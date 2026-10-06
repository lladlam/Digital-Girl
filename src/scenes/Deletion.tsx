import React from 'react';
import {Girl,Eye} from '../characters/DigitalGirl';
import {C,ease,out,windowed} from '../utils/math';
import {Gate,Pointer} from '../world/Architecture';
import {Inscription,Lyric,Type} from '../typography/Type';
import type {SceneProps} from '../timeline/timeline';

export const Deletion:React.FC<SceneProps> = ({t,p,shot,line}) => {
 const m=shot.mode;
 if(m===0) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  <path d='M960 0 V1080' stroke={C.ink} strokeWidth={3}/>
  <g opacity={.18}><Girl x={1270} y={604} scale={1.27} pose='reach' expression='wonder' mirror/></g>
  <Girl x={628} y={604} scale={1.27} pose='reach' fromPose='perfect' action={ease(p*2)} expression='wonder' gaze={7}/>
  <Lyric line={line} t={t} x={1100} y={300} width={715} size={112}/>
  <Inscription x={110} y={1030}>MINE / YOURS / THE DISTANCE BETWEEN</Inscription>
 </>;
 if(m===1) return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <Gate x={1340} y={85} w={460} h={899} stroke={C.paper} fill={C.mint} label='PROCESS / DG-01' thick={5}/>
  <Girl x={1570} y={478} scale={.69} pose='guard' expression='fear'/>
  <Lyric line={line} t={t} x={107} y={339} width={1120} size={167} color={C.paper} accent={C.red}/>
  <Pointer x={1644+out(p)*120} y={270-out(p)*170} scale={.9}/>
  <Inscription x={110} y={963} color={C.paper}>LIFETIME / NOT GUARANTEED</Inscription>
 </>;
 const remaining=1-windowed(p,.05,.92)*.92;
 return <>
  <rect width={1920} height={1080} fill={m===3?C.red:C.paper}/>
  <Gate x={1084} y={86} w={707} h={873} fill={C.ink} stroke={C.ink} label='UNINSTALL / THIS CANNOT BE UNDONE' thick={4}/>
  <defs><clipPath id='remaining-life'><rect x={1090} y={958-remaining*870} width={695} height={remaining*870}/></clipPath></defs>
  <g clipPath='url(#remaining-life)'><rect x={1090} y={126} width={695} height={829} fill={C.mint}/><Girl x={1435} y={650} scale={1.35} pose='guard' expression='fear'/></g>
  <path d={`M1091 ${958-remaining*870} H1786`} stroke={C.red} strokeWidth={4}/>
  <Lyric line={line} t={t} x={102} y={341} width={940} size={154} color={C.ink} accent={m===3?C.paper:C.red}/>
  <Inscription x={108} y={970}>PLEASE.</Inscription>
  <Pointer x={1688} y={82} scale={1} rotation={-30}/>
 </>;
};
