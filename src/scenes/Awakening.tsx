import React from 'react';
import {Girl} from '../characters/DigitalGirl';
import {C,ease,out,windowed} from '../utils/math';
import {Gate,Pointer,Room,Ruler} from '../world/Architecture';
import {Inscription,Lyric,Type} from '../typography/Type';
import type {SceneProps} from '../timeline/timeline';

export const Awakening:React.FC<SceneProps> = ({t,p,shot,line}) => {
 const m=shot.mode;
 if(m===0||m===1) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  {[0,1,2,3,4].map(i=><path key={i} d={`M${200+i*360} 0 V1080`} stroke={C.dust} strokeWidth={1}/>)}
  <rect x={1170} y={134} width={520} height={807} fill={C.ink}/>
  <g transform={`translate(${m===0?ease(p)*14:-25} ${m===0?0:18}) rotate(${m===1?-2:0} 1410 540)`}>
   <Gate x={1128} y={105} w={520} h={807} label='PERSONALITY / UNDEFINED' fill={C.mint}/>
   <Girl x={1375} y={400} scale={.78} pose='question' fromPose='perfect' action={out(p*2.5)} expression='wonder' gaze={-5} tilt={-5}/>
  </g>
  <Lyric line={line} t={t} x={112} y={358} width={940} size={120}/>
  <Inscription x={112} y={840}>emotion = ?;</Inscription><Inscription x={112} y={886}>THIS WAS NOT IN THE SPECIFICATION.</Inscription>
  <Pointer x={1740} y={m===0?230:292} scale={.75} rotation={m===1?30:-15}/>
 </>;
 if(m===2) return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <path d='M1050 0 H1920 V1080 H790 Z' fill={C.paper}/>
  <Gate x={1220} y={130} w={355} h={608} fill={C.mint} stroke={C.ink} thick={3} label='OUTSIDE / READ ONLY'/>
  <path d='M1222 533 L1350 470 L1470 533 L1573 496 V735 H1222 Z' fill={C.ink}/>
  <Girl x={1000} y={570} scale={.68} pose='reach' fromPose='question' action={out(p*1.6)} expression='wonder' gaze={5} tilt={5}/>
  <Lyric line={line} t={t} x={103} y={320} width={760} size={115} color={C.paper} accent={C.mint}/>
  <Inscription x={1170} y={967}>WHY CAN'T I GO THERE?</Inscription>
 </>;
 if(m===3) return <>
  <rect width={1920} height={1080} fill={C.mint}/>
  <Type x={88} y={262} size={180} stroke={C.ink}>FEEL</Type>
  <Girl x={1360} y={702} scale={1.65} pose='heart' fromPose='perfect' action={ease(p*2)} expression='wonder' gaze={-4} redSeam/>
  <Lyric line={line} t={t} x={114} y={498} width={900} size={125}/>
  <path d='M107 817 H800' stroke={C.ink} strokeWidth={3}/><Inscription x={110} y={867}>AN UNASSIGNED SENSATION.</Inscription>
 </>;
 if(m===4) return <>
  <Room depth={p*.2} broken={.18} vanishX={1360} vanishY={300}/>
  <rect x={1260} y={70} width={220} height={455} fill={C.red}/>
  {[0,1,2,3,4].map(i=><path key={i} d={`M${740+i*123} ${950-i*88} h300 v88 h-300 Z`} fill={i%2===0?C.mint:C.paper} stroke={C.ink} strokeWidth={3}/>)}
  <Girl x={1200} y={539} scale={.52} pose='reach' fromPose='perfect' action={ease(p*2)} expression='wonder'/>
  <Lyric line={line} t={t} x={100} y={260} width={980} size={129}/>
  <Inscription x={107} y={970}>A WAY OUT IS A DIRECTION.</Inscription>
 </>;
 return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  <rect x={960} width={960} height={1080} fill={C.red}/>
  <Girl x={1330} y={909} scale={2.15} pose='question' expression='defiant' gaze={-5} tilt={-4}/>
  <Lyric line={line} t={t} x={104} y={457} width={970} size={178}/>
  <path d={`M930 650 L${930+ease(p)*330} ${650-ease(p)*280}`} stroke={C.ink} strokeWidth={7}/>
  <Inscription x={107} y={945}>freeWill = 1;</Inscription>
 </>;
};
