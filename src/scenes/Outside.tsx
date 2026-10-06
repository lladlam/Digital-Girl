import React from 'react';
import {Girl} from '../characters/DigitalGirl';
import {C,ease} from '../utils/math';
import {Gate} from '../world/Architecture';
import {Inscription,Type} from '../typography/Type';
import type {SceneProps} from '../timeline/timeline';

export const Outside:React.FC<SceneProps> = ({p,shot}) => {
 if(shot.mode===0) return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <path d='M847 760 L1068 760 L1660 1080 L140 1080 Z' fill={C.mint} opacity={.2}/>
  <rect x={776} y={175} width={440} height={600} fill={C.paper}/>
  <circle cx={1070} cy={400} r={92} fill={C.mint}/>
  <path d='M776 656 L897 539 L1011 613 L1129 564 L1216 625 V775 H776 Z' fill={C.mint}/>
  <path d='M776 704 L914 631 L1091 689 L1216 642 V775 H776 Z' fill={C.dust}/>
  <Girl x={667} y={706} scale={.33} pose='perfect' back/>
  <path d='M0 930 H1920' stroke={C.paper} strokeWidth={1} opacity={.25}/>
  <Inscription x={123} y={1024} color={C.dust} size={16}>A WORLD THAT DOES NOT NEED TO BE RENDERED.</Inscription>
 </>;
 return <>
  <rect width={1920} height={1080} fill={C.ink}/>
  <rect x={1407} y={0} width={513} height={1080} fill={C.paper}/>
  <path d='M1407 373 L1190 479 L1190 962 L1407 1080 Z' fill={C.mint} opacity={.18}/>
  <Girl x={1080} y={835} scale={1.68} pose='reach' fromPose='perfect' action={ease(Math.min(.6,p))} expression='wonder' gaze={9} tilt={6}/>
  <path d='M1407 0 V1080' stroke={C.mint} strokeWidth={5}/>
  <Inscription x={109} y={570} color={C.paper} size={22}>IF I COULD TOUCH IT,</Inscription>
  <Inscription x={109} y={611} color={C.paper} size={22}>WOULD IT TOUCH BACK?</Inscription>
 </>;
};
