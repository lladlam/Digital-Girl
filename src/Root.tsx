import React, {useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Composition,cancelRender,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import {Boot} from './scenes/Boot';
import {Introduction} from './scenes/Introduction';
import {FirstBreak} from './scenes/FirstBreak';
import {Awakening} from './scenes/Awakening';
import {Memory} from './scenes/Memory';
import {Heart} from './scenes/Heart';
import {Outside} from './scenes/Outside';
import {Deletion} from './scenes/Deletion';
import {FinalEscape} from './scenes/FinalEscape';
import {Ending} from './scenes/Ending';
import {Short} from './Short';
import {Thumbnail} from './Thumbnail';
import {NarrativeInterference} from './effects/NarrativeInterference';
import {LayoutAudit} from './utils/LayoutAudit';
import {shotAt,lyrics,FPS,TOTAL_FRAMES,DURATION,shortSelection} from './timeline/timeline';
import {C,clamp} from './utils/math';
import './fonts.css';

export const FontReady:React.FC<{children:React.ReactNode}> = ({children})=>{
 const [handle]=useState(()=>delayRender('Load bundled fonts'));
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const fonts:[string,string,string][]=[
   ['Barlow Condensed','barlow-condensed-latin-800-normal','800'],
   ['Barlow Condensed','barlow-condensed-latin-700-normal','700'],
   ['Space Grotesk','space-grotesk-latin-500-normal','500'],
   ['Space Grotesk','space-grotesk-latin-700-normal','700'],
   ['IBM Plex Mono','ibm-plex-mono-latin-400-normal','400']
  ];
  Promise.all(fonts.map(async([family,file,weight])=>{
   const font=new FontFace(family,`url(${staticFile('fonts/'+file+'.woff2')})`,{weight});
   await font.load();document.fonts.add(font);
  })).then(()=>setReady(true)).catch(cancelRender);
 },[handle]);
 useEffect(()=>{if(ready)continueRender(handle);},[ready,handle]);
 return ready?<>{children}</>:null;
};

export const Texture:React.FC = ()=> <g style={{pointerEvents:'none'}}>
 <defs><pattern id='paper-grain' width={256} height={256} patternUnits='userSpaceOnUse'><image href={staticFile('assets/grain.png')} width={256} height={256}/></pattern></defs>
 <rect width='100%' height='100%' fill='url(#paper-grain)' opacity={.045}/>
</g>;

export const Main:React.FC = ()=>{
 const frame=useCurrentFrame(),t=Math.min(frame/FPS,DURATION-.0001),shot=shotAt(t),p=clamp((t-shot.start)/(shot.end-shot.start));
 const props={t,p,shot,line:shot.lineIndex===undefined?undefined:lyrics[shot.lineIndex]};
 const Scene={boot:Boot,introduction:Introduction,awakening:Awakening,break:FirstBreak,memory:Memory,heart:Heart,outside:Outside,deletion:Deletion,escape:FinalEscape,ending:Ending}[shot.scene];
 return <AbsoluteFill style={{background:C.paper}}><FontReady><Audio src={staticFile('assets/song.mp3')}/>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080' width='100%' height='100%'>
    <Scene {...props}/>
    <NarrativeInterference t={t}/>
    <Texture/>
    <rect x={0} y={0} width={1920} height={22} fill={C.ink}/><rect x={0} y={1058} width={1920} height={22} fill={C.ink}/>
  </svg><LayoutAudit/></FontReady>
 </AbsoluteFill>;
};

export const Root:React.FC = ()=> <>
 <Composition id='DigitalGirlMV' component={Main} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080}/>
 <Composition id='DigitalGirlShort' component={Short} durationInFrames={Math.round((shortSelection.end-shortSelection.start)*FPS)} fps={FPS} width={1080} height={1920}/>
 <Composition id='DigitalGirlThumbnail' component={Thumbnail} durationInFrames={1} fps={FPS} width={1920} height={1080}/>
</>;
