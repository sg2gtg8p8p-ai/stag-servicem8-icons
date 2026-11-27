import {DATA} from './source-data.mjs';
export const CHOICES = Object.freeze({
 plan: [['unknown','Not confirmed'],['s','S-plan'],['splus','S-plan Plus'],['y','Y-plan']],
 zones: [['unknown','Not confirmed'],['1','1 heating zone'],['2','2 heating zones'],['3','3 heating zones'],['4plus','4 or more heating zones']],
 pumps: [['unknown','Not confirmed'],['common','One common pump'],['separate','Separate pumps / other arrangement']],
 generation: [['unknown','Not confirmed'],['slt3-current','Hive 20-page guide · ©2025'],['active-heating2-legacy','Hive Active Heating 2 · ©2017']],
 channel: [['unknown','Not confirmed'],['single','Single-channel receiver'],['dual','Dual-channel receiver']],
 mode: [['unknown','Not confirmed'],['relay','Relay'],['ot','OpenTherm']]
});
export function variantReferences(raw={}) {
 const s={}; for(const [key,options] of Object.entries(CHOICES)) {
  s[key]=raw[key]??'unknown'; if(!options.some(([value])=>value===s[key])) throw Error('Unknown '+key);
 }
 const out={selection:s,diagrams:[],notes:[],holds:[],references:[],combinedCircuit:false,installationApproved:false};
 const reference=(source,page,purpose)=>out.references.push({source,page,purpose});
 if(s.plan!=='unknown') {
  const plan=DATA.plans[s.plan]; reference('resideo',plan.page,'Original plan, exact controls shown');
  const expected=s.plan==='splus'?'2':'1';
  if(s.pumps==='common'&&s.zones===expected) out.diagrams.push({id:{s:'s-plan',splus:'s-plan-plus',y:'y-plan'}[s.plan],label:'Open original '+plan.title+' diagram'});
  else out.holds.push('Selected zone/pump arrangement is not the illustrated '+plan.title+' circuit. Its source shows '+expected+' heating zone'+(expected==='1'?'':'s')+' and one common pump. No matching plan route is offered.');
 }
 if(s.pumps!=='common') out.holds.push(s.plan==='unknown'?'No pump or valve compatibility is established by a receiver reference. Before selecting a plan, confirm its illustrated pump arrangement. Separate pumps need their own manufacturer-supported hydraulic/electrical design; an overrun inset is not another pump.':'Confirm one common pump before choosing these plan drawings. Separate pumps need their own manufacturer-supported hydraulic/electrical design; an overrun inset is not another pump.');
 if(s.generation==='unknown'||s.channel==='unknown'||s.mode==='unknown') out.holds.push('Confirm the receiver generation, channel and operating mode to select a receiver reference.');
 else {
  const current=s.generation==='slt3-current';
  reference(s.generation,current?7:9,'Identify physical receiver and channel; source selection is not appliance verification');
  if(s.mode==='ot'&&(!current||s.channel!=='single')) out.holds.push('This receiver generation/channel has no reviewed OpenTherm route. Dual channel is not a dual OpenTherm mode.');
  else if(!current&&s.zones==='4plus') out.holds.push('Receiver route withheld: four or more heating zones exceed this older guide’s reviewed scope.');
  else if(s.mode==='ot'&&s.zones!=='1') out.holds.push('OpenTherm reference withheld: the current guide excludes its described multizone arrangement; a single heating zone must be confirmed.');
  else {
   const id=current?(s.channel==='dual'?'hive-dual':'hive-single'):'hive-older';
   out.diagrams.push({id,label:'Open '+(current?'current':'older')+' Hive '+s.channel+'-channel '+s.mode+' source'});
   reference(s.generation,current?(s.channel==='dual'?10:9):13,'Receiver page only; no terminal translation to plan');
   out.notes.push(s.channel==='single'?'Single channel is one heating control channel; it does not add a separate stored-hot-water channel.':'Dual channel controls heating and stored hot water; it does not mean two independently controlled heating zones.');
   out.notes.push(s.mode==='ot'?'OpenTherm is a distinct bus reference. No relay or plan connection is inferred.':s.channel==='dual'?'Dual-channel mains-plan outputs must not be treated as volt-free contacts.':'The single-channel separate common/contact reference does not establish the actual switched voltage or a mains bridge.');
   if(current&&s.channel==='single') out.notes.push('Current OTR1 page: relay is the left drawing; OpenTherm is the right drawing. Use only the selected source context.');
   if(!current) out.notes.push('Older full page contains both variants: single on the left, dual on the right. Its labels must not be transferred to OTR1.');
  }
  if(['2','3','4plus'].includes(s.zones)) {
   reference(s.generation,current?11:17,'Manufacturer multizone scope, not a pump/valve circuit');
   out.notes.push(current?DATA.receiverNotes.zonesCurrent:DATA.receiverNotes.zonesOlder);
   if(!current&&s.zones==='4plus') out.holds.push('Four or more heating zones exceed this older guide’s reviewed three-heating-zone scope. No receiver-count design is supplied.');
   out.holds.push('A single receiver drawing does not establish the receiver count, hot-water control, load capacity or pump/valve design for this multizone installation.');
  }
 }
 out.notes.push('Plan and Hive pages are independent manufacturer references. They are not a combined Hive circuit, wiring translation or compatibility approval. Match boiler supply/demand and pump-overrun requirements to its own instructions.');
 return out;
}
export function mountVariantPicker(parent,doc,openDiagram) {
 const make=(tag,text)=>{const el=doc.createElement(tag);if(text)el.textContent=text;return el;};
 const panel=make('details'),summary=make('summary','Find references for my zones and Hive receiver');panel.className='swr-original';panel.append(summary,make('p','Choose the arrangement you have. This finds separate source pages, not a combined wiring design.'));
 const labels={plan:'System plan',zones:'Heating zones (hot water is separate)',pumps:'Pump arrangement',generation:'Hive source / receiver generation',channel:'Receiver channel',mode:'Receiver operating mode'};
 const controls={},result=make('section');result.setAttribute('aria-live','polite');
 for(const [key,options]of Object.entries(CHOICES)) {
  const label=make('label',labels[key]),select=make('select');select.setAttribute('aria-label',labels[key]);label.style.display='block';label.style.margin='12px 0';select.style.display='block';select.style.width='100%';select.style.maxWidth='100%';
  for(const[value,text]of options){const option=make('option',text);option.value=value;select.append(option);}select.value='unknown';controls[key]=select;label.append(select);panel.append(label);select.addEventListener('change',draw);
 }
 function draw(){
  const state=variantReferences(Object.fromEntries(Object.entries(controls).map(([key,select])=>[key,select.value])));result.replaceChildren();
  for(const text of [...state.holds,...state.notes])result.append(make('p',text));
  for(const route of state.diagrams){const button=make('button',route.label);button.type='button';button.addEventListener('click',()=>openDiagram(route.id));result.append(button);}
  const refs=make('details');refs.append(make('summary','Source pages for these choices'));
  for(const ref of state.references){const source=DATA.sources[ref.source],a=make('a',source.title+' · PDF page '+ref.page+' (online)');a.href=source.url+'#page='+ref.page;a.target='_blank';a.rel='noopener noreferrer';const p=make('p',ref.purpose+'. ');p.append(a);refs.append(p);}result.append(refs);
 }
 panel.append(result);parent.append(panel);draw();return panel;
}
