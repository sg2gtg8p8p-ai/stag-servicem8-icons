import {ASSETS} from './engine-config.mjs';
import {prepareImage,dimensions,boundedSize,IMAGE_LIMITS} from './image.mjs';
const abortError=()=>new DOMException('Reading cancelled.','AbortError');
function boundedJob(promise,signal,onLate){
  return new Promise((resolve,reject)=>{
    let settled=false;
    const stop=error=>{if(settled)return;settled=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);reject(error);};
    const cancel=()=>stop(abortError());
    const timer=setTimeout(()=>stop(Error('Photo reading took too long. Crop the label or type its details instead.')),60000);
    signal?.addEventListener('abort',cancel,{once:true});
    if(signal?.aborted){cancel();}
    Promise.resolve(promise).then(value=>{
      if(settled){onLate?.(value);return;}
      settled=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);resolve(value);
    },stop);
  });
}
export function assetURL(path,base=import.meta.url){
  if(typeof path!=='string'||!/^([a-zA-Z0-9_-][a-zA-Z0-9_.-]*\/)*[a-zA-Z0-9_.-]*\/?$/.test(path)||!path||path.split('/').some(p=>p==='..'||p==='.'))throw Error('Photo reader assets are unavailable.');
  const root=new URL('../../photo-engine/tesseract-6.0.1/',base);
  const result=new URL(path,root),origin=new URL(base).origin;
  if(result.origin!==origin||!result.href.startsWith(root.href)||result.search||result.hash)throw Error('Photo reader must use this app’s own saved assets.');
  return result.href;
}
export function workerOptions(base=import.meta.url){
  return {workerPath:assetURL('worker.min.js',base),corePath:assetURL('core/',base),langPath:assetURL('lang/',base),
    workerBlobURL:false,cacheMethod:'none',gzip:true,legacyCore:false,legacyLang:false,logger:()=>{},errorHandler:()=>{}};
}
export function createReader({doc=globalThis.document,fetcher=globalThis.fetch,digest=globalThis.crypto?.subtle,prepare=prepareImage,base=import.meta.url,engine=()=>globalThis.Tesseract}={}){
  let worker=null,active=null,prepared=false,loading=null,script=null;
  async function verifyAssets(signal){
    if(prepared)return;
    if(!ASSETS.length||!digest)throw Error('Photo reading is not ready in this browser. Type the label details instead.');
    for(const asset of ASSETS.filter(asset=>asset.runtime)){
      if(signal?.aborted)throw abortError();
      const response=await fetcher(assetURL(asset.path,base),{credentials:'omit',redirect:'error',cache:'force-cache',signal});
      if(!response.ok)throw Error('Connect to download the on-device photo reader, or type the label details.');
      const bytes=await response.arrayBuffer();
      const hash=[...new Uint8Array(await digest.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
      if(bytes.byteLength!==asset.bytes||hash!==asset.sha256)throw Error('Photo reader verification failed. Type the label details instead.');
    }
    if(signal?.aborted)throw abortError();
    const entry=ASSETS.find(asset=>asset.path==='tesseract.min.js');
    if(!entry)throw Error('Photo reader is unavailable.');
    await new Promise((resolve,reject)=>{
      script=doc.createElement('script');script.src=assetURL(entry.path,base);
      const hex=entry.sha256.match(/../g).map(x=>String.fromCharCode(parseInt(x,16))).join('');
      script.integrity='sha256-'+btoa(hex);script.crossOrigin='anonymous';
      const cancel=()=>{script?.remove();reject(abortError());};
      signal?.addEventListener('abort',cancel,{once:true});
      const finish=(fn,value)=>{signal?.removeEventListener('abort',cancel);fn(value);};
      script.onload=()=>finish(resolve);script.onerror=()=>finish(reject,Error('Photo reading could not start. Type the label details instead.'));
      doc.head.append(script);
    });
    if(signal?.aborted)throw abortError();
    if(typeof engine()?.createWorker!=='function')throw Error('Photo reader is unavailable.');
    prepared=true;
  }
  async function cancel(){
    active?.abort();active=null;
    const current=worker;worker=null;
    if(current)try{await current.terminate();}catch{}
  }
  async function read(file,{onStatus=()=>{},quarterTurns=0}={}){
    if(loading)throw Error('Finish or cancel the current photo reading first.');
    const controller=new AbortController();active=controller;
    const job=(async()=>{
      let canvas;
      try{
        if(!file||!Number.isSafeInteger(file.size)||file.size<24||file.size>IMAGE_LIMITS.bytes)throw Error('Choose a JPEG or PNG up to 12 MB. Crop closely to the data plate first.');
        boundedSize(dimensions(await file.slice(0,IMAGE_LIMITS.headerBytes).arrayBuffer()));
        if(controller.signal.aborted)throw abortError();
        onStatus('Preparing the on-device reader. The first download needs a connection.');
        await verifyAssets(controller.signal);
        if(controller.signal.aborted)throw abortError();
        onStatus('Preparing the label photo on this device…');
        canvas=await prepare(file,{signal:controller.signal,doc,quarterTurns});
        if(controller.signal.aborted)throw abortError();
        onStatus('Reading label text on this device…');
        const created=await boundedJob(engine().createWorker('eng',1,workerOptions(base)),controller.signal,late=>{Promise.resolve(late?.terminate?.()).catch(()=>{});});
        if(controller.signal.aborted){try{await created.terminate();}catch{}throw abortError();}
        worker=created;
        const result=await boundedJob(created.recognize(canvas,{}, {text:true,blocks:false,hocr:false,tsv:false}),controller.signal);
        if(controller.signal.aborted)throw abortError();
        return typeof result?.data?.text==='string'?result.data.text.slice(0,12000):'';
      }finally{
        if(canvas){canvas.width=1;canvas.height=1;}
        const current=worker;worker=null;if(current)try{await current.terminate();}catch{}
        if(active===controller)active=null;
      }
    })();
    loading=job;
    try{return await job;}finally{if(loading===job)loading=null;}
  }
  return {read,cancel,busy:()=>!!loading};
}
