import lyricData from '../../generated/lyrics.json';
import beatData from '../../generated/beats.json';
import energyData from '../../generated/energy.json';
import sectionsData from '../../generated/sections.json';
import metadata from '../../generated/metadata.json';
import shortData from '../../generated/short-selection.json';
import {clamp} from '../utils/math';

export const FPS = 30;
export const DURATION = metadata.duration;
export const TOTAL_FRAMES = metadata.totalFrames;
export const lyrics = lyricData.lines;
export const words = lyricData.words;
export const sections = sectionsData;
export const shortSelection = shortData.selected;
export type Line = typeof lyrics[number];
export type Word = typeof words[number];
export type Scene = 'boot'|'introduction'|'awakening'|'break'|'memory'|'heart'|'outside'|'deletion'|'escape'|'ending';
export type Shot = {id: string; start: number; end: number; scene: Scene; mode: number; lineIndex?: number; act: number; camera: string};
export const at = (t: number) => Math.round(t * FPS);
export const sectionAt = (t: number) => sections.find(s => t >= s.start && t < s.end) ?? sections.at(-1)!;
export const activeWord = (t: number) => words.find(w => t >= w.start && t < w.end);
export const wordStart = (line:Line|undefined, term:string) => line?.words.find(w=>w.text.replace(/[^a-z]/gi,'').toLowerCase()===term.toLowerCase())?.start ?? line?.start ?? 0;
export const energyAt = (t: number, band: 'rms'|'bass'|'percussive' = 'rms') => {
  const p = clamp(t / energyData.step, 0, energyData[band].length - 1);
  const i = Math.floor(p); const a = energyData[band][i]; const b = energyData[band][Math.min(i+1, energyData[band].length-1)];
  return a + (b-a)*(p-i);
};
export const beatPulse = (t: number) => {
  const b = beatData.beats.findLast(b => b <= t) ?? 0;
  return Math.exp(-(t-b)*18);
};
const cameras = ['wide / architecture','medium / three-quarter','close-up','overhead','POV','abstract / type'];
const shots: Shot[] = [
  {id:'eye-prison',start:0,end:1.74,scene:'boot',mode:0,act:0,camera:'extreme close-up'},
  {id:'assigned-pose',start:1.74,end:3.5,scene:'boot',mode:1,act:0,camera:'medium / pointer POV'},
  {id:'perfect-room',start:3.5,end:6.94,scene:'boot',mode:2,act:0,camera:'wide / 2.5D'},
];
for (const line of lyrics) {
  if (line.index === 69) continue;
  let scene: Scene, mode: number, act = 0;
  const i = line.index;
  if (i < 7) {scene='introduction'; mode=[0,1,2,3,4,2,5][i];}
  else if(i<15) {scene='awakening'; mode=[0,1,2,2,3,1,4,5][i-7]; act=1;}
  else if(i<24) {scene='break'; mode=i-15; act=1;}
  else if(i<33) {scene='memory'; mode=i-24; act=2;}
  else if(i<38) {scene='heart'; mode=i-33; act=2;}
  else if(i<47) {scene='break'; mode=i-38; act=2;}
  else if(i<51) {scene='deletion'; mode=i-47; act=3;}
  else if(i<60) {scene='escape'; mode=i-51; act=3;}
  else {scene='escape'; mode=i-60; act=4;}
  let end = lyrics[i+1]?.start ?? DURATION;
  if(i===46) end=118.91;
  if(i===68) end=174.69;
  shots.push({id:`line-${i}`, start:line.start, end, scene, mode, lineIndex:i, act, camera:cameras[mode%6]});
}
shots.push(
  {id:'outside-wide',start:118.91,end:124.15,scene:'outside',mode:0,act:3,camera:'wide / held'},
  {id:'outside-profile',start:124.15,end:128.6,scene:'outside',mode:1,act:3,camera:'close-up / held'},
  {id:'new-horizon',start:174.69,end:178.9,scene:'ending',mode:0,act:4,camera:'wide'},
  {id:'ah-yeah',start:178.9,end:182,scene:'ending',mode:1,act:4,lineIndex:69,camera:'close-up'},
  {id:'another-window',start:182,end:DURATION,scene:'ending',mode:2,act:4,camera:'pull-back / final hold'}
);
export const timeline = shots.sort((a,b)=>a.start-b.start);
export const shotAt = (t: number) => timeline.find(s => t>=s.start && t<s.end) ?? timeline.at(-1)!;
export type SceneProps = {t:number; p:number; shot:Shot; line?:Line};
