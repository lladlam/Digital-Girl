import React, {useId} from 'react';
import {C, clamp, mix} from '../utils/math';

export type Pose = 'perfect'|'question'|'reach'|'break'|'guard'|'grasp'|'free'|'heart';
type Point = [number,number];
const POSES:Record<Pose,{left:[Point,Point];right:[Point,Point]}> = {
 perfect:{left:[[-173,181],[-108,269]],right:[[170,180],[110,265]]},
 question:{left:[[-171,197],[-143,310]],right:[[184,137],[106,-36]]},
 reach:{left:[[-175,209],[-147,334]],right:[[216,30],[335,-57]]},
 break:{left:[[-238,72],[-330,-32]],right:[[230,71],[354,-17]]},
 guard:{left:[[-142,173],[81,66]],right:[[179,91],[-14,-4]]},
 grasp:{left:[[-180,198],[-124,316]],right:[[218,-39],[272,-191]]},
 free:{left:[[-214,125],[-309,149]],right:[[229,105],[331,55]]},
 heart:{left:[[-183,192],[-35,110]],right:[[171,191],[25,113]]},
};

const Hand:React.FC<{x:number;y:number;angle:number;grip?:boolean}> = ({x,y,angle,grip=false}) => <g transform={`translate(${x} ${y}) rotate(${angle})`}>
 <path d={grip?'M-17 0 L-23 -28 Q-24 -44 -13 -47 L13 -44 Q28 -40 24 -23 L19 4 Z':'M-17 0 L-23 -25 L-28 -42 Q-31 -49 -26 -51 Q-22 -52 -17 -42 L-12 -31 L-11 -70 Q-10 -80 -5 -77 L0 -41 L5 -79 Q10 -86 14 -77 L12 -37 L20 -68 Q27 -72 27 -61 L20 -27 L24 -45 Q29 -52 32 -44 L26 -10 L17 5 Z'} fill={C.paper} stroke={C.ink} strokeWidth={3} strokeLinejoin='round'/>
 {grip?<path d='M-16 -30 L15 -25 M-15 -17 L15 -12 M0 -42 L-2 -10' stroke={C.ink} strokeWidth={2} fill='none'/>:<path d='M-9 -28 Q-3 -11 12 -13 M5 -39 L3 -22' stroke={C.ink} strokeWidth={1.5} fill='none'/>}</g>;

const Arm:React.FC<{side:number;elbow:Point;wrist:Point;grip?:boolean}> = ({side,elbow,wrist,grip=false}) => {
 const start:Point=[side*106,45];
 const angle=Math.atan2(wrist[1]-elbow[1],wrist[0]-elbow[0])*180/Math.PI+90;
 return <g><path d={`M${start} L${elbow} L${wrist}`} fill='none' stroke={C.ink} strokeWidth={57} strokeLinejoin='round'/>
 <path d={`M${start} L${elbow}`} fill='none' stroke={C.mint} strokeWidth={34}/>
 <path d={`M${elbow} L${wrist}`} fill='none' stroke={C.paper} strokeWidth={37}/>
 <path d={`M${mix(elbow[0],wrist[0],.65)} ${mix(elbow[1],wrist[1],.65)} L${wrist}`} fill='none' stroke={C.ink} strokeWidth={43}/>
 <circle cx={elbow[0]} cy={elbow[1]} r={22} fill={C.ink}/><circle cx={elbow[0]} cy={elbow[1]} r={7} fill={C.red}/>
 <Hand x={wrist[0]} y={wrist[1]} angle={angle} grip={grip}/></g>;
};

export const Eye:React.FC<{x?:number;y?:number;scale?:number;flip?:boolean;gaze?:number;fear?:boolean;prison?:boolean}> = ({x=0,y=0,scale=1,flip=false,gaze=0,fear=false,prison=false}) => {
 const id=useId().replace(/:/g,'');
 const shape=fear?'M-54 0 Q0 -46 59 -2 Q15 37 -46 15 Z':'M-54 0 Q-2 -35 61 -6 Q17 33 -46 15 Z';
 return <g transform={`translate(${x} ${y}) scale(${flip?-scale:scale} ${scale})`}>
  <defs><clipPath id={id}><path d={shape}/></clipPath></defs>
  <path d={shape} fill={C.paper} stroke={C.ink} strokeWidth={2}/>
  <path d='M-55 -1 Q-7 -28 47 -13 L67 -24 L60 -6 Q1 -24 -55 2 Z' fill={C.ink}/>
  <g clipPath={`url(#${id})`}><ellipse cx={7+gaze} cy={2} rx={fear?19:22} ry={fear?24:23} fill={C.red}/>
  <ellipse cx={8+gaze} cy={2} rx={7} ry={19} fill={C.ink}/>
  <path d={`M${-6+gaze} -8 L${7+gaze} -11 L${10+gaze} -3 L${-3+gaze} 0 Z`} fill={C.paper}/></g>
  <path d='M-45 17 Q3 35 48 15' fill='none' stroke={C.ink} strokeWidth={2}/>
  <path d='M47 -15 L57 -32 M56 -9 L76 -17' fill='none' stroke={C.ink} strokeWidth={4}/>
  {prison&&<g clipPath={`url(#${id})`} stroke={C.paper} fill='none' strokeWidth={.7}>{[1,.7,.4].map(k=><rect key={k} x={8-18*k} y={2-20*k} width={36*k} height={40*k}/>)}</g>}
 </g>;
};

export const Girl:React.FC<{x:number;y:number;scale?:number;pose?:Pose;fromPose?:Pose;action?:number;expression?:'calm'|'wonder'|'fear'|'defiant';gaze?:number;tilt?:number;back?:boolean;redSeam?:boolean;silhouette?:boolean;mirror?:boolean}> =
 ({x,y,scale=1,pose='perfect',fromPose,action=1,expression='calm',gaze=0,tilt=0,back=false,redSeam=false,silhouette=false,mirror=false}) => {
 const q=POSES[pose],a=POSES[fromPose??pose],p=clamp(action);
 const blend=(v:Point,w:Point):Point=>[mix(v[0],w[0],p),mix(v[1],w[1],p)];
 return <g transform={`translate(${x} ${y}) scale(${mirror?-scale:scale} ${scale})`}>
  <g>
   {/* Graphic cast shadow and consistent leg silhouettes. */}
   <path d='M-96 357 L-101 483 L-123 631 L-162 657 L-163 674 L-62 674 L-44 510 L-13 369 Z' fill={C.ink} stroke={C.ink} strokeWidth={5}/>
   <path d='M24 369 L44 514 L73 674 L165 674 L165 659 L124 636 L112 478 L98 356 Z' fill={C.ink} stroke={C.ink} strokeWidth={5}/>
   <path d='M-82 386 L-78 463 L-66 470 L-52 392 Z M56 393 L62 468 L87 476 L77 384 Z' fill={C.paper}/>
   <path d='M-113 621 L-72 621 M91 621 L130 621' fill='none' stroke={C.red} strokeWidth={9}/>
   <path d='M-66 488 L-85 611 M82 493 L107 611' fill='none' stroke={C.mint} strokeWidth={3}/>
   <Arm side={-1} elbow={blend(a.left[0],q.left[0])} wrist={blend(a.left[1],q.left[1])}/>
   <path d='M-119 28 L-55 -2 L51 -2 L123 31 L92 153 L70 220 L135 347 Q40 400 -131 350 L-75 226 L-94 146 Z' fill={C.ink} stroke={C.ink} strokeWidth={6}/>
   <path d='M-95 38 L-41 12 L37 12 L89 41 L64 170 L39 207 L-47 207 L-64 156 Z' fill={back?C.ink:C.paper}/>
   <path d='M-51 13 L-72 52 L-35 183 L-5 137 L20 190 L68 47 L38 10 Z' fill={C.mint}/>
   <path d='M-26 18 L-7 143 L22 185 L31 17 Z' fill={C.ink}/>
   <path d='M-73 216 L73 216 L125 347 Q0 386 -123 347 Z' fill={C.ink}/>
   {[-88,-47,-8,34,77].map((v,i)=><path key={v} d={`M${v*.63} 230 L${v} 342 L${v+16} 348 L${v*.63+8} 230 Z`} fill={i%2===0?C.mint:C.paper} opacity={.78}/>)}
   <path d='M-72 212 H73' stroke={C.paper} strokeWidth={7}/><rect x={-22} y={201} width={43} height={24} fill={C.red}/>
   <path d='M8 25 L8 123 L34 158 L34 202' stroke={C.red} strokeWidth={redSeam?8:3} fill='none'/>
   {redSeam&&<g><path d='M8 98 L-14 119 L11 141 L31 115 Z' fill={C.red}/><circle cx={8} cy={119} r={30} fill='none' stroke={C.red} strokeWidth={1.5}/></g>}
   <Arm side={1} elbow={blend(a.right[0],q.right[0])} wrist={blend(a.right[1],q.right[1])} grip={pose==='grasp'}/>
   <path d='M-37 -52 L-38 12 Q0 35 38 12 L35 -58 Z' fill={C.paper} stroke={C.ink} strokeWidth={4}/>
   <path d='M-46 -20 L43 -20 L46 15 Q0 35 -47 14 Z' fill={C.ink}/><rect x={-15} y={-13} width={28} height={11} fill={C.red}/>
  </g>
  <g transform={`rotate(${tilt} 0 -95)`}>
   <path d='M-140 -251 Q-146 -362 8 -367 Q148 -360 157 -246 L163 -54 L137 8 L116 -70 L118 -5 L59 -42 L-121 -9 L-115 -76 L-163 -30 Z' fill={C.ink}/>
   {!back&&<>
    <path d='M-103 -200 Q-151 -239 -144 -162 Q-143 -124 -111 -118 M109 -196 Q150 -235 143 -160 Q142 -129 116 -118' fill={C.paper} stroke={C.ink} strokeWidth={4}/>
    <path d='M-117 -262 Q-74 -327 5 -321 Q98 -317 122 -251 L119 -145 Q111 -81 62 -48 L0 -18 L-50 -42 Q-109 -69 -118 -149 Z' fill={C.paper} stroke={C.ink} strokeWidth={4}/>
    <path d='M103 -239 L119 -145 Q111 -81 62 -48 L0 -18 L29 -57 L69 -93 L77 -205 Z' fill={C.mint}/>
    <path d='M-85 -221 Q-54 -237 -25 -225 M30 -225 Q56 -243 93 -227' fill='none' stroke={C.ink} strokeWidth={expression==='fear'?4:3}/>
    <Eye x={-65} y={-185} scale={.81} flip gaze={-gaze} fear={expression==='fear'}/>
    <Eye x={65} y={-185} scale={.81} gaze={gaze} fear={expression==='fear'}/>
    <path d='M2 -178 L-7 -116 L4 -110' stroke={C.ink} strokeWidth={2.5} fill='none'/>
    <path d='M-71 -136 l-9 9 M-61 -133 l-9 9 M70 -135 l-9 9 M81 -132 l-9 9' stroke={C.red} strokeWidth={1.5} opacity={.65}/>
    {expression==='fear'?<ellipse cx={0} cy={-72} rx={10} ry={13} fill={C.ink}/>:expression==='wonder'?<path d='M-12 -77 Q1 -85 13 -75 L8 -69 L-8 -69 Z' fill={C.ink}/>:<path d={expression==='defiant'?'M-22 -81 Q0 -65 25 -88':'M-19 -77 Q0 -72 20 -79'} fill='none' stroke={C.ink} strokeWidth={3} strokeLinecap='round'/>}
    <path d='M-9 -58 H9' stroke={C.ink} strokeWidth={1.5}/>
   </>}
   <path d='M-145 -244 Q-158 -350 -40 -366 Q93 -399 150 -293 L148 -157 L106 -217 L88 -299 L75 -209 L34 -254 L17 -199 L-7 -263 L-62 -210 L-76 -267 L-111 -207 L-118 -105 L-140 -52 Z' fill={C.ink}/>
   <path d='M-73 -335 Q-22 -361 28 -352 L1 -306 L-7 -270 L-57 -223 L-59 -284 L-82 -241 Z' fill={C.paper}/>
   <path d='M43 -351 Q110 -344 133 -284 L113 -243 L105 -292 Z' fill={C.mint}/>
   <path d='M-125 -251 L-132 -86 M140 -195 L146 -63' stroke={C.mint} strokeWidth={3} fill='none'/>
   <g transform='rotate(-12 111 -240)'><rect x={88} y={-260} width={66} height={13} fill={C.red}/><rect x={93} y={-240} width={59} height={8} fill={C.red}/></g>
   <path d='M-133 -168 L-163 -165 L-161 -95 L-138 -88 L-124 -108 Z' fill={C.mint} stroke={C.ink} strokeWidth={4}/><path d='M-151 -153 V-111' stroke={C.red} strokeWidth={6}/>
   {back&&<path d='M-45 -330 L-37 -47 M51 -330 L71 -66 M-96 -275 L-109 -29' stroke={C.mint} strokeWidth={2} fill='none'/>}
  </g>
  {silhouette&&<path d='M-128 -293 Q-148 -369 7 -367 Q153 -360 152 -238 L139 -30 L121 39 L90 153 L74 211 L133 350 L98 379 L114 630 L165 661 L164 674 L73 674 L12 397 L-12 397 L-63 674 L-163 674 L-162 657 L-118 630 L-96 372 L-131 350 L-74 211 L-110 33 L-148 -27 Z' fill={C.ink}/>}
 </g>;
};
