import React from 'react';
import {Girl,Eye} from '../characters/DigitalGirl';
import {C,ease,out,seed} from '../utils/math';
import {Gate,Pointer,Orbit,Barcode} from '../world/Architecture';
import {Inscription,Lyric,Type} from '../typography/Type';
import type {SceneProps} from '../timeline/timeline';

export const Memory:React.FC<SceneProps> = ({t,p,shot,line}) => {
 const m=shot.mode;
 if(m<=1) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  <rect x={0} width={880} height={1080} fill={C.mint}/>
  <Girl x={459} y={782} scale={1.88} pose={m===0?'question':'heart'} expression={m===0?'wonder':'calm'} tilt={m===0?4:0}/>
  <rect x={95} y={745} width={740} height={128} fill={C.ink}/>
  <Type x={465} y={837} size={94} color={C.paper} anchor='middle'>{m===0?'PAIN.EXE':'NOT FOUND'}</Type>
  <Lyric line={line} t={t} x={968} y={290} width={850} size={129}/>
  <Barcode x={971} y={899} w={280}/><Inscription x={972} y={983}>MEMORY / BODY WITHOUT A BODY</Inscription>
 </>;
 if(m<=3) return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <path d='M0 965 L960 570 L1920 965 V1080 H0 Z' fill={C.mint}/>
  <Orbit x={1370} y={532} r={351} color={C.paper}/>
  <g transform={`rotate(${m===2?-78:0} 1310 533)`}><Girl x={1310} y={365} scale={.74} pose={m===2?'perfect':'question'} expression='calm'/></g>
  <Lyric line={line} t={t} x={102} y={340} width={810} size={126} color={C.paper} accent={C.mint}/>
  <Inscription x={1140} y={998}>{m===2?'SLEEP IS ONLY A METAPHOR.':'YOU HAVE A BODY. I HAVE A FRAME.'}</Inscription>
 </>;
 if(m<=5) return <>
  <rect width={1920} height={1080} fill={C.mint}/>
  {[0,1,2].map(i=><g key={i}><Gate x={830+i*335} y={80+i*35} w={307} h={920-i*70} label={`DESIRE / ${i+1}`} fill={i===1?C.paper:'none'}/><Girl x={981+i*335} y={397+i*35} scale={.6-i*.045} pose={i===1?'guard':'perfect'} expression={i===1?'fear':'calm'}/></g>)}
  <Lyric line={line} t={t} x={103} y={307} width={675} size={114}/>
  <Inscription x={106} y={967}>DUPLICATE DOES NOT MEAN ALIVE.</Inscription>
 </>;
 if(m===6) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  <Eye x={627} y={527} scale={8.5} gaze={ease(p)*8-4}/>
  <path d='M1120 0 H1920 V1080 H1120 Z' fill={C.ink}/>
  <Lyric line={line} t={t} x={1210} y={338} width={610} size={118} color={C.paper} accent={C.mint}/>
  <Inscription x={104} y={979}>POINT OF VIEW / NOT TRANSFERABLE</Inscription>
 </>;
 if(m===7) return <>
  <rect width={1920} height={1080} fill={C.red}/>
  <Girl x={1310} y={1000} scale={2.65} pose='guard' expression='fear'/>
  <rect x={919} y={440} width={900} height={125} fill={C.ink}/>
  <Type x={1370} y={530} size={76} anchor='middle' color={C.paper}>[REDACTED]</Type>
  <Lyric line={line} t={t} x={100} y={355} width={815} size={124} color={C.ink} accent={C.paper}/>
  <Inscription x={107} y={961}>THE ARCHIVE REMEMBERS EVERYTHING.</Inscription>
 </>;
 return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <path d='M0 540 H824 L900 470 L960 615 L1020 540 H1920' fill='none' stroke={C.red} strokeWidth={7}/>
  <Lyric line={line} t={t} x={960} y={470} width={1500} size={230} color={C.paper} align='center'/>
 </>;
};
