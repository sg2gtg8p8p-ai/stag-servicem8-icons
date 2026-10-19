import {getDocument,GlobalWorkerOptions} from './vendor/pdf.min.mjs';
GlobalWorkerOptions.workerSrc=new URL('./vendor/pdf.worker.min.mjs',import.meta.url).href;
const documents=new Map();
const verifiedBaxiSHA256='b3eaa7584bee2c85cdf71245655349b249fea3943383bd31b6b48a7de93c2410';
const digest=async b=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(v=>v.toString(16).padStart(2,'0')).join('');
const allowed=url=>url.protocol==='https:'&&url.origin==='https://edge.sitecorecloud.io'&&url.pathname.startsWith('/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/')&&url.pathname.toLowerCase().endsWith('.pdf')&&!url.search&&!url.username&&!url.password;
const el=(name,text)=>{const e=document.createElement(name);if(text)e.textContent=text;return e;};
function create(info){
 const address=new URL(info.url,location.href);address.hash='';
 const figure=el('figure');figure.className='inline-manual';figure.dataset.record=info.recordId;
 const caption=el('figcaption',(info.reference||'Official manual')+' · PDF p. '+info.page+' · online');
 const original=el('a','Open original manual');original.href=address.href+'#page='+info.page;original.target='_blank';original.rel='noopener noreferrer';
 if(!allowed(address)||!Number.isInteger(info.page)||info.page<1||!Number.isInteger(info.pageCount)||info.page>info.pageCount){figure.append(el('p','Inline preview is not available for this source.'),original);return figure;}
 const status=el('p','Loading official diagram…');status.setAttribute('role','status');figure.append(status,caption);
 const run=async()=>{
  try{
   if(!navigator.onLine)throw Error('offline');
   let load=documents.get(address.href);
   if(!load){
    load=getDocument({url:address.href,withCredentials:false,isEvalSupported:false,disableAutoFetch:true,disableStream:true}).promise.then(async pdf=>{if(address.href!=='https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Heat-only-boilers/Baxi-400-Heat/Baxi_400_Heat_Installation_and_Service_Guide.pdf'||await digest(await pdf.getData())!==verifiedBaxiSHA256){await pdf.destroy();throw Error('Source revision has changed');}return pdf;});
    documents.set(address.href,load);load.catch(()=>documents.delete(address.href));
   }
   const pdf=await load;
   if(pdf.numPages!==info.pageCount)throw Error('Source page count has changed');
   const page=await pdf.getPage(info.page),natural=page.getViewport({scale:1}),viewport=page.getViewport({scale:Math.min(2,1400/natural.width)});
   if(!figure.isConnected)return;
   const canvas=el('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);canvas.setAttribute('aria-label',(info.label||'Official manufacturer diagram')+'; '+info.reference+' page '+info.page);
   await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
   if(!figure.isConnected)return;
   status.remove();figure.prepend(canvas);
   const enlarge=el('button','Enlarge diagram');enlarge.type='button';
   const zoom=()=>{
    const dialog=el('dialog');dialog.className='inline-manual-dialog';const close=el('button','Close diagram');close.type='button';
    const scroll=el('div');scroll.className='inline-manual-zoom';const copy=el('canvas');copy.width=canvas.width;copy.height=canvas.height;copy.getContext('2d').drawImage(canvas,0,0);scroll.append(copy);
    close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove());dialog.append(close,scroll,el('p',caption.textContent));document.body.append(dialog);dialog.showModal();close.focus();
   };
   enlarge.onclick=zoom;canvas.onclick=zoom;figure.append(enlarge,original);figure.dataset.loaded='true';
  }catch(error){
   if(!figure.isConnected)return;
   status.textContent=error.message==='offline'?'Connect to view the official diagram.':'The official diagram could not load. Use the original manual.';
   figure.append(original);figure.dataset.loaded='false';
  }
 };
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();run();}},{rootMargin:'250px'});
 observer.observe(figure);return figure;
}
window.StagInlineDiagram={create};
