import {MAX_TEXT,identify,identityLabel,identityEqual,retrieve,safeURL,createSession,SECTIONS,questionTopic} from './logic.mjs';
import {createAIClient,REFERENCE_QUESTIONS,canvasPhotoPayload} from './ai-client.mjs';
import {prepareImage} from './image.mjs';
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
export function mountHelp(root,{doc=root.ownerDocument,loadCatalogue,loadDetail,reader,onSection=()=>{},aiClient=createAIClient()}){
  const session=createSession();let records=[],file=null,operation=0,busy=false,selection=null,aiInFlight=false,aiState={connected:false,ready:false},pendingAIPhoto=null;
  const field=(tag,id,label)=>{const wrap=element(doc,'div');const l=element(doc,'label',label);l.htmlFor=id;const input=element(doc,tag);input.id=id;wrap.append(l,input);return {wrap,input};};
  const intro=element(doc,'div');intro.append(element(doc,'h1','Photo & boiler help'));
  paragraph(doc,intro,'Read a boiler label or type its GC/product number. On-device reading is free; AI is optional.');
  const tips=element(doc,'details');tips.append(element(doc,'summary','Photo tips and limits'));
  paragraph(doc,tips,'Read a clear data-plate photo on this device, or type its details. On-device reading uploads nothing. Optional AI sends only the photo or question you explicitly submit through Stag’s server to OpenAI. It does not establish a fitted part or a diagnosis.');
  paragraph(doc,tips,'A code match does not confirm fitted parts or authorise an order. Always check the actual data plate, fuel, generation and installed setup.','help-notice');
  paragraph(doc,tips,'Crop closely to the label, keep it upright and avoid glare. JPEG/PNG only, up to 12 MB and 24 megapixels. Retake or crop a large/unclear image. Photo reading needs an initial online reader download; its availability offline is not guaranteed.','help-small');
  intro.append(tips);
  const aiConnection=element(doc,'details');aiConnection.append(element(doc,'summary','Connect optional AI'));
  const aiStatus=element(doc,'p','AI is not connected on this device.','help-small');aiStatus.setAttribute('role','status');
  const pairCode=field('input','help-ai-pair-code','One-time phone connection code');pairCode.input.type='password';pairCode.input.autocomplete='off';pairCode.input.spellcheck=false;pairCode.input.maxLength=256;
  const pairButton=button(doc,'Connect this device',connectAI),disconnectButton=button(doc,'Disconnect AI',disconnectAI);disconnectButton.hidden=true;
  const aiCost=element(doc,'p','','help-small');
  paragraph(doc,aiConnection,'Use the phone code provided during private setup. Never enter an OpenAI API key in this app. The device connection is revocable and expires.');
  aiConnection.append(aiStatus,pairCode.wrap,pairButton,disconnectButton,aiCost);
  paragraph(doc,aiConnection,'AI sends submitted content to OpenAI through Stag’s server. Stag does not save questions, photos or answers. OpenAI’s API retention rules may apply. Do not include customer names, addresses or other private details.','help-small');
  link(doc,aiConnection,{url:'https://developers.openai.com/api/docs/guides/your-data',label:'OpenAI API data controls'});
  intro.append(aiConnection);

  const photo=field('input','help-photo','Choose or take a label photo');photo.input.type='file';photo.input.accept='image/jpeg,image/png';photo.input.setAttribute('capture','environment');
  const status=element(doc,'p','Loading the saved catalogue…','help-notice');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const controls=element(doc,'div',undefined,'help-actions');
  const read=button(doc,'Read label on this device',readPhoto),cancel=button(doc,'Cancel reading',cancelRead),reset=button(doc,'Clear photo and answers',resetAll);
  const aiRead=button(doc,'Read label with AI',prepareAIPhoto);
  cancel.hidden=true;read.disabled=true;aiRead.disabled=true;controls.append(read,aiRead,cancel,reset);
  const aiPhotoReview=element(doc,'div',undefined,'help-notice');aiPhotoReview.hidden=true;
  paragraph(doc,aiPhotoReview,'Send the selected, resized label photo to OpenAI through Stag’s server? Check that it contains no customer or personal information. A code transcript is not a verified part match.');
  aiPhotoReview.append(button(doc,'Send this label photo',sendAIPhoto),button(doc,'Cancel AI photo',discardAIPhoto));
  const detected=field('textarea','help-label-text','Label text — check and correct before matching');detected.input.maxLength=MAX_TEXT;detected.input.rows=5;detected.input.autocomplete='off';detected.input.spellcheck=false;
  const find=button(doc,'Find catalogue candidates',findCandidates);find.disabled=true;
  const candidates=element(doc,'div');candidates.setAttribute('aria-live','polite');
  const confirmed=element(doc,'div');
  const questionBox=element(doc,'section');questionBox.hidden=true;
  questionBox.append(element(doc,'h2','Find information in this boiler’s saved guide'));
  paragraph(doc,questionBox,'Search the confirmed boiler’s saved references, or ask AI to explain supported information. Adjustment and repair questions open the complete existing guide.');
  const question=field('input','help-question','What information do you need?');question.input.type='text';question.input.maxLength=240;question.input.autocomplete='off';
  const ask=button(doc,'Find saved information',answerQuestion),askAI=button(doc,'Ask AI about saved information',answerWithAI);askAI.disabled=true;question.input.maxLength=400;questionBox.append(question.wrap,ask,askAI);
  const answer=element(doc,'div');questionBox.append(answer);
  root.append(intro,photo.wrap,controls,aiPhotoReview,status,detected.wrap,find,candidates,confirmed,questionBox);
  function updateBusy(value){busy=!!(value||aiInFlight);updateAIButtons();question.input.disabled=busy;ask.disabled=busy;read.disabled=busy||!file||!records.length;find.disabled=busy||!records.length;cancel.hidden=!busy;cancel.textContent=aiInFlight?'Clear pending AI result':'Cancel reading';photo.input.disabled=busy;detected.input.disabled=busy;}
  function forgetConfirmation(){discardAIPhoto();session.invalidate();selection=null;questionBox.hidden=true;question.input.value='';clear(answer);clear(confirmed);}
  async function cancelRead(){operation++;forgetConfirmation();await reader.cancel();updateBusy(false);status.textContent=aiInFlight?'The displayed AI result is cleared. The request already sent may still use credit; wait for it to finish. No retry has been made.':'Reading cancelled. Choose another photo or type the plate details.';}
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
    try{const row=await loadDetail(record.id);if(current!==operation||!session.valid(token))return;if(!identityEqual(row?.boiler,record))throw Error('The saved entry does not match. Return to the library and confirm the exact boiler.');selection=row;clear(candidates);paragraph(doc,confirmed,'Confirmed catalogue entry: '+identityLabel(record),'help-identity');paragraph(doc,confirmed,'This confirms your catalogue choice, not the installed appliance, serial applicability or safe working conditions.','help-notice');confirmed.append(button(doc,'Choose a different boiler',()=>{operation++;forgetConfirmation();findCandidates();}));questionBox.hidden=false;updateAIButtons();status.textContent='Choose a question topic below. No photo, text or answer is saved by this section.';}
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
  function updateAIButtons(){aiRead.disabled=busy||!file||!records.length||!aiState.ready;askAI.disabled=busy||!selection||!aiState.ready;pairButton.disabled=busy;disconnectButton.disabled=busy;pairCode.input.disabled=busy;}
  function applyAIState(next){aiState=next||{connected:false,ready:false};disconnectButton.hidden=!aiState.connected;pairCode.wrap.hidden=!!aiState.connected;pairButton.hidden=!!aiState.connected;
    aiStatus.textContent=!aiState.connected?'AI is not connected on this device.':aiState.ready?'AI is connected. Check all answers against the complete saved references.':'This device is connected, but the AI service is not ready. Use the saved guide.';
    const used=aiState.budget?.upper_accounted_micro_usd,cap=aiState.budget?.cap_micro_usd;aiCost.textContent=Number.isSafeInteger(used)&&Number.isSafeInteger(cap)?'Trial usage counter: US$'+(used/1000000).toFixed(4)+' of US$'+(cap/1000000).toFixed(2)+'. This is conservative accounting, not an invoice.':'';updateAIButtons();}
  async function syncAI(){try{applyAIState(await aiClient.status());}catch(error){applyAIState({connected:aiClient.hasSession(),ready:false});aiStatus.textContent=error.message;}}
  async function connectAI(){if(busy)return;const code=pairCode.input.value;pairCode.input.value='';pairButton.disabled=true;try{await aiClient.pair(code);await syncAI();}catch(error){aiStatus.textContent=error.message;}finally{pairCode.input.value='';updateAIButtons();}}
  async function disconnectAI(){if(busy)return;try{await aiClient.disconnect();}catch{}finally{applyAIState({connected:false,ready:false});discardAIPhoto();}}
  function discardAIPhoto(){pendingAIPhoto=null;aiPhotoReview.hidden=true;}
  async function prepareAIPhoto(){
    if(busy||!file||!aiState.ready)return;
    const chosen=file,current=++operation;forgetConfirmation();clear(candidates);detected.input.value='';updateBusy(true);status.textContent='Preparing this label photo on your device. Nothing has been sent yet.';
    try{const canvas=await prepareImage(chosen,{doc});let payload;try{payload=await canvasPhotoPayload(canvas);}finally{canvas.width=canvas.height=1;}
      if(current!==operation||chosen!==file)return;pendingAIPhoto={chosen,current,payload};aiPhotoReview.hidden=false;status.textContent='Photo prepared. Review the notice, then choose Send this label photo.';
    }catch(error){if(current===operation)status.textContent=error.message;}finally{if(current===operation)updateBusy(false);}
  }
  async function sendAIPhoto(){
    const pending=pendingAIPhoto;if(busy||!pending||pending.current!==operation||pending.chosen!==file||!aiState.ready)return;
    discardAIPhoto();aiInFlight=true;updateBusy(true);status.textContent='AI is reading the submitted label. Clearing this screen does not cancel a request already sent.';
    try{const reply=await aiClient.photo(pending.payload);if(pending.current!==operation||pending.chosen!==file)return;
      detected.input.value=reply.visible_identifiers.join('\n');status.textContent=reply.visible_identifiers.length?'Check every AI-read code against the original label, then find candidates and confirm the exact entry.':'No supported identifier was read. Retake a closer photo or type the exact code.';
      if(reply.uncertain)status.textContent+=' The transcript is uncertain; do not accept guessed characters.';
    }catch(error){if(pending.current===operation)status.textContent=error.message;}finally{aiInFlight=false;updateBusy(false);await syncAI();}
  }
  async function answerWithAI(){
    const identity=session.confirmed();if(busy||!identity||!selection||!aiState.ready||!question.input.value.trim())return;
    if(questionTopic(question.input.value)?.routeOnly){await answerQuestion();return;}
    const current=++operation,token=session.token(),query=question.input.value;clear(answer);aiInFlight=true;updateBusy(true);status.textContent='AI is checking this entry’s saved references…';
    try{const reply=await aiClient.ask(identity.id,query);if(current!==operation||!session.valid(token)||query!==question.input.value)return;
      const row=await loadDetail(identity.id);if(current!==operation||!session.valid(token)||!identityEqual(row?.boiler,identity))return;
      const result=retrieve(row,identity,REFERENCE_QUESTIONS[reply.reference_key]);renderAnswer(doc,answer,result,{onSection:section=>{if(session.valid(token)&&identityEqual(session.confirmed(),identity))onSection(identity.id,section);}});
      if(reply.kind==='generated'&&result.kind==='references'&&reply.answer_text){const explanation=element(doc,'article',undefined,'help-reference');explanation.append(element(doc,'h2','AI explanation — check the saved reference'));paragraph(doc,explanation,reply.answer_text);answer.prepend(explanation);}
      status.textContent='Read the complete saved conditions and sources below. AI wording does not confirm fit, a measurement or completed work.';
    }catch(error){if(current===operation)status.textContent=error.message;}finally{aiInFlight=false;updateBusy(false);await syncAI();}
  }
  const ready=Promise.resolve().then(loadCatalogue).then(value=>{records=Array.isArray(value)?value:[];if(!records.length)throw Error('empty');status.textContent='Choose a clear label photo, or type an exact GC/product code.';updateBusy(false);syncAI();}).catch(()=>{status.textContent='The saved catalogue is unavailable. Reconnect and verify the library download.';read.disabled=true;find.disabled=true;});
  return {ready,reset:resetAll,cancel:cancelRead,dispose(){operation++;reader.cancel();file=null;detected.input.value='';forgetConfirmation();},
    // Elements are exposed for finite DOM tests, not persisted or sent anywhere.
    elements:{photo:photo.input,detected:detected.input,read,cancel,find,candidates,confirmed,question:question.input,ask,answer,status,questionBox}};
}
