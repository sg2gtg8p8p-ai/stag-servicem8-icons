import {dataset,detail} from '../decoder.js';
import {mountHelp} from './ui.mjs';
import {createReader} from './ocr.mjs';
const mounts=new WeakMap();
export function mountHelpHost(doc,{mountUI=mountHelp,readerFactory=createReader,loadCatalogue=()=>dataset('search-index'),loadDetail=detail,observe=globalThis.ResizeObserver}={}){
  const root=doc.getElementById('help-root'),entry=doc.getElementById('help-open'),status=doc.getElementById('help-host-status');
  const library=doc.getElementById('baf-library'),bar=doc.getElementById('offlineBar'),exit=doc.getElementById('help-exit'),body=doc.getElementById('help-body');
  if(!root||!entry||!library||!bar||!exit||!body){if(status){status.hidden=false;status.textContent='Photo & boiler help is unavailable. Continue using the library.';}return null;}
  if(mounts.has(root))return mounts.get(root);
  let active=false,saved=null,spacer=null,ui=null;
  const properties=['position','top','left','right','z-index'];
  function geometry(){root.style.setProperty('--help-top',Math.max(0,bar.getBoundingClientRect().bottom)+'px');if(spacer)spacer.style.height=bar.getBoundingClientRect().height+'px';}
  function close(){
    if(!active)return;
    ui?.reset();root.hidden=true;
    if(saved.visibility)library.style.setProperty('visibility',saved.visibility,saved.visibilityPriority);else library.style.removeProperty('visibility');
    library.inert=saved.inert;if(saved.aria===null)library.removeAttribute('aria-hidden');else library.setAttribute('aria-hidden',saved.aria);
    for(const [name,value,priority]of saved.headerStyle){if(value)bar.style.setProperty(name,value,priority);else bar.style.removeProperty(name);}
    spacer?.remove();spacer=null;active=false;saved.focus?.focus?.({preventScroll:true});
  }
  function open(){
    if(active)return;
    if(!ui)try{ui=mountUI(body,{doc,loadCatalogue,loadDetail,reader:readerFactory({doc}),onSection:(recordId,section)=>{
      close();doc.defaultView.dispatchEvent(new CustomEvent('stag-open-standalone-record',{detail:{recordId,section}}));
    }});}catch{if(status){status.hidden=false;status.textContent='Photo & boiler help is unavailable. Continue using the library.';}return;}
    saved={visibility:library.style.visibility,visibilityPriority:library.style.getPropertyPriority('visibility'),inert:library.inert,aria:library.getAttribute('aria-hidden'),focus:doc.activeElement,headerStyle:properties.map(name=>[name,bar.style.getPropertyValue(name),bar.style.getPropertyPriority(name)])};
    spacer=doc.createElement('div');spacer.setAttribute('aria-hidden','true');spacer.style.height=bar.getBoundingClientRect().height+'px';bar.before(spacer);
    for(const [name,value]of [['position','fixed'],['top','0'],['left','0'],['right','0'],['z-index','20']])bar.style.setProperty(name,value,'important');
    geometry();library.style.setProperty('visibility','hidden','important');library.inert=true;library.setAttribute('aria-hidden','true');root.hidden=false;active=true;exit.focus({preventScroll:true});
  }
  entry.addEventListener('click',open);exit.addEventListener('click',close);
  doc.defaultView?.addEventListener('resize',()=>{if(active)geometry();});
  doc.defaultView?.addEventListener('stag-open-standalone-record',close);
  doc.defaultView?.addEventListener('pagehide',()=>{ui?.reset();});
  for(const name of ['baf-open','swr-open'])doc.getElementById(name)?.addEventListener('click',close,true);
  if(observe){const observer=new observe(()=>{if(active)geometry();});observer.observe(bar);}
  const controller={open,close,isOpen:()=>active,getUI:()=>ui};mounts.set(root,controller);entry.disabled=false;if(status)status.hidden=true;return controller;
}
if(typeof document!=='undefined')mountHelpHost(document);
