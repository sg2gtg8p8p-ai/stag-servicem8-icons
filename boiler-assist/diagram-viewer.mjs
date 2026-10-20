import {getDocument,GlobalWorkerOptions} from './vendor/pdf.min.mjs';
GlobalWorkerOptions.workerSrc=new URL('./vendor/pdf.worker.min.mjs',import.meta.url).href;
const documents=new Map();
const verifiedSources=new Map(Object.entries({"https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Heat-only-boilers/Baxi-400-Heat/Baxi_400_Heat_Installation_and_Service_Guide.pdf":{"sha256":"b3eaa7584bee2c85cdf71245655349b249fea3943383bd31b6b48a7de93c2410","pageCount":64,"pages":[55]},"https://www.worcester-bosch.co.uk/support/literature/download/release/6720802047/12638":{"sha256":"f9e5764764c92b81de8eeadd6dfe92daf97026c641446aea2b39a1d888a4f6aa","pageCount":64,"pages":[38,35,37,36,32]},"https://www.worcester-bosch.co.uk/support/literature/download/release/8716104436/12764":{"sha256":"202bac8297aac6f18b89396f5e12e355990242c95fbb1772b1178b5af1c3d9d3","pageCount":32,"pages":[23,25,28,27,29,22]},"https://www.worcester-bosch.co.uk/support/literature/download/release/PL47000/21961":{"sha256":"bd0e6908a4d3e22d22ceb752c26d74d86ca0da0b06c72fd391c4d05d0cfabde4","pageCount":67,"pages":[62,60,61,63,57,58,59]},"https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Combi-boilers/Baxi-Duotec-Compact-Combi/baxi-duotec-compact-combi-installation-manual.pdf":{"sha256":"6620e4658b815f6adbc6f37a81fe8458221380c09a4467ee3b0380c36d6bd5d0","pageCount":84,"pages":[64,59,51,52,53,56,57,62,63,12,13,19],"documentId":"baxi-duotec-compact-7844480-01"},"https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Heat-only-boilers/Potterton-Titanium-Heat/potterton-titanium-heat-installation-manual.pdf":{"sha256":"af21871c976a7f560be26cd63b095cc6f3fe99edc94d51616c4aef8b1b1d8287","pageCount":64,"pages":[49,55],"documentId":"potterton-titanium-heat-7717257-02-202002","recordIds":["potterton-potterton-titanium-12-heat-41-592-61","potterton-potterton-titanium-15-heat-41-592-62","potterton-potterton-titanium-18-heat-41-592-63","potterton-potterton-titanium-24-heat-41-592-64","potterton-potterton-titanium-30-heat-41-592-65"],"regionPages":{"fig61-complete-controls":55,"fig59-button":55,"fig60-sampling":55,"casing-access":49}},"https://idealheating.com/_gatsby/file/a8a01c4778b35976b86007a593b9b19f/Logic%20MAX%20Combi%20Installation%20&%20Servicing%20-%20November%202025%20UIN%20237660%20A05.pdf?u=https%3A%2F%2Fdownloads.ctfassets.net%2Fsj902orc9wh4%2F4hw7r7ut3zXch9PphO11t5%2F938123989fcc20e49b0604029c0f0661%2FLogic_MAX_Combi_Installation___Servicing_-_November_2025_UIN_237660_A05.pdf":{"sha256":"9209ceb71a30055734973e4cd6913607250b989ab9a0ce10c5d487c3b711d100","pageCount":72,"pages":[34,36,39,47,69,70],"documentId":"ideal-logic-max-combi2-237660-a05-202511","recordIds":["ideal-logic-max-combi-2-c24-47-387-03","ideal-logic-max-combi-2-c30-47-387-04","ideal-logic-max-combi-2-c35-47-387-05"],"regionPages":{"replacement-only":47,"own-menu-rates":36,"inlet-and-warning":34,"complete-assessment":70,"own-sampling":39},"allowQuery":true,"regionContexts":{"complete-assessment":{"page":69,"text":"Commissioning preliminaries (p.69): the air/gas ratio valve is factory-set and must not be adjusted DURING COMMISSIONING. Before this assessment, verify the gas type and required supply-pressure/gas-rate checks. Visually verify the complete flue is correctly assembled, fixed and supported, within the applicable maximum lengths and installation guidance, especially if others fitted it. Use a maintained and calibrated analyser of the specified BS EN 50379-3:2012 type, operated by a competent person; zero it in fresh air following its manufacturer instructions. Separate applicable conversion-kit instructions govern any other gas family; this guide applies only to the exact Natural Gas models. Follow the complete p70 flow including its investigation, recheck, stop and closure branches. This context accompanies the flow; it is not a gas-valve calibration instruction."},"replacement-only":{"page":47,"text":"Replacement-location reference (p.47, section3.17): this is the gas control valve replacement illustration, not calibration instructions. Label3 is the outlet pipe clip; label5 identifies the valve-to-chassis fixing screws. Neither label identifies an adjustment screw or its direction/effect. The source replacement method, correct isolation, seals, trap and soundness/recommissioning requirements remain separate; no valve replacement recipe or engineer calibration method is supplied by this guide."}}}}));
// Normalised source-page regions, visually checked against these exact PDF byte hashes.
const diagramRegions=new Map([
 ['https://www.worcester-bosch.co.uk/support/literature/download/release/6720802047/12638#38',[0.50,0.055,0.425,0.245]],
 ['https://www.worcester-bosch.co.uk/support/literature/download/release/8716104436/12764#23',[0.06,0.415,0.89,0.50]],
 ['https://www.worcester-bosch.co.uk/support/literature/download/release/8716104436/12764#25',[0.06,0.035,0.89,0.43]],
 ['https://www.worcester-bosch.co.uk/support/literature/download/release/PL47000/21961#62',[0.08,0.20,0.36,0.29]],
 ['https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Heat-only-boilers/Baxi-400-Heat/Baxi_400_Heat_Installation_and_Service_Guide.pdf#55',[0.045,0.06,0.41,0.82]],
 ["https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Combi-boilers/Baxi-Duotec-Compact-Combi/baxi-duotec-compact-combi-installation-manual.pdf#64",[0.07,0.42,0.3,0.13]],
 ["https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Combi-boilers/Baxi-Duotec-Compact-Combi/baxi-duotec-compact-combi-installation-manual.pdf#59",[0.065,0.09,0.34,0.28]],
 ["https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Combi-boilers/Baxi-Duotec-Compact-Combi/baxi-duotec-compact-combi-installation-manual.pdf#51",[0.065,0.315,0.34,0.18]],
 ["https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Combi-boilers/Baxi-Duotec-Compact-Combi/baxi-duotec-compact-combi-installation-manual.pdf#52",[0.065,0.09,0.34,0.66]],
 ["https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Heat-only-boilers/Potterton-Titanium-Heat/potterton-titanium-heat-installation-manual.pdf#55#fig61-complete-controls",[0.065,0.635,0.415,0.275]],
 ["https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Heat-only-boilers/Potterton-Titanium-Heat/potterton-titanium-heat-installation-manual.pdf#55#fig59-button",[0.105,0.27,0.36,0.135]],
 ["https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Heat-only-boilers/Potterton-Titanium-Heat/potterton-titanium-heat-installation-manual.pdf#55#fig60-sampling",[0.105,0.418,0.365,0.205]],
 ["https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Heat-only-boilers/Potterton-Titanium-Heat/potterton-titanium-heat-installation-manual.pdf#49#casing-access",[0,0,1,1]],
 ["https://idealheating.com/_gatsby/file/a8a01c4778b35976b86007a593b9b19f/Logic%20MAX%20Combi%20Installation%20&%20Servicing%20-%20November%202025%20UIN%20237660%20A05.pdf?u=https%3A%2F%2Fdownloads.ctfassets.net%2Fsj902orc9wh4%2F4hw7r7ut3zXch9PphO11t5%2F938123989fcc20e49b0604029c0f0661%2FLogic_MAX_Combi_Installation___Servicing_-_November_2025_UIN_237660_A05.pdf#47#replacement-only",[0.52,0.095,0.385,0.335]],
 ["https://idealheating.com/_gatsby/file/a8a01c4778b35976b86007a593b9b19f/Logic%20MAX%20Combi%20Installation%20&%20Servicing%20-%20November%202025%20UIN%20237660%20A05.pdf?u=https%3A%2F%2Fdownloads.ctfassets.net%2Fsj902orc9wh4%2F4hw7r7ut3zXch9PphO11t5%2F938123989fcc20e49b0604029c0f0661%2FLogic_MAX_Combi_Installation___Servicing_-_November_2025_UIN_237660_A05.pdf#36#own-menu-rates",[0,0,1,1]],
 ["https://idealheating.com/_gatsby/file/a8a01c4778b35976b86007a593b9b19f/Logic%20MAX%20Combi%20Installation%20&%20Servicing%20-%20November%202025%20UIN%20237660%20A05.pdf?u=https%3A%2F%2Fdownloads.ctfassets.net%2Fsj902orc9wh4%2F4hw7r7ut3zXch9PphO11t5%2F938123989fcc20e49b0604029c0f0661%2FLogic_MAX_Combi_Installation___Servicing_-_November_2025_UIN_237660_A05.pdf#34#inlet-and-warning",[0,0,1,1]],
 ["https://idealheating.com/_gatsby/file/a8a01c4778b35976b86007a593b9b19f/Logic%20MAX%20Combi%20Installation%20&%20Servicing%20-%20November%202025%20UIN%20237660%20A05.pdf?u=https%3A%2F%2Fdownloads.ctfassets.net%2Fsj902orc9wh4%2F4hw7r7ut3zXch9PphO11t5%2F938123989fcc20e49b0604029c0f0661%2FLogic_MAX_Combi_Installation___Servicing_-_November_2025_UIN_237660_A05.pdf#70#complete-assessment",[0,0,1,1]],
 ["https://idealheating.com/_gatsby/file/a8a01c4778b35976b86007a593b9b19f/Logic%20MAX%20Combi%20Installation%20&%20Servicing%20-%20November%202025%20UIN%20237660%20A05.pdf?u=https%3A%2F%2Fdownloads.ctfassets.net%2Fsj902orc9wh4%2F4hw7r7ut3zXch9PphO11t5%2F938123989fcc20e49b0604029c0f0661%2FLogic_MAX_Combi_Installation___Servicing_-_November_2025_UIN_237660_A05.pdf#39#own-sampling",[0.525,0.722,0.371,0.191]]
]);
const digest=async b=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(v=>v.toString(16).padStart(2,'0')).join('');
const sourceFor=info=>{try{const u=new URL(info.url,location.href);u.hash='';const source=verifiedSources.get(u.href);return source&&!u.username&&!u.password&&(!u.search||source.allowQuery===true)&&Number.isInteger(info.page)&&source.pages.includes(info.page)&&source.pageCount===info.pageCount&&(source.recordIds===undefined||(Array.isArray(source.recordIds)&&source.recordIds.includes(info.recordId)))&&(source.regionPages===undefined?info.regionId===undefined:typeof info.regionId==='string'&&source.regionPages[info.regionId]===info.page)?source:null;}catch{return null;}};
const supports=info=>!!sourceFor(info);
const el=(name,text)=>{const e=document.createElement(name);if(text)e.textContent=text;return e;};
function create(info){
 const address=new URL(info.url,location.href);address.hash='';
 const figure=el('figure');figure.className='inline-manual';figure.dataset.record=info.recordId;
 const caption=el('figcaption',(info.reference||'Official manual')+' · PDF p. '+info.page+' · online');
 const original=el('a','Open original manual');original.href=address.href+'#page='+info.page;original.target='_blank';original.rel='noopener noreferrer';
 const context=sourceFor(info)?.regionContexts?.[info.regionId];
 let contextBlock;
 if(context){
  contextBlock=el('div');contextBlock.className='inline-manual-context';contextBlock.append(el('p',context.text));
  const contextLink=el('a','Read source context · p. '+context.page);contextLink.href=address.href+'#page='+context.page;contextLink.target='_blank';contextLink.rel='noopener noreferrer';contextBlock.append(contextLink);
  figure.append(contextBlock);
 }
 if(!supports(info)){figure.append(el('p','Inline preview is not available for this source.'),original);return figure;}
 const status=el('p','Loading official diagram…');status.setAttribute('role','status');figure.append(status,original,caption);
 const run=async()=>{
  let progress,updateProgress;
  try{
   if(!navigator.onLine)throw Error('offline');
   let load=documents.get(address.href);
   if(!load){
    const state={stage:'loading',loaded:null,total:null,slow:false,listeners:new Set()};
    const announce=()=>{for(const listener of state.listeners)if(!listener())state.listeners.delete(listener);};
    const loadingTask=getDocument({url:address.href,withCredentials:false,isEvalSupported:false,disableAutoFetch:true,disableStream:true});
    loadingTask.onProgress=({loaded,total})=>{state.loaded=loaded;state.total=total;announce();};
    const slowTimer=setTimeout(()=>{state.slow=true;announce();},10000);
    load=loadingTask.promise.then(async pdf=>{
     const bytes=await pdf.getData();state.stage='checking';announce();
     if(await digest(bytes)!==sourceFor(info).sha256){await pdf.destroy();throw Error('Source revision has changed');}
     state.stage='ready';announce();return pdf;
    }).finally(()=>{clearTimeout(slowTimer);state.listeners.clear();});
    load.progress=state;
    documents.set(address.href,load);load.catch(()=>{if(documents.get(address.href)===load)documents.delete(address.href);});
   }
   progress=load.progress;
   updateProgress=()=>{
    if(!figure.isConnected)return false;
    if(progress.stage==='checking')status.textContent='Checking official diagram…'+(progress.slow?' You can keep browsing or open the original manual.':'');
    else if(progress.stage==='ready')status.textContent='Preparing official diagram…';
    else{
     const known=Number.isFinite(progress.total)&&progress.total>0&&Number.isFinite(progress.loaded)&&progress.loaded>=0;
     const percent=known?' · '+Math.min(100,Math.floor(100*progress.loaded/progress.total))+'%':'…';
     status.textContent=(progress.slow?'Still loading official diagram':'Loading official diagram')+percent+(progress.slow?'. Keep browsing, or open the original manual.':'');
    }
    return true;
   };
   progress.listeners.add(updateProgress);updateProgress();
   const pdf=await load;
   if(pdf.numPages!==info.pageCount)throw Error('Source page count has changed');
   const page=await pdf.getPage(info.page),natural=page.getViewport({scale:1}),region=diagramRegions.get(address.href+'#'+info.page+(info.regionId===undefined?'':'#'+info.regionId));
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
   status.remove();figure.prepend(canvas);if(contextBlock)figure.prepend(contextBlock);
   const enlarge=el('button','Enlarge diagram');enlarge.type='button';
   const zoom=()=>{
    const dialog=el('dialog');dialog.className='inline-manual-dialog';const close=el('button','Close diagram');close.type='button';
    const scroll=el('div');scroll.className='inline-manual-zoom';const copy=el('canvas');copy.width=canvas.width;copy.height=canvas.height;copy.getContext('2d').drawImage(canvas,0,0);scroll.append(copy);
    close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove());dialog.append(close);if(context)dialog.append(el('p',context.text));dialog.append(scroll,el('p',caption.textContent));document.body.append(dialog);dialog.showModal();close.focus();
   };
   enlarge.onclick=zoom;canvas.onclick=zoom;figure.append(enlarge,original);figure.dataset.loaded='true';
  }catch(error){
   if(!figure.isConnected)return;
   status.textContent=error.message==='offline'?'Connect to view the official diagram.':'The official diagram could not load. Use the original manual.';
   figure.append(original);figure.dataset.loaded='false';
  }finally{progress?.listeners.delete(updateProgress);}
 };
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();run();}},{rootMargin:'250px'});
 observer.observe(figure);return figure;
}
function taskPage(document,refs,recordId,diagramRef){
 let u;try{u=new URL(document.url,location.href);u.hash='';}catch{return null;}
 const source=verifiedSources.get(u.href);if(!source||document.pageCount!==source.pageCount)return null;
 // New record-bound sources require their exact document fingerprint and explicit named task region.
 if(source.recordIds&&(!Array.isArray(source.recordIds)||!source.recordIds.includes(recordId)||document.id!==source.documentId||document.sha256!==source.sha256||!diagramRef||typeof diagramRef.regionId!=='string'))return null;
 // Optional explicit task source: reject a wrong binding rather than choosing another page.
 if(diagramRef!==undefined){
  const boundSource=[...verifiedSources].find(([,entry])=>entry.documentId===document.id);
  if(boundSource&&boundSource[0]!==u.href)return null;
  if(!diagramRef||diagramRef.documentId!==document.id||(source.documentId&&source.documentId!==document.id)||
     !Array.isArray(document.applianceIds)||!document.applianceIds.includes(recordId)||!Array.isArray(refs)||
     !Number.isInteger(diagramRef.page)||!refs.some(ref=>ref.documentId===document.id&&ref.page===diagramRef.page))return null;
  const info={url:u.href,page:diagramRef.page,pageCount:source.pageCount,reference:document.reference,recordId,label:'Official source page for this task'};
  if(diagramRef.regionId!==undefined)info.regionId=diagramRef.regionId;
  return sourceFor(info)?info:null;
 }
 const page=source.pages.find(page=>refs.some(ref=>ref.documentId===document.id&&ref.page===page));
 return page?{url:u.href,page,pageCount:source.pageCount,reference:document.reference,recordId,label:'Official source page for this task'}:null;
}
window.StagInlineDiagram={create,supports,taskPage};
