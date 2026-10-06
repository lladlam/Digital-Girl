"""Validate encoded deliverables against the actual source, not a mock audio track."""
from pathlib import Path
import hashlib, json, subprocess, struct
import numpy as np
from scipy.signal import correlate, correlation_lags

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output'
meta=json.loads((ROOT/'generated/metadata.json').read_text())
selection=json.loads((ROOT/'generated/short-selection.json').read_text())['selected']
report={'source_integrity':{},'outputs':{}}

def run(args):
    return subprocess.run(args,check=True,capture_output=True).stdout

def pcm(path,start=None,duration=None):
    args=['ffmpeg','-v','error','-i',str(path)]
    if start is not None:args+=['-ss',str(start)]
    if duration is not None:args+=['-t',str(duration)]
    return np.frombuffer(run(args+['-vn','-ac','1','-ar','16000','-f','f32le','-']),dtype='<f4').copy()

def atoms(path):
    names=[]
    with path.open('rb') as f:
        while True:
            header=f.read(8)
            if len(header)<8: break
            size,kind=struct.unpack('>I4s',header)
            skip=8
            if size==1:
                size=struct.unpack('>Q',f.read(8))[0];skip=16
            names.append(kind.decode('ascii',errors='replace'))
            if size==0:break
            if size<skip:raise AssertionError('Invalid MP4 atom')
            f.seek(size-skip,1)
    return names

for ext,asset in meta['assets'].items():
    path=ROOT/asset['path']
    sha=hashlib.sha256(path.read_bytes()).hexdigest()
    assert sha==asset['sha256'],f'Changed source copy: {ext}'
    original=list(Path('/workspace/attachments').rglob('*.'+ext))
    same=not original or hashlib.sha256(original[0].read_bytes()).hexdigest()==sha
    assert same,f'Original upload differs: {ext}'
    report['source_integrity'][ext]={'sha256':sha,'retained_copy_matches':True,'upload_compared':bool(original)}

full_source=pcm(ROOT/'public/assets/song.mp3')
for name,width,height,frames,offset in [
 ('digital-girl-mv.mp4',1920,1080,meta['totalFrames'],0),
 ('digital-girl-short.mp4',1080,1920,round((selection['end']-selection['start'])*30),round(selection['start']*30)/30)
]:
    path=OUT/name
    info=json.loads(run(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(path)]))
    v=next(s for s in info['streams'] if s['codec_type']=='video')
    a=next(s for s in info['streams'] if s['codec_type']=='audio')
    assert (v['width'],v['height'])==(width,height)
    assert v['avg_frame_rate']=='30/1'
    assert int(v['nb_read_frames'])==frames,(name,v['nb_read_frames'],frames)
    assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p'
    assert a['codec_name']=='aac' and a['channels']==2
    # Decode BOTH streams completely. Exit status and all error output are preserved.
    decoded=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','null','-'],capture_output=True,text=True)
    assert decoded.returncode==0 and not decoded.stderr.strip(),decoded.stderr
    atom_list=atoms(path)
    assert atom_list.index('moov')<atom_list.index('mdat'),'MP4 is not fast-start'
    actual=pcm(path)
    # Slice the fully decoded master instead of seeking the compressed MP3. This
    # avoids decoder-reservoir differences at the vertical edit's start point.
    start_sample=int(round(offset*16000))
    expected=full_source if offset==0 else full_source[start_sample:start_sample+int(round(frames/30*16000))]
    # Estimate lag from a 12-second content segment, then correlate the entire aligned track.
    segment=min(12*16000,len(expected),len(actual))
    x=expected[:segment]; y=actual[:segment]
    cc=correlate(y,x,mode='full',method='fft')
    lags=correlation_lags(len(y),len(x),mode='full')
    valid=np.abs(lags)<=1600
    lag=int(lags[valid][np.argmax(cc[valid])])
    if lag>=0:
        sample_actual=actual[lag:];sample_expected=expected
    else:
        sample_actual=actual;sample_expected=expected[-lag:]
    n=min(len(sample_actual),len(sample_expected))
    coefficient=float(np.corrcoef(sample_actual[:n],sample_expected[:n])[0,1])
    assert abs(lag/16000)<1/30,('Audio offset exceeds one frame',lag)
    assert coefficient>.985,('Audio does not match the supplied recording',coefficient)
    duration=float(info['format']['duration'])
    assert abs(duration-frames/30)<.08
    report['outputs'][name]={
      'width':width,'height':height,'fps':30,'frames':frames,'duration_seconds':duration,
      'video_codec':v['codec_name'],'pixel_format':v['pix_fmt'],'audio_codec':a['codec_name'],
      'audio_channels':a['channels'],'audio_sample_rate':a['sample_rate'],'source_audio_start_seconds':offset,
      'audio_alignment_lag_ms':lag/16,'full_track_audio_correlation':coefficient,
      'complete_decode':'passed','fast_start':True,'bytes':path.stat().st_size,
      'sha256':hashlib.sha256(path.read_bytes()).hexdigest()
    }
    print(name,json.dumps(report['outputs'][name],indent=2),flush=True)

png=(OUT/'thumbnail.png').read_bytes()
assert png[:8]==b'\x89PNG\r\n\x1a\n'
assert struct.unpack('>II',png[16:24])==(1920,1080)
run(['ffmpeg','-v','error','-i',str(OUT/'thumbnail.png'),'-f','null','-'])
report['outputs']['thumbnail.png']={'width':1920,'height':1080,'valid_png':True}
report['limitations']=[
 'Audio was validated numerically; the chat interface could not audition returned audio.',
 'Word timings remain the supplied MIDI/LRC reconstruction, not a new forced alignment.',
 'Recent visual-reference sites returned proxy 403; see docs/research.md.'
]
(OUT/'checks/verification.json').write_text(json.dumps(report,indent=2))
print('All encoded-output checks passed.',flush=True)
