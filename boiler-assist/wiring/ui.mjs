import {DATA} from './source-data.mjs';
import {LABELS,createReferenceStore} from './logic.mjs';
import {mountPageViewer,originalManualURL} from './viewer.mjs';
const wiringUIMounts=new WeakMap();
export function mount(root,doc=root?.ownerDocument){
 if(!root||!doc)throw Error('Wiring reference root unavailable');if(wiringUIMounts.has(root))return wiringUIMounts.get(root);
 const get=id=>root.querySelector('#swr-'+id),store=createReferenceStore(),titles={home:'Wiring reference',plans:'System plans',hive:'Hive receivers',cylinder:'Cylinder controls',fault:'Fault-finding reference'},sections={home:'homeSection',plans:'plansSection',hive:'hiveSection',cylinder:'cylinderSection',fault:'faultSection'};
 const make=(tag,text,cls)=>{const e=doc.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls.split(/\s+/).filter(Boolean).map(c=>'swr-'+c).join(' ');return e;};
 const viewer=mountPageViewer({root:get('pageViewer'),scopeRoot:root,dialog:get('largePage'),isSelectionCurrent:rev=>{const s=store.getState();return !root.hidden&&s.revision===rev&&s.result!==null;}});
 function populate(id,key){for(const[v,t]of Object.entries(LABELS[key])){const option=make('option',t);option.value=v;get(id).append(option);}}
 for(const key of ['plan','generation','channel','mode','zones','interface','demand'])populate(key,key);populate('cylinderPlan','plan');
 function clearResult(){viewer.clear();get('result').replaceChildren();get('result').hidden=true;get('summarySection').hidden=true;get('summaryText').value='';get('copySummary').disabled=true;get('copyStatus').textContent='';get('editStatus').textContent='Choices changed. Show the current reference before copying.';}
 function sync(){const s=store.getState().selection;for(const[key,id]of Object.entries(sections))get(id).hidden=s.section!==key;get('sectionTitle').textContent=titles[s.section];get('actionRow').hidden=s.section==='home';get('plan').value=s.plan;get('cylinderPlan').value=s.plan;get('confirmed').checked=s.confirmed;get('contextBadge').textContent=s.boiler?'· '+s.boiler+' (unverified)':'· unverified';}
 function update(patch){if(store.update(patch)){clearResult();sync();}}
 function navigate(section){update({section});get('sectionTitle').focus({preventScroll:true});root.scrollTop=0;}
 get('homeButton').addEventListener('click',()=>navigate('home'));
 for(const button of root.querySelectorAll('[data-swr-section]'))button.addEventListener('click',()=>navigate(button.dataset.swrSection));
 get('selectionForm').addEventListener('input',e=>{const field=e.target;if(field?.type!=='text')return;if(field.name?.startsWith('swr-'))update({[field.name.slice(4)]:field.value});});
 get('selectionForm').addEventListener('change',e=>{const field=e.target,key=field?.dataset?.swrField||(field?.name?.startsWith('swr-')?field.name.slice(4):'');if(!key||field.type==='text')return;update({[key]:field.type==='checkbox'?field.checked:field.value});});
 function sourceCard(reference,revision){
  const source=DATA.sources[reference.source],info=source.pages[String(reference.page)],card=make('article',undefined,'source-card');card.append(make('p',source.title,'source-title'),make('p',source.edition+' · PDF '+reference.page+' / printed '+(info?.printed??reference.page),'help'),make('p',reference.purpose,'help'));
  const link=make('a','Open original manual · page '+reference.page);link.href=originalManualURL(reference);link.target='_blank';link.rel='noopener noreferrer';card.append(link);
  if(reference.kind==='figure'&&source.inline){const button=make('button','View whole original page');button.type='button';button.addEventListener('click',()=>{if(store.getState().revision===revision&&store.getState().result)viewer.show(reference,revision);});card.append(button);}
  else card.append(make('p',reference.kind==='index'?'Manual index only; no live-test procedure is adapted.':source.accessNote,'help'));return card;
 }
 function renderResult(state){
  const {result,revision,summary}=state,box=get('result');box.replaceChildren();box.hidden=false;box.append(make('h2',result.title));
  if(result.held)box.append(make('p',result.section==='hive'?'Terminal-specific information is withheld until this exact source, receiver and mode are confirmed.':result.section==='plans'?'A matching circuit design is not established.':'Reference selection is incomplete.','hold'));
  for(const note of result.notes)box.append(make('p',note));
  if(result.terminalLabels){box.append(make('h3','Labels in this exact source'),make('p','Source labels only. No boiler compatibility, links or load ratings are established.','help'));const labels=make('dl',undefined,'reference-labels');for(const[k,v]of Object.entries(result.terminalLabels))labels.append(make('dt',k),make('dd',v));box.append(labels);}
  if(result.issues.length){const section=make('section',undefined,'issues');section.append(make('h3','Unresolved source qualifications'));for(const issue of result.issues)section.append(make('p',issue.text,'hold'));box.append(section);}
  const missing=make('details');missing.open=true;missing.append(make('summary','Evidence still needed'));const list=make('ul');for(const text of result.missing)list.append(make('li',text));missing.append(list);box.append(missing);
  if(result.references.length){box.append(make('h3',result.section==='plans'&&store.getState().selection.plan==='three'?'Related source references':'Original source references'));for(const reference of result.references)box.append(sourceCard(reference,revision));}
  get('summarySection').hidden=false;get('summaryText').value=summary;get('copySummary').disabled=false;get('editStatus').textContent='Current reference shown. It does not approve an installation.';
  if(result.references.length)viewer.show(result.references[0],revision);
 }
 get('selectionForm').addEventListener('submit',e=>{e.preventDefault();if(store.getState().selection.section==='home')return;try{renderResult(store.review());}catch(error){clearResult();get('editStatus').textContent=error.message;}});
 get('copySummary').addEventListener('click',async()=>{
  const revision=store.getState().revision;let text;try{text=store.copyText(revision);}catch(error){get('copyStatus').textContent=error.message;return;}
  try{if(!doc.defaultView?.navigator?.clipboard?.writeText)throw Error('Clipboard unavailable');await doc.defaultView.navigator.clipboard.writeText(text);get('copyStatus').textContent=store.getState().revision===revision?'Reference summary copied.':'Choices changed while copying. The clipboard may contain the earlier reference; review and copy again.';}
  catch{if(store.getState().revision!==revision){get('copyStatus').textContent='Choices changed. Review the current reference before copying.';return;}get('summaryText').focus();get('summaryText').select();get('copyStatus').textContent='Text selected. Touch and hold, then choose Copy.';}
 });
 doc.defaultView?.addEventListener('pagehide',event=>{if(event.persisted)viewer.clear();else viewer.dispose();});sync();const controller={store,viewer};wiringUIMounts.set(root,controller);return controller;
}

