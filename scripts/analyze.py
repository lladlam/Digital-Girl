"""Read originals, normalize the supplied word clock, analyze the COMPLETE MP3.

No stem separator is used: band energy and HPSS are explicitly labelled proxies.
Original assets are read-only; copies and all derivatives are reproducible.
"""
from pathlib import Path
import hashlib, json, re, shutil, subprocess, os
os.environ.setdefault('NUMBA_CACHE_DIR', '/workspace/.cache/numba')
import numpy as np
import librosa

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'generated'
OUT.mkdir(exist_ok=True)
def save(name, obj):
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, separators=(',', ':')))
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()

# Prefer retained project assets on subsequent runs; discover original uploads otherwise.
assets = ROOT / 'public/assets'
assets.mkdir(parents=True, exist_ok=True)
sources = {}
for ext, target in [('mp3', 'song.mp3'), ('lrc', 'song.lrc'), ('json', 'word-timing.original.json')]:
    retained = assets / target
    if retained.exists(): source = retained
    else:
        candidates = list(Path('/workspace/attachments').rglob('*.' + ext))
        if len(candidates) != 1: raise RuntimeError(f'Expected one original {ext}, found {len(candidates)}')
        source = candidates[0]
        shutil.copyfile(source, retained)
    assert digest(source) == digest(retained)
    sources[ext] = {'path': str(retained.relative_to(ROOT)), 'sha256': digest(source)}

original = json.loads((assets / 'word-timing.original.json').read_text())
lines, words = [], []
for i, line in enumerate(original['lines']):
    items = []
    for word in line['words']:
        a, b = float(word['start']), float(word['end'])
        assert a <= b and a >= 0
        w = {'text': word['text'], 'start': a, 'end': b, 'lineIndex': i,
             'lineStart': line['start'], 'lineEnd': line['end']}
        words.append(w); items.append(w)
    lines.append({'index': i, 'text': line['text'], 'start': line['start'], 'end': line['end'], 'words': items})
assert all(a['start'] <= b['start'] for a, b in zip(words, words[1:]))
def clean(s): return re.sub(r'\W+', '', s).lower()
lrc = []
for line in (assets / 'song.lrc').read_text(encoding='utf-8-sig').splitlines():
    m = re.match(r'\[(\d+):(\d+\.\d+)\](.*)', line)
    if m and m[3].strip() and '作词' not in m[3] and '作曲' not in m[3]:
        lrc.append({'time': 60*int(m[1])+float(m[2]), 'text': m[3].strip()})
assert len(lrc) == len(lines), (len(lrc), len(lines))
assert all(clean(a['text']) == clean(b['text']) for a,b in zip(lrc,lines))
save('lyrics.json', {'lines': lines, 'words': words, 'timingMethod': original['timingMethod']})
print(f'Validated {len(lines)} LRC lines / {len(words)} supplied word timings', flush=True)

wav = OUT / 'audio-mono.wav'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(assets/'song.mp3'),'-ac','1','-ar','22050',str(wav)], check=True)
y, sr = librosa.load(wav, sr=None)
duration = len(y)/sr
hop, fft = 512, 2048
S = np.abs(librosa.stft(y, n_fft=fft, hop_length=hop))
H, P = librosa.decompose.hpss(S)
onset = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S), sr=sr, hop_length=hop)
tempo, beat_frames = librosa.beat.beat_track(onset_envelope=onset, sr=sr, hop_length=hop, start_bpm=103, trim=False)
beats = librosa.frames_to_time(beat_frames, sr=sr, hop_length=hop)
onset_frames = librosa.onset.onset_detect(onset_envelope=onset, sr=sr, hop_length=hop)
onsets = librosa.frames_to_time(onset_frames, sr=sr, hop_length=hop)
freq = librosa.fft_frequencies(sr=sr, n_fft=fft)
rms = librosa.feature.rms(S=S, frame_length=fft)[0]
centroid = librosa.feature.spectral_centroid(S=S, sr=sr)[0]
bass = np.sqrt(np.mean(S[(freq>=35)&(freq<=180)]**2, axis=0))
drums = np.sqrt(np.mean(P**2, axis=0))
voice = np.sqrt(np.mean(H[(freq>=180)&(freq<=4000)]**2, axis=0))
times = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=hop)
grid = np.arange(0, duration, .05)
def normalize(v):
    return np.clip(v/max(float(np.quantile(v,.98)), 1e-8),0,1)
def sample(v): return np.round(np.interp(grid, times, normalize(v)),4).tolist()
energy = {'step':.05, 'rms':sample(rms), 'bass':sample(bass), 'percussive':sample(drums),
          'harmonicVocalBandProxy':sample(voice), 'onset':sample(onset),
          'spectralCentroidHz': np.round(np.interp(grid,times,centroid),1).tolist()}
save('energy.json', energy)
anchor = int(np.argmin(np.abs(beats-44.14)))
downbeats = [float(b) for i,b in enumerate(beats) if (i-anchor)%4==0]
save('beats.json', {'bpmDetected': float(np.asarray(tempo).flat[0]), 'bpmSource':103,
 'beats':np.round(beats,4).tolist(), 'downbeats':np.round(downbeats,4).tolist(),
 'downbeatMethod':'Estimated 4/4 phase anchored to first chorus; not supervised downbeat detection.',
 'onsets':np.round(onsets,4).tolist()})

# Narrative structure follows supplied lyric boundaries, corroborated by full-track features.
definitions = [
 ('INTRO','Boot / the eye is a prison',0,6.94),
 ('VERSE_1','Manufactured perfection',6.94,25.87),
 ('PRE_CHORUS_1','The first forbidden thought',25.87,44.14),
 ('CHORUS_1','Breaking the frame',44.14,62.73),
 ('VERSE_2','An archive of impossible sensations',62.73,81.72),
 ('PRE_CHORUS_2','A heart that was never specified',81.72,100.03),
 ('CHORUS_2','The system fights back',100.03,118.91),
 ('INSTRUMENTAL','Outside is a small rectangle of light',118.91,128.6),
 ('BRIDGE','Uninstall / existential fear',128.6,137.37),
 ('FINAL_CHORUS','Reversing control',137.37,156.14),
 ('FINAL_CHORUS_2','She rewrites the world',156.14,174.69),
 ('OUTRO','A second desktop',174.69,duration)]
sections = []
for id, title, start, end in definitions:
    mask=(times>=start)&(times<end)
    sections.append({'id':id,'title':title,'start':start,'end':round(end,5),
      'meanRms':float(np.mean(rms[mask])), 'onsetsPerSecond':float(np.sum((onsets>=start)&(onsets<end))/(end-start)),
      'classification':'Editorial, based on lyric form and audio feature changes'})
save('sections.json', sections)
candidates=[]
for i,sec in enumerate(sections):
    if 'CHORUS' not in sec['id'] or 'PRE_' in sec['id']: continue
    keyword=sum(1 for w in words if sec['start']<=w['start']<sec['end'] and clean(w['text']) in ['break','physical','digital','girl','real'])
    # Comparable repeated hooks: prefer the resolved narrative and a complete musical phrase.
    score=sec['meanRms']*20 + keyword*.12 + (1.5 if sec['id']=='FINAL_CHORUS_2' else 0)
    candidates.append({'start':sec['start'],'end':sec['end'],'score':score,'section':sec['id']})
winner=max(candidates,key=lambda c:c['score'])
save('short-selection.json', {'selected':winner,'candidates':candidates,'method':'Full chorus phrases scored by RMS, hook words and narrative payoff; 15–30 seconds.'})
save('metadata.json', {'title':'Digital Girl','artist':'Jinja','originalArtist':original.get('originalArtist'),
 'duration':round(duration,6),'fps':30,'totalFrames':int(np.ceil(duration*30)), 'sampleRate':48000,
 'assets':sources, 'wordCount':len(words),'lineCount':len(lines),
 'wordTimingCaveat':original['timingMethod'],
 'analysisCaveat':'HPSS and frequency bands are energy proxies, not isolated drums/bass/vocals. Bar phase is estimated.'})
print(json.dumps({'duration':duration,'detected_bpm':float(np.asarray(tempo).flat[0]),'beats':len(beats),'onsets':len(onsets),'short':winner},indent=2),flush=True)
