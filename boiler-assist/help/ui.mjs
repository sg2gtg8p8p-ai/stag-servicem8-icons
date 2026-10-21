import {MAX_TEXT,identify,identityLabel,identityEqual,retrieve,safeURL,createSession,SECTIONS} from './logic.mjs';
export function element(doc,tag,text,cls){const n=doc.createElement(tag);if(text!==undefined)n.textContent=String(text);if(cls)n.className=cls;return n;}
function button(doc,text,fn){const n=element(doc,'button',text);n.type='button';n.addEventListener('click',fn);return n;}
function clear(node){node.replaceChildren();}
function paragraph(doc,parent,text,cls){if(text)parent.append(element(doc,'p',text,cls));}
function link(doc,parent,item){const url=safeURL(item.url);if(!url)return;const a=element(doc,'a',item.label||item.title||'Saved source');a.href=url;a.target='_blank';a.rel='noopener noreferrer';parent.append(a);paragraph(doc,parent,item.reference,'help-small');}
const OMIT=new Set(['sourceIds','classification','id','auditReviewed']);
const LABELS={label:'Entry',value:'Stored reference',conditions:'Conditions',condition:'Condition',note:'Note',notes:'Notes',applicability:'Applies to',fuel:'Fuel',context:'Context',minimum:'Minimum',maximum:'Maximum',unit:'Unit',reference:'Reference',source:'Source',title:'Title',warning:'Warning',holds:'Unresolved items',gaps:'Source gaps'};
// Only text nodes are created, including user/OCR text and every stored value.
// Complete source blocks retain all non-link context rather than cherry-picking a
// number; unknown keys are shown as stored words, never executed as HTML.
export function renderStored(doc,parent,value){
  if(value===null||value===undefined)return;
  if(typeof value!=='object'){paragraph(doc,parent,String(value));return;}
  if(Array.isArray(value)){for(const entry of value)renderStored(doc,parent,entry);return;}
  for(const [key,entry] of Object.entries(value)){
    if(OMIT.has(key)||entry===null||entry===undefined)continue;
    if(key==='url'){if(safeURL(entry))link(doc,parent,{url:entry,label:'Stored source link'});continue;}
    parent.append(element(doc,'strong',LABELS[key]||key.replace(/([a-z])([A-Z])/g,'$1 $2')));
    renderStored(doc,parent,entry);
  }
}
export function renderAnswer(doc,parent,result,{onSection=()=>{}}={}){
  clear(parent);
  if(result.context){paragraph(doc,parent,result.context.identity,'help-identity');paragraph(doc,parent,result.context.status,'help-notice');paragraph(doc,parent,result.context.applicability,'help-notice');
    if(result.kind==='references'&&result.context.notes?.length){const box=element(doc,'details');box.append(element(doc,'summary','All saved notes and limits'));renderStored(doc,box,result.context.notes);parent.append(box);}}
  paragraph(doc,parent,result.message,'help-notice');
  if(result.kind==='references')for(const item of result.blocks){const block=element(doc,'article',undefined,'help-reference');renderStored(doc,block,item.block);for(const source of item.sources)link(doc,block,{url:source.url,label:source.title||'Saved source',reference:source.reference});parent.append(block);}
  // Associated presentation may carry extra conditions; retain it as a complete,
  // readable reference rather than reducing the native block to an orphan value.
  if(result.kind==='references'&&result.completePresentation){const box=element(doc,'details');box.append(element(doc,'summary','Complete saved context for this section'));renderStored(doc,box,result.completePresentation);parent.append(box);}
  if(result.section)parent.append(button(doc,'Open complete '+(result.title||SECTIONS[result.section]||'guide'),()=>onSection(result.section)));
  const sources=element(doc,'details');sources.append(element(doc,'summary','Manuals and sources — connection needed'));
  for(const item of result.links||[])link(doc,sources,item);
  if(!(result.links||[]).length)paragraph(doc,sources,'No supported source link is stored for this entry.');
  parent.append(sources);
}
export function mountHelp(root,{doc=root.ownerDocument,loadCatalogue,loadDetail,reader,onSection=()=>{}}){
  const session=createSession();let records=[],file=null,operation=0,busy=false,selection=null;
  const field=(tag,id,label)=>{const wrap=element(doc,'div');const l=element(doc,'label',label);l.htmlFor=id;const input=element(doc,tag);input.id=id;wrap.append(l,input);return {wrap,input};};
  const intro=element(doc,'div');intro.append(element(doc,'h1','Photo & boiler help'));
  paragraph(doc,intro,'Read the text on a boiler label, or type its GC/product number. Photos stay on this device.');
  const tips=element(doc,'details');tips.append(element(doc,'summary','Photo tips and limits'));
  paragraph(doc,tips,'Read a clear data-plate photo on this device, or type its details. Nothing is uploaded. This is text recognition and saved-guide lookup, not visual identification or a diagnostic AI.');
  paragraph(doc,tips,'A code match does not confirm fitted parts or authorise an order. Always check the actual data plate, fuel, generation and installed setup.','help-notice');
  paragraph(doc,tips,'Crop closely to the label, keep it upright and avoid glare. JPEG/PNG only, up to 12 MB and 24 megapixels. Retake or crop a large/unclear image. Photo reading needs an initial online reader download; its availability offline is not guaranteed.','help-small');
  intro.append(tips);
  const photo=field('input','help-photo','Choose or take a label photo');photo.input.type='file';photo.input.accept='image/jpeg,image/png';photo.input.setAttribute('capture','environment');
  const status=element(doc,'p','Loading the saved catalogue…','help-notice');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const controls=element(doc,'div',undefined,'help-actions');
  const read=button(doc,'Read label on this device',readPhoto),cancel=button(doc,'Cancel reading',cancelRead),reset=button(doc,'Clear photo and answers',resetAll);
  cancel.hidden=true;read.disabled=true;controls.append(read,cancel,reset);
  const detected=field('textarea','help-label-text','Label text — check and correct before matching');detected.input.maxLength=MAX_TEXT;detected.input.rows=5;detected.input.autocomplete='off';detected.input.spellcheck=false;
  const find=button(doc,'Find catalogue candidates',findCandidates);find.disabled=true;
  const candidates=element(doc,'div');candidates.setAttribute('aria-live','polite');
  const confirmed=element(doc,'div');
  const questionBox=element(doc,'section');questionBox.hidden=true;
  questionBox.append(element(doc,'h2','Find information in this boiler’s saved guide'));
  paragraph(doc,questionBox,'Use a topic such as dimensions, manuals, modes or fault codes. This searches the saved references for the confirmed catalogue entry. It does not generate technical advice.');
  const question=field('input','help-question','What information do you need?');question.input.type='text';question.input.maxLength=240;question.input.autocomplete='off';
  const ask=button(doc,'Find saved information',answerQuestion);questionBox.append(question.wrap,ask);
  const answer=element(doc,'div');questionBox.append(answer);
  root.append(intro,photo.wrap,controls,status,detected.wrap,find,candidates,confirmed,questionBox);
  function updateBusy(value){busy=value;read.disabled=value||!file||!records.length;find.disabled=value||!records.length;cancel.hidden=!value;photo.input.disabled=value;detected.input.disabled=value;}
  function forgetConfirmation(){session.invalidate();selection=null;questionBox.hidden=true;question.input.value='';clear(answer);clear(confirmed);}
  async function cancelRead(){operation++;forgetConfirmation();await reader.cancel();updateBusy(false);status.textContent='Reading cancelled. Choose another photo or type the plate details.';}
  function resetAll(){operation++;reader.cancel();file=null;photo.input.value='';detected.input.value='';clear(candidates);forgetConfirmation();updateBusy(false);status.textContent='Photo, detected text and answers cleared from this screen.';}
  photo.input.addEventListener('change',()=>{operation++;reader.cancel();file=photo.input.files?.[0]||null;detected.input.value='';clear(candidates);forgetConfirmation();updateBusy(false);status.textContent=file?'Photo selected. Tap Read label, or type the details below.':'Choose a label photo or type its details.';});
  detected.input.addEventListener('input',()=>{operation++;forgetConfirmation();clear(candidates);status.textContent='Text changed. Find candidates and confirm the exact entry again.';});
  question.input.addEventListener('input',()=>{operation++;clear(answer);});
  question.input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();answerQuestion();}});
  async function readPhoto(){
    if(busy||!file)return;
    const current=++operation;forgetConfirmation();clear(candidates);detected.input.value='';updateBusy(true);
    try{const text=await reader.read(file,{onStatus:message=>{if(current===operation)status.textContent=message;}});if(current!==operation)return;detected.input.value=text.slice(0,MAX_TEXT);status.textContent=text.trim()?'Check the detected text against the plate, then find candidates. Recognition can misread characters.':'No clear text was read. Retake a closer photo or type the exact code.';}
    catch(error){if(current===operation)status.textContent=error?.name==='AbortError'?'Reading cancelled.':(error?.message||'Photo reading failed. Type the plate details instead.');}
    finally{if(current===operation)updateBusy(false);}
  }
  function findCandidates(){
    operation++;forgetConfirmation();clear(candidates);
    const result=identify(detected.input.value,records);status.textContent=result.message;
    if(result.conflict)paragraph(doc,candidates,'Multiple or unrecognised codes were found. Resolve the discrepancy against the actual data plate; nothing has been selected automatically.','help-notice');
    if(result.candidates.length>30){paragraph(doc,candidates,'Too many matching entries. Add the exact GC or product code to narrow the list.');return;}
    for(const candidate of result.candidates){
      const card=element(doc,'article',undefined,'help-candidate');paragraph(doc,card,identityLabel(candidate.record),'help-identity');paragraph(doc,card,candidate.reasons.join(' · '),'help-small');
      const label=element(doc,'label');const check=element(doc,'input');check.type='checkbox';label.append(check,doc.createTextNode(' I checked this exact entry against the data plate, fuel and fitted setup.'));
      const choose=button(doc,'Confirm this boiler',()=>confirm(candidate.record));choose.disabled=true;check.addEventListener('change',()=>{choose.disabled=!check.checked;});card.append(label,choose);candidates.append(card);
    }
  }
  async function confirm(record){
    const current=++operation;forgetConfirmation();const token=session.confirm(record);status.textContent='Opening this exact saved catalogue entry…';
    try{const row=await loadDetail(record.id);if(current!==operation||!session.valid(token))return;if(!identityEqual(row?.boiler,record))throw Error('The saved entry does not match. Return to the library and confirm the exact boiler.');selection=row;clear(candidates);paragraph(doc,confirmed,'Confirmed catalogue entry: '+identityLabel(record),'help-identity');paragraph(doc,confirmed,'This confirms your catalogue choice, not the installed appliance, serial applicability or safe working conditions.','help-notice');confirmed.append(button(doc,'Choose a different boiler',()=>{operation++;forgetConfirmation();findCandidates();}));questionBox.hidden=false;status.textContent='Choose a question topic below. No photo, text or answer is saved by this section.';}
    catch(error){if(current===operation){forgetConfirmation();status.textContent='The saved entry could not be opened. Reconnect or use the library search.';}}
  }
  async function answerQuestion(){
    const identity=session.confirmed();if(!identity||!selection)return;
    const current=++operation,token=session.token(),query=question.input.value;
    clear(answer);status.textContent='Finding this entry’s saved references…';
    try{const row=await loadDetail(identity.id);if(current!==operation||!session.valid(token))return;const result=retrieve(row,identity,query);renderAnswer(doc,answer,result,{onSection:section=>{
      if(!session.valid(token)||!identityEqual(session.confirmed(),identity))return;
      onSection(identity.id,section);
    }});status.textContent='Saved-guide lookup complete. Read the full conditions and source limits.';}
    catch(error){if(current===operation)status.textContent='The saved guide is unavailable. Reconnect or use the library search; no answer has been inferred.';}
  }
  const ready=Promise.resolve().then(loadCatalogue).then(value=>{records=Array.isArray(value)?value:[];if(!records.length)throw Error('empty');status.textContent='Choose a clear label photo, or type an exact GC/product code.';updateBusy(false);}).catch(()=>{status.textContent='The saved catalogue is unavailable. Reconnect and verify the library download.';read.disabled=true;find.disabled=true;});
  return {ready,reset:resetAll,cancel:cancelRead,dispose(){operation++;reader.cancel();file=null;detected.input.value='';forgetConfirmation();},
    // Elements are exposed for finite DOM tests, not persisted or sent anywhere.
    elements:{photo:photo.input,detected:detected.input,read,cancel,find,candidates,confirmed,question:question.input,ask,answer,status,questionBox}};
}
