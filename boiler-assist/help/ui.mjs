import {faultAnswer} from './fault-answer.mjs';
import {MAX_TEXT,identify,identityLabel,identityEqual,retrieve,safeURL,createSession,SECTIONS,questionTopic} from './logic.mjs';
import {createAIClient,REFERENCE_QUESTIONS,canvasPhotoPayload} from './ai-client.mjs';
import {prepareImage} from './image.mjs';
import {manualCandidates} from './manual-search.mjs';
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
// Display-only estimate: ECB 22 October 2026, GBP0.83770 / USD1.1205 per EUR.
// The authoritative pilot ledger and cap stay in micro-USD on the server.
export function pilotUsageText(state){
  const used=state?.budget?.upper_accounted_micro_usd,cap=state?.budget?.cap_micro_usd;
  if(!Number.isSafeInteger(used)||used<0||!Number.isSafeInteger(cap)||cap<=0)return state?.connected?'AI usage is unavailable. Reconnect and refresh; no balance is assumed.':'Connect AI on this device to see the pilot allowance.';
  const gbp=n=>'£'+(n/1000000*(0.83770/1.1205)).toFixed(4);
  return 'Estimated used: '+gbp(used)+' · Pilot allowance left: '+gbp(Math.max(0,cap-used))+' · Pilot limit: '+gbp(cap)+'.';
}
export function aiReadinessMessage(state){
  if(state?.ready)return '';
  const error=typeof state?.unavailableMessage==='string'?state.unavailableMessage:'';
  if(/different versions/.test(error))return 'Update Boiler Assist from Menu: this app and the AI service have different library versions. No photo has been sent.';
  if(/expired/.test(error))return 'This AI connection has expired. Reconnect in Help & AI settings. No photo has been sent.';
  if(error)return 'The AI connection could not be checked. Tap Check AI connection, or enter the code below. No photo has been sent.';
  if(!state?.connected)return 'AI is not connected on this device. Open Help & AI settings to connect, or enter the code below. No photo has been sent.';
  const b=state?.budget;
  if(b?.pilot?.active===false)return 'The AI trial is paused or has expired. You can still enter the code and use the saved library. No photo has been sent.';
  if(b?.halt_reason)return 'AI is paused after a request that needs review. Do not resend it; you can still enter the code below.';
  if(Number.isSafeInteger(b?.pending)&&b.pending>0)return 'An AI request is still being checked. Please wait; no second photo has been sent.';
  if(Number.isSafeInteger(b?.attempts)&&Number.isSafeInteger(b?.max_attempts)&&b.max_attempts>0&&b.attempts>=b.max_attempts)return 'The AI trial request limit has been reached ('+b.attempts+' of '+b.max_attempts+'). This is separate from account credit. You can still enter the code below; no photo has been sent.';
  if(b?.allowed===false)return 'The AI trial allowance is paused. You can still enter the code and use the saved library. No photo has been sent.';
  return 'AI is not ready. Tap Check AI connection, or enter the code below. No photo has been sent.';
}
export function mountHelp(root,{doc=root.ownerDocument,loadCatalogue,loadDetail,reader,onSection=()=>{},aiClient=createAIClient()}){
  let activeFault=null;const session=createSession();let records=[],file=null,operation=0,busy=false,selection=null,aiInFlight=false,aiState={connected:false,ready:false},pendingAIPhoto=null;
  const field=(tag,id,label)=>{const wrap=element(doc,'div');const l=element(doc,'label',label);l.htmlFor=id;const input=element(doc,tag);input.id=id;wrap.append(l,input);return {wrap,input};};
  const intro=element(doc,'div');intro.append(element(doc,'h1','Identify a boiler'));
  paragraph(doc,intro,'Search by make, model or GC number, or use a label photo.');
  const tips=element(doc,'details');tips.append(element(doc,'summary','Photo tips and limits'));
  paragraph(doc,tips,'Read a clear data-plate photo on this device, or type its details. On-device reading uploads nothing. Optional AI sends only the photo or question you explicitly submit through Stag’s server to OpenAI. It does not establish a fitted part or a diagnosis.');
  paragraph(doc,tips,'A code match does not confirm fitted parts or authorise an order. Always check the actual data plate, fuel, generation and installed setup.','help-notice');
  paragraph(doc,tips,'Crop closely to the label, keep it upright and avoid glare. JPEG/PNG only, up to 12 MB and 25 megapixels. Retake or crop a large/unclear image. Photo reading needs an initial online reader download; its availability offline is not guaranteed.','help-small');

  const aiConnection=element(doc,'details');aiConnection.append(element(doc,'summary','Connect optional AI'));
  const aiStatus=element(doc,'p','AI is not connected on this device.','help-small');aiStatus.setAttribute('role','status');
  const pairCode=field('input','help-ai-pair-code','One-time phone connection code');pairCode.input.type='password';pairCode.input.autocomplete='off';pairCode.input.spellcheck=false;pairCode.input.maxLength=256;
  const pairButton=button(doc,'Connect this device',connectAI),disconnectButton=button(doc,'Disconnect AI',disconnectAI);disconnectButton.hidden=true;
  const aiCost=element(doc,'p','','help-small');
  paragraph(doc,aiConnection,'Use the phone code provided during private setup. Never enter an OpenAI API key in this app. The device connection is revocable and expires.');
  aiConnection.append(aiStatus,pairCode.wrap,pairButton,disconnectButton,aiCost);
  paragraph(doc,aiConnection,'AI sends submitted content to OpenAI through Stag’s server. Stag does not save questions, photos or answers. OpenAI’s API retention rules may apply. Do not include customer names, addresses or other private details.','help-small');
  link(doc,aiConnection,{url:'https://developers.openai.com/api/docs/guides/your-data',label:'OpenAI API data controls'});
  const settings=element(doc,'details');settings.append(element(doc,'summary','Help & AI settings'),tips,aiConnection);

  const photo=field('input','help-photo','Choose or take a label photo');photo.input.type='file';photo.input.accept='image/jpeg,image/png';
  const status=element(doc,'p','Loading the saved catalogue…','help-notice');status.hidden=true;status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const controls=element(doc,'div',undefined,'help-actions');
  const read=button(doc,'Read label on this device',readPhoto),cancel=button(doc,'Cancel reading',cancelRead),reset=button(doc,'Clear photo and answers',resetAll);
  const aiRead=button(doc,'Send photo to AI',prepareAIPhoto);
  const changePhoto=button(doc,'Change photo',()=>photo.input.click());changePhoto.hidden=true;
  const freeReading=element(doc,'details');freeReading.append(element(doc,'summary','Free photo reading'),read);
  paragraph(doc,freeReading,'Reads text on this device without sending the photo to OpenAI. It may miss text that AI can read.');settings.append(freeReading);
  cancel.hidden=true;read.disabled=true;aiRead.disabled=true;controls.append(aiRead,changePhoto,cancel,reset);
  const aiPhotoNotice=element(doc,'p','Send photo to AI sends the selected label photo to OpenAI through Stag’s server and uses API credit. Leave out customer or personal details.','help-small');
  const aiAvailability=element(doc,'p','','help-notice');aiAvailability.setAttribute('role','status');aiAvailability.hidden=true;
  const refreshAI=button(doc,'Check AI connection',async()=>{if(busy)return;refreshAI.disabled=true;await syncAI();if(file&&!busy){status.hidden=!aiState.ready;status.textContent=aiState.ready?'AI is ready. Tap Send photo to AI, or enter the code below.':'';}refreshAI.disabled=false;});refreshAI.hidden=true;
  const detected=field('textarea','help-label-text','GC/product code or label text');detected.input.maxLength=MAX_TEXT;detected.input.rows=2;detected.input.autocomplete='off';detected.input.spellcheck=false;
  const find=button(doc,'Find boiler',findCandidates);find.disabled=true;
  const manual=field('input','help-manual-search','Make, model or GC number');manual.input.type='search';manual.input.maxLength=240;manual.input.autocomplete='off';manual.input.placeholder='e.g. Worcester 24Ri or 41-311-65';
  const manualSearch=button(doc,'Search boilers',searchManually);manualSearch.disabled=true;
  const manualBox=element(doc,'section');manualBox.setAttribute('aria-label','Search without a photo');manualBox.append(manual.wrap,manualSearch);
  const textDetails=element(doc,'details');textDetails.append(element(doc,'summary','Enter or correct label text'),detected.wrap,find);
  const candidates=element(doc,'div');candidates.setAttribute('aria-live','polite');
  const confirmed=element(doc,'div');confirmed.setAttribute('aria-live','polite');
  const questionBox=element(doc,'section');questionBox.hidden=true;
  questionBox.append(element(doc,'h2','What do you need?'));
  paragraph(doc,questionBox,'Ask a question or open a section below. Service and FGA questions go straight to the full guide.');
  const question=field('input','help-question','Type or dictate a question');question.input.type='text';question.input.maxLength=240;question.input.autocomplete='off';
  const ask=button(doc,'Search guide',submitQuestion);question.input.maxLength=400;questionBox.append(question.wrap,ask);
  paragraph(doc,questionBox,'To speak, tap the question box, then the microphone on your iPhone keyboard. Check the words before sending.','help-small');
  const shortcuts=element(doc,'div',undefined,'help-actions');for(const [label,section]of [['FGA readings','combustion'],['Service procedure','fullService'],['Technical data','technicalData'],['Manual','manuals']])shortcuts.append(button(doc,label,()=>{const id=session.confirmed()?.id;if(id&&selection&&!busy)onSection(id,section);}));questionBox.append(shortcuts);
  const answer=element(doc,'div');questionBox.append(answer);
  const intake=element(doc,'section');intake.append(manualBox,candidates,photo.wrap,aiPhotoNotice,aiAvailability,refreshAI,controls,textDetails);
  root.append(intro,status,intake,confirmed,questionBox,settings);
  function updateBusy(value){busy=!!(value||aiInFlight);updateAIButtons();question.input.disabled=busy;ask.disabled=busy;read.disabled=busy||!file||!records.length;find.disabled=busy||!records.length;manual.input.disabled=busy;manualSearch.disabled=busy||!records.length;for(const control of shortcuts.querySelectorAll('button'))control.disabled=busy;cancel.hidden=!busy;cancel.textContent=aiInFlight?'Clear pending AI result':'Cancel reading';photo.input.disabled=busy;changePhoto.disabled=busy;changePhoto.hidden=!file;detected.input.disabled=busy;}
  function forgetConfirmation(){intro.querySelector('h1').textContent='Identify a boiler';intro.querySelector('p').textContent='Search by make, model or GC number, or use a label photo.';activeFault=null;discardAIPhoto();session.invalidate();selection=null;questionBox.hidden=true;intake.hidden=false;status.hidden=false;tips.hidden=false;aiConnection.hidden=false;question.input.value='';clear(answer);clear(confirmed);}
  async function cancelRead(){operation++;forgetConfirmation();await reader.cancel();updateBusy(false);status.textContent=aiInFlight?'The displayed AI result is cleared. The request already sent may still use credit; wait for it to finish. No retry has been made.':'Reading cancelled. Choose another photo or type the plate details.';}
  function resetAll(){operation++;reader.cancel();file=null;photo.input.value='';detected.input.value='';manual.input.value='';clear(candidates);forgetConfirmation();updateBusy(false);status.textContent='Photo, detected text and answers cleared from this screen.';}
  photo.input.addEventListener('click',()=>{if(busy)return;resetAll();status.textContent='Choose a label photo. If you cancel, no photo will remain selected.';});
  photo.input.addEventListener('cancel',()=>{if(!file)status.textContent='No photo selected. Choose a photo to try again.';});
  photo.input.addEventListener('change',()=>{operation++;reader.cancel();file=photo.input.files?.[0]||null;detected.input.value='';clear(candidates);forgetConfirmation();updateBusy(false);status.hidden=!!file&&!aiState.ready;status.textContent=file?'Photo selected. Tap Send photo to AI, or enter the code below.':'Choose a label photo or type its details.';});
  detected.input.addEventListener('input',()=>{operation++;forgetConfirmation();clear(candidates);status.textContent='Text changed. Find candidates and confirm the exact entry again.';});
  manual.input.addEventListener('input',()=>{operation++;forgetConfirmation();clear(candidates);status.textContent='Search changed. Choose the exact boiler again.';});
  manual.input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();searchManually();}});
  question.input.addEventListener('input',()=>{operation++;clear(answer);});
  question.input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();submitQuestion();}});
  async function readPhoto(){
    if(busy||!file)return;
    const current=++operation;forgetConfirmation();clear(candidates);detected.input.value='';updateBusy(true);
    try{const text=await reader.read(file,{onStatus:message=>{if(current===operation)status.textContent=message;}});if(current!==operation)return;detected.input.value=text.slice(0,MAX_TEXT);updateBusy(false);if(text.trim()){const matched=findCandidates();textDetails.open=!matched;if(!matched)status.textContent='The free reader did not find a boiler match. Try Send photo to AI, or check and correct the code below.';}else{ textDetails.open=true;status.textContent='The free reader could not read this label. Try Send photo to AI, or enter the exact code below.';}}
    catch(error){if(current===operation)status.textContent=error?.name==='AbortError'?'Reading cancelled.':(error?.message||'Photo reading failed. Type the plate details instead.');}
    finally{if(current===operation)updateBusy(false);}
  }
  function searchManually(){if(busy||!records.length)return;detected.input.value=manual.input.value;showCandidates(manualCandidates(manual.input.value,records));}
  function findCandidates(){return showCandidates(identify(detected.input.value,records));}
  function showCandidates(result){
    operation++;forgetConfirmation();clear(candidates);
    status.textContent=result.message;
    const exact=result.candidates.filter(candidate=>candidate.exactCode);
    if(exact.length===1&&exact[0].reasons.includes('Exact GC digits')&&exact[0].reasons.includes('Exact product code'))status.textContent='GC and product code match the catalogue entry below. Check the model and fuel, then choose Use this boiler.';
    if(exact.length>1)paragraph(doc,candidates,'More than one catalogue entry matches the read codes. Compare the model, GC/product code and fuel before choosing. Nothing has been selected automatically.','help-notice');
    if(result.unmatchedGc.length)paragraph(doc,candidates,exact.length?'Other number sequences were read as possible GC codes but did not match the catalogue. Check the label text before choosing.':'The read code is shown above and in the label text below. Check it against the sticker. If it is correct, the model needs adding to the catalogue; no boiler has been substituted.',exact.length?'help-small':'help-notice');
    if(result.candidates.length>30)paragraph(doc,candidates,'Showing the first 30 of '+result.candidates.length+' matches. Add the model, output or GC number to narrow the list.','help-notice');
    for(const candidate of result.candidates.slice(0,30)){
      const card=element(doc,'article',undefined,'help-candidate');paragraph(doc,card,identityLabel(candidate.record),'help-identity');paragraph(doc,card,candidate.reasons.join(' · '),'help-small');
      paragraph(doc,card,'Check the model, code and fuel against the label before continuing.','help-small');
      const choose=button(doc,'Use this boiler',()=>confirm(candidate.record));card.append(choose);candidates.append(card);
    }
    if(result.candidates.length)candidates.scrollIntoView({block:'start'});
    return result.candidates.length>0;
  }
  async function confirm(record){
    const current=++operation;forgetConfirmation();const token=session.confirm(record);status.textContent='Opening this exact saved catalogue entry…';
    try{const row=await loadDetail(record.id);if(current!==operation||!session.valid(token))return;if(!identityEqual(row?.boiler,record))throw Error('The saved entry does not match. Return to the library and confirm the exact boiler.');selection=row;intro.querySelector('h1').textContent='Boiler questions';intro.querySelector('p').textContent='Ask about the boiler shown below.';clear(candidates);paragraph(doc,confirmed,identityLabel(record),'help-identity');paragraph(doc,confirmed,'Check the fitted configuration and source conditions in the guide before using any setting.','help-small');confirmed.append(button(doc,'Change boiler',()=>{operation++;forgetConfirmation();findCandidates();}));intake.hidden=true;status.hidden=true;settings.open=false;questionBox.hidden=false;updateAIButtons();root.closest('#help-root')?.scrollTo({top:0});}
    catch(error){if(current===operation){forgetConfirmation();status.textContent='The saved entry could not be opened. Reconnect or use the library search.';}}
  }
  function isFaultQuestion(value){return selection?.boiler?.faultCodes?.some(f=>f.label?.trim().toLowerCase()===value.trim().toLowerCase())||/\b(fault|error|lockout|code|overheat)\b/i.test(value)||/\b[A-Za-z]{1,2}[. -]?\d{1,4}\b/.test(value)||!!activeFault&&/^(what (next|now|else|should i check)|next|checked|done|still)/i.test(value);}
  async function submitQuestion(){if(busy||!selection||!question.input.value.trim())return;if(isFaultQuestion(question.input.value))return answerQuestion();activeFault=null;if(aiState.ready)return answerWithAI();return answerQuestion();}
  function renderFault(result,identity,token){
    clear(answer);paragraph(doc,answer,result.message,'help-notice');activeFault=result.activeLabel;if(result.applicability||result.notes?.length||result.completePresentation){const limits=element(doc,'details');limits.append(element(doc,'summary','Saved applicability and source limits'));renderStored(doc,limits,{applicability:result.applicability,notes:result.notes,presentation:result.completePresentation});answer.append(limits);}
    for(const e of result.entries){const card=element(doc,'article',undefined,'help-reference');card.append(element(doc,'h2',e.label));paragraph(doc,card,e.codeKind==='status'?'Operating status — this is not a fault diagnosis.':e.codeKind==='diagnostic'?'Diagnostic information — this is not a confirmed component failure.':'Meaning and manufacturer checks');paragraph(doc,card,e.text);renderStored(doc,card,e.conditions);for(const source of e.sources)link(doc,card,{...source,label:source.title});answer.append(card);}
    if(!result.entries.length)for(const wording of result.availableLabels){answer.append(button(doc,wording,()=>{question.input.value=wording;answerQuestion();}));}
    answer.append(button(doc,'Open complete fault guide',()=>{if(session.valid(token)&&identityEqual(session.confirmed(),identity))onSection(identity.id,'faultCodes');}));
    for(const source of result.links)link(doc,answer,{...source,label:source.title});
  }
  async function answerQuestion(){
    const identity=session.confirmed();if(!identity||!selection)return;
    const current=++operation,token=session.token(),query=question.input.value;
    clear(answer);status.hidden=false;status.textContent='Finding this entry’s saved references…';
    try{const row=await loadDetail(identity.id);if(current!==operation||!session.valid(token)||query!==question.input.value)return;if(isFaultQuestion(query)){const fault=faultAnswer(row,identity.id,query,activeFault);renderFault(fault,identity,token);status.textContent='Fault guide for this selected boiler. No paid AI request or part order was made.';return;}const result=retrieve(row,identity,query);if(result.kind==='section'&&result.section){onSection(identity.id,result.section);return;}renderAnswer(doc,answer,result,{onSection:section=>{
      if(!session.valid(token)||!identityEqual(session.confirmed(),identity))return;
      onSection(identity.id,section);
    }});status.textContent='Saved-guide lookup complete. Read the full conditions and source limits.';}
    catch(error){if(current===operation)status.textContent='The saved guide is unavailable. Reconnect or use the library search; no answer has been inferred.';}
  }
  function updateAIButtons(){aiRead.disabled=busy||!file||!records.length||!aiState.ready;ask.disabled=busy||!selection;ask.textContent=aiState.ready?'Ask AI':'Search guide';pairButton.disabled=busy;disconnectButton.disabled=busy;pairCode.input.disabled=busy;aiAvailability.hidden=!file||!!aiState.ready;aiAvailability.textContent=aiReadinessMessage(aiState);refreshAI.hidden=!file||!!aiState.ready;refreshAI.disabled=busy;}
  function applyAIState(next){aiState=next||{connected:false,ready:false};disconnectButton.hidden=!aiState.connected;pairCode.wrap.hidden=!!aiState.connected;pairButton.hidden=!!aiState.connected;
    aiStatus.textContent=!aiState.connected?'AI is not connected on this device.':aiState.ready?'AI is connected. Check all answers against the complete saved references.':'This device is connected, but the AI service is not ready. Use the saved guide.';
    aiCost.textContent=pilotUsageText(aiState)+' Conservative pilot counter, not your OpenAI account balance or invoice. GBP estimate uses the fixed ECB rate from 22 October 2026; payment-provider conversion and fees may differ. The original US$1 cap is unchanged.';updateAIButtons();}
  async function syncAI(){try{applyAIState(await aiClient.status());}catch(error){applyAIState({connected:aiClient.hasSession(),ready:false,unavailableMessage:error.message});aiStatus.textContent=error.message;}}
  async function connectAI(){if(busy)return;const code=pairCode.input.value;pairCode.input.value='';pairButton.disabled=true;try{await aiClient.pair(code);await syncAI();}catch(error){aiStatus.textContent=error.message;}finally{pairCode.input.value='';updateAIButtons();}}
  async function disconnectAI(){if(busy)return;try{await aiClient.disconnect();}catch{}finally{applyAIState({connected:false,ready:false});discardAIPhoto();}}
  function discardAIPhoto(){pendingAIPhoto=null;}
  async function prepareAIPhoto(){
    if(busy||!file||!aiState.ready)return;
    const chosen=file,current=++operation;forgetConfirmation();clear(candidates);detected.input.value='';updateBusy(true);status.textContent='Preparing this label photo on your device. Nothing has been sent yet.';
    try{const canvas=await prepareImage(chosen,{doc});let payload;try{payload=await canvasPhotoPayload(canvas);}finally{canvas.width=canvas.height=1;}
      if(current!==operation||chosen!==file)return;pendingAIPhoto={chosen,current,payload};updateBusy(false);await sendAIPhoto();
    }catch(error){if(current===operation)status.textContent=error.message;}finally{if(current===operation)updateBusy(false);}
  }
  async function sendAIPhoto(){
    const pending=pendingAIPhoto;if(busy||!pending||pending.current!==operation||pending.chosen!==file||!aiState.ready)return;
    discardAIPhoto();aiInFlight=true;updateBusy(true);status.textContent='AI is reading the submitted label. Clearing this screen does not cancel a request already sent.';
    try{const reply=await aiClient.photo(pending.payload);if(pending.current!==operation||pending.chosen!==file)return;
      detected.input.value=reply.visible_identifiers.join('\n');if(reply.visible_identifiers.length){textDetails.open=!findCandidates();}else status.textContent='No supported identifier was read. Retake a closer photo or type the exact code.';
      if(reply.uncertain){status.textContent+=' AI text is uncertain: check the original label; do not accept guessed characters.';textDetails.open=true;}
    }catch(error){if(pending.current===operation)status.textContent=error.message;}finally{aiInFlight=false;updateBusy(false);await syncAI();}
  }
  async function answerWithAI(){
    const identity=session.confirmed();if(busy||!identity||!selection||!aiState.ready||!question.input.value.trim())return;
    if(questionTopic(question.input.value)?.routeOnly){await answerQuestion();return;}
    const current=++operation,token=session.token(),query=question.input.value;clear(answer);status.hidden=false;aiInFlight=true;updateBusy(true);status.textContent='AI is checking this entry’s saved references…';
    try{const reply=await aiClient.ask(identity.id,query);if(current!==operation||!session.valid(token)||query!==question.input.value)return;
      const row=await loadDetail(identity.id);if(current!==operation||!session.valid(token)||!identityEqual(row?.boiler,identity))return;
      const result=retrieve(row,identity,REFERENCE_QUESTIONS[reply.reference_key]);renderAnswer(doc,answer,result,{onSection:section=>{if(session.valid(token)&&identityEqual(session.confirmed(),identity))onSection(identity.id,section);}});
      if(reply.kind==='generated'&&result.kind==='references'&&reply.answer_text){const explanation=element(doc,'article',undefined,'help-reference');explanation.append(element(doc,'h2','AI explanation — check the saved reference'));paragraph(doc,explanation,reply.answer_text);answer.prepend(explanation);}
      status.textContent='Read the complete saved conditions and sources below. AI wording does not confirm fit, a measurement or completed work.';
    }catch(error){if(current===operation)status.textContent=error.message;}finally{aiInFlight=false;updateBusy(false);await syncAI();}
  }
  const ready=Promise.resolve().then(loadCatalogue).then(value=>{records=Array.isArray(value)?value:[];if(!records.length)throw Error('empty');status.textContent='Choose a clear label photo, or type an exact GC/product code.';updateBusy(false);syncAI();}).catch(()=>{status.hidden=false;status.textContent='The saved catalogue is unavailable. Reconnect and verify the library download.';read.disabled=true;find.disabled=true;});
  function suspendForGuide(){activeFault=null;operation++;reader.cancel();file=null;photo.input.value='';detected.input.value='';manual.input.value='';clear(candidates);discardAIPhoto();clear(answer);question.input.value='';updateBusy(false);}
  function returnToQuestions(){if(!selection||!identityEqual(session.confirmed(),selection.boiler))return false;clear(answer);question.input.value='';intake.hidden=true;questionBox.hidden=false;status.hidden=true;settings.open=false;root.closest('#help-root')?.scrollTo({top:0});return true;}
  return {ready,useSelectedRecord:async (record,query='')=>{await ready;resetAll();await confirm(record);if(query&&selection){question.input.value=query;await answerQuestion();}},reset:resetAll,cancel:cancelRead,suspendForGuide,returnToQuestions,dispose(){operation++;reader.cancel();file=null;detected.input.value='';forgetConfirmation();},
    // Elements are exposed for finite DOM tests, not persisted or sent anywhere.
    elements:{photo:photo.input,manual:manual.input,manualSearch,detected:detected.input,read,cancel,find,candidates,confirmed,question:question.input,ask,answer,status,questionBox}};
}
