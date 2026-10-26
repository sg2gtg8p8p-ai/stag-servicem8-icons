// Connections transcribed from Resideo Issue 19, printed pages 6 and 12.
// Each row is one electrically common junction, not continuity through switches.
const common={
  1:{label:'Permanent live',colour:'#9a4b16'},
  2:{label:'Neutral',colour:'#006fc0'},
  3:{label:'Earth',colour:'#438218'},
  4:{label:'Heating ON',colour:'#4933a5'},
  5:{label:'Heating demand',colour:'#b44e12'},
  6:{label:'Hot water ON',colour:'#9c246c'},
  7:{label:'Hot water OFF / satisfied',colour:'#656565'},
  8:{label:'Hot-water demand',colour:'#b44e12'},
  10:{label:'Boiler / pump demand',colour:'#b44e12'}
};
const e=(device,terminal)=>({device,terminal});
const mains={1:e('Mains supply','L'),2:e('Mains supply','N'),3:e('Mains supply','Earth')};
const programmer={1:e('ST9400C programmer','L'),2:e('ST9400C programmer','N'),4:e('ST9400C programmer','4 · CH ON'),6:e('ST9400C programmer','3 · HW ON')};
const room={2:e('T6360B room thermostat','2'),4:e('T6360B room thermostat','1'),5:e('T6360B room thermostat','3')};
const stat={6:e('L641A cylinder thermostat','C'),8:e('L641A cylinder thermostat','1')};
const pump={2:e('Pump','N'),3:e('Pump','Earth')};
const boiler={2:e('Boiler','N'),3:e('Boiler','Earth')};
const valve=(name,wire)=>e(name,wire+' wire');
const row=(n,ends,note='')=>({id:String(n),...common[n],ends,note});
export const TRACE_PLANS=Object.freeze({
 's-plan':{
  source:'resideo',page:6,controls:'ST9400C · T6360B · L641A · two V4043H valves',demand:'10',
  rows:[
   row(1,[mains[1],programmer[1],valve('V4043H heating valve','Grey'),valve('V4043H hot-water valve','Grey')],'The room thermostat and pump are on switched circuits, not on this permanent-live junction.'),
   row(2,[mains[2],programmer[2],room[2],valve('V4043H heating valve','Blue'),valve('V4043H hot-water valve','Blue'),pump[2],boiler[2]]),
   row(3,[mains[3],valve('V4043H heating valve','Green/yellow'),valve('V4043H hot-water valve','Green/yellow'),pump[3],boiler[3]],'Earth parking at Class II controls is not drawn on the source circuit. Retain protective-conductor continuity.'),
   row(4,[programmer[4],room[4]],'The room thermostat switches between terminals 1 and 3; that contact is not a permanent link.'),
   row(5,[room[5],valve('V4043H heating valve','Brown')]),
   row(6,[programmer[6],stat[6]],'The cylinder thermostat switches C to 1 for hot-water demand; that contact is not a permanent link.'),
   row(8,[stat[8],valve('V4043H hot-water valve','Brown')]),
   row(10,[valve('V4043H heating valve','Orange'),valve('V4043H hot-water valve','Orange')],'The valve end switches connect grey to orange when operated. They are not permanent links.')
  ]
 },
 'y-plan':{
  source:'resideo',page:12,controls:'ST9400C · T6360B · L641A · V4073A mid-position valve',demand:'8',
  rows:[
   row(1,[mains[1],programmer[1]],'The valve has no permanent-live connection in this source. Its white and grey leads are separate switched circuits.'),
   row(2,[mains[2],programmer[2],room[2],valve('V4073A mid-position valve','Blue'),pump[2],boiler[2]]),
   row(3,[mains[3],valve('V4073A mid-position valve','Green/yellow'),pump[3],boiler[3]],'Earth parking at Class II controls is not drawn on the source circuit. Retain protective-conductor continuity.'),
   row(4,[programmer[4],room[4]],'The room thermostat switches between terminals 1 and 3; that contact is not a permanent link.'),
   row(5,[room[5],valve('V4073A mid-position valve','White')]),
   row(6,[programmer[6],stat[6]]),
   row(7,[e('ST9400C programmer','1 · HW OFF'),e('L641A cylinder thermostat','2'),valve('V4073A mid-position valve','Grey')]),
   {...row(8,[stat[8],valve('V4073A mid-position valve','Orange')],'The cylinder thermostat switches C to 1 on demand or C to 2 when satisfied. No internal valve contacts are bridged in this view.'),label:'Boiler / pump demand'}
  ]
 }
});
export function getTrace(planId,wireId,arrangement='switched'){
 const plan=TRACE_PLANS[planId];if(!plan||!['switched','overrun'].includes(arrangement))return null;
 const original=plan.rows.find(r=>r.id===wireId);if(!original&&!(wireId==='pump-output'&&arrangement==='overrun'))return null;
 const result=original?structuredClone(original):{id:'pump-output',label:'Boiler pump output',colour:'#b44e12',ends:[e('Boiler','PL · pump live output'),e('Pump','L')],note:'Separate boiler-controlled pump circuit, as shown in the pump-overrun inset. Follow the boiler’s own pump-output instructions.'};
 if(wireId==='1'&&arrangement==='overrun')result.ends.push(e('Boiler','L · permanent supply'));
 if(wireId===plan.demand){result.ends.push(e('Boiler',arrangement==='overrun'?'SL · switched demand':'L · switched supply'));if(arrangement==='switched')result.ends.push(e('Pump','L'));}
 return {...result,plan:planId,page:plan.page,arrangement};
}
