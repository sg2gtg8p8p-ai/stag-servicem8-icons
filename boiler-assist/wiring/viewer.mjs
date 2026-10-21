import {DATA} from './source-data.mjs';
export class StaleSelectionError extends Error{constructor(){super('Reference selection changed.');this.name='StaleSelectionError';}}
export function makePageRequest(sourceId,page){const s=DATA.sources[sourceId];if(!Object.hasOwn(DATA.sources,sourceId)||!s)throw Error('Unknown original source.');const req={sourceId,url:s.url,sha256:s.sha256,bytes:s.bytes,pageCount:s.pageCount,page};validatePageRequest(req);return Object.freeze(req);}
export function validatePageRequest(req){
 const s=DATA.sources[req?.sourceId];if(!s||!Object.hasOwn(DATA.sources,req?.sourceId)||req.url!==s.url||req.sha256!==s.sha256||req.bytes!==s.bytes||req.pageCount!==s.pageCount)throw Error('Original source identity does not match.');
 if(!Number.isSafeInteger(req.page)||!Object.hasOwn(s.pages,String(req.page)))throw Error('This page is not an accepted original figure context.');return s;
}
export function originalManualURL(reference){
 const s=DATA.sources[reference?.source];if(!s||!Object.hasOwn(DATA.sources,reference?.source)||!['index','figure'].includes(reference.kind))throw Error('Unknown manual.');const allowed=reference.kind==='index'?s.manualIndexPages.includes(reference.page):Object.hasOwn(s.pages,String(reference.page));if(!allowed||!Number.isSafeInteger(reference.page))throw Error('Manual page is outside its source index.');return s.url+'#page='+reference.page;
}
const hex=bytes=>[...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('');
export async function verifyPDFBytes(raw,expected,subtle=globalThis.crypto?.subtle){
 if(!subtle?.digest)throw Error('Secure source verification is unavailable. Open the original manual.');
 if(!(raw instanceof ArrayBuffer)||raw.byteLength!==expected.bytes)throw Error('Original manual byte count does not match.');
 const head=new Uint8Array(raw,0,Math.min(5,raw.byteLength));if(String.fromCharCode(...head)!=='%PDF-')throw Error('The source response is not the expected PDF.');
 if(hex(await subtle.digest('SHA-256',raw))!==expected.sha256)throw Error('Original manual integrity does not match.');return raw;
}
export function verifyDocumentCount(pdf,expected){if(!pdf||pdf.numPages!==expected.pageCount)throw Error('Original manual page count does not match.');return pdf;}
let libraryPromise;
async function defaultLibrary(){
 if(!libraryPromise)libraryPromise=import(new URL('../vendor/pdf.min.mjs',import.meta.url).href).then(lib=>{lib.GlobalWorkerOptions.workerSrc=new URL('../vendor/pdf.worker.min.mjs',import.meta.url).href;return lib;});return libraryPromise;
}
export function createDocumentLoader({fetchImpl=globalThis.fetch?.bind(globalThis),subtle=globalThis.crypto?.subtle,loadLibrary=defaultLibrary}={}){
 const pending=new Map();let disposed=false;
 return{get(req){
  const source=validatePageRequest(req);if(disposed)return Promise.reject(Error('Source viewer is closed.'));if(!source.inline)return Promise.reject(Error('This source uses the original-manual link only.'));
  const key=req.url+'|'+req.sha256;
  if(!pending.has(key))pending.set(key,(async()=>{
   if(typeof fetchImpl!=='function')throw Error('Source loading is unavailable.');
   const response=await fetchImpl(source.url,{mode:'cors',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer'});
   if(!response?.ok)throw Error('The original manual could not be loaded.');if(response.url&&response.url!==source.url)throw Error('The original source address changed.');
   if(!String(response.headers?.get('content-type')??'').toLowerCase().includes('application/pdf'))throw Error('The original source did not return a PDF.');
   const bytes=await verifyPDFBytes(await response.arrayBuffer(),source,subtle);
   if(disposed)throw Error('Source viewer is closed.');const lib=await loadLibrary();
   const task=lib.getDocument({data:new Uint8Array(bytes),isEvalSupported:false,useSystemFonts:true,disableAutoFetch:true,disableStream:true,disableRange:true,stopAtErrors:true});
   let pdf;try{pdf=await task.promise;verifyDocumentCount(pdf,source);if(disposed)throw Error('Source viewer is closed.');}catch(e){if(pdf)await pdf.destroy?.();else await task.destroy?.();throw e;}return pdf;
  })());
  return pending.get(key);
 },dispose(){disposed=true;for(const promise of pending.values())promise.then(pdf=>pdf.destroy?.()).catch(()=>{});pending.clear();},get sharedSourcePromises(){return pending.size;}};
}
export function createRenderGate(){let revision=0;return{invalidate(){return++revision;},current(token){return token===revision;},get revision(){return revision;}};}
export function commitIfCurrent(isCurrent,commit){if(!isCurrent())throw new StaleSelectionError();return commit();}
export async function prepareVerifiedPage(loader,req,isCurrent){
 validatePageRequest(req);const pdf=await loader.get(req);if(!isCurrent())throw new StaleSelectionError();verifyDocumentCount(pdf,DATA.sources[req.sourceId]);
 const page=await pdf.getPage(req.page);if(!isCurrent())throw new StaleSelectionError();return page;
}
export function mountPageViewer({root,scopeRoot=root,dialog,isSelectionCurrent,loader=createDocumentLoader()}){
 const doc=root.ownerDocument,get=id=>scopeRoot.querySelector('#swr-'+id),status=get('viewerStatus'),host=get('pageCanvas'),fallback=get('viewerManual'),caption=get('viewerCaption'),enlarge=get('enlargePage'),modalHost=get('largeCanvas'),modalTitle=get('largeTitle');
 const gate=createRenderGate(),tasks=new Set();let selected=null,selectionRevision=null,modalRevision=0;
 const current=token=>gate.current(token)&&isSelectionCurrent(selectionRevision);
 function cancelTasks(){for(const task of tasks){try{task.cancel();}catch{}}tasks.clear();}
 function closeLarge(){modalRevision++;if(dialog.open)dialog.close();modalHost.replaceChildren();}
 function clear(){gate.invalidate();cancelTasks();closeLarge();selected=null;selectionRevision=null;host.replaceChildren();status.textContent='';caption.textContent='';enlarge.hidden=true;root.hidden=true;}
 async function render(req,target,token,large=false,largeToken=0){
  const isCurrent=()=>current(token)&&(!large||largeToken===modalRevision&&dialog.open);
  const page=await prepareVerifiedPage(loader,req,isCurrent);if(!isCurrent())throw new StaleSelectionError();
  // PDF.js full-page viewport handles the current guide's nonzero page-box origin.
  const unit=page.getViewport({scale:1}),cssWidth=large?Math.max(760,Math.min(1100,(doc.defaultView?.innerWidth??390)*1.8)):Math.max(280,Math.min(900,host.clientWidth||340));
  const ratio=Math.min(2,doc.defaultView?.devicePixelRatio||1),viewport=page.getViewport({scale:cssWidth*ratio/unit.width});
  const canvas=doc.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);canvas.style.width=large?cssWidth+'px':'100%';canvas.style.height='auto';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',DATA.sources[req.sourceId].title+', original full PDF page '+req.page);
  const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw Error('Page drawing is unavailable. Open the original manual.');
  const task=page.render({canvasContext:ctx,viewport,background:'#ffffff'});tasks.add(task);try{await task.promise;}finally{tasks.delete(task);}
  commitIfCurrent(isCurrent,()=>target.replaceChildren(canvas));return canvas;
 }
 async function show(reference,revision){
  clear();selectionRevision=revision;const token=gate.revision;root.hidden=false;
  // Working official link exists before any loading/verification promise begins.
  fallback.href=originalManualURL(reference);fallback.textContent='Open original manual · PDF page '+reference.page;fallback.hidden=false;
  const source=DATA.sources[reference.source],info=source.pages[String(reference.page)];caption.textContent=source.title+' · '+source.edition+' · PDF '+reference.page+' / printed '+(info?.printed??reference.page)+'. '+(info?.caption??reference.purpose);
  if(reference.kind==='index'||!source.inline){status.textContent=reference.kind==='index'?'Source index link only. No test table is adapted into a procedure.':source.accessNote;return;}
  const req=makePageRequest(reference.source,reference.page);selected=req;status.textContent='Loading original full page…';
  try{await render(req,host,token);if(!current(token))return;status.textContent='Verified original full page. Other variants on the page are context, not proof of a match.';enlarge.hidden=false;}
  catch(e){if(!current(token)||e instanceof StaleSelectionError)return;host.replaceChildren();enlarge.hidden=true;status.textContent=(e?.message||'The original page could not be displayed.')+' Use the original-manual link.';}
 }
 enlarge.addEventListener('click',async()=>{
  if(!selected||!current(gate.revision))return;const token=gate.revision,req=selected,largeToken=++modalRevision;modalHost.replaceChildren();modalTitle.textContent='Original full page · PDF '+req.page;dialog.showModal();const loading=doc.createElement('p');loading.textContent='Loading full page…';modalHost.append(loading);
  try{await render(req,modalHost,token,true,largeToken);}catch(e){if(!current(token)||largeToken!==modalRevision||e instanceof StaleSelectionError)return;const p=doc.createElement('p');p.textContent=(e?.message||'The page could not be enlarged.')+' The original-manual link remains available.';modalHost.replaceChildren(p);}
 });
 get('closeLarge').addEventListener('click',closeLarge);dialog.addEventListener('cancel',()=>{modalRevision++;modalHost.replaceChildren();});dialog.addEventListener('close',()=>{if(!dialog.open){modalRevision++;modalHost.replaceChildren();}});
 return{show,clear,dispose(){clear();loader.dispose();}};
}
