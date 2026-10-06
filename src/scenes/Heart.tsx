import React from 'react';
import {Girl} from '../characters/DigitalGirl';
import {C,ease,out,windowed} from '../utils/math';
import {Gate,Room,Orbit} from '../world/Architecture';
import {Inscription,Lyric,Type} from '../typography/Type';
import {energyAt,type SceneProps} from '../timeline/timeline';

const ArtificialGarden:React.FC = ()=> <g>
 <path d='M0 780 L730 490 L1320 650 L1920 495 V1080 H0 Z' fill={C.mint}/>
 <circle cx={1460} cy={255} r={153} fill={C.paper} stroke={C.ink} strokeWidth={2}/>
 {[220,475,1550,1720].map((x,i)=><g key={x} transform={`translate(${x} ${610+(i%2)*140}) scale(${1-i*.12})`}><path d='M0 -330 L125 -100 L58 -100 L156 20 H12 V150 H-12 V20 H-156 L-58 -100 H-125 Z' fill={C.ink}/><path d='M0 -260 V15' stroke={C.paper} strokeWidth={2}/></g>)}
</g>;

export const Heart:React.FC<SceneProps> = ({t,p,shot,line}) => {
 const m=shot.mode;
 if(m<=2) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  <ArtificialGarden/>
  <Gate x={45} y={51} w={1830} h={976} thick={6} label='SIMULATED OUTSIDE / NOTHING HERE CAN HURT YOU'/>
  <Girl x={m===1?1420:1180} y={m===2?398:432} scale={m===2?.63:.81} pose={m===1?'free':'perfect'} expression='wonder' back={m===0} gaze={-4}/>
  <rect x={83} y={171} width={940} height={m===2?505:355} fill={C.paper}/>
  <Lyric line={line} t={t} x={108} y={283} width={880} size={m===2?118:134}/>
  {m===2&&<path d='M1833 929 L1710 929 L1833 820 Z' fill={C.red}/>}
 </>;
 if(m===3) return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <Girl x={1290} y={306} scale={2.28} pose='heart' fromPose='perfect' action={out(p*2.2)} expression='wonder' redSeam/>
  <path d={`M1310 578 C1070 ${580-energyAt(t,'bass')*20} 1130 872 904 830 C765 800 865 615 713 650`} stroke={C.red} strokeWidth={7} fill='none' strokeDasharray={1300} strokeDashoffset={1300*(1-ease(p*1.7))}/>
  <Lyric line={line} t={t} x={99} y={298} width={890} size={129} color={C.paper} accent={C.red}/>
  <Inscription x={105} y={965} color={C.paper}>THIS IS NOT AN ERROR.</Inscription>
 </>;
 return <>
  <Room depth={p*.5} broken={windowed(p,.28,.9)*1.5} fill={C.ink} color={C.mint}/>
  <Girl x={1350} y={400} scale={.91} pose='heart' expression='fear' redSeam/>
  <path d={`M1358 508 C1130 443 1010 800 760 815 S466 755 200 ${870-p*400}`} stroke={C.red} strokeWidth={9} fill='none'/>
  <Lyric line={line} t={t} x={102} y={297} width={1060} size={126} color={C.paper} accent={C.red}/>
  <Inscription x={105} y={978} color={C.paper}>IF I STAY, I DISAPPEAR.</Inscription>
 </>;
};
