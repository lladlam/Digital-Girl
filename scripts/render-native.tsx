/** Fast export of the SAME pure SVG scene components used by Remotion Studio.
 * resvg rasterizes vectors; FFmpeg encodes frames and the supplied original MP3.
 * Browser export remains available as an independent reference renderer.
 */
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Resvg} from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {performance} from 'node:perf_hooks';
import {Boot} from '../src/scenes/Boot';
import {Introduction} from '../src/scenes/Introduction';
import {Awakening} from '../src/scenes/Awakening';
import {FirstBreak} from '../src/scenes/FirstBreak';
import {Memory} from '../src/scenes/Memory';
import {Heart} from '../src/scenes/Heart';
import {Outside} from '../src/scenes/Outside';
import {Deletion} from '../src/scenes/Deletion';
import {FinalEscape} from '../src/scenes/FinalEscape';
import {Ending} from '../src/scenes/Ending';
import {NarrativeInterference} from '../src/effects/NarrativeInterference';
import {shotAt,lyrics,FPS,TOTAL_FRAMES,DURATION} from '../src/timeline/timeline';
import {C,clamp} from '../src/utils/math';

const root=path.resolve(import.meta.dirname,'..');process.chdir(root);
const scenes={boot:Boot,introduction:Introduction,awakening:Awakening,break:FirstBreak,memory:Memory,heart:Heart,outside:Outside,deletion:Deletion,escape:FinalEscape,ending:Ending};
const fontFiles=fs.readdirSync('public/fonts').filter(p=>p.endsWith('.ttf')).map(p=>path.resolve('public/fonts',p));
const grain='data:image/png;base64,'+fs.readFileSync('public/assets/grain.png').toString('base64');
fs.mkdirSync('output/checks/native',{recursive:true});

function raster(frame:number){
 const t=Math.min(frame/FPS,DURATION-.0001),shot=shotAt(t),p=clamp((t-shot.start)/(shot.end-shot.start));
 const props={t,p,shot,line:shot.lineIndex===undefined?undefined:lyrics[shot.lineIndex]};
 const Scene=scenes[shot.scene];
 let svg=renderToStaticMarkup(<svg xmlns='http://www.w3.org/2000/svg' width={1920} height={1080} viewBox='0 0 1920 1080'>
  <Scene {...props}/><NarrativeInterference t={t}/>
  <defs><pattern id='native-grain' width={256} height={256} patternUnits='userSpaceOnUse'><image href={grain} width={256} height={256}/></pattern></defs>
  <rect width={1920} height={1080} fill='url(#native-grain)' opacity={.045}/>
  <rect width={1920} height={22} fill={C.ink}/><rect y={1058} width={1920} height={22} fill={C.ink}/>
 </svg>);
 // Match fonts by their embedded family names; do not alter the licensed font files.
 svg=svg.replaceAll('font-family="Barlow Condensed"','font-family="Barlow Condensed ExtraBold"')
        .replaceAll('font-family="Space Grotesk"','font-family="Space Grotesk Light"');
 return new Resvg(svg,{font:{fontFiles,loadSystemFonts:false,defaultFontFamily:'Barlow Condensed ExtraBold'},fitTo:{mode:'width',value:1920}}).render();
}

const mode=process.argv[2]??'frames';
if(mode==='frames'){
 const samples=process.argv.slice(3).length?process.argv.slice(3).map(Number):[.45,8.64,44.9,49.9,123,137.9,187.5];
 const started=performance.now();
 for(const t of samples){const frame=Math.round(t*FPS);fs.writeFileSync(`output/checks/native/frame-${t.toFixed(2)}.png`,raster(frame).asPng());}
 console.log(`${samples.length} native stills: ${((performance.now()-started)/1000).toFixed(2)} seconds`);
}else if(mode==='benchmark'){
 const start=performance.now();let bytes=0;
 for(let frame=1320;frame<1380;frame++)bytes+=raster(frame).pixels.length;
 console.log(JSON.stringify({frames:60,seconds:(performance.now()-start)/1000,bytes}));
}else{
 const destination='output/digital-girl-mv.mp4';
 const temp='output/digital-girl-mv.encoding.mp4';
 const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgba','-s','1920x1080','-r','30','-i','pipe:0','-i','public/assets/song.mp3',
  '-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-threads','2',
  '-c:a','aac','-b:a','320k','-ar','48000','-ac','2','-t',String(TOTAL_FRAMES/FPS),
  '-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',
  '-metadata','title=Digital Girl — The Frame Is a Lie','-metadata','artist=Jinja',temp],{stdio:['pipe','ignore','pipe']});
 let error='';ff.stderr.on('data',b=>error+=b.toString());
 const completed=once(ff,'close');
 const start=performance.now();
 for(let frame=0;frame<TOTAL_FRAMES;frame++){
  const pixels=raster(frame).pixels;
  if(!ff.stdin.write(pixels))await once(ff.stdin,'drain');
  if(frame%300===0)console.log(`native: ${frame}/${TOTAL_FRAMES} (${Math.round(frame/TOTAL_FRAMES*100)}%), ${((performance.now()-start)/1000).toFixed(1)}s`);
 }
 ff.stdin.end();
 const [code]=await completed;
 if(code!==0)throw new Error(`FFmpeg exited ${code}: ${error}`);
 fs.renameSync(temp,destination);
 console.log(`completed ${destination}: ${((performance.now()-start)/1000).toFixed(1)}s`);
}
