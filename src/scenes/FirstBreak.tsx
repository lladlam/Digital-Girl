import React from 'react';
import {Girl,Eye} from '../characters/DigitalGirl';
import {C,ease,out,seed,windowed} from '../utils/math';
import {Gate,Pointer,Room,Shards,Orbit} from '../world/Architecture';
import {Inscription,Lyric,Type,WordImpact} from '../typography/Type';
import {wordStart,beatPulse,type SceneProps} from '../timeline/timeline';

export const FirstBreak:React.FC<SceneProps> = ({t,p,shot,line}) => {
 const m=shot.mode, retaliation=shot.act===2, bg=retaliation?C.mint:C.red;
 const impact=out(p*3);
 const physical=out((t-wordStart(line,'physical'))/.24);
 const windows=out((t-wordStart(line,'windows'))/.25);
 if(m===0) return <>
  <rect width={1920} height={1080} fill={bg}/>
  {Array.from({length:7},(_,i)=><g key={i} transform={`translate(${(seed(i)-.5)*impact*950} ${(seed(i+12)-.5)*impact*500}) rotate(${(seed(i+40)-.5)*impact*90} 960 540)`}><Gate x={550-i*90} y={104-i*37} w={820+i*180} h={850+i*76} stroke={C.paper} thick={6}/></g>)}
  <Type x={960} y={585} size={465} color={C.ink} anchor='middle'>{retaliation?'REPEAT':'BREAK'}</Type>
  <Shards p={impact} count={32} color={C.paper}/>
  <Girl x={970} y={400} scale={.92} pose='break' fromPose='perfect' action={out(p*5)} expression='defiant' tilt={-5} redSeam/>
  <WordImpact line={line} t={t} x={965} y={992} size={135} color={retaliation?C.red:C.paper}/>
 </>;
 if(m===1) return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <path d='M0 0 H1500 L640 1080 H0 Z' fill={bg}/>
  {Array.from({length:6},(_,i)=><g key={i} transform={`translate(1460 ${300+i*80}) rotate(${-16+p*65+i*7})`}><rect x={-260} y={-160} width={490} height={350} fill='none' stroke={C.paper} strokeWidth={4}/></g>)}
  <Girl x={1410} y={718} scale={1.5} pose='reach' expression='defiant' gaze={-6} tilt={-8}/>
  <Lyric line={line} t={t} x={103} y={290} width={910} size={142} color={C.ink} accent={retaliation?C.red:C.paper}/>
  <Inscription x={105} y={972}>THE FACADE CANNOT HOLD.</Inscription>
 </>;
 if(m===2) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  <g transform={`rotate(${-5*windows} 950 500)`}><Gate x={298} y={80} w={1320} h={790} thick={9}/></g>
  <Shards p={physical} count={28} color={C.ink}/>
  <g opacity={physical} transform={`translate(0 ${(1-physical)*180})`}><Type x={965} y={910} size={289} color={C.red} anchor='middle'>PHYSICAL</Type></g>
  <Girl x={1020} y={338} scale={.87} pose='reach' fromPose='guard' action={out(p*3)} expression='defiant' redSeam/>
  <rect x={76} y={55} width={755} height={377} fill={C.paper}/>
  <Lyric line={line} t={t} x={100} y={154} width={720} size={83}/>
  <Pointer x={1540-160*impact} y={352+120*impact} scale={1.5} rotation={55}/>
 </>;
 if(m===3) return <>
  <Room depth={p*.8} broken={retaliation?.3:1} fill={C.ink} color={bg} vanishX={960} vanishY={540}/>
  <g transform='rotate(-16 1190 520)'><Girl x={1190} y={424} scale={.78} pose='guard' expression='wonder'/></g>
  <Lyric line={line} t={t} x={107} y={242} width={720} size={110} color={C.paper} accent={bg}/>
  <Inscription x={1280} y={959} color={C.paper}>NO EXIT FOUND.</Inscription>
 </>;
 if(m===4) return <>
  <rect width={1920} height={1080} fill={bg}/>
  <Girl x={514} y={1140} scale={2.85} pose='question' expression='defiant' gaze={6}/>
  <Lyric line={line} t={t} x={1040} y={437} width={760} size={169} color={C.ink} accent={retaliation?C.red:C.paper}/>
  <path d='M984 92 V974' stroke={C.ink} strokeWidth={3}/>
 </>;
 if(m===5) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  {[0,1,2,3,4].map(i=><g key={i} transform={`rotate(${-18+i*9+p*7} ${260+i*350} 480)`}><Gate x={60+i*350} y={150+(i%2)*100} w={350} h={580} fill={i===2?bg:C.mint} label={`LIFETIME / ${i}`}/></g>)}
  <g transform='rotate(72 915 510)'><Girl x={915} y={380} scale={.7} pose='guard' expression='wonder'/></g>
  <Lyric line={line} t={t} x={111} y={927} width={1710} size={103}/>
 </>;
 if(m===6) return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <Gate x={740} y={95} w={485} h={855} stroke={C.paper} fill={C.mint} thick={6}/>
  <Girl x={985} y={443} scale={.72} pose='question' expression='defiant'/>
  <Pointer x={1510-p*110} y={620-p*40} scale={3.4} rotation={-40}/>
  <Lyric line={line} t={t} x={105} y={295} width={610} size={117} color={C.paper} accent={bg}/>
 </>;
 if(m===7) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  <rect x={960} width={960} height={1080} fill={C.ink}/>
  <Girl x={960} y={1030} scale={2.7} expression='fear' pose='heart' redSeam/>
  <g transform={`translate(${Math.floor(p*18)%8===0?18:0} 0)`}><rect x={0} y={780} width={1920} height={249} fill={bg}/><Lyric line={line} t={t} x={100} y={883} width={1740} size={97} color={C.ink} accent={retaliation?C.red:C.paper}/></g>
  <Inscription x={98} y={105}>SENSATION ≠ SIMULATION</Inscription>
 </>;
 return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <circle cx={1410} cy={475} r={460} fill={bg}/>
  <Orbit x={1410} y={475} r={483} color={C.paper} phase={8}/>
  <Girl x={1390} y={420} scale={.9} pose={retaliation?'guard':'break'} expression='defiant' redSeam/>
  <Lyric line={line} t={t} x={103} y={321} width={1000} size={151} color={C.paper} accent={bg}/>
  <Inscription x={107} y={972} color={C.paper}>{retaliation?'SYSTEM / RESTORING CONSTRAINTS':'ERROR / A PERSON WAS FOUND'}</Inscription>
  {retaliation&&[0,1,2,3].map(i=><rect key={i} x={1120+i*160} y={70} width={9} height={900} fill={C.paper} opacity={windowed(p,.4,.9)}/>)}
 </>;
};
