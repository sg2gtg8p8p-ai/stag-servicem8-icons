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
$('installHelp').onclick=()=>{showAppMode();showWaiting();$('installDialog').showModal();};
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
  $('packDetails').textContent=s.ready?(info?info.boilers+' boilers · '+info.gasFires+' gas fires · '+Math.ceil(s.totalBytes/1024/1024)+' MB verified · version '+info.appVersion+' · pack '+s.buildId:'Saved library verified. Loading the catalogue…'):'First online download and verification is required before offline use.';
  if(!s.ready&&s.reason)notice('Offline copy unavailable: '+s.reason+'. Reconnect, check for an update, then close and reopen the app.');
}
let checkingUpdate=false,lastUpdateCheck=0,applyingUpdate=false,downloadMessage='',downloadFailure='';
async function updateDeadline(operation,ms,message){
  let timer;
  try{return await Promise.race([operation,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(message)),ms);})]);}
  finally{clearTimeout(timer);}
}
function showWaiting(){
  const waiting=!!(registration?.waiting&&registration.active&&navigator.serviceWorker.controller);
  $('updateNotice').hidden=!waiting;$('dialogApplyUpdate').hidden=!waiting;
  if(waiting)$('dialogUpdateStatus').textContent='Update available. Finish your lookup, then choose Update app.';
  if(waiting&&!applyingUpdate){$('updateMessage').textContent='Update ready';$('applyAppUpdate').disabled=false;$('dialogApplyUpdate').disabled=false;}
}
async function checkForUpdates(manual=false){
  if(checkingUpdate){if(manual)$('dialogUpdateStatus').textContent=downloadMessage||'Checking the update. Keep the app open while it downloads.';return;}
  if(!registration){if(manual)$('dialogUpdateStatus').textContent='The app is still starting. Please try again shortly.';return;}
  if(!navigator.onLine){if(manual)$('dialogUpdateStatus').textContent='You are offline. Connect to check for updates.';return;}
  const now=Date.now();if(!manual&&now-lastUpdateCheck<60000)return;
  lastUpdateCheck=now;checkingUpdate=true;
  if(manual){$('checkUpdates').disabled=true;$('checkUpdates').textContent='Checking…';$('dialogUpdateStatus').textContent='Checking for updates…';}
  try{
    await updateDeadline(registration.update(),45000,'The update check is taking too long. Keep connected, close and reopen Boiler Assist, then try again.');
    const worker=registration.installing;
    if(worker)await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{worker.removeEventListener('statechange',changed);reject(Error(downloadMessage||'The update is still downloading. Keep this app open and connected; saved download progress will be reused.'));},90000);
      const changed=()=>{if(['installed','redundant'].includes(worker.state)){clearTimeout(timer);worker.removeEventListener('statechange',changed);worker.state==='installed'?resolve():reject(Error(downloadFailure||'The download was interrupted. Keep the app open and try Check for updates again.'));}};
      worker.addEventListener('statechange',changed);changed();
    });
    showWaiting();if(manual&&!registration.waiting&&!registration.installing)$('dialogUpdateStatus').textContent='You’re up to date.';
  }catch(e){if(manual)$('dialogUpdateStatus').textContent=e.message||'The update could not be checked. Try again when connected.';}
  finally{checkingUpdate=false;if(manual){$('checkUpdates').disabled=false;$('checkUpdates').textContent='Check for updates';}}
}
$('checkUpdates').onclick=()=>checkForUpdates(true);
async function applyUpdate(){
  const worker=registration?.waiting;if(!worker)return;
  if(!confirm('Finish your current lookup before updating. The app will reopen on the main screen. Continue?'))return;
  writeSelection();applyingUpdate=true;$('applyAppUpdate').disabled=true;$('dialogApplyUpdate').disabled=true;$('dialogUpdateStatus').textContent='Applying update… The app will reopen on the main screen.';
  try{
    const result=await new Promise((resolve,reject)=>{
      const channel=new MessageChannel(),timer=setTimeout(()=>reject(Error('Close Boiler Assist and reopen to finish this update.')),20000);
      channel.port1.onmessage=e=>{clearTimeout(timer);resolve(e.data);};
      worker.postMessage({type:'APPLY_UPDATE'},[channel.port2]);
    });
    if(!result?.ok){try{sessionStorage.removeItem('stag-boiler-update-resume-v1');}catch{}applyingUpdate=false;$('applyAppUpdate').disabled=false;$('updateMessage').textContent=result?.reason==='other-windows-open'?'Close the other Boiler Assist windows, then tap Update app.':'The update could not be verified. Keep this version open and try again.';}
  }catch(e){$('applyAppUpdate').disabled=false;$('updateMessage').textContent=e.message;}
  if(!applyingUpdate||!$('applyAppUpdate').disabled){$('dialogApplyUpdate').disabled=false;$('dialogUpdateStatus').textContent=$('updateMessage').textContent;}
}
$('applyAppUpdate').onclick=applyUpdate;$('dialogApplyUpdate').onclick=applyUpdate;
window.addEventListener('pageshow',()=>checkForUpdates(false));
window.addEventListener('online',()=>checkForUpdates(false));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkForUpdates(false);});
async function boot(){
  // Start recovery before reading a catalogue that may itself need repair.
  // A failed/slow saved data file must not prevent registering the new worker.
  if('serviceWorker'in navigator&&isSecureContext)registration=await updateDeadline(navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}),45000,'The offline updater did not start. Close and reopen Boiler Assist while connected, then retry.');
  if(registration)attachOfflineEvents();
  const r=await fetch('./release-info.json',{credentials:'omit'});if(!r.ok)throw Error('App release information unavailable');info=await r.json();
  records=[...await dataset('search-index'),...await dataset('gas-fire-index')];updateResume();referenceCatalogueReady=true;receiveReference();
  // Older versions left this marker when applying an update. Consume it without reopening a saved boiler.
  try{sessionStorage.removeItem('stag-boiler-update-resume-v1');}catch{}
  $('preparedDate').textContent=info.preparedOn;
  if(!('serviceWorker'in navigator)||!isSecureContext){$('offlineStatus').textContent='Offline installation requires a trusted HTTPS address or this computer’s localhost.';return;}
  await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Offline download did not complete. Keep connected and reopen to retry.')),45000))]);await showStatus();showWaiting();checkForUpdates(false);
}
function attachOfflineEvents(){
  registration.addEventListener('updatefound',()=>{downloadFailure='';const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){downloadMessage='';showWaiting();showStatus();}if(worker.state==='redundant')notice(downloadFailure||'The update download was interrupted. Your existing library is kept. Keep this app open and use Check for updates to retry.');});});
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(applyingUpdate){location.reload();return;}showStatus();});
  navigator.serviceWorker.addEventListener('message',e=>{
    const data=e.data;
    if(data?.type==='PACK_ERROR'){notice('The saved library failed verification. Reconnect and check for updates; do not rely on an incomplete copy.');showStatus();}
    if(data?.type==='PACK_DOWNLOAD_PROGRESS'&&Number.isSafeInteger(data.completed)&&Number.isSafeInteger(data.total)&&data.total>0&&data.total<=100000&&data.completed>=0&&data.completed<=data.total){
      downloadMessage='Preparing update: '+data.completed+' of '+data.total+' files ready. Keep the app open.';
      $('dialogUpdateStatus').textContent=downloadMessage;
    }
    if(data?.type==='PACK_DOWNLOAD_FAILED'&&['storage-full','verification','download'].includes(data.reason)){
      downloadFailure=data.reason==='storage-full'?'There is not enough space to save the update. Free some phone storage, then retry. Your existing library is kept.':data.reason==='verification'?'A downloaded file did not match the published update. Keep the app open and retry Check for updates. Your existing library is kept.':'The update download was interrupted. Keep this app open and connected, then retry Check for updates. Saved download progress is kept.';
      $('dialogUpdateStatus').textContent=downloadFailure;notice(downloadFailure);
    }
  });
}
boot().catch(e=>{$('offlineStatus').dataset.ready='false';$('offlineStatus').textContent='Offline library is not ready.';notice(e.message||'Keep connected and reopen the app to complete its verified download.');});
