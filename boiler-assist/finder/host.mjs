import {mount} from './ui.mjs';
import {SOURCE_DATA} from './source-data.mjs';
const hostMounts=new WeakMap();
export function validateFinderData(data){
 const codes=['7814304','7814305','7814306','7733600371','7733600373','228334','228335','228336'];
 if(data?.schemaVersion!==2||!Array.isArray(data.models)||data.models.length!==8||new Set(data.models.map(m=>m.productCode)).size!==8||codes.some(c=>!data.models.some(m=>m.productCode===c)))throw Error('Finder model data unavailable');
 const source=new Map(data.sources.map(s=>[s.id,s]));
 for(const m of data.models){
  if(m.fuel!=='NG'||m.type!=='combi'||!source.get(m.sourceId)?.currentListingObserved||!m.sourceIds?.includes(m.shared.sourceId)||m.sourceIds.some(id=>!source.has(id)))throw Error('Finder source binding unavailable');
  const ranges=m.chKW.kind==='unqualified'?[m.chKW.range]:m.chKW.kind==='operating-categories'?[m.chKW.condensing,m.chKW.nonCondensing]:[];
  if(!ranges.length||ranges.some(r=>!Number.isFinite(r?.min)||!Number.isFinite(r?.max)||r.min<=0||r.max<r.min)||Object.entries(m.dhwFlowsLMin).some(([k,v])=>!['35','40'].includes(k)||!Number.isFinite(v)||v<=0))throw Error('Finder ratings unavailable');
  const idealBindings={
   '228334':['ideal-logic-max-combi2-c24-47-387-03-ng-combi','Logic MAX Combi2 C24 (GC 47-387-03)','47-387-03',4.8,5.1,24.2,9.9,0.8],
   '228335':['ideal-logic-max-combi2-c30-47-387-04-ng-combi','Logic MAX Combi2 C30 (GC 47-387-04)','47-387-04',6.1,6.4,30.3,12.4,1.3],
   '228336':['ideal-logic-max-combi2-c35-47-387-05-ng-combi','Logic MAX Combi2 C35 (GC 47-387-05)','47-387-05',7.1,7.5,35.3,14.5,1.3]
  };
  if(m.manufacturer==='Ideal'||Object.hasOwn(idealBindings,m.productCode)||m.chKW.comparisonPolicy!==undefined){
   const b=idealBindings[m.productCode],manual=source.get('ideal-logic-max-combi2-237660-a05-retained-manual'),brochure=source.get('ideal-technical-brochure-2025-revf'),listing=source.get('ideal-logic-max-combi2-current-listing');
   if(!b||m.manufacturer!=='Ideal'||m.id!==b[0]||m.model!==b[1]||m.gcNumber!==b[2]||m.family!=='Logic MAX Combi2'||m.sourceId!=='ideal-logic-max-combi2-current-listing'||listing?.url!=='https://idealheating.com/products/logic-max-combi'||listing.currentListingObserved!==true||JSON.stringify(m.sourceIds)!==JSON.stringify(['ideal-logic-max-combi2-current-listing','ideal-logic-max-combi2-237660-a05-retained-manual','ideal-technical-brochure-2025-revf'])||m.shared.sourceId!=='ideal-logic-max-combi2-237660-a05-retained-manual')throw Error('Finder Ideal identity/source binding unavailable');
   if(['ideal-logic-max-combi2-current-listing','ideal-logic-max-combi2-237660-a05-retained-manual','ideal-technical-brochure-2025-revf'].some(id=>data.sources.filter(s=>s.id===id).length!==1)||manual?.sha256!=='9209ceb71a30055734973e4cd6913607250b989ab9a0ce10c5d487c3b711d100'||manual.pageCount!==72||manual.bytes!==28080619||manual.url!=="https://idealheating.com/_gatsby/file/a8a01c4778b35976b86007a593b9b19f/Logic%20MAX%20Combi%20Installation%20&%20Servicing%20-%20November%202025%20UIN%20237660%20A05.pdf?u=https%3A%2F%2Fdownloads.ctfassets.net%2Fsj902orc9wh4%2F4hw7r7ut3zXch9PphO11t5%2F938123989fcc20e49b0604029c0f0661%2FLogic_MAX_Combi_Installation___Servicing_-_November_2025_UIN_237660_A05.pdf"||manual.currentListingObserved!==false||brochure?.sha256!=='f2f0ed45736583abeb3aa4ba149a7d3d0628eef8497872e4b27ad6c2c076764a'||brochure.pageCount!==98||brochure.bytes!==7019189||brochure.currentListingObserved!==false||JSON.stringify(brochure.printedTablePages)!=='[37,53]'||brochure.url!=='https://assets.ctfassets.net/sj902orc9wh4/7DZsV4yVT55XaOHyM4ri1F/f3e35314d150e294ae8e79468f6f308f/IHD_Technical_Brochure_RevF_Web_Compressed__1_.pdf')throw Error('Finder Ideal pinned source unavailable');
   if(m.chKW.kind!=='operating-categories'||m.chKW.comparisonPolicy!=='source-mean-temperatures-only'||JSON.stringify(m.chKW.meanWaterTemperaturesC)!=='{"nonCondensing":70,"condensing":40}'||m.chKW.waterTemperatures!=='Non-condensing: 70°C mean water temperature; condensing: 40°C mean water temperature. Source does not give a flow/return pair for either table rating.'||m.chKW.nonCondensing.min!==b[3]||m.chKW.nonCondensing.max!==24.2||m.chKW.condensing.min!==b[4]||m.chKW.condensing.max!==25.6||m.dhwKW!==b[5]||JSON.stringify(m.dhwFlowsLMin)!==JSON.stringify({'35':b[6]}))throw Error('Finder Ideal rating/basis unavailable');
   if(m.shared.minimumDhwOperatingPressureBar!==null||m.shared.minimumStaticMainsPressureForMaximumFlowBar!==null||m.shared.guaranteedFullFlowDynamicPressure!==null||m.shared.minimumDhwFlowLMin!==2||m.shared.nominalFuel!=='NG'||JSON.stringify(m.shared.dimensionMM)!=='{"height":700,"width":395,"depth":278}'||m.shared.minimumPressureMeaning!==`Manual p6: ${b[7]} bar inlet pressure is required for maximum hot-water flow; the manual does not state whether this is static or dynamic. Separately, the 0.5 bar inlet operating figure applies at 0.6 bar system pressure. The 2 L/min minimum delivery rate does not guarantee full rated flow.`)throw Error('Finder Ideal supply qualification unavailable');
  }
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
