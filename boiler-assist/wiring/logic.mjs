import {DATA} from './source-data.mjs';
const options={section:['home','plans','hive','cylinder','fault'],plan:['unknown','s','splus','y','w','three'],generation:['unknown','slt3-current','active-heating2-legacy'],channel:['unknown','single','dual'],mode:['unknown','relay','ot','dual'],zones:['unknown','single','multiple'],interface:['unknown','mains','contact','ot'],demand:['unknown','heating','hw','both','satisfied']};
export const LABELS={plan:{unknown:'Unknown / not confirmed',s:'S-plan · two-port valves',splus:'S-plan Plus · one common pump',y:'Y-plan · mid-position three-port',w:'W-plan · diverter / hot-water priority',three:'3 separate pumps / 3 valves'},generation:{unknown:'Unknown / not confirmed','slt3-current':'20-page SLT3-linked guide · ©2025','active-heating2-legacy':'36-page Active Heating2 guide · ©2017'},channel:{unknown:'Unknown / not confirmed',single:'Single channel',dual:'Dual channel'},mode:{unknown:'Unknown / not confirmed',relay:'Single-channel relay',ot:'Single-channel OpenTherm',dual:'Dual-channel relay reference'},zones:{unknown:'Unknown / not confirmed',single:'Single heating zone',multiple:'Multiple heating zones'},interface:{unknown:'Unknown / not confirmed',mains:'Recorded mains-switched demand',contact:'Recorded separate dry-contact demand',ot:'Recorded OpenTherm input'},demand:{unknown:'Unknown / not confirmed',heating:'Heating demand',hw:'Hot-water demand',both:'Heating and hot-water demand',satisfied:'Recorded satisfied / no demand'}};
export function emptySelection(){return{section:'home',plan:'unknown',generation:'unknown',channel:'unknown',mode:'unknown',confirmed:false,zones:'unknown',boiler:'',interface:'unknown',valveModel:'',cylinderModel:'',demand:'unknown'};}
export function normalizeSelection(raw){
 const out=emptySelection();for(const k of Object.keys(raw))if(!Object.hasOwn(out,k))throw Error('Unknown reference field');
 for(const k of Object.keys(options)){const v=raw[k]??out[k];if(!options[k].includes(v))throw Error('Invalid '+k);out[k]=v;}
 for(const k of ['boiler','valveModel','cylinderModel'])out[k]=String(raw[k]??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,140);
 if(raw.confirmed!==undefined&&typeof raw.confirmed!=='boolean')throw Error('Invalid receiver confirmation');out.confirmed=raw.confirmed??false;return out;
}
const ref=(source,page,purpose)=>{const s=DATA.sources[source];if(!s?.pages[String(page)])throw Error('Page is not an accepted figure context');return{source,page,purpose,kind:'figure'};};
const indexRef=(source,page,purpose)=>{const s=DATA.sources[source];if(!s?.manualIndexPages.includes(page))throw Error('Page is not an accepted manual index');return{source,page,purpose,kind:'index'};};
const basicMissing=['Exact boiler manufacturer input, permanent supply and pump-overrun requirements have not been matched.','Receiver, valve and pump contact/load ratings are unverified. A 3A supply fuse is not a relay or pump-load rating.','Actual component identity, system topology, isolation/prove-dead and protective conditions have not been accepted.'];
const threeMissing=['Exact three-pump / three-valve hydraulic and electrical arrangement is missing.','All three pump models and individual running/start loads are needed.','All three valve/actuator models, control contacts and controller/receiver generations are needed.','A matching manufacturer-supported demand, interlock and pump-overrun design is needed.'];
export function interfaceConflict(recorded,context){
 if(recorded==='unknown')return false;
 if(context.interface==='OpenTherm-bus')return recorded!=='ot';
 if(recorded==='ot')return true;
 return context.interface==='dual-mains-plan-outputs'&&recorded==='contact';
}
function selectHive(s){
 const notes=[DATA.receiverNotes[s.generation==='slt3-current'?'current':'older']],missing=[],references=[];let context=null;
 if(s.generation==='unknown')return{notes:['Select the exact source guide and receiver type. Unknown selections withhold terminal-specific information.'],missing:['Receiver generation and matching source guide are not confirmed.'],references,context:null,held:true};
 references.push(ref(s.generation,s.generation==='slt3-current'?7:9,'Receiver identification only. Both channel variants appear; this does not prove the installed variant.'));
 if(s.channel==='unknown')missing.push('Receiver channel is not confirmed.');
 if(s.mode==='unknown')missing.push('Receiver operating mode is not confirmed.');
 if(!s.confirmed)missing.push('The physical receiver and matching guide/mode have not been confirmed.');
 if(s.channel!=='unknown'&&s.mode!=='unknown'){
  let id=null;
  if(s.channel==='dual'&&s.mode==='dual')id=s.generation==='slt3-current'?'current-dual':'legacy-dual';
  else if(s.channel==='single'&&s.mode==='relay')id=s.generation==='slt3-current'?'otr1-relay':'legacy-single';
  else if(s.channel==='single'&&s.mode==='ot'&&s.generation==='slt3-current')id='otr1-opentherm';
  if(!id)missing.push('This source/channel/mode combination is not supported by the reviewed guide. No terminal panel is selected.');
  else{
   const candidate=DATA.receivers[id];
   if(s.mode==='ot'&&s.zones==='multiple')missing.push('The 20-page guide p11 excludes OpenTherm for its described multizone heating arrangement. Terminal information is withheld.');
   else if(interfaceConflict(s.interface,candidate))missing.push('The recorded boiler input type conflicts with this source interface. No matching terminal panel is selected.');
   else if(s.confirmed)context=candidate;
  }
 }
 if(context){references.splice(0,1,ref(context.source,context.page,context.id==='otr1-opentherm'?'OTR1 OpenTherm reference: RIGHT diagram only. Full page also contains the relay variant.':context.id==='otr1-relay'?'OTR1 relay reference: LEFT diagram only. Full page also contains the OpenTherm variant.':context.source==='active-heating2-legacy'?'Selected '+context.channel+'-channel reference. Full page contains both single and dual variants.':'Dual-channel source reference. Exact part number is not named.'));
  notes.push(context.model?'Source names '+context.model+'. Source switch position: '+context.switchPosition+'. This selects reference information, not a change to an installed device.':'Exact receiver model part number is not named by this source; no part number is inferred.');
  if(context.channel==='dual')notes.push(context.source==='slt3-current'?'This source says dual receivers have no mode switch. No dual OpenTherm mode is established.':'This older dual diagram retains its own explicit NO/NC labels. No OpenTherm mode is established.');
  notes.push(context.interface==='OpenTherm-bus'?'OT1/OT2 are a distinct bus interface; numbered relay positions 1–4 are unused in this mode. Exact boiler compatibility and low/high-voltage separation remain unverified.':context.interface==='dual-mains-plan-outputs'?'Mains-plan outputs are distinct from dry contacts and OpenTherm. No low-voltage or bus equivalence is implied.':'The separate common/contact interface is distinct from receiver mains supply. No L-to-common bridge or actual control voltage is inferred.');
 }
 notes.push(s.generation==='slt3-current'?DATA.receiverNotes.zonesCurrent:DATA.receiverNotes.zonesOlder,DATA.receiverNotes.blue);
 if(s.generation==='slt3-current')notes.push(DATA.receiverNotes.dualScope);
 missing.push('Exact receiver contact voltage/current ratings and boiler interface compatibility are unverified.');
 return{notes,missing,references,context,held:!context};
}
export function analyseReference(raw){
 const s=normalizeSelection(raw),out={selectionKey:JSON.stringify(s),section:s.section,title:'Wiring reference',notes:[],missing:[...basicMissing],references:[],issues:[],terminalLabels:null,receiverContext:null,held:false,designAvailable:false,installationApproved:false,sourceReferenceOnly:true};
 if(!s.boiler)out.missing.unshift('Exact boiler model/revision is not recorded.');
 if(s.interface==='unknown')out.missing.push('The actual boiler demand interface is unknown.');
 if(s.plan==='three')out.missing.push(...threeMissing);
 if(s.section==='plans'){
  if(s.plan==='unknown'){out.title='Choose a system plan';out.held=true;out.missing.push('System plan has not been identified.');}
  else if(s.plan==='three'){
   out.title='3 separate pumps / 3 valves';out.notes=['An exact source-matched design is not available in this reference pack.','S-plan Plus has three valves and ONE common pump in each illustrated circuit. It does not establish three separately controlled pumps.','Related references below explain a different plan or control interface; they are not a design for this topology.'];out.references=[ref('resideo',11,'S-plan Plus: THREE valves and ONE common pump. Related reference only.'),ref('resideo',18,'Boiler supply and demand examples. Related interface reference only.'),ref('active-heating2-legacy',17,'Receiver/zone configurations only. Not a pump/valve circuit.')];out.held=true;
  }else{
   const p=DATA.plans[s.plan];out.title=p.title;out.notes=[p.text,...p.notes,'Source controller context: '+p.models.join(', ')+'.','Boiler power supply, mains-switched demand, a separate dry contact and OpenTherm are distinct functions. The exact boiler interface is not established by selecting a plan.'];out.references=[ref(p.source,p.page,'Selected '+p.title+' source context; full page and alternative inset retained.'),ref('resideo',18,'Separate boiler supply/demand examples; exact boiler requirements remain unknown.')];
   if(s.plan==='y')out.issues.push(DATA.conflicts.find(c=>c.id==='p14'));
   out.issues.push(DATA.conflicts.find(c=>c.id==='p20'));if(s.plan==='w')out.issues.push(DATA.conflicts.find(c=>c.id==='wstate'));
  }
 }else if(s.section==='hive'){
  out.title='Hive receiver reference';const h=selectHive(s);out.notes=h.notes;out.missing.push(...h.missing);out.references=h.references;out.held=h.held;out.receiverContext=h.context?.id??null;out.terminalLabels=h.context?.terminalLabels??null;
  out.notes.push('Plan and receiver selections are independent source references. No combined circuit or Hive-to-Resideo terminal translation is created.');
 }else if(s.section==='cylinder'){
  out.title='Cylinder controls';out.notes=['The Resideo reference uses L641A cylinder controls. Call and satisfied paths have different roles in S, Y and W plans.','Confirm the exact cylinder thermostat, valve type and recorded demand state before choosing the complete original plan. A model typed here is unverified user information.','A single reading does not establish a faulty thermostat. No live testing, links or bypass instructions are provided.'];
  const key=['s','splus','y','w'].includes(s.plan)?s.plan:null;out.references=(key?[ref('resideo',DATA.plans[key].page,'L641A in the selected source plan.')]:[ref('resideo',6,'L641A in S-plan.'),ref('resideo',12,'L641A in Y-plan.'),ref('resideo',15,'L641A in W-plan.')]);
  out.issues=DATA.conflicts.filter(c=>['cylinder','frost'].includes(c.id));if(s.plan==='w'||s.plan==='unknown')out.issues.push(DATA.conflicts.find(c=>c.id==='wstate'));if(!s.cylinderModel)out.missing.push('Exact cylinder-control model is unknown.');if(!s.valveModel)out.missing.push('Exact valve/actuator model is unknown.');if(s.demand==='unknown')out.missing.push('The relevant call/satisfied demand context is unknown.');
 }else if(s.section==='fault'){
  out.title='Fault-finding reference';out.notes=['Identify the exact control and receiver generation, valve model/plan, boiler interface, and heating/hot-water call or satisfied state.','Source tables depend on their full wiring and demand context; they do not prove a faulty part from an isolated reading.','Boiler power supply is separate from the control input. Mains-switched, dry-contact and OpenTherm references must not be interchanged.','This index supplies no energised tests, probing, voltage injection, jumper/bypass links or repair steps. Competent-person isolation/prove-dead and actual conditions remain outside this reference.'];out.references=[indexRef('resideo',23,'Y-plan context index: original pp23–24.'),indexRef('resideo',25,'S/S-plan Plus context index: original pp25–26; cylinder wording held.'),indexRef('resideo',27,'W-plan context index: original pp27–28; mixed call-state wording held.')];out.issues=DATA.conflicts;
  if(!s.valveModel)out.missing.push('Exact valve/actuator model is unknown.');if(!s.cylinderModel)out.missing.push('Cylinder-control identity is unknown.');if(s.demand==='unknown')out.missing.push('Recorded demand state is unknown.');
 }else{out.title='Wiring reference';out.notes=['Choose a source reference. No complete circuit or installation approval is produced.'];out.held=true;}
 out.missing=[...new Set(out.missing)];return out;
}
export function referenceSummary(raw,result){
 const s=normalizeSelection(raw);if(!result||result.selectionKey!==JSON.stringify(s))throw Error('Review the current choices before copying.');
 const lines=['STAG WIRING — SOURCE REFERENCE ONLY',result.title,'No complete circuit, boiler compatibility or installation approval is established.','Plan: '+LABELS.plan[s.plan],'Receiver source: '+LABELS.generation[s.generation],'Channel: '+LABELS.channel[s.channel]+'; mode: '+LABELS.mode[s.mode],'Physical receiver / matching guide confirmation: '+(s.confirmed?'User confirmed for reference selection only':'Not confirmed'),'Zones: '+LABELS.zones[s.zones],'Boiler (unverified user entry): '+(s.boiler||'Unknown'),'Boiler demand interface (unverified): '+LABELS.interface[s.interface],'Valve/actuator (unverified): '+(s.valveModel||'Unknown'),'Cylinder control (unverified): '+(s.cylinderModel||'Unknown'),'Recorded demand: '+LABELS.demand[s.demand],'Terminal-specific panel: '+(result.receiverContext||'Withheld / not selected'),''];
 if(result.terminalLabels)lines.push('Source labels only: '+Object.entries(result.terminalLabels).map(([k,v])=>k+': '+v).join('; '),'');
 lines.push(...result.notes,'','MISSING EVIDENCE',...result.missing.map(x=>'- '+x));if(result.issues.length)lines.push('','SOURCE QUALIFICATIONS',...result.issues.map(x=>x.text));
 lines.push('','ORIGINAL SOURCES');for(const id of new Set(result.references.map(r=>r.source))){const source=DATA.sources[id],pages=[...new Set(result.references.filter(r=>r.source===id).map(r=>r.page))];lines.push(source.title+' · '+source.edition,'PDF pages: '+pages.join(', '),'Source SHA256: '+source.sha256,source.url);}
 return lines.join('\n');
}
export function createReferenceStore(initial={}){
 let selection=normalizeSelection({...emptySelection(),...initial}),revision=0,result=null,summary=null;
 return{getState:()=>({selection:structuredClone(selection),revision,result:result?structuredClone(result):null,summary}),update(patch){let next=normalizeSelection({...selection,...patch});if(['generation','channel','mode'].some(k=>next[k]!==selection[k]))next.confirmed=false;if(JSON.stringify(next)===JSON.stringify(selection))return false;selection=next;revision++;result=null;summary=null;return true;},review(){result={...analyseReference(selection),revision};summary=referenceSummary(selection,result);return this.getState();},copyText(expectedRevision){if(!result||summary===null||result.revision!==revision||expectedRevision!==revision)throw Error('Choices changed. Review the current reference before copying.');return summary;}};
}
