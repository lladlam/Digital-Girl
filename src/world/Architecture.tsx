import React from 'react';
import {C, ease, seed} from '../utils/math';
import {Inscription, Type} from '../typography/Type';

export const Pointer: React.FC<{x:number;y:number;scale?:number;rotation?:number;color?:string}> = ({x,y,scale=1,rotation=-15,color=C.red}) =>
 <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}><path d='M0 0 L0 112 L29 85 L51 131 L70 121 L47 76 L86 73 Z' fill={color} stroke={C.ink} strokeWidth={4}/><path d='M8 18 L8 89 L29 67 L51 71 Z' fill={C.paper} opacity={.4}/></g>;

export const Gate: React.FC<{x:number;y:number;w:number;h:number;label?:string;fill?:string;stroke?:string;thick?:number;shadow?:boolean;children?:React.ReactNode}> = ({x,y,w,h,label='DG / INSTANCE 01',fill='none',stroke=C.ink,thick=3,shadow=false,children}) =>
 <g>{shadow&&<rect x={x+18} y={y+18} width={w} height={h} fill={C.ink}/>}<rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={thick}/><path d={`M${x} ${y+36} H${x+w}`} stroke={stroke} strokeWidth={thick}/><Inscription x={x+18} y={y+25} color={stroke} size={14}>{label}</Inscription><path d={`M${x+w-28} ${y+13} l12 12 m-12 0 l12 -12`} fill='none' stroke={stroke} strokeWidth={2}/>{children}</g>;

export const Room: React.FC<{depth?:number;broken?:number;color?:string;fill?:string;vanishX?:number;vanishY?:number}> = ({depth=0,broken=0,color=C.ink,fill=C.paper,vanishX=960,vanishY=470}) =>
 <g><rect width={1920} height={1080} fill={fill}/>{Array.from({length:9},(_,i)=>{
   const z=(i+depth%1)/9, k=Math.pow(1-z,2.3),w=1860*k+40,h=1030*k+25;
   const dx=(seed(i+12)-.5)*broken*160,dy=(seed(i+27)-.5)*broken*80;
   return <g key={i} transform={`translate(${dx} ${dy}) rotate(${(seed(i)-.5)*broken*24} ${vanishX} ${vanishY})`} opacity={1-z*.5}><rect x={vanishX-w/2} y={vanishY-h/2} width={w} height={h} fill='none' stroke={color} strokeWidth={i===0?8:2}/></g>;
 })}{[[0,0],[1920,0],[1920,1080],[0,1080]].map(([x,y],i)=><path key={i} d={`M${x} ${y} L${vanishX} ${vanishY}`} stroke={color} strokeWidth={1}/>)}</g>;

export const Shards: React.FC<{p:number;count?:number;color?:string;origin?:[number,number];seedOffset?:number}> = ({p,count=38,color=C.paper,origin=[960,540],seedOffset=0}) =>
 <g>{Array.from({length:count},(_,i)=>{
   const n=i+seedOffset, angle=seed(n)*Math.PI*2,r=120+seed(n+70)*1100*ease(p),x=origin[0]+Math.cos(angle)*r,y=origin[1]+Math.sin(angle)*r;
   const w=14+seed(n+100)*110,h=8+seed(n+160)*50;
   return <g key={i} transform={`translate(${x} ${y}) rotate(${seed(n+20)*360+p*120})`}><path d={`M${-w} 0 L${w*.2} ${-h} L${w} ${h*.5} L0 ${h} Z`} fill={i%5===0?C.red:color} stroke={C.ink} strokeWidth={2}/></g>;
 })}</g>;

export const Orbit:React.FC<{x:number;y:number;r:number;phase?:number;color?:string}> = ({x,y,r,phase=0,color=C.ink}) => <g transform={`translate(${x} ${y}) rotate(${phase})`}><circle r={r} fill='none' stroke={color} strokeWidth={2}/><ellipse rx={r} ry={r*.28} fill='none' stroke={color} strokeWidth={1.5}/><ellipse rx={r*.28} ry={r} fill='none' stroke={color} strokeWidth={1.5}/><path d={`M${-r-30} 0 H${r+30} M0 ${-r-30} V${r+30}`} stroke={color}/><circle cx={r} r={7} fill={C.red}/></g>;

export const Barcode:React.FC<{x:number;y:number;w?:number;h?:number;color?:string}> = ({x,y,w=160,h=45,color=C.ink}) => <g>{Array.from({length:32},(_,i)=><rect key={i} x={x+i*w/32} y={y} width={seed(i+10)*3+.5} height={h} fill={color}/>)}</g>;

export const Ruler:React.FC<{x:number;y:number;length:number;vertical?:boolean;color?:string}> = ({x,y,length,vertical=false,color=C.dust}) => <g transform={`translate(${x} ${y}) rotate(${vertical?90:0})`}><path d={`M0 0 H${length}`} stroke={color}/>{Array.from({length:Math.floor(length/25)+1},(_,i)=><path key={i} d={`M${i*25} 0 v${i%4===0?18:7}`} stroke={color}/>)}</g>;
