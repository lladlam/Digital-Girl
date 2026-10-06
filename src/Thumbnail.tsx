import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FontReady,Texture} from './Root';
import {Girl} from './characters/DigitalGirl';
import {Gate,Pointer} from './world/Architecture';
import {Type} from './typography/Type';
import {C} from './utils/math';

export const Thumbnail:React.FC = ()=> <AbsoluteFill><FontReady><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080' width='100%' height='100%'>
 <rect width={1920} height={1080} fill={C.red}/>
 <path d='M0 0 H975 L1125 1080 H0 Z' fill={C.paper}/>
 {[0,1,2].map(i=><g key={i} transform={`rotate(${-10+i*9} 1450 560)`}><Gate x={970+i*55} y={78+i*20} w={760} h={930} stroke={C.paper} thick={6} label=''/></g>)}
 <Type x={92} y={393} size={259}>DIGITAL</Type><Type x={88} y={717} size={415}>GIRL</Type>
 <Type x={108} y={898} size={62} font='body' weight={700}>JINJA</Type>
 <Girl x={1395} y={907} scale={2.15} pose='grasp' expression='defiant' gaze={-4} tilt={-5} redSeam/>
 <Pointer x={1760} y={246} scale={1.8}/>
 <Texture/>
</svg></FontReady></AbsoluteFill>;
