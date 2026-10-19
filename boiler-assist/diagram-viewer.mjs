import {getDocument,GlobalWorkerOptions} from './vendor/pdf.min.mjs';
GlobalWorkerOptions.workerSrc=new URL('./vendor/pdf.worker.min.mjs',import.meta.url).href;
const documents=new Map();
const verifiedSources=new Map(Object.entries({"https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Heat-only-boilers/Baxi-400-Heat/Baxi_400_Heat_Installation_and_Service_Guide.pdf":{"sha256":"b3eaa7584bee2c85cdf71245655349b249fea3943383bd31b6b48a7de93c2410","pageCount":64,"pages":[55]},"https://www.worcester-bosch.co.uk/support/literature/download/release/6720802047/12638":{"sha256":"f9e5764764c92b81de8eeadd6dfe92daf97026c641446aea2b39a1d888a4f6aa","pageCount":64,"pages":[38,35,37,36,32]},"https://www.worcester-bosch.co.uk/support/literature/download/release/8716104436/12764":{"sha256":"202bac8297aac6f18b89396f5e12e355990242c95fbb1772b1178b5af1c3d9d3","pageCount":32,"pages":[23,25,28,27,29,22]},"https://www.worcester-bosch.co.uk/support/literature/download/release/PL47000/21961":{"sha256":"bd0e6908a4d3e22d22ceb752c26d74d86ca0da0b06c72fd391c4d05d0cfabde4","pageCount":67,"pages":[62,60,61,63,57,58,59]}}));
// Normalised source-page regions, visually checked against these exact PDF byte hashes.
const diagramRegions=new Map([
 ['https://www.worcester-bosch.co.uk/support/literature/download/release/6720802047/12638#38',[0.50,0.055,0.425,0.245]],
 ['https://www.worcester-bosch.co.uk/support/literature/download/release/8716104436/12764#23',[0.06,0.415,0.89,0.50]],
 ['https://www.worcester-bosch.co.uk/support/literature/download/release/8716104436/12764#25',[0.06,0.035,0.89,0.43]],
 ['https://www.worcester-bosch.co.uk/support/literature/download/release/PL47000/21961#62',[0.08,0.20,0.36,0.29]],
 ['https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Heat-only-boilers/Baxi-400-Heat/Baxi_400_Heat_Installation_and_Service_Guide.pdf#55',[0.045,0.06,0.41,0.82]]
]);
const digest=async b=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(v=>v.toString(16).padStart(2,'0')).join('');
const sourceFor=info=>{try{const u=new URL(info.url,location.href);u.hash='';const source=verifiedSources.get(u.href);return source&&!u.username&&!u.password&&!u.search&&Number.isInteger(info.page)&&source.pages.includes(info.page)&&source.pageCount===info.pageCount?source:null;}catch{return null;}};
const supports=info=>!!sourceFor(info);
const el=(name,text)=>{const e=document.createElement(name);if(text)e.textContent=text;return e;};
function create(info){
 const address=new URL(info.url,location.href);address.hash='';
 const figure=el('figure');figure.className='inline-manual';figure.dataset.record=info.recordId;
 const caption=el('figcaption',(info.reference||'Official manual')+' · PDF p. '+info.page+' · online');
 const original=el('a','Open original manual');original.href=address.href+'#page='+info.page;original.target='_blank';original.rel='noopener noreferrer';
 if(!supports(info)){figure.append(el('p','Inline preview is not available for this source.'),original);return figure;}
 const status=el('p','Loading official diagram…');status.setAttribute('role','status');figure.append(status,caption);
 const run=async()=>{
  try{
   if(!navigator.onLine)throw Error('offline');
   let load=documents.get(address.href);
   if(!load){
    load=getDocument({url:address.href,withCredentials:false,isEvalSupported:false,disableAutoFetch:true,disableStream:true}).promise.then(async pdf=>{if(await digest(await pdf.getData())!==sourceFor(info).sha256){await pdf.destroy();throw Error('Source revision has changed');}return pdf;});
    documents.set(address.href,load);load.catch(()=>documents.delete(address.href));
   }
   const pdf=await load;
   if(pdf.numPages!==info.pageCount)throw Error('Source page count has changed');
   const page=await pdf.getPage(info.page),natural=page.getViewport({scale:1}),region=diagramRegions.get(address.href+'#'+info.page);
   const viewport=page.getViewport({scale:region?Math.min(4,1600/(natural.width*region[2])):Math.min(2,1400/natural.width)});
   if(!figure.isConnected)return;
   const rendered=el('canvas');rendered.width=Math.ceil(viewport.width);rendered.height=Math.ceil(viewport.height);
   await page.render({canvasContext:rendered.getContext('2d'),viewport}).promise;
   const canvas=el('canvas');
   if(region){
    const[x,y,w,h]=region;canvas.width=Math.round(rendered.width*w);canvas.height=Math.round(rendered.height*h);
    canvas.getContext('2d').drawImage(rendered,Math.round(rendered.width*x),Math.round(rendered.height*y),canvas.width,canvas.height,0,0,canvas.width,canvas.height);
    figure.dataset.sourceRegion='verified-diagram';
   }else{canvas.width=rendered.width;canvas.height=rendered.height;canvas.getContext('2d').drawImage(rendered,0,0);}
   rendered.width=rendered.height=0;
   canvas.setAttribute('aria-label',(info.label||'Official manufacturer diagram')+'; '+info.reference+' page '+info.page);
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
function taskPage(document,refs,recordId){
 let u;try{u=new URL(document.url,location.href);u.hash='';}catch{return null;}
 const source=verifiedSources.get(u.href);if(!source||document.pageCount!==source.pageCount)return null;
 const page=source.pages.find(page=>refs.some(ref=>ref.documentId===document.id&&ref.page===page));
 return page?{url:u.href,page,pageCount:source.pageCount,reference:document.reference,recordId,label:'Official source page for this task'}:null;
}
window.StagInlineDiagram={create,supports,taskPage};
