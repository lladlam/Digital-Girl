import React from 'react';
import {C, clamp, out} from '../utils/math';
import type {Line} from '../timeline/timeline';
import fontMetrics from '../../generated/font-metrics.json';

let context:CanvasRenderingContext2D|null=null;
const textWidth=(text:string,size:number)=>{
 if(typeof document==='undefined') return ((fontMetrics as Record<string,number>)[text]??text.length*.47)*size;
 context ??= document.createElement('canvas').getContext('2d');
 if(!context) return text.length*size*.47;
 context.font=`800 ${size}px "Barlow Condensed"`;
 return context.measureText(text).width;
};

export const Type: React.FC<{children:React.ReactNode;x:number;y:number;size?:number;color?:string;anchor?:'start'|'middle'|'end';font?:'display'|'mono'|'body';weight?:number;spacing?:number;opacity?:number;rotate?:number;stroke?:string}> =
({children,x,y,size=40,color=C.ink,anchor='start',font='display',weight=800,spacing=0,opacity=1,rotate=0,stroke}) =>
  <text x={x} y={y} fontSize={size} fill={stroke?'none':color} stroke={stroke} strokeWidth={stroke?2:undefined} textAnchor={anchor} opacity={opacity} letterSpacing={spacing} fontWeight={font==='mono'?400:weight} fontFamily={font==='display'?'Barlow Condensed':font==='mono'?'IBM Plex Mono':'Space Grotesk'} transform={rotate?`rotate(${rotate} ${x} ${y})`:undefined}>{children}</text>;

export const Inscription: React.FC<{x:number;y:number;children:React.ReactNode;color?:string;size?:number}> = ({x,y,children,color=C.ink,size=18}) => <Type x={x} y={y} size={size} font='mono' weight={400} color={color} spacing={2}>{children}</Type>;

// Phrase layout is independent of active word. Nothing jumps when a later word arrives.
export const Lyric: React.FC<{line?:Line;t:number;x:number;y:number;width?:number;size?:number;color?:string;accent?:string;align?:'left'|'center';style?:'solid'|'outline'|'stamp';uppercase?:boolean;leading?:number}> =
({line,t,x,y,width=800,size=100,color=C.ink,accent=C.red,align='left',style='solid',uppercase=true,leading=1.04}) => {
  if(!line) return null;
  const rows: {word:Line['words'][number]; text:string; w:number}[][] = [[]];
  let used=0;
  const measure=(s:string)=>textWidth(s,size);
  for(const word of line.words){
    const text=uppercase?word.text.toUpperCase():word.text;
    const w=measure(text), gap=size*.19;
    if(used+w>width && rows.at(-1)!.length){rows.push([]);used=0;}
    rows.at(-1)!.push({word,text,w});used+=w+gap;
  }
  return <g>{rows.map((row,ri)=>{
    const rowWidth=row.reduce((n,v)=>n+v.w+size*.19,0)-size*.19;
    let xx=align==='center'?x-rowWidth/2:x;
    return <g key={ri}>{row.map(({word,text,w})=>{
      const left=xx; xx+=w+size*.19;
      const a=clamp((t-word.start)/.105), active=t>=word.start&&t<word.end;
      const yy=y+ri*size*leading+(1-out(a))*16;
      return <g key={`${word.start}-${text}`} opacity={t<word.start?0:1} transform={`translate(${left} ${yy})`}>
        {active&&style==='stamp'&&<rect x={-5} y={-size*.8} width={w+10} height={size*.88} fill={accent}/>}
        <text data-lyric-word={word.text} data-line={line.index} fontFamily='Barlow Condensed' fontWeight={800} fontSize={size} fill={active?(style==='stamp'?C.paper:accent):style==='outline'?'none':color} stroke={!active&&style==='outline'?color:undefined} strokeWidth={1.8}>{text}</text>
        {active&&style!=='stamp'&&<path d={`M0 ${size*.11} H${w}`} stroke={accent} strokeWidth={3}/>}</g>;
    })}</g>;
  })}</g>;
};

export const WordImpact: React.FC<{line?:Line;t:number;x:number;y:number;size?:number;color?:string;rotate?:number}> = ({line,t,x,y,size=330,color=C.paper,rotate=0}) => {
  const word=line?.words.find(w=>t>=w.start&&t<w.end) ?? line?.words.findLast(w=>w.start<=t);
  if(!word) return null;
  const a=out((t-word.start)/.14);
  const text=word.text.replace(/[.,!?"]/g,'').toUpperCase();
  const fit=Math.min(size,1500/Math.max(1,text.length*.5));
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${1+(1-a)*.12})`}><Type x={0} y={0} size={fit} anchor='middle' color={color}>{text}</Type></g>;
};
