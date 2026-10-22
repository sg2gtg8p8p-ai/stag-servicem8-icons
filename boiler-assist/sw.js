'use strict';
const EXPECTED_BUILD_ID='12c85af3074b64b6';
const EXPECTED_MANIFEST_SHA256='84fab39fe9828beb61b13dbd6e1fcfc552ed7fb34316fa2677c3d80dc708538a';
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
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try{const response=await fetch(address,{cache:'no-store',credentials:'omit',redirect:'error',signal:controller.signal});if(!response.ok)throw Error('Resource download failed');return response;}
  finally{clearTimeout(timer);}
}
async function install(){
  const response=await network(url('./cache-manifest.json'));
  const raw=await response.clone().arrayBuffer(),m=await validManifest(new Response(raw));
  const name=await cacheName(),cache=await caches.open(name);
  try{
    for(const file of m.files){const r=await network(url(file.url));if(!await valid(r,file))throw Error('Resource integrity failed');await cache.put(url(file.url),r);}
    // Write the ready metadata only after the whole immutable pack is verified.
    await cache.put(url('./__verified_pack'),new Response(raw,{headers:{'Content-Type':'application/json'}}));
  }catch(e){await caches.delete(name);throw e;}
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
