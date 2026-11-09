'use strict';
const EXPECTED_BUILD_ID='8ae91005d3161386';
const EXPECTED_MANIFEST_SHA256='a017b5cf007f57c57a36e227189f106af9d41f5d2f99ca39603c795b91185588';
const OWNER='stag-boiler-assist-offline-v1:';
const digest=async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');
const base=new URL(self.registration.scope),url=name=>new URL(name,base).href;
async function prefix(){return OWNER+(await digest(new TextEncoder().encode(base.href))).slice(0,12)+':';}
async function cacheName(){return await prefix()+EXPECTED_BUILD_ID;}
async function validManifest(response){
  if(!response?.ok)throw Error('Verified pack metadata is unavailable');
  const raw=await response.arrayBuffer();
  if(await digest(raw)!==EXPECTED_MANIFEST_SHA256)throw Error('Pack metadata integrity failed');
  const m=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));
  if(m.schemaVersion!==1||m.buildId!==EXPECTED_BUILD_ID||!Array.isArray(m.files)||!m.files.length)throw Error('Pack revision is unavailable');
  const names=new Set();
  for(const f of m.files){
    const u=new URL(f.url,base);
    if(typeof f.url!=='string'||!f.url.startsWith('./')||f.url.includes('..')||u.origin!==base.origin||!u.pathname.startsWith(base.pathname)||u.search||u.hash||names.has(u.href)||!/^[a-f0-9]{64}$/.test(f.sha256)||!Number.isSafeInteger(f.bytes)||f.bytes<0)throw Error('Pack resource is outside its allowed scope');
    names.add(u.href);
  }
  if(!names.has(url('./index.html')))throw Error('Pack launch page is missing');
  return m;
}
async function manifest(){
  const c=await caches.open(await cacheName());return validManifest(await c.match(url('./__verified_pack')));
}
async function valid(response,file){if(!response?.ok)return false;const raw=await response.clone().arrayBuffer();return raw.byteLength===file.bytes&&await digest(raw)===file.sha256;}
async function network(address){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),120000);
  try{
    const response=await fetch(address,{cache:'no-store',credentials:'omit',redirect:'error',signal:controller.signal});
    if(!response.ok)throw Error('Resource download failed');
    // Keep the timeout active until the BODY has arrived, not just its headers.
    // Buffer one resource at a time and do not retain transfer encodings for an
    // already decoded body when storing the verified bytes in CacheStorage.
    const raw=await response.arrayBuffer();
    return new Response(raw,{headers:{'Content-Type':response.headers.get('Content-Type')||'application/octet-stream'}});
  }
  finally{clearTimeout(timer);}
}
async function updateNotice(message){
  try{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of windows){const address=new URL(client.url);if(address.origin===base.origin&&address.pathname.startsWith(base.pathname))client.postMessage(message);}
  }catch{} // Progress delivery must not interrupt an otherwise valid download.
}
async function reusable(file,cache,names){
  const own=await cache.match(url(file.url));if(await valid(own,file))return {response:own,current:true};
  for(const name of names){const previous=await caches.open(name),response=await previous.match(url(file.url));if(await valid(response,file))return {response,current:false};}
  return null;
}
async function download(file){
  let failure;
  for(let attempt=0;attempt<3;attempt++){
    try{const response=await network(url(file.url));if(!await valid(response,file))throw Error('Resource integrity failed');return response;}
    catch(error){failure=error;}
  }
  throw failure;
}
async function install(){
  let raw,m,metadataFailure;
  for(let attempt=0;attempt<3;attempt++){
    try{const response=await network(url('./cache-manifest.json'));raw=await response.arrayBuffer();m=await validManifest(new Response(raw));break;}
    catch(error){metadataFailure=error;}
  }
  if(!m){await updateNotice({type:'PACK_DOWNLOAD_FAILED',reason:'download',completed:0,total:0});throw metadataFailure;}
  const name=await cacheName(),cache=await caches.open(name),owned=await prefix();
  const previous=(await caches.keys()).filter(key=>key!==name&&key.startsWith(owned));
  // A failed candidate can resume, but cannot announce readiness or activate.
  // Never delete the active version, another app's cache, or user selections.
  await cache.delete(url('./__verified_pack'));
  let completed=0,reused=0;
  try{
    for(const file of m.files){
      const saved=await reusable(file,cache,previous),response=saved?.response||await download(file);
      // Reuse requires the NEW manifest's exact byte length and SHA-256,
      // including when the resource came from a partially saved candidate.
      // Both reusable() and download() return only after that exact check.
      if(!saved?.current)await cache.put(url(file.url),response);
      completed++;if(saved)reused++;
      if(completed===1||completed%20===0||completed===m.files.length)await updateNotice({type:'PACK_DOWNLOAD_PROGRESS',completed,total:m.files.length,reused});
    }
    // Write the ready metadata only after the whole immutable pack is verified.
    await cache.put(url('./__verified_pack'),new Response(raw,{headers:{'Content-Type':'application/json'}}));
  }catch(e){
    await cache.delete(url('./__verified_pack'));
    const reason=e?.name==='QuotaExceededError'?'storage-full':e?.message==='Resource integrity failed'?'verification':'download';
    await updateNotice({type:'PACK_DOWNLOAD_FAILED',reason,completed,total:m.files.length});
    // Retain individually verified files for the next ordinary update attempt.
    // The current verified library remains separate and usable.
    throw e;
  }
}
async function health(){
  const m=await manifest(),cache=await caches.open(await cacheName()),keys=await cache.keys();
  if(keys.length!==m.files.length+1)throw Error('Saved pack is incomplete');
  for(const file of m.files)if(!await valid(await cache.match(url(file.url)),file))throw Error('Saved resource integrity failed');
  return m;
}
async function notify(){for(const client of await self.clients.matchAll({includeUncontrolled:true}))client.postMessage({type:'PACK_ERROR'});}
self.addEventListener('install',event=>event.waitUntil(install()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await health();await self.clients.claim();})()));
// No automatic activation or reload. Explicit Apply requires one app window;
// successfully activated versions never read a different revision's cache.
self.addEventListener('message',event=>{
  if(event.data?.type==='APPLY_UPDATE'){
    event.waitUntil((async()=>{
      try{
        const windows=(await self.clients.matchAll({type:'window',includeUncontrolled:true})).filter(client=>{const address=new URL(client.url);return address.origin===base.origin&&address.pathname.startsWith(base.pathname);});
        if(windows.length!==1||windows[0].id!==event.source?.id){event.ports[0]?.postMessage({ok:false,reason:'other-windows-open'});return;}
        // Recheck the complete installed revision before an explicitly requested switch.
        await health();event.ports[0]?.postMessage({ok:true,buildId:EXPECTED_BUILD_ID});await self.skipWaiting();
      }catch{event.ports[0]?.postMessage({ok:false,reason:'verification-failed'});}
    })());return;
  }
  if(event.data?.type!=='STATUS')return;
  event.waitUntil((async()=>{try{const m=await health();event.ports[0]?.postMessage({ready:true,buildId:m.buildId,preparedOn:m.preparedOn,totalBytes:m.totalBytes,files:m.files.length});}catch(e){event.ports[0]?.postMessage({ready:false,reason:e.message});}})());
});
const safePage='<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Boiler Assist offline copy unavailable</title><body style="background:#101719;color:#f4f8f8;font:18px system-ui;padding:24px"><h1>Saved Boiler Assist library unavailable</h1><p>The downloaded files are missing or failed verification. Do not rely on this copy.</p><p>Reconnect, close all Boiler Assist windows and reopen to complete a verified download or update.</p><a style="color:#56ddd0" href="./">Retry when connected</a></body></html>';
self.addEventListener('fetch',event=>{
  const request=event.request,u=new URL(request.url);
  if(request.method!=='GET'||u.origin!==base.origin||!u.pathname.startsWith(base.pathname))return;
  event.respondWith((async()=>{
    try{
      const m=await manifest();
      const wanted=u.pathname===base.pathname&&!u.search?url('./index.html'):u.href;
      const file=!u.search&&m.files.find(f=>url(f.url)===wanted);
      if(!file)return new Response('Not part of this offline reference pack',{status:404,headers:{'Content-Type':'text/plain'}});
      const cache=await caches.open(await cacheName());
      if(file.url==='./index.html'){
        try{await health();}catch{await install();await health();}
      }
      let response=await cache.match(wanted);
      if(await valid(response,file))return response;
      // Repair only exact bytes from this revision. Never mix a newer response
      // into an older active pack or fall back to another application's cache.
      response=await network(wanted);
      if(!await valid(response,file))throw Error('Resource revision differs');
      await cache.put(wanted,response.clone());return response;
    }catch{
      await notify();
      return new Response(request.mode==='navigate'?safePage:'Saved library unavailable; reconnect and verify the pack',{status:503,headers:{'Content-Type':request.mode==='navigate'?'text/html; charset=utf-8':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
    }
  })());
});
