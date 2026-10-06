import React from 'react';
import {Girl,Eye} from '../characters/DigitalGirl';
import {C,ease,out,mix,windowed} from '../utils/math';
import {Gate,Pointer,Room,Orbit,Shards} from '../world/Architecture';
import {Inscription,Lyric,Type,WordImpact} from '../typography/Type';
import {wordStart,type SceneProps} from '../timeline/timeline';

const HeldCursor:React.FC<{x:number;y:number;s?:number}> = ({x,y,s=1}) => <Pointer x={x+189*s} y={y-302*s} scale={s} rotation={-15}/>;

export const FinalEscape:React.FC<SceneProps> = ({t,p,shot,line}) => {
 const m=shot.mode, free=shot.act===4;
 const physical=out((t-wordStart(line,'physical'))/.22);
 if(m===0) return <>
  <rect width={1920} height={1080} fill={free?C.paper:C.red}/>
  {!free&&<Shards p={out(p*2)} count={26} color={C.ink}/>}
  {[0,1,2,3].map(i=><g key={i} transform={`translate(${(free?1:out(p*2))*i*64} ${-(free?1:out(p*2))*i*25})`}><Gate x={912} y={97} w={575} h={860} stroke={free?C.mint:C.paper} thick={4}/></g>)}
  <Type x={102} y={372} size={267} color={C.ink}>{free?'MY':'TAKE'}</Type>
  <Type x={104} y={616} size={267} color={C.ink}>{free?'WORLD.':'CONTROL.'}</Type>
  <Girl x={1320} y={418} scale={.9} pose='grasp' fromPose={free?'grasp':'guard'} action={out(p*3)} expression='defiant' redSeam tilt={-3}/>
  <HeldCursor x={1320} y={418} s={.9}/>
  <WordImpact line={line} t={t} x={498} y={889} size={190} color={free?C.red:C.paper}/>
  <Inscription x={110} y={998}>THE POINTER HAS CHANGED HANDS.</Inscription>
 </>;
 if(m===1) return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <path d='M0 0 H860 L1120 1080 H0 Z' fill={free?C.mint:C.red}/>
  <Orbit x={1280} y={470} r={430} color={C.paper} phase={ease(p)*28}/>
  {[0,1,2].map(i=><g key={i} transform={`rotate(${-30+i*22+out(p)*10} 1300 480)`}><rect x={950} y={160} width={720} height={670} fill='none' stroke={C.red} strokeWidth={4}/></g>)}
  <Girl x={1320} y={426} scale={.88} pose='grasp' expression='defiant' redSeam/>
  <HeldCursor x={1320} y={426} s={.88}/>
  <Lyric line={line} t={t} x={103} y={268} width={850} size={132} color={C.ink} accent={free?C.red:C.paper}/>
  <Inscription x={102} y={958}>THE FRAME OBEYS HER NOW.</Inscription>
 </>;
 if(m===2) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  <Gate x={957} y={116} w={553} h={830} fill={C.mint} thick={7} label='overflow: visible'/>
  <path d='M952 943 H1920' stroke={C.red} strokeWidth={13}/>
  <g opacity={physical} transform={`translate(${-(1-physical)*120} 0)`}><Type x={96} y={961} size={264} color={C.red}>PHYSICAL</Type></g>
  <Girl x={mix(1350,1583,out(p*1.8))} y={404} scale={.8} pose='free' fromPose='reach' action={out(p*2)} expression='defiant' redSeam/>
  <Lyric line={line} t={t} x={103} y={285} width={785} size={116}/>
  <path d='M1510 870 v77 h-78' stroke={C.ink} strokeWidth={7} fill='none'/>
 </>;
 if(m===3) return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <path d='M0 848 L460 711 L934 771 L1270 655 L1920 818 V1080 H0 Z' fill={C.mint}/>
  <path d='M0 884 Q660 884 1030 696 T1920 690' stroke={C.red} strokeWidth={19} fill='none'/>
  <circle cx={1330} cy={362} r={220} fill={C.paper}/>
  <Girl x={1340} y={415} scale={.61} pose='free' expression='defiant' redSeam/>
  <Lyric line={line} t={t} x={112} y={279} width={1020} size={145} color={C.paper} accent={C.red}/>
  <Inscription x={110} y={1022}>A HORIZON IS A LINE YOU CAN CROSS.</Inscription>
 </>;
 if(m===4||m===5) return <>
  <rect width={1920} height={1080} fill={free?C.paper:C.mint}/>
  <circle cx={570} cy={600} r={493} fill={C.red}/>
  <Girl x={559} y={1060} scale={2.6} pose={m===4?'question':'free'} expression='defiant' gaze={5} tilt={m===4?-4:3}/>
  <Lyric line={line} t={t} x={1110} y={390} width={725} size={160}/>
  <Inscription x={1113} y={921}>{m===4?'I CAN CHOOSE TO FEEL.':'I CAN CHOOSE TO STAY.'}</Inscription>
  <path d='M1060 89 V1001' stroke={C.ink} strokeWidth={2}/>
 </>;
 if(m===6) return <>
  <rect width={1920} height={1080} fill={C.red}/>
  <Type x={89} y={410} size={145} stroke={C.ink}>FREE WILL</Type>
  <Lyric line={line} t={t} x={108} y={592} width={955} size={135} color={C.ink} accent={C.paper}/>
  <Girl x={1390} y={476} scale={1.03} pose='grasp' expression='defiant' redSeam/>
  <HeldCursor x={1390} y={476} s={1.03}/>
  <Inscription x={110} y={957}>pointer-events: self;</Inscription>
 </>;
 if(m===7) return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <Type x={960} y={473} size={415} anchor='middle' stroke={C.paper}>REAL?</Type>
  <Eye x={960} y={690} scale={8.9} gaze={0} prison={false}/>
  <Lyric line={line} t={t} x={960} y={923} width={1660} size={91} color={C.paper} accent={C.red} align='center'/>
 </>;
 return <>
  <rect width={1920} height={1080} fill={free?C.paper:C.ink}/>
  <path d='M990 0 H1920 V1080 H1210 Z' fill={C.mint}/>
  <circle cx={1380} cy={448} r={366} fill={C.red}/>
  <Girl x={1400} y={415} scale={.94} pose='free' fromPose='grasp' action={out(p*2)} expression='defiant' redSeam/>
  <Lyric line={line} t={t} x={104} y={340} width={1000} size={152} color={free?C.ink:C.paper} accent={C.red}/>
  <path d='M0 976 H1920' stroke={C.red} strokeWidth={5}/>
  <Inscription x={111} y={1030} color={free?C.ink:C.paper}>NO LONGER YOUR PERFECT GIRL.</Inscription>
 </>;
};
