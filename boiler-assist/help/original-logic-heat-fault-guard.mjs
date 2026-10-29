import {matchOriginalLogicHeatRoute} from './original-logic-heat-fault-data.mjs';
export const identities=new Map([
 ['ideal-logic-heat-original-12-ng-41-399-99',{model:'Logic Heat 12',gc:'41-399-99'}],
 ['ideal-logic-heat-original-15-ng-41-409-93',{model:'Logic Heat 15',gc:'41-409-93'}],
 ['ideal-logic-heat-original-18-ng-41-409-94',{model:'Logic Heat 18',gc:'41-409-94'}],
 ['ideal-logic-heat-original-24-ng-41-409-95',{model:'Logic Heat 24',gc:'41-409-95'}],
 ['ideal-logic-heat-original-30-ng-41-409-96',{model:'Logic Heat 30',gc:'41-409-96'}],
]);
export const isOriginalLogicHeatFaultQuestion=value=>matchOriginalLogicHeatRoute(value)!==null;
export function originalLogicHeatFaultAnswer(row,id,question,last,previous){
 if(!identities.has(id))return previous(row,id,question,last);
 const b=row?.boiler,known=identities.get(id),base=previous(row,id,'__original_logic_heat_unmatched__');
 const deny={...base,entries:[],activeLabel:null,message:'Enter an exact original Logic Heat code or choose a saved symptom. Another generation’s fault meanings cannot be substituted.'};
 if(!b||b.id!==id||b.manufacturer!=='Ideal'||b.model!==known.model||b.gcNumber!==known.gc||b.productNumber!==null||b.fuel!=='Natural Gas'||b.faultCodeFormat!=='ideal-original-logic-heat-short'||typeof question!=='string'||question.length>400)return deny;
 const url='https://www.freeboilermanuals.com/assets/pdf/ideal/Logic-Heat-Installation-Manual.compressed.pdf';
 const entries=(b.faultCodes||[]).filter(e=>e.sourceIds?.length&&e.sourceIds.every(k=>b.sources?.some(s=>s.id===k&&s.documentReference==='UIN 205862 A06'&&s.revision==='January 2014'&&s.url?.split('#')[0]===url)));
 const q=question.trim().toLowerCase().replace(/\s+/g,' ');let chosen=entries.filter(e=>e.label.toLowerCase()===q);
 if(!chosen.length){const route=matchOriginalLogicHeatRoute(question);if(route)chosen=entries.filter(e=>route.code?e.code===route.code:e.label===route.label);else if(last&&/^(what next|next|still the same|checked that|done)$/.test(q))chosen=entries.filter(e=>e.label===last);}
 if(chosen.length!==1)return deny;
 const e=chosen[0];return{...base,entries:[{label:e.label,text:e.value,code:e.code,codeKind:e.codeKind,conditions:[e.conditions],sources:e.sourceIds.map(k=>{const s=b.sources.find(s=>s.id===k);return{url:s.url,title:s.title,reference:s.reference};})}],activeLabel:e.label,message:'Original manufacturer '+(e.codeKind==='symptom'?'symptom decision tree':e.codeKind==='status'?'display-status guidance':'fault decision tree')+' for this exact Logic Heat model and source edition. Follow the original Yes/No branches. No failed component or passed test is confirmed.'};
}
