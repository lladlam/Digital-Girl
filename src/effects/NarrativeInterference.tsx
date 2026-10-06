import React from 'react';
import {words,beatPulse,FPS} from '../timeline/timeline';
import {C,seed} from '../utils/math';

// Brief, word-triggered interference. It disappears entirely once control is reversed.
const events=words.filter(w=>
 (w.lineIndex===7&&w.text==='do-')||
 (w.lineIndex===15&&w.text.toLowerCase().startsWith('down'))||
 (w.lineIndex===31&&w.text.includes('REDACTED'))||
 (w.lineIndex===38&&w.text.toLowerCase()==='break')
).map(w=>w.start);
export const NarrativeInterference:React.FC<{t:number}> = ({t})=>{
 const event=events.find(s=>t>=s&&t<s+2/FPS);
 if(event===undefined)return null;
 const f=Math.floor(t*FPS);
 return <g>{[0,1,2,3].map(i=><rect key={i} x={seed(f+i)*190} y={140+seed(f+i+30)*710} width={1420+seed(f+i+8)*440} height={4+seed(f+i+4)*20} fill={i%2?C.paper:C.ink} opacity={.55+beatPulse(t)*.35}/>)}</g>;
};
