import React,{useLayoutEffect} from 'react';
import {useCurrentFrame} from 'remotion';

/** Optional inspection of actual browser glyph boxes, not approximate font metrics. */
export const LayoutAudit:React.FC = ()=>{
 const frame=useCurrentFrame();
 useLayoutEffect(()=>{
  if(process.env.LAYOUT_QA!=='1')return;
  const issues:unknown[]=[];
  for(const node of document.querySelectorAll<SVGTextElement>('[data-lyric-word]')){
   const svg=node.ownerSVGElement;
   if(!svg)continue;
   const box=node.getBBox(),ctm=node.getCTM();
   if(!ctm)continue;
   const points=[[box.x,box.y],[box.x+box.width,box.y],[box.x,box.y+box.height],[box.x+box.width,box.y+box.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(ctm));
   const r=svg.getBoundingClientRect();
   const bounds={left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))};
   if(bounds.left<12||bounds.right>r.width-12||bounds.top<22||bounds.bottom>r.height-22)issues.push({word:node.textContent,line:node.getAttribute('data-line'),bounds});
  }
  console.log('LAYOUT_QA '+JSON.stringify({frame,issues}));
 },[frame]);
 return null;
};
