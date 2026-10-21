import {mount} from './ui.mjs';
import {DATA} from './source-data.mjs';
const wiringMounts=new WeakMap();
const wiringContracts={"resideo":{"url":"https://www.resideo.com/gb/en/-/media/EMEA%20Site%20Cluster/Mastersite/Documents/Sales%20Literature/Resideo_HWHome_Wiring%20Guide_May24.pdf/?rv=4a17ca0fc4ee4e588b93905ce95b5d89","sha256":"ec0b205ad90b01bdb7177c0f757d0e356a2b7c06cf99a891ef5b10e61472bc2b","bytes":3033263,"pageCount":36,"inline":false,"pages":[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,32]},"slt3-current":{"url":"https://assets.ctfassets.net/mijf9lz5yt3u/4LFy5x5QRqycyxGKT3HXYA/92716ffff1c680323bd9397f298920f2/Hive_Thermostat_SLT3_Installation_Guide_LR__1_.pdf","sha256":"9d06f70e5c586c5071b8962e88517141752fa275148d5d7f0da1e09eb6e5df2d","bytes":737078,"pageCount":20,"inline":true,"pages":[7,9,10]},"active-heating2-legacy":{"url":"https://assets.ctfassets.net/mijf9lz5yt3u/3PJRO1bvewa2mAgYzKJGAV/94f24a8e62f743eb354560e30186c07f/Hive_Active_Heating_2_Wireless_Thermostat_User_Guide_Installation_Guide.pdf","sha256":"d5cf9bf693e5ad8f4d01a9e6edbaa46c9c2cbfbfbea01f61b7cc8a85a67a4337","bytes":876329,"pageCount":36,"inline":true,"pages":[9,13,17]}};
export function validateWiringData(data){
 if(data?.schemaVersion!==1||data.installationApproval!==false||data.invasiveTestSteps!==false||Object.keys(data.sources??{}).length!==3)throw Error('Wiring source data unavailable');
 for(const[id,pin]of Object.entries(wiringContracts)){
  const s=data.sources[id];if(!s||s.url!==pin.url||s.sha256!==pin.sha256||s.bytes!==pin.bytes||s.pageCount!==pin.pageCount||s.inline!==pin.inline||JSON.stringify(Object.keys(s.pages).map(Number).sort((a,b)=>a-b))!==JSON.stringify(pin.pages))throw Error('Wiring source binding unavailable');
 }
 if(data.receivers?.['otr1-relay']?.terminalLabels?.['2']!=='Unused'||data.receivers?.['legacy-single']?.terminalLabels?.['2']!=='Heating off (NC)'||['1','2','3','4'].some(n=>data.receivers?.['otr1-opentherm']?.terminalLabels?.[n]!=='Unused')||data.plans?.splus?.commonPumps!==1||data.plans?.splus?.valves?.V4043H!==3)throw Error('Wiring source qualification unavailable');
 return true;
}
export function mountWiringHost(doc,{mountUI=mount,data=DATA,observe=globalThis.ResizeObserver}={}){
 const root=doc.getElementById('swr-root'),entry=doc.getElementById('swr-open'),message=doc.getElementById('swr-host-status');
 const unavailable=()=>{if(entry)entry.disabled=true;if(message){message.hidden=false;message.textContent='Wiring reference unavailable. Continue using the library or finder.';}};
 if(!root){unavailable();return null;}if(wiringMounts.has(root))return wiringMounts.get(root);
 const library=doc.getElementById('baf-library'),bar=doc.getElementById('offlineBar'),exit=root.querySelector('#swr-exit'),finderRoot=doc.getElementById('baf-root'),finderEntry=doc.getElementById('baf-open');
 if(!entry||!message||!library||!bar||!exit){unavailable();return null;}
 let ui,active=false,saved=null,wiringY=0,spacer=null;const headerProperties=['position','top','left','right','z-index'];
 try{validateWiringData(data);ui=mountUI(root,doc);}catch{unavailable();return null;}
 function geometry(){const rect=bar.getBoundingClientRect();root.style.setProperty('--swr-top',Math.max(0,rect.bottom)+'px');if(spacer)spacer.style.height=rect.height+'px';}
 function close(){
  if(!active)return;wiringY=root.scrollTop;ui.viewer?.clear();root.hidden=true;
  if(saved.visibility)library.style.setProperty('visibility',saved.visibility,saved.visibilityPriority);else library.style.removeProperty('visibility');library.inert=saved.inert;if(saved.aria===null)library.removeAttribute('aria-hidden');else library.setAttribute('aria-hidden',saved.aria);
  for(const[name,value,priority]of saved.headerStyle){if(value)bar.style.setProperty(name,value,priority);else bar.style.removeProperty(name);}spacer?.remove();spacer=null;active=false;saved.focus?.focus?.({preventScroll:true});
 }
 function open(){
  if(active)return;
  // Use the existing finder Back action rather than touching its survey or state.
  if(finderRoot&&!finderRoot.hidden){const back=finderRoot.querySelector('#baf-exit');if(!back){unavailable();return;}back.click();if(!finderRoot.hidden){unavailable();return;}}
  saved={visibility:library.style.visibility,visibilityPriority:library.style.getPropertyPriority('visibility'),inert:library.inert,aria:library.getAttribute('aria-hidden'),focus:doc.activeElement,headerStyle:headerProperties.map(name=>[name,bar.style.getPropertyValue(name),bar.style.getPropertyPriority(name)])};
  spacer=doc.createElement('div');spacer.id='swr-header-spacer';spacer.setAttribute('aria-hidden','true');spacer.style.height=bar.getBoundingClientRect().height+'px';bar.before(spacer);
  for(const[name,value]of [['position','fixed'],['top','0'],['left','0'],['right','0'],['z-index','20']])bar.style.setProperty(name,value,'important');
  geometry();library.style.setProperty('visibility','hidden','important');library.inert=true;library.setAttribute('aria-hidden','true');root.hidden=false;root.scrollTop=wiringY;active=true;exit.focus({preventScroll:true});
 }
 entry.addEventListener('click',open);exit.addEventListener('click',close);
 // Capture runs before the existing finder entry handler and restores the shared host.
 finderEntry?.addEventListener('click',close,true);
 doc.defaultView?.addEventListener('resize',()=>{if(active)geometry();});doc.defaultView?.addEventListener('stag-open-standalone-record',close);
 if(observe){const observer=new observe(()=>{if(active)geometry();});observer.observe(bar);}
 const controller={open,close,ui,isOpen:()=>active};wiringMounts.set(root,controller);entry.disabled=false;message.hidden=true;return controller;
}
if(typeof document!=='undefined')mountWiringHost(document);
