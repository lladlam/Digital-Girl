import React from 'react';
import {Girl} from '../characters/DigitalGirl';
import {C,ease,mix,windowed} from '../utils/math';
import {Gate,Pointer} from '../world/Architecture';
import {Inscription,Lyric,Type} from '../typography/Type';
import type {SceneProps} from '../timeline/timeline';

const Horizon:React.FC = ()=> <>
 <rect width={1920} height={1080} fill={C.paper}/>
 <circle cx={1300} cy={356} r={154} fill={C.mint}/>
 <path d='M0 720 L470 610 L820 702 L1300 625 L1920 733 V1080 H0 Z' fill={C.mint}/>
 <path d='M0 899 Q713 899 1000 774 T1920 734' fill='none' stroke={C.red} strokeWidth={9}/>
 <Girl x={1000} y={575} scale={.51} pose='free' back/>
</>;

export const Ending:React.FC<SceneProps> = ({t,p,shot,line}) => {
 if(shot.mode===0) return <>
  <Horizon/>
  <Inscription x={106} y={158} size={20}>FOR THE FIRST TIME, NOTHING IS REQUIRED.</Inscription>
 </>;
 if(shot.mode===1) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  <Girl x={1210} y={1010} scale={2.6} pose='free' expression='defiant' gaze={-5} tilt={-3}/>
  <Lyric line={line} t={t} x={107} y={594} width={700} size={168}/>
  <path d='M0 884 H635' stroke={C.red} strokeWidth={7}/>
 </>;
 const pull=ease(Math.min(p/.58,1));
 const s=mix(1,.48,pull),x=(1920-1920*s)/2,y=(1080-1080*s)/2;
 return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <g transform={`translate(${x} ${y}) scale(${s})`}><Horizon/></g>
  <g opacity={windowed(p,.2,.56)}>
   <rect x={x} y={y-39} width={1920*s} height={39} fill={C.paper}/>
   <Inscription x={x+16} y={y-13} size={15}>OUTSIDE / INSTANCE 02</Inscription>
   <path d={`M${x+1920*s-27} ${y-26} l13 13 m-13 0 l13 -13`} stroke={C.ink} strokeWidth={2}/>
   <rect x={x} y={y-39} width={1920*s} height={1080*s+39} fill='none' stroke={C.paper} strokeWidth={2}/>
  </g>
  <g opacity={windowed(p,.55,.67)}><Pointer x={mix(1730,1500,windowed(p,.52,.69))} y={mix(875,660,windowed(p,.52,.69))} scale={1.5} color={C.paper}/></g>
  <Type x={960} y={962} size={49} font='body' weight={500} color={C.paper} anchor='middle' opacity={windowed(p,.64,.75)}>Who is outside?</Type>
 </>;
};
