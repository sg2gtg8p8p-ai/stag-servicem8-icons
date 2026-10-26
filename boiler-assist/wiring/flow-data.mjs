import {TRACE_PLANS,getTrace} from './trace-data.mjs';
// External terminal routes: Issue 19 pp6/12. Normal operation: pp24/26.
// These are functional sequences, not new copper links through switching contacts.
export const FLOW_SOURCE=Object.freeze({source:'resideo',sha256:'ec0b205ad90b01bdb7177c0f757d0e356a2b7c06cf99a891ef5b10e61472bc2b',pages:[6,12,24,26]});
export const MODES=Object.freeze({heating:'Heating only',hotwater:'Hot water only',both:'Heating and hot water','heating-satisfied':'Heating — cylinder already hot'});
export function availableModes(planId,wire){
 if(!TRACE_PLANS[planId]||['2','3'].includes(wire))return [];
 const heating=['heating',...(planId==='y-plan'?['heating-satisfied']:[]),'both'];
 if(['4','5'].includes(wire))return heating;
 if(wire==='6'||planId==='s-plan'&&wire==='8')return ['hotwater','both'];
 if(wire==='7')return planId==='y-plan'?['heating','heating-satisfied']:[];
 if(['1',TRACE_PLANS[planId].demand,'pump-output'].includes(wire))return ['heating',...(planId==='y-plan'?['heating-satisfied']:[]),'hotwater','both'];
 return [];
}
const step=(id,title,connections,condition,wires,kind='wire')=>({id,title,connections,condition,wires,kind});
export function getFlow(planId,wire,arrangement='switched',requestedMode='heating'){
 if(!getTrace(planId,wire,arrangement))return null;const options=availableModes(planId,wire);if(!options.length)return null;
 const mode=options.includes(requestedMode)?requestedMode:options[0],heating=mode!=='hotwater',water=mode==='hotwater'||mode==='both',both=mode==='both',s=planId==='s-plan',call=s?'10':'8';
 const steps=[step('supply','Start at the mains','Mains L → wiring centre 1 → ST9400C L',s?'Centre 1 also feeds the grey leads of both V4043H valves.':'The white and grey valve leads use separate switched feeds below.',['1'],'supply')];
 if(heating){
  steps.push(step('heating-clock','Programmer calls for heating','ST9400C CH ON 4 → centre 4 → T6360B terminal 1','The heating programme or manual ON enables this path.',['4'],'contact'));
  steps.push(step('room-stat','Room thermostat calls','T6360B 1 → closed contact → 3 → centre 5',s?'Centre 5 → heating valve brown.':'Centre 5 → V4073A white.',['4','5'],'contact'));
 }
 if(water||mode==='heating-satisfied'){
  steps.push(step('water-clock','Programmer enables hot water','ST9400C HW ON 3 → centre 6 → L641A C','This supplies the cylinder thermostat common terminal.',['6'],'contact'));
  if(water)steps.push(step('cylinder-call','Cylinder thermostat calls','L641A C → closed contact → 1 → centre 8',s?'Centre 8 → hot-water valve brown.':'Centre 8 supplies the boiler demand and is also joined to the valve orange lead.',['6','8'],'contact'));
 }
 if(s){
  const names=both?'heating and hot-water valves':heating?'heating valve':'hot-water valve';
  steps.push(step('valve-motor','Valve motor opens the '+(both?'valves':'valve'),(both?'Centre 5 → heating brown; centre 8 → hot-water brown.':heating?'Centre 5 → heating valve brown.':'Centre 8 → hot-water valve brown.')+' Blue motor returns → centre 2 → mains N.','V4043H '+names+' must travel open. The motor circuit is separate from the grey/orange end switch.',both?['5','8']:heating?['5']:['8'],'motor'));
  steps.push(step('end-switch','Opened valve closes its end switch','Separate feed: mains L → centre 1 → valve grey → end switch → orange → centre 10',both?'The end switches are in parallel: either open valve can call the boiler. They are not wired in series.':'The '+names+' end switch supplies the demand after the valve opens.',['1','10'],'mechanical'));
 }else if(mode==='heating'||mode==='heating-satisfied'){
  steps.push(mode==='heating'?step('grey-feed','Hot-water OFF feed','ST9400C HW OFF 1 → centre 7 → V4073A grey','Heating-only example with hot water OFF at the programmer. The white feed above also calls for heating.',['7'],'contact'):step('grey-feed','Satisfied cylinder feed','L641A C → satisfied contact 2 → centre 7 → V4073A grey','Alternative heating-only example: hot water is enabled but the cylinder thermostat is satisfied. The white heating feed is also present.',['6','7'],'contact'));
  steps.push(step('mid-position-valve','Valve reaches heating-only position','V4073A white from centre 5 + grey from centre 7. Blue → centre 2 → mains N.','The valve opens heating port A. Its internal switching makes orange live only at the heating-only position. No direct grey-to-orange wire link is implied.',['5','7'],'motor'));
  steps.push(step('valve-output','Valve sends the boiler call','V4073A orange → centre 8','This is the heating-only demand output, after the valve reaches the required position.',['8'],'mechanical'));
 }else{
  steps.push(step('mid-position-valve',both?'Valve serves heating and hot water':'Valve rests at hot water',both?'Centre 5 → V4073A white; blue → centre 2 → mains N.':'No white or grey drive in this hot-water-only example.',both?'White holds the valve at mid position, opening ports A and B. The calling cylinder thermostat supplies centre 8.':'The spring-return position opens hot-water port B. The cylinder thermostat supplies the boiler call directly; valve movement is not required first.',both?['5','8']:['8'],'motor'));
  steps.push(step('water-output','Cylinder call continues to the boiler','L641A 1 → centre 8 → boiler demand','The orange valve lead shares centre 8 and may be powered from the cylinder thermostat in this condition. Orange being live alone does not prove valve position.',['8'],'wire'));
 }
 steps.push(step('boiler','Demand reaches the boiler','Centre '+call+' → boiler '+(arrangement==='overrun'?'SL (switched demand)':'L (switched supply)'),arrangement==='overrun'?'Separate permanent feed: mains L → centre 1 → boiler L. Use the boiler’s own terminal requirements.':'This is the switched-supply boiler arrangement in the main drawing. Match the actual boiler requirements.',[call,...(arrangement==='overrun'?['1']:[])],'load'));
 steps.push(step('pump',arrangement==='overrun'?'Boiler controls the pump':'Pump runs with the demand',arrangement==='overrun'?'Boiler PL / pump-live output → pump L':'Centre '+call+' → pump L',arrangement==='overrun'?'The pump has a separate boiler-controlled feed and may continue for overrun. It is not linked directly to the SL demand.':'The pump live shares this demand junction with the boiler in the main drawing.',arrangement==='overrun'?['pump-output']:[call],'load'));
 const neutral=getTrace(planId,'2',arrangement).ends.filter(e=>e.device!=='Mains supply').map(e=>e.device+' '+e.terminal).join('; ');
 steps.push(step('neutral-return','Return to mains neutral','All shown N / blue returns → centre 2 → mains N',neutral,['2'],'return'));
 return {planId,wire,arrangement,mode,label:MODES[mode],sourcePages:s?[6,26]:[12,24],steps:steps.map(x=>({...x,highlight:x.wires.includes(wire)})),scope:'Normal operating example for the exact listed controls; not a claim that the installed circuit is currently energised.'};
}
