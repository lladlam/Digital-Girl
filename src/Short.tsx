import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {FontReady,Texture} from './Root';
import {Girl,Eye} from './characters/DigitalGirl';
import {Gate,Pointer,Orbit} from './world/Architecture';
import {Type,Lyric,Inscription,WordImpact} from './typography/Type';
import {C,ease,out,clamp} from './utils/math';
import {shortSelection,FPS,shotAt,lyrics} from './timeline/timeline';
import {LayoutAudit} from './utils/LayoutAudit';

// A dedicated vertical stage. No horizontal frame, crop or scaled 16:9 composition.
export const Short:React.FC = ()=>{
 const frame=useCurrentFrame(),t=frame/FPS+shortSelection.start,shot=shotAt(t);
 const p=clamp((t-shot.start)/(shot.end-shot.start)),m=shot.mode,line=lyrics[shot.lineIndex!];
 const dark=m===1||m===3||m===7,red=m===0||m===6;
 return <AbsoluteFill style={{background:C.paper}}><FontReady><Audio src={staticFile('assets/song.mp3')} startFrom={Math.round(shortSelection.start*FPS)}/>
 <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1080 1920' width='100%' height='100%'>
  <rect width={1080} height={1920} fill={dark?C.ink:red?C.red:C.paper}/>
  <Inscription x={70} y={88} color={dark?C.paper:C.ink} size={19}>DIGITAL GIRL / JINJA</Inscription>
  {m===0&&<>
   <Type x={540} y={308} size={218} anchor='middle' color={C.ink}>TAKE</Type>
   <Type x={540} y={490} size={218} anchor='middle' color={C.ink}>CONTROL.</Type>
   {[0,1,2].map(i=><g key={i} transform={`rotate(${(i-1)*9} 540 1000)`}><Gate x={195-i*60} y={544-i*36} w={620+i*120} h={1000+i*72} stroke={C.paper} thick={5}/></g>)}
   <Girl x={522} y={929} scale={.96} pose='grasp' expression='defiant' redSeam/>
   <Pointer x={703} y={639} scale={.96}/>
   <WordImpact line={line} t={t} x={540} y={1756} size={190} color={C.paper}/>
  </>}
  {(m===1||m===2||m===3)&&<>
   {m===1?<Orbit x={540} y={928} r={475} color={C.red} phase={p*20}/>:<Gate x={204} y={663} w={672} h={892} stroke={dark?C.paper:C.ink} fill={dark?C.ink:C.mint} thick={6} label='overflow: visible'/>}
   <Lyric line={line} t={t} x={540} y={275} width={935} size={116} align='center' color={dark?C.paper:C.ink} accent={C.red}/>
   <Girl x={m===2?540+out(p)*128:540} y={1010} scale={.91} pose={m===1?'grasp':'free'} expression='defiant' redSeam/>
   {m===1&&<Pointer x={712} y={735} scale={.91}/>}
   <path d='M0 1660 Q610 1680 1080 1460' fill='none' stroke={C.red} strokeWidth={12}/>
   <Type x={540} y={1810} size={m===2?184:125} anchor='middle' color={dark?C.paper:C.ink}>{m===2?'PHYSICAL':m===1?'HER RULES.':'HER WORLD.'}</Type>
  </>}
  {(m===4||m===5)&&<>
   <circle cx={540} cy={845} r={502} fill={C.red}/>
   <Girl x={539} y={1260} scale={2.44} pose='free' expression='defiant' gaze={5}/>
   <rect x={0} y={1390} width={1080} height={530} fill={C.paper}/>
   <Lyric line={line} t={t} x={540} y={1550} width={940} size={157} align='center'/>
   <Inscription x={70} y={238}>I CAN CHOOSE TO FEEL.</Inscription>
  </>}
  {m===6&&<>
   <Type x={540} y={312} size={184} anchor='middle' color={C.ink}>FREE WILL</Type>
   <Girl x={510} y={850} scale={1.02} pose='grasp' expression='defiant' redSeam/>
   <Pointer x={703} y={542} scale={1.02}/>
   <Lyric line={line} t={t} x={540} y={1680} width={925} size={134} align='center' color={C.ink} accent={C.paper}/>
  </>}
  {m===7&&<>
   <Type x={540} y={451} size={340} anchor='middle' stroke={C.paper}>REAL?</Type>
   <Eye x={540} y={921} scale={8.2}/>
   <Lyric line={line} t={t} x={540} y={1450} width={937} size={126} align='center' color={C.paper} accent={C.red}/>
  </>}
  {m===8&&<>
   <Type x={540} y={312} size={219} anchor='middle'>DIGITAL</Type><Type x={540} y={506} size={240} anchor='middle'>GIRL</Type>
   <circle cx={540} cy={962} r={434} fill={C.red}/>
   <Girl x={540} y={934} scale={.80} pose='free' expression='defiant' redSeam/>
   <Lyric line={line} t={t} x={540} y={1630} width={940} size={115} align='center'/>
  </>}
  <Texture/>
  <path d='M70 1861 H1010' stroke={dark?C.paper:C.ink} strokeWidth={2}/>
 </svg><LayoutAudit/></FontReady></AbsoluteFill>;
};
