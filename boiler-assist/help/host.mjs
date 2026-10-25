import {dataset,detail} from '../decoder.js';
import {mountHelp,pilotUsageText} from './ui.mjs';
import {createAIClient} from './ai-client.mjs';
import {createReader} from './ocr.mjs';
const mounts=new WeakMap();
export function mountHelpHost(doc,{mountUI=mountHelp,readerFactory=createReader,loadCatalogue=()=>dataset('search-index'),loadDetail=detail,observe=globalThis.ResizeObserver,aiClient=createAIClient()}={}){
  const root=doc.getElementById('help-root'),entry=doc.getElementById('help-open'),status=doc.getElementById('help-host-status');
  const library=doc.getElementById('baf-library'),bar=doc.getElementById('offlineBar'),exit=doc.getElementById('help-exit'),body=doc.getElementById('help-body');
  if(!root||!entry||!library||!bar||!exit||!body){if(status){status.hidden=false;status.textContent='Photo & boiler help is unavailable. Continue using the library.';}return null;}
  if(mounts.has(root))return mounts.get(root);
  let selectedLibraryRecord=null;let active=false,saved=null,spacer=null,ui=null,returnRecordId=null,openingGuide=false;
  const faultEntry=doc.createElement('button');faultEntry.type='button';faultEntry.id='help-selected-fault';faultEntry.textContent='Ask about a fault';faultEntry.className='manual-button';faultEntry.hidden=true;doc.getElementById('detailTitle')?.after(faultEntry);
  const detailView=doc.getElementById('detailView');
  const updateFaultEntry=()=>{selectedLibraryRecord=doc.documentElement.dataset.stagQuestionBoiler||selectedLibraryRecord;faultEntry.hidden=!selectedLibraryRecord||detailView?.hidden!==false;};
  if(doc.defaultView?.MutationObserver)new doc.defaultView.MutationObserver(updateFaultEntry).observe(doc.documentElement,{attributes:true,attributeFilter:['data-stag-question-boiler']});
  if(detailView&&doc.defaultView?.MutationObserver)new doc.defaultView.MutationObserver(updateFaultEntry).observe(detailView,{attributes:true,attributeFilter:['hidden']});
  faultEntry.addEventListener('click',async()=>{const id=selectedLibraryRecord;if(!id)return;clearReturn();open();const records=await loadCatalogue();const record=records.find(r=>r.id===id);if(record&&active&&selectedLibraryRecord===id)await ui?.useSelectedRecord(record,'fault');});

  const guideBack=doc.getElementById('back'),guideBackLabel=guideBack?.textContent;
  function clearReturn(){returnRecordId=null;if(guideBack)guideBack.textContent=guideBackLabel;const inner=doc.querySelector('#tabs .simple-menu-back');if(inner)inner.textContent='← Boiler menu';}
  const usage=doc.getElementById('aiPilotUsage'),refresh=doc.getElementById('refreshAIUsage');let refreshing=null;
  const displayUsage=value=>{if(usage)usage.textContent=pilotUsageText(value);};
  const sharedAI={...aiClient,async status(){const next=await aiClient.status();displayUsage(next);return next;}};
  async function refreshUsage(){
    if(refreshing)return refreshing;
    if(refresh)refresh.disabled=true;if(usage)usage.textContent='Checking AI pilot allowance…';
    refreshing=sharedAI.status().catch(()=>{if(usage)usage.textContent='AI usage could not be checked. Last balance is not assumed. Try again when connected.';}).finally(()=>{refreshing=null;if(refresh)refresh.disabled=false;});
    return refreshing;
  }
  refresh?.addEventListener('click',refreshUsage);
  doc.getElementById('installHelp')?.addEventListener('click',refreshUsage);

  const properties=['position','top','left','right','z-index'];
  function geometry(){root.style.setProperty('--help-top',Math.max(0,bar.getBoundingClientRect().bottom)+'px');if(spacer)spacer.style.height=bar.getBoundingClientRect().height+'px';}
  function close(preserveQuestion=false){
    if(preserveQuestion!==true){clearReturn();ui?.reset();}
    if(!active)return;
    if(preserveQuestion===true)ui?.suspendForGuide();root.hidden=true;
    if(saved.visibility)library.style.setProperty('visibility',saved.visibility,saved.visibilityPriority);else library.style.removeProperty('visibility');
    library.inert=saved.inert;if(saved.aria===null)library.removeAttribute('aria-hidden');else library.setAttribute('aria-hidden',saved.aria);
    for(const [name,value,priority]of saved.headerStyle){if(value)bar.style.setProperty(name,value,priority);else bar.style.removeProperty(name);}
    spacer?.remove();spacer=null;active=false;saved.focus?.focus?.({preventScroll:true});
  }
  function open(){
    if(active)return;
    if(!ui)try{ui=mountUI(body,{doc,loadCatalogue,loadDetail,reader:readerFactory({doc}),aiClient:sharedAI,onSection:(recordId,section)=>{
      returnRecordId=recordId;close(true);if(guideBack)guideBack.textContent='← Back to AI questions';openingGuide=true;
      try{doc.defaultView.dispatchEvent(new CustomEvent('stag-open-standalone-record',{detail:{recordId,section}}));}finally{openingGuide=false;}
    }});}catch{if(status){status.hidden=false;status.textContent='Photo & boiler help is unavailable. Continue using the library.';}return;}
    saved={visibility:library.style.visibility,visibilityPriority:library.style.getPropertyPriority('visibility'),inert:library.inert,aria:library.getAttribute('aria-hidden'),focus:doc.activeElement,headerStyle:properties.map(name=>[name,bar.style.getPropertyValue(name),bar.style.getPropertyPriority(name)])};
    spacer=doc.createElement('div');spacer.setAttribute('aria-hidden','true');spacer.style.height=bar.getBoundingClientRect().height+'px';bar.before(spacer);
    for(const [name,value]of [['position','fixed'],['top','0'],['left','0'],['right','0'],['z-index','20']])bar.style.setProperty(name,value,'important');
    geometry();library.style.setProperty('visibility','hidden','important');library.inert=true;library.setAttribute('aria-hidden','true');root.hidden=false;active=true;exit.focus({preventScroll:true});
  }
  entry.addEventListener('click',async()=>{if(returnRecordId){clearReturn();ui?.reset();}open();if(selectedLibraryRecord&&doc.getElementById('detailView')?.hidden===false){const records=await loadCatalogue();const record=records.find(r=>r.id===selectedLibraryRecord);if(record&&active)await ui?.useSelectedRecord(record);}});exit.addEventListener('click',()=>{close();if(doc.getElementById('detailView')?.hidden===false)guideBack?.click();});
  doc.defaultView?.addEventListener('resize',()=>{if(active)geometry();});
  doc.defaultView?.addEventListener('stag-open-standalone-record',()=>{if(!openingGuide)close();});
  doc.defaultView?.addEventListener('stag-standalone-selection',event=>{
    selectedLibraryRecord=event.detail?.recordId||null;updateFaultEntry();
    if(!returnRecordId)return;
    if(event.detail?.recordId!==returnRecordId){clearReturn();ui?.reset();return;}
    if(guideBack)guideBack.textContent='← Back to AI questions';
    const inner=doc.querySelector('#tabs .simple-menu-back');if(inner)inner.textContent='← Back to AI questions';
  });
  doc.addEventListener('click',event=>{
    if(!returnRecordId||active||!event.target.closest?.('#back, #tabs .simple-menu-back'))return;
    event.preventDefault();event.stopImmediatePropagation();clearReturn();open();
    if(!ui?.returnToQuestions()){close();guideBack?.click();}
  },true);
  doc.defaultView?.addEventListener('pagehide',()=>{clearReturn();ui?.reset();});
  for(const name of ['baf-open','swr-open'])doc.getElementById(name)?.addEventListener('click',()=>close(),true);
  if(observe){const observer=new observe(()=>{if(active)geometry();});observer.observe(bar);}
  const controller={open,close,isOpen:()=>active,getUI:()=>ui};mounts.set(root,controller);entry.disabled=false;if(status)status.hidden=true;return controller;
}
if(typeof document!=='undefined')mountHelpHost(document);
