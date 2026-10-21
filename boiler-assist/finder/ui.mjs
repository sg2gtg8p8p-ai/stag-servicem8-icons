import {SOURCE_DATA} from './source-data.mjs';
import {createSurveyStore,surveySummary,chRatingLines,dhwRatingLine} from './assessment.mjs';
const uiMounts=new WeakMap();

// Number controls can expose an empty value while their visible edit is invalid.
// Preserve that distinction; an unfinished/invalid edit is not an unknown reading.
export function controlInputValue(control){return control?.validity?.badInput?'__invalid_number__':control.value;}

// Called only by the user's Copy button. No background clipboard work.
export async function copyCurrentSurvey(store,clipboard){
 let prepared;try{prepared=store.prepareCopy();}catch(error){return{copied:false,stale:true,text:'',message:error.message};}
 try{
  if(!clipboard?.writeText)throw Error('Clipboard unavailable');
  await clipboard.writeText(prepared.text);
  if(!store.isCurrentCopy(prepared.revision))return{copied:false,stale:true,text:'',message:'Inputs changed during copy. An earlier summary may be on the clipboard; review the survey again.'};
  return{copied:true,stale:false,text:'',message:'Current provisional survey copied.'};
 }catch{
  if(!store.isCurrentCopy(prepared.revision))return{copied:false,stale:true,text:'',message:'Inputs changed. Review again before copying.'};
  return{copied:false,stale:false,text:prepared.text,message:'Copy was unavailable. Use the selectable summary below.'};
 }
}
export function mount(root,doc=root?.ownerDocument,data=SOURCE_DATA){
 if(!root||!doc)throw Error('Finder root unavailable');if(uiMounts.has(root))return uiMounts.get(root);
 const get=id=>root.querySelector('#baf-'+id),store=createSurveyStore(data),form=get('survey');let stage=0;
 const stages=[...root.querySelectorAll('[data-baf-stage]')],choiceButtons=[...root.querySelectorAll('[data-baf-choice]')],controls=[...form.querySelectorAll('input[name],select[name],textarea[name]')];
 const make=(tag,text,cls)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls.split(/\s+/).filter(Boolean).map(c=>'baf-'+c).join(' ');return n;};
 const list=items=>{const ul=make('ul');for(const text of items)ul.append(make('li',text));return ul;};
 const status=text=>{get('status').textContent=text??'';};
 function link(source,label){const a=make('a',label);a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';return a;}
 function details(title,items){const d=make('details');d.append(make('summary',title),list(items));return d;}
 function renderAssessment(a){
  const box=get('assessmentArea');box.replaceChildren();const card=make('article',undefined,'card');card.append(make('span',a.state==='evidence-missing'?'Evidence missing':'Provisional only','badge '+a.state),make('h3',a.type.label),...a.type.notes.map(x=>make('p',x)));
  card.append(make('h4','Central heating'),make('p',a.requiredCH.kw===null?'Demand not known. No kW is inferred from the room counts.':a.requiredCH.kw+' kW stated; '+(a.usableCH?'verify the declared load and water-temperature basis.':'the demand basis still needs verification.')));
  card.append(make('h4','Hot water'),make('p',a.requiredDHW.flowLMin===null?'Required simultaneous flow not known.':a.requiredDHW.flowLMin+' L/min at '+(a.requiredDHW.riseK===null?'an unknown temperature rise':a.requiredDHW.riseK+' K rise')+'.'));
  if(a.missing.length)card.append(details('Measurements & evidence still needed ('+a.missing.length+')',a.missing));
  card.append(details('Sizing notes',a.notes));box.append(card);
 }
 function renderModels(result){
  const box=get('modelsArea');box.replaceChildren();if(result.gap)box.append(make('p',result.gap,'notice'));
  if(result.models.length)box.append(make('p','Capacity comparison only. Full-flow supply, exact design basis and installation fit remain unverified.','hint'));
  for(const m of result.models){
   const meanOnly=m.chKW.comparisonPolicy==='source-mean-temperatures-only';
   const card=make('article',undefined,'card');card.append(make('span',m.state==='excluded'?'Excluded for these inputs':m.state==='evidence-missing'?(m.sourceURL?'Size checks needed':'Source checks needed'):'Provisional candidate','badge '+m.state),make('h3',m.manufacturer+' '+m.model),make('p','Product '+m.productCode+' · Natural gas combi','hint'));
   const ch=make('p',undefined,'rating');ch.append(make('strong','Central heating'));for(const line of chRatingLines(m)){ch.append(make('span',line),make('br'));}card.append(ch);
   const dhw=make('p',undefined,'rating');dhw.append(make('strong','Domestic hot water'),make('span',dhwRatingLine(m)));card.append(dhw);
   if(meanOnly)card.append(make('p',m.shared.minimumPressureMeaning,'hint'));
   if(m.reasons.length)card.append(list(m.reasons));
   if(m.cautions.length)card.append(details('Comparison qualifications',m.cautions));
   if(m.state==='evidence-missing'&&m.evidenceMissing?.length)card.append(details('Input evidence missing',m.evidenceMissing));
   card.append(details('Supply, source & installation checks',m.requiredChecks));
   const sourceDetails=make('details');sourceDetails.append(make('summary','Manufacturer data'),make('p','Body '+m.shared.dimensionMM.height+' × '+m.shared.dimensionMM.width+' × '+m.shared.dimensionMM.depth+' mm; clearances and fit are separate.'));
   if(meanOnly){
    sourceDetails.append(make('p','Minimum DHW delivery: '+m.shared.minimumDhwFlowLMin+' L/min only. No unconditional operating dynamic pressure or full-flow dynamic/static threshold is established.'),make('p',m.chKW.waterTemperatures),make('p','Ideal listing observed 21 October 2026. Ratings: own manual 11/2025 UIN 237660 A05. Manufacturer product codes: 2025 RevF brochure.'));
   }else{
   if(m.shared.minimumDhwOperatingPressureBar!==null&&m.shared.minimumDhwFlowLMin!==null)sourceDetails.append(make('p','Minimum operation: '+m.shared.minimumDhwOperatingPressureBar+' bar and '+m.shared.minimumDhwFlowLMin+' L/min. These do not guarantee full rated flow.'));
   else sourceDetails.append(make('p','Minimum OPERATING dynamic pressure and flow are not separately verified. Baxi minimums are not transferred.'));
   if(m.shared.minimumStaticMainsPressureForMaximumFlowBar!==null)sourceDetails.append(make('p','Minimum STATIC mains pressure for maximum flow: '+m.shared.minimumStaticMainsPressureForMaximumFlowBar+' bar for this exact model. This is not a dynamic minimum; passing it does not establish dynamic/full-flow delivery.'));
   sourceDetails.append(make('p',m.chKW.kind==='unqualified'?'One published CH range; condensing/non-condensing and water temperatures are not stated. DHW kW is not separately verified from the model name.':'The HTML gives no exact CH water-temperature basis and no guaranteed full-flow dynamic pressure.'),make('p','Manufacturer pages checked on 20 October 2026.'));
   }
   for(const sourceId of m.sourceIds){const source=data.sources.find(s=>s.id===sourceId);if(source)sourceDetails.append(link(source,sourceId==='ideal-logic-max-combi2-237660-a05-retained-manual'?'Ideal own manual · PDF/printed pages 6, 7, 8, 12, 14':sourceId==='ideal-technical-brochure-2025-revf'?'Ideal own brochure · PDF pages 37, 53; RevF page 98':sourceId==='wb-4000-installer-brochure'?'Official table · PDF page 6, printed 10–11':'Official manufacturer listing'));}card.append(sourceDetails);
   box.append(card);
  }
  if(result.models.length)box.append(make('p',result.ranking,'hint'));
 }
 function renderAdditions(result){
  const box=get('additionsArea');box.replaceChildren();
  for(const[title,items]of [['Domestic water supply',result.water.items],['Condensate route / pump',result.condensate.items],['Flue, controls & site',result.site]]){const d=make('details');d.append(make('summary',title),list(items));box.append(d);}
 }
 function syncChoices(){const raw=store.getState().survey;for(const b of choiceButtons)b.setAttribute('aria-pressed',String(raw[b.dataset.bafChoice]===b.dataset.bafValue));}
 function currentInputs(){
  const n=store.getState().survey,fuels={NG:'Natural gas',LPG:'LPG',Oil:'Oil',unknown:'Fuel not sure'},types={combi:'Combi',system:'System',regular:'Regular / heat-only','not-sure':'Type not sure',same:'Keep current type'};
  const count=(key,label)=>n[key]===''||n[key]===null?label+' unknown':n[key]==='__invalid_number__'?label+' needs checking':n[key]+' '+label;
  get('currentInputs').textContent=[fuels[n.fuel],types[n.preference],count('bedrooms','bedrooms'),count('bathrooms','bathrooms'),count('radiators','radiators')].join(' · ');
  const brand=n.manufacturer,pool=data.models.filter(m=>brand==='all'||m.manufacturer===brand);
  get('coverage').textContent=brand==='survey'?'Survey only: no model filter applied.':(brand==='all'?'All available makes':brand||'Choose a make')+': '+pool.length+' reviewed natural-gas combi variants. This is a limited model pool, not the whole market.';
 }
 function renderSizeGuide(g){
  const box=get('sizeGuideArea');box.replaceChildren();const card=make('article',undefined,'card');card.append(make('h3','Preliminary size guide'));
  if(g.bandKW)card.append(make('p',g.bandKW.min+'–'+g.bandKW.max+' kW general catalogue range','size-band'));
  card.append(make('p',g.reason),make('p',g.qualification,'hint'),make('p','This guide does not select or rule out any model.','hint'));box.append(card);
 }
 function renderCalculated(){
  const state=store.getState();currentInputs();syncChoices();get('results').hidden=!state.result;get('copyFallback').hidden=true;get('fallbackText').value='';get('summaryText').value='';get('copy').disabled=!state.result;
  if(!state.result){for(const id of ['assessmentArea','modelsArea','additionsArea','sizeGuideArea'])get(id).replaceChildren();return;}
  renderSizeGuide(state.result.sizeGuide);renderAssessment(state.result.assessment);renderModels(state.result.matches);renderAdditions(state.result.installation);get('summaryText').value=surveySummary(state.survey,state.result,data);
 }
 function showStage(next,focus=true){stage=next;for(const panel of stages)panel.hidden=Number(panel.dataset.bafStage)!==stage;get('progress').textContent=(stage+1)+' of 3 · '+['Your boiler','Your home','Size guide & models'][stage];if(focus){const heading=get('stageTitle'+stage);heading.tabIndex=-1;heading.focus({preventScroll:true});root.scrollTop=0;}}
 function assess(){const result=store.assess();renderCalculated();if(!result.ok){status(result.errors.join(' '));return false;}status('');showStage(2);return true;}
 function changed(key,value){const state=store.getState();if(!Object.hasOwn(state.survey,key)||state.survey[key]===value)return;store.update({[key]:value});renderCalculated();status(state.result?'Inputs changed. Update model choices to refresh the guide and copy summary.':'');}
 function inputChanged(event){const control=event.target;if(!control?.name?.startsWith('baf-'))return;changed(control.name.slice(4),controlInputValue(control));}
 for(const b of choiceButtons)b.addEventListener('click',()=>{const key=b.dataset.bafChoice,value=b.dataset.bafValue;const control=controls.find(c=>c.name==='baf-'+key);if(control)control.value=value;changed(key,value);});
 form.addEventListener('input',inputChanged);form.addEventListener('change',inputChanged);form.addEventListener('submit',e=>{e.preventDefault();assess();});
 for(const b of root.querySelectorAll('[data-baf-search]'))b.addEventListener('click',e=>{e.preventDefault();assess();});
 get('toHome').addEventListener('click',()=>{status('');showStage(1);});get('editHome').addEventListener('click',()=>{status('');showStage(1);});
 for(const b of root.querySelectorAll('[data-baf-back]'))b.addEventListener('click',()=>{status('');showStage(Math.max(0,stage-1));});
 get('allMakes').addEventListener('click',()=>{const c=controls.find(c=>c.name==='baf-manufacturer');c.value='all';changed('manufacturer','all');assess();});
 get('restart').addEventListener('click',()=>{const state=store.reset();for(const c of controls)c.value=state.survey[c.name.slice(4)];for(const d of root.querySelectorAll('details'))d.open=false;renderCalculated();status('');showStage(0);});
 get('copy').addEventListener('click',async()=>{get('copy').disabled=true;get('copyFallback').hidden=true;const result=await copyCurrentSurvey(store,globalThis.navigator?.clipboard);status(result.message);get('copy').disabled=!store.getState().result;if(!result.copied&&!result.stale){get('fallbackText').value=result.text;get('copyFallback').hidden=false;get('fallbackText').focus();get('fallbackText').select();}});
 get('selectFallback').addEventListener('click',()=>{get('fallbackText').focus();get('fallbackText').select();});
 const sourceNames={'ideal-logic-max-combi2-current-listing':'Ideal current listing · observed 21 October 2026','ideal-logic-max-combi2-237660-a05-retained-manual':'Ideal own manual · 11/2025 UIN237660 A05','ideal-technical-brochure-2025-revf':'Ideal product codes · 2025 RevF brochure','baxi-800-combi2-current-html':'Baxi current technical table','wb-4000-current-html':'Worcester current listing','wb-4000-installer-brochure':'Worcester verified model table · D11/24','domestic-water-conditions':'Domestic flow and dynamic pressure','mains-boosting':'Mains boosting assessment','gravity-boosting':'Gravity boosting assessment','booster-notification':'Booster notification requirements','condensate-route':'Condensate route and freeze risk','condensate-pump-context':'Condensate example · no transferred dimensions'};
 for(const source of data.sources){const p=make('p');p.append(link(source,sourceNames[source.id]??source.id));get('sourceLinks').append(p);}
 // Source links are local metadata only; they are opened solely by the user.
 for(const [url,label]of [['https://www.vaillant.co.uk/advice/understanding-heating-technology/boilers/what-size-boiler-do-i-need/','Vaillant boiler sizing guide'],['https://www.vaillant.co.uk/advice/understanding-heating-technology/boilers/what-is-a-condensing-boiler/','Vaillant condensing-boiler guide']]){const p=make('p');p.append(link({url},label));get('guideSourceLinks').append(p);}
 get('surveyFields').disabled=false;status('');renderCalculated();showStage(0,false);
 const controller={store,getStage:()=>stage};uiMounts.set(root,controller);return controller;
}
