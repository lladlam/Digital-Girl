import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderMedia, renderStill} from '@remotion/renderer';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
process.chdir(root);
process.env.XDG_CACHE_HOME='/workspace/.cache';
const mode=process.argv[2]??'frames';
const output=path.join(root,'output');
const shortSelection=JSON.parse(await readFile(path.join(root,'generated/short-selection.json'),'utf8')).selected;
await mkdir(output,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public'),outDir:path.join(root,'.cache/bundle')});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium',chromiumOptions:{gl:null}});
try {
 const id=mode==='short'||mode==='audit-short'?'DigitalGirlShort':mode==='thumbnail'?'DigitalGirlThumbnail':'DigitalGirlMV';
 const comp=await selectComposition({serveUrl,id,puppeteerInstance:browser,logLevel:'warn'});
 if(mode==='audit'||mode==='audit-short'){
  const {lines}=JSON.parse(await readFile('generated/lyrics.json','utf8'));
  const selection=JSON.parse(await readFile('generated/short-selection.json','utf8')).selected;
  const requested=process.argv.slice(3).map(Number);
  const allSamples=mode==='audit'?lines:lines.filter(l=>l.start>=selection.start&&l.end<=selection.end);
  const samples=requested.length?allSamples.filter(l=>requested.includes(l.index)):allSamples;
  const records=[];
  await mkdir(path.join(output,'checks',mode),{recursive:true});
  for(const line of samples){
   const offset=mode==='audit-short'?selection.start:0;
   const frame=Math.floor((line.end-.04-offset)*30);
   await renderStill({serveUrl,composition:comp,output:path.join(output,'checks',mode,`line-${String(line.index).padStart(2,'0')}.png`),frame,
    imageFormat:'png',puppeteerInstance:browser,envVariables:{LAYOUT_QA:'1'},logLevel:'warn',
    onBrowserLog:(log)=>{const s=log.text; if(s?.startsWith('LAYOUT_QA '))records.push(JSON.parse(s.slice(10)));}
   });
   console.log(`${mode}: line ${line.index}`);
  }
  await writeFile(path.join(output,'checks',`${mode}${process.argv.length>3?'-recheck':''}.json`),JSON.stringify(records,null,2));
  const issues=records.flatMap(r=>r.issues);
  console.log(`Actual glyph bounds: ${records.length} rendered frames, ${issues.length} overflow findings.`);
  if(!records.length||issues.length)process.exitCode=1;
 }else if(mode==='frames'){
  await mkdir(path.join(output,'checks'),{recursive:true});
  const samples=process.argv.slice(3).length?process.argv.slice(3).map(Number):[.45,2.6,5,10.7,18.8,32.3,40.5,44.9,49.9,60.9,69.5,92.8,103,123,134.5,138.2,145.5,158.6,164,176.5,187.5];
  for(const t of samples){
   const file=path.join(output,'checks',`frame-${t.toFixed(2)}.png`);
   await renderStill({serveUrl,composition:comp,output:file,frame:Math.round(t*30),imageFormat:'png',puppeteerInstance:browser,logLevel:'warn'});
   console.log(`frame ${t.toFixed(2)} → ${path.relative(root,file)}`);
  }
 }else if(mode==='thumbnail'){
  await renderStill({serveUrl,composition:comp,output:path.join(output,'thumbnail.png'),frame:0,imageFormat:'png',puppeteerInstance:browser});
 }else{
  const file=path.join(output,mode==='short'?'digital-girl-short.mp4':'digital-girl-mv.mp4');
  let last=-1;
  await renderMedia({serveUrl,composition:comp,outputLocation:file,codec:'h264',crf:17,pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'320k',
   concurrency:3,puppeteerInstance:browser,logLevel:'warn',x264Preset:'fast',
   onProgress:({progress,renderedFrames,encodedFrames})=>{const percent=Math.floor(progress*100);if(percent>=last+5){last=percent;console.log(`${mode}: ${percent}% — rendered ${renderedFrames}/${comp.durationInFrames}, encoded ${encodedFrames}`);}}
  });
  if(mode==='short'){
   // Browser seeking in an MP3 can begin from a decoder reservoir boundary. Extract
   // the exact source interval with FFmpeg so the vertical deliverable carries the
   // same master-clock audio as the horizontal deliverable.
   const audioClip=path.join(output,'short-audio.m4a');
   const muxed=path.join(output,'digital-girl-short.muxed.mp4');
   const start=String(shortSelection.start), duration=String(comp.durationInFrames/comp.fps);
   const extract=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i','public/assets/song.mp3','-ss',start,'-t',duration,'-vn','-c:a','aac','-b:a','320k','-ar','48000','-ac','2',audioClip],{stdio:'inherit'});
   if(extract.status!==0) throw new Error('Could not extract the short audio interval');
   const mux=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',file,'-i',audioClip,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','copy','-t',duration,'-movflags','+faststart',muxed],{stdio:'inherit'});
   if(mux.status!==0) throw new Error('Could not mux the short audio interval');
   const normalized=path.join(output,'digital-girl-short.normalized.mp4');
   const normalize=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',muxed,'-map','0:v:0','-map','0:a:0','-vf','format=yuv420p','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-color_range','tv','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-c:a','copy','-t',duration,'-movflags','+faststart',normalized],{stdio:'inherit'});
   if(normalize.status!==0) throw new Error('Could not normalize the short video pixel format');
   spawnSync('mv',[normalized,file],{stdio:'inherit'});
  }
  console.log(`completed ${file}`);
 }
} finally {await browser.close({silent:true});}
