import './local-bridge.js';
import {dataset} from './decoder.js';
const $=id=>document.getElementById(id),stateKey='stag-boiler-assist-offline-selection-v1';
let records=[],info,registration=null,last=null,restore=null,saveTimer;
let storage=null;try{storage=globalThis.localStorage;}catch{}
const sections=new Set(['technicalData','fullService','serviceMode','serviceProcedure','combustion','adjustments','spareParts','parts','faultCodes','manuals','notes','sources','serialAge','spillage','identification']);
const notice=text=>{$('appNotice').textContent=text;$('appNotice').hidden=false;};
function readSelection(){try{const v=JSON.parse(storage?.getItem(stateKey)||'null');return v?.version===1&&typeof v.recordId==='string'&&v.recordId.length<=160&&sections.has(v.section)&&Number.isFinite(v.y)&&v.y>=0&&v.y<1000000?v:null;}catch{return null;}}
function writeSelection(){if(!last||restore)return;try{storage?.setItem(stateKey,JSON.stringify({version:1,recordId:last.recordId,section:last.section,y:Math.max(0,Math.min(999999,window.scrollY))}));}catch{notice('This browser could not save your last guide position. The library can still be used.');}}
function updateResume(){const saved=readSelection(),record=saved&&records.find(r=>r.id===saved.recordId);$('resumeGuide').hidden=!record;if(record)$('resumeGuide').textContent='Resume '+record.model;}
function sourceLabels(){for(const a of document.querySelectorAll('main a[href]')){let u;try{u=new URL(a.href);}catch{continue;}if(u.protocol==='https:'&&u.origin!==location.origin&&!a.dataset.offlineSource){a.dataset.offlineSource='online';const label=document.createElement('small');label.className='online-source-label';label.textContent='Online source · not downloaded with this app';a.after(label);}}}
window.addEventListener('stag-standalone-selection',e=>{
  const v=e.detail;if(!v||!records.some(r=>r.id===v.recordId)||!sections.has(v.section))return;
  last={recordId:v.recordId,section:v.section};
  requestAnimationFrame(()=>{
    sourceLabels();
    if(restore&&restore.recordId===last.recordId&&restore.section===last.section){const y=restore.y;requestAnimationFrame(()=>{window.scrollTo(0,y);restore=null;writeSelection();updateResume();});}
    else{writeSelection();updateResume();}
  });
});
window.addEventListener('pagehide',writeSelection);
document.addEventListener('visibilitychange',writeSelection);
window.addEventListener('scroll',()=>{clearTimeout(saveTimer);saveTimer=setTimeout(writeSelection,150);},{passive:true});
document.addEventListener('click',e=>{const a=e.target.closest?.('a[href]');if(!a)return;let u;try{u=new URL(a.href);}catch{return;}if(u.protocol==='https:'&&u.origin!==location.origin&&navigator.onLine===false){e.preventDefault();notice('This source PDF or website is not downloaded. Reconnect to open the official source, or use a copy you already saved in Files.');}},true);
$('resumeGuide').onclick=()=>{const v=readSelection();if(!v||!records.some(r=>r.id===v.recordId))return;restore=v;window.dispatchEvent(new CustomEvent('stag-open-standalone-record',{detail:{recordId:v.recordId,section:v.section}}));};
const standaloneDisplay=window.matchMedia?.('(display-mode: standalone)');
function showAppMode(){
  const asApp=standaloneDisplay?.matches===true||navigator.standalone===true;
  $('appModeStatus').dataset.mode=asApp?'app':'browser';
  $('appModeStatus').textContent=asApp?'Opened as a Home Screen app.':'Opened in a browser. A Home Screen icon may already exist.';
}
if(standaloneDisplay?.addEventListener)standaloneDisplay.addEventListener('change',showAppMode);
else standaloneDisplay?.addListener?.(showAppMode);
window.addEventListener('pageshow',showAppMode);
showAppMode();
$('installHelp').onclick=()=>{showAppMode();$('installDialog').showModal();};
function referenceRecord(hash,catalogue){
  if(typeof hash!=='string'||!hash.startsWith('#reference=')||hash.includes('&')||hash.slice(1).includes('#'))return null;
  let id;try{id=decodeURIComponent(hash.slice('#reference='.length));}catch{return null;}
  if(!id||id.length>160)return null;
  const matches=catalogue.filter(record=>record.id===id);
  return matches.length===1?matches[0]:null;
}
let referenceCatalogueReady=false,pendingReference=null;
function receiveReference(){
  if(!referenceCatalogueReady||(!location.hash&&!location.search))return;
  const record=location.search?null:referenceRecord(location.hash,records);
  // Drop untrusted link context from this app's current address; never persist or echo it.
  try{history.replaceState(null,'',location.pathname);}catch{}
  pendingReference=record;
  if(!$('detailView').hidden)$('back').click();
  $('referenceLink').hidden=!record;
  if(!record){notice('Reference link not recognised. Use manual search and confirm the appliance.');$('boilerSearch').focus();return;}
  $('referenceIdentity').textContent=[record.manufacturer,record.model,record.gcNumber?'GC '+record.gcNumber:'',record.productNumber?'Product '+record.productNumber:'',record.fuel].filter(Boolean).join(' · ');
}
window.addEventListener('hashchange',receiveReference);
$('openReference').onclick=()=>{
  const record=pendingReference;if(!record)return;
  pendingReference=null;$('referenceLink').hidden=true;
  window.dispatchEvent(new CustomEvent('stag-open-standalone-record',{detail:{recordId:record.id,section:'technicalData'}}));
};
$('dismissReference').onclick=()=>{pendingReference=null;$('referenceLink').hidden=true;$('boilerSearch').focus();};

$('closeInstall').onclick=()=>$('installDialog').close();
async function status(){
  const worker=navigator.serviceWorker?.controller||registration?.active;
  if(!worker)return {ready:false};
  return new Promise(resolve=>{const channel=new MessageChannel(),timer=setTimeout(()=>resolve({ready:false}),15000);channel.port1.onmessage=e=>{clearTimeout(timer);resolve(e.data);};worker.postMessage({type:'STATUS'},[channel.port2]);});
}
async function showStatus(){
  const s=await status();$('offlineStatus').dataset.ready=String(!!s.ready);
  $('offlineStatus').textContent=s.ready?'Library saved for offline use · prepared '+s.preparedOn:'Offline library not verified yet. Stay connected until the download completes.';
  $('packDetails').textContent=s.ready?info.boilers+' boilers · '+info.gasFires+' gas fires · '+Math.ceil(s.totalBytes/1024/1024)+' MB verified · version '+info.appVersion+' · pack '+s.buildId:'First online download and verification is required before offline use.';
  if(!s.ready&&s.reason)notice('Offline copy unavailable: '+s.reason+'. Reconnect, check for an update, then close and reopen the app.');
}
let checkingUpdate=false,lastUpdateCheck=0,applyingUpdate=false;
function showWaiting(){
  const waiting=!!(registration?.waiting&&registration.active&&navigator.serviceWorker.controller);
  $('updateNotice').hidden=!waiting;
  if(waiting){$('updateMessage').textContent='Update ready';$('applyAppUpdate').disabled=false;}
}
async function checkForUpdates(manual=false){
  if(!registration||checkingUpdate)return;
  if(!navigator.onLine){if(manual)notice('Connect to check for an app update.');return;}
  const now=Date.now();if(!manual&&now-lastUpdateCheck<60000)return;
  lastUpdateCheck=now;checkingUpdate=true;
  try{
    await registration.update();
    const worker=registration.installing;
    if(worker)await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('The update is still downloading.')),30000);
      const changed=()=>{if(['installed','redundant'].includes(worker.state)){clearTimeout(timer);worker.state==='installed'?resolve():reject(Error('The new update could not be verified.'));}};
      worker.addEventListener('statechange',changed);changed();
    });
    showWaiting();if(manual&&!registration.waiting)notice('You’re up to date.');
  }catch(e){if(manual)notice(e.message||'The update could not be checked. Try again when connected.');}
  finally{checkingUpdate=false;}
}
$('checkUpdates').onclick=()=>checkForUpdates(true);
$('applyAppUpdate').onclick=async()=>{
  const worker=registration?.waiting;if(!worker)return;
  if(!confirm('Finish your current lookup before updating. The app will reopen on the main screen. Continue?'))return;
  writeSelection();applyingUpdate=true;$('applyAppUpdate').disabled=true;
  try{
    const result=await new Promise((resolve,reject)=>{
      const channel=new MessageChannel(),timer=setTimeout(()=>reject(Error('Close Boiler Assist and reopen to finish this update.')),20000);
      channel.port1.onmessage=e=>{clearTimeout(timer);resolve(e.data);};
      worker.postMessage({type:'APPLY_UPDATE'},[channel.port2]);
    });
    if(!result?.ok){try{sessionStorage.removeItem('stag-boiler-update-resume-v1');}catch{}applyingUpdate=false;$('applyAppUpdate').disabled=false;$('updateMessage').textContent=result?.reason==='other-windows-open'?'Close the other Boiler Assist windows, then tap Update app.':'The update could not be verified. Keep this version open and try again.';}
  }catch(e){$('applyAppUpdate').disabled=false;$('updateMessage').textContent=e.message;}
};
window.addEventListener('pageshow',()=>checkForUpdates(false));
window.addEventListener('online',()=>checkForUpdates(false));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkForUpdates(false);});
async function boot(){
  const r=await fetch('./release-info.json',{credentials:'omit'});if(!r.ok)throw Error('App release information unavailable');info=await r.json();
  records=[...await dataset('search-index'),...await dataset('gas-fire-index')];updateResume();referenceCatalogueReady=true;receiveReference();
  // Older versions left this marker when applying an update. Consume it without reopening a saved boiler.
  try{sessionStorage.removeItem('stag-boiler-update-resume-v1');}catch{}
  $('preparedDate').textContent=info.preparedOn;
  if(!('serviceWorker'in navigator)||!isSecureContext){$('offlineStatus').textContent='Offline installation requires a trusted HTTPS address or this computer’s localhost.';return;}
  registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
  registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){showWaiting();showStatus();}if(worker.state==='redundant')notice('The new offline download failed verification. No incomplete pack is ready; an existing verified pack remains separate.');});});
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(applyingUpdate){location.reload();return;}showStatus();});
  navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='PACK_ERROR'){notice('The saved library failed verification. Reconnect and check for updates; do not rely on an incomplete copy.');showStatus();}});
  await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Offline download did not complete. Keep connected and reopen to retry.')),45000))]);await showStatus();showWaiting();checkForUpdates(false);
}
boot().catch(e=>{$('offlineStatus').dataset.ready='false';$('offlineStatus').textContent='Offline library is not ready.';notice(e.message||'Keep connected and reopen the app to complete its verified download.');});
