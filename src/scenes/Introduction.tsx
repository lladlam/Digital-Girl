import React from 'react';
import {Girl} from '../characters/DigitalGirl';
import {C,ease,out} from '../utils/math';
import {Gate,Pointer,Room,Orbit,Barcode,Ruler} from '../world/Architecture';
import {Inscription,Lyric,Type} from '../typography/Type';
import type {SceneProps} from '../timeline/timeline';

export const Introduction:React.FC<SceneProps> = ({t,p,shot,line}) => {
 const m=shot.mode;
 if(m===0||m===1) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  <rect x={1155} width={765} height={1080} fill={C.mint}/>
  <circle cx={1390} cy={410} r={365} fill={C.ink}/>
  <Ruler x={100} y={105} length={750}/>
  <Inscription x={104} y={165}>01 / MANUFACTURED PERFECTION</Inscription>
  <Lyric line={line} t={t} x={104} y={430} width={m===1?1000:870} size={m===1?164:159}/>
  <Girl x={m===1?1470:1380} y={m===1?856:412} scale={m===1?1.9:.91} pose='perfect' gaze={m===1?-4:0}/>
  <path d='M104 835 H850' stroke={C.ink} strokeWidth={3}/><Barcode x={104} y={870} w={205}/>
  <Inscription x={349} y={899}>PERSONALITY / FACTORY DEFAULT</Inscription>
 </>;
 if(m===2) return <>
  <Room depth={p*.36} vanishX={1250} vanishY={535}/>
  <path d='M0 730 L1250 535 L1920 875 V1080 H0 Z' fill={C.ink}/>
  {[0,1,2,3,4].map(i=><Gate key={i} x={92+i*285} y={110+i*40} w={230} h={540-i*62} fill={C.paper} label={`MEMORY / 00${i+1}`}/>)}
  <Girl x={1360} y={450} scale={.66}/>
  <Lyric line={line} t={t} x={102} y={833} width={1600} size={100} color={C.paper} accent={C.mint}/>
  <Inscription x={106} y={72}>THE WORLD FITS INSIDE A WINDOW.</Inscription>
 </>;
 if(m===3||m===4) return <>
  <rect width={1920} height={1080} fill={m===3?C.mint:C.paper}/>
  <Orbit x={1400} y={528} r={410} phase={m===4?p*18:0}/>
  <path d='M0 914 H1920' stroke={C.ink} strokeWidth={3}/>
  {m===3&&<><g opacity={.25}><Girl x={1370} y={495} scale={.63}/></g><g opacity={.5}><Girl x={1605} y={449} scale={.7}/></g></>}
  <Girl x={m===3?1090:1420} y={400} scale={.8} pose={m===4?'reach':'perfect'} fromPose='perfect' action={out(p*3)}/>
  <Lyric line={line} t={t} x={110} y={414} width={m===3?780:900} size={m===3?138:148}/>
  <Inscription x={111} y={910}>{m===3?'OPTIMIZED FOR YOUR DREAMS.':'BELIEF / READY TO INSTALL'}</Inscription>
  <Pointer x={1700} y={196} scale={.78}/>
 </>;
 return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <circle cx={961} cy={552} r={457} fill={C.paper}/>
  <Orbit x={961} y={552} r={483} color={C.mint} phase={p*9}/>
  <Girl x={960} y={389} scale={.94}/>
  <Lyric line={line} t={t} x={106} y={382} width={390} size={112} color={C.paper} accent={C.red}/>
  <Inscription x={112} y={80} color={C.paper}>WORSHIP / ENABLED</Inscription>
 </>;
};
