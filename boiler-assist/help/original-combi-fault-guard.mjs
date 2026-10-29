import {matchReviewedTextRoute} from './original-combi-fault-routes.mjs';
export const combiIdentities=new Map([
 ['ideal-logic-max-combi-c24-47-349-56',{model:'Logic MAX Combi C24',gc:'47-349-56'}],
 ['ideal-logic-max-combi-c30-47-349-57',{model:'Logic MAX Combi C30',gc:'47-349-57'}],
 ['ideal-logic-max-combi-c35-47-349-58',{model:'Logic MAX Combi C35',gc:'47-349-58'}],
]);
export const isOriginalCombiFaultQuestion=value=>matchReviewedTextRoute(value)!==null;
// Correct only the visible manual reference; the established identity payload stays unchanged.
export function originalCombiIdentityLabel(b,label){
 const identity=combiIdentities.get(b?.id);
 if(!identity||b.manufacturer!=='Ideal'||b.model!==identity.model||b.gcNumber!==identity.gc||b.productNumber!==null||b.fuel!=='Natural Gas'||typeof label!=='string')return label;
 return label.replace('UIN 223262 A01','UIN 222362 A01');
}
export function originalCombiFaultAnswer(row,id,question,last,previous){
 if(!combiIdentities.has(id))return previous(row,id,question,last);
 const b=row?.boiler,identity=combiIdentities.get(id),prior=previous(row,id,'__original_lcd_combi_unmatched__');
 const base={...prior,identity:originalCombiIdentityLabel(b,prior.identity)};
 const deny={...base,entries:[],activeLabel:null,message:'Enter the exact LCD fault text or choose a saved fault/symptom below. Short display codes and another generation’s messages cannot be substituted.'};
 if(!b||b.id!==id||b.manufacturer!=='Ideal'||b.model!==identity.model||b.gcNumber!==identity.gc||b.productNumber!==null||b.fuel!=='Natural Gas'||b.faultCodeFormat!=='ideal-original-combi-text'||typeof question!=='string'||question.length>400)return deny;
 const sourceURL='https://www.freeboilermanuals.com/assets/pdf/ideal/Logic-Max-Combi-Inst.pdf';
 const entries=(b.faultCodes||[]).filter(e=>e.sourceIds?.length&&e.sourceIds.every(k=>b.sources?.some(s=>s.id===k&&s.documentReference==='UIN 222362 A01'&&s.revision==='April 2019'&&s.url?.split('#')[0]===sourceURL)));
 const q=question.trim().toLowerCase().replace(/\s+/g,' ');let chosen=entries.filter(e=>e.label.toLowerCase()===q);
 if(!chosen.length){
  const route=matchReviewedTextRoute(question);
  if(route)chosen=entries.filter(e=>e.code===route.key&&e.codeKind===route.kind);
  else if(last&&/^(what next|next|still the same|checked that|done)$/.test(q))chosen=entries.filter(e=>e.label===last);
 }
 if(chosen.length!==1)return deny;
 const e=chosen[0];
 return{...base,entries:[{label:e.label,text:e.value,code:e.code,codeKind:e.codeKind,conditions:[e.conditions],sources:e.sourceIds.map(k=>{const s=b.sources.find(s=>s.id===k);return{url:s.url,title:s.title,reference:s.reference};})}],activeLabel:e.label,message:(e.codeKind==='symptom'?'Manufacturer symptom decision tree; no displayed fault is implied.':'Manufacturer information for this exact original LCD fault text.')+' Follow the original Yes/No branches. No failed component or passed test has been confirmed.'};
}
