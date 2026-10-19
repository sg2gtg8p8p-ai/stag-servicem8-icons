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
$('installHelp').onclick=()=>$('installDialog').showModal();
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
function showWaiting(){if(registration?.waiting&&registration.active&&navigator.serviceWorker.controller)notice('An update has downloaded. Finish your current lookup, close all Boiler Assist app/browser windows, then reopen to use it. Your current guide will not be replaced while it is open.');}
$('checkUpdates').onclick=async()=>{
  if(!navigator.onLine){notice('Reconnect before checking for updates. Your verified saved library can still be used.');return;}
  try{await registration?.update();showWaiting();await showStatus();if(!registration?.waiting)notice('Update check completed. The saved pack date does not certify that every manufacturer source is the latest revision.');}
  catch{notice('The update could not be checked. Keep using only a verified saved pack and try again when connected.');}
};
async function boot(){
  const r=await fetch('./release-info.json',{credentials:'omit'});if(!r.ok)throw Error('App release information unavailable');info=await r.json();
  records=[...await dataset('search-index'),...await dataset('gas-fire-index')];updateResume();
  $('preparedDate').textContent=info.preparedOn;
  if(!('serviceWorker'in navigator)||!isSecureContext){$('offlineStatus').textContent='Offline installation requires a trusted HTTPS address or this computer’s localhost.';return;}
  registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
  registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){showWaiting();showStatus();}if(worker.state==='redundant')notice('The new offline download failed verification. No incomplete pack is ready; an existing verified pack remains separate.');});});
  navigator.serviceWorker.addEventListener('controllerchange',()=>{showStatus();});
  navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='PACK_ERROR'){notice('The saved library failed verification. Reconnect and check for updates; do not rely on an incomplete copy.');showStatus();}});
  await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Offline download did not complete. Keep connected and reopen to retry.')),45000))]);await showStatus();showWaiting();
}
boot().catch(e=>{$('offlineStatus').dataset.ready='false';$('offlineStatus').textContent='Offline library is not ready.';notice(e.message||'Keep connected and reopen the app to complete its verified download.');});
