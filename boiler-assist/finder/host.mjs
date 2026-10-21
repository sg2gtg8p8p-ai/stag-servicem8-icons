import {mount} from './ui.mjs';
import {SOURCE_DATA} from './source-data.mjs';
const hostMounts=new WeakMap();
export function validateFinderData(data){
 const codes=['7814304','7814305','7814306','7733600371','7733600373'];
 if(data?.schemaVersion!==2||!Array.isArray(data.models)||data.models.length!==5||new Set(data.models.map(m=>m.productCode)).size!==5||codes.some(c=>!data.models.some(m=>m.productCode===c)))throw Error('Finder model data unavailable');
 const source=new Map(data.sources.map(s=>[s.id,s]));
 for(const m of data.models){
  if(m.fuel!=='NG'||m.type!=='combi'||!source.get(m.sourceId)?.currentListingObserved||!m.sourceIds?.includes(m.shared.sourceId)||m.sourceIds.some(id=>!source.has(id)))throw Error('Finder source binding unavailable');
  const ranges=m.chKW.kind==='unqualified'?[m.chKW.range]:m.chKW.kind==='operating-categories'?[m.chKW.condensing,m.chKW.nonCondensing]:[];
  if(!ranges.length||ranges.some(r=>!Number.isFinite(r?.min)||!Number.isFinite(r?.max)||r.min<=0||r.max<r.min)||Object.entries(m.dhwFlowsLMin).some(([k,v])=>!['35','40'].includes(k)||!Number.isFinite(v)||v<=0))throw Error('Finder ratings unavailable');
  if(m.manufacturer==='Worcester Bosch'){
   const pdf=source.get('wb-4000-installer-brochure');
   if(pdf?.sha256!=='ad19189f862c34da4357d2c4068196ce89cba364a9f745f45fe43ceef43f2223'||pdf.pageCount!==7||m.chKW.kind!=='unqualified'||m.dhwKW!==null||m.shared.minimumDhwOperatingPressureBar!==null||m.shared.minimumDhwFlowLMin!==null)throw Error('Finder Worcester source qualification unavailable');
  }
 }
 return true;
}
export function mountFinderHost(doc,{mountUI=mount,data=SOURCE_DATA,observe=globalThis.ResizeObserver}={}){
 const root=doc.getElementById('baf-root');if(!root)return null;if(hostMounts.has(root))return hostMounts.get(root);
 const entry=doc.getElementById('baf-open'),library=doc.getElementById('baf-library'),bar=doc.getElementById('offlineBar'),message=doc.getElementById('baf-host-status'),exit=root.querySelector('#baf-exit');
 let ui,active=false,saved=null,finderY=0,spacer=null;
 const headerProperties=['position','top','left','right','z-index'];
 const unavailable=()=>{entry.disabled=true;message.hidden=false;message.textContent='Finder unavailable. Continue using the Library.';};
 try{validateFinderData(data);ui=mountUI(root,doc,data);}catch{unavailable();return null;}
 function geometry(){const rect=bar.getBoundingClientRect();root.style.setProperty('--baf-top',Math.max(0,rect.bottom)+'px');if(spacer)spacer.style.height=rect.height+'px';}
 function close(){if(!active)return;finderY=root.scrollTop;root.hidden=true;if(saved.visibility)library.style.setProperty('visibility',saved.visibility,saved.visibilityPriority);else library.style.removeProperty('visibility');library.inert=saved.inert;if(saved.aria===null)library.removeAttribute('aria-hidden');else library.setAttribute('aria-hidden',saved.aria);for(const[name,value,priority]of saved.headerStyle){if(value)bar.style.setProperty(name,value,priority);else bar.style.removeProperty(name);}spacer?.remove();spacer=null;active=false;saved.focus?.focus?.({preventScroll:true});}
 function open(){
  if(active)return;
  saved={visibility:library.style.visibility,visibilityPriority:library.style.getPropertyPriority('visibility'),inert:library.inert,aria:library.getAttribute('aria-hidden'),focus:doc.activeElement,headerStyle:headerProperties.map(name=>[name,bar.style.getPropertyValue(name),bar.style.getPropertyPriority(name)])};
  // Keep the actual shared Menu/update header visible without scrolling the window
  // or shrinking the Library document (its existing scroll-selection saver stays untouched).
  spacer=doc.createElement('div');spacer.id='baf-header-spacer';spacer.setAttribute('aria-hidden','true');spacer.style.height=bar.getBoundingClientRect().height+'px';bar.before(spacer);
  for(const[name,value]of [['position','fixed'],['top','0'],['left','0'],['right','0'],['z-index','20']])bar.style.setProperty(name,value,'important');
  geometry();library.style.setProperty('visibility','hidden','important');library.inert=true;library.setAttribute('aria-hidden','true');root.hidden=false;root.scrollTop=finderY;active=true;exit.focus({preventScroll:true});
 }
 entry.addEventListener('click',open);exit.addEventListener('click',close);
 doc.defaultView?.addEventListener('resize',()=>{if(active)geometry();});
 doc.defaultView?.addEventListener('stag-open-standalone-record',close);
 if(observe){const observer=new observe(()=>{if(active)geometry();});observer.observe(bar);}
 const controller={open,close,ui,isOpen:()=>active};hostMounts.set(root,controller);entry.disabled=false;message.hidden=true;return controller;
}
if(typeof document!=='undefined')mountFinderHost(document);
