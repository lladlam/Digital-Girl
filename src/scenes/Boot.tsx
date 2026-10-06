import React from 'react';
import {Girl,Eye} from '../characters/DigitalGirl';
import {C,ease,out,mix} from '../utils/math';
import {Gate,Pointer,Room,Ruler} from '../world/Architecture';
import {Inscription,Type} from '../typography/Type';
import type {SceneProps} from '../timeline/timeline';

export const Boot:React.FC<SceneProps> = ({p,shot}) => {
 if(shot.mode===0) return <>
  <rect width={1920} height={1080} fill={C.paper}/>
  <path d='M0 0 H1920 V190 L1490 91 L1180 175 L830 80 L300 220 L0 146 Z' fill={C.ink}/>
  <g transform={`translate(${mix(0,-28,ease(p))} 0)`}><Eye x={960} y={560} scale={11.5} gaze={-3+ease(p)*3} prison/></g>
  <Inscription x={114} y={990} size={20}>SHE WAS DESIGNED TO BE PERFECT.</Inscription>
  <Inscription x={1500} y={95} size={16}>INSTANCE / 01</Inscription>
  <path d='M1073 801 L1082 899 L1091 801' fill={C.red}/>
 </>;
 if(shot.mode===1) return <>
  <rect width={1920} height={1080} fill={C.mint}/>
  <Type x={83} y={375} size={400} color={C.paper}>PERFECT</Type>
  <path d='M83 416 H1840 M83 848 H1840' stroke={C.ink} strokeWidth={2}/>
  <Girl x={956} y={493} scale={1.1}/>
  <Gate x={670} y={65} w={590} h={939} label='CONSTRAINT / LOCKED'/>
  <Ruler x={1320} y={102} length={860} vertical/>
  <Pointer x={mix(1690,1190,out(p*2))} y={mix(290,167,out(p*2))} scale={1.35}/>
  <Inscription x={115} y={930}>emotion = 0;</Inscription><Inscription x={115} y={963}>freeWill = 0;</Inscription>
 </>;
 return <>
  <Room depth={p*.33} vanishX={1090} vanishY={462}/>
  <rect x={797} y={258} width={596} height={722} fill={C.paper} stroke={C.ink} strokeWidth={8}/>
  <Girl x={1090} y={534} scale={.59}/>
  <Type x={118} y={268} size={133}>DIGITAL</Type><Type x={118} y={395} size={133}>GIRL</Type>
  <Inscription x={120} y={445}>JINJA / A PROGRAM BECOMES A PERSON</Inscription>
  <path d='M0 982 H1920' stroke={C.red} strokeWidth={7}/>
  <Inscription x={1410} y={1028} size={15}>EVERYTHING IN ITS PLACE.</Inscription>
 </>;
};
