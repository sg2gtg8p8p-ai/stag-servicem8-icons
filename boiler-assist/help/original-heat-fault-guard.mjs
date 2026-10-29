// Only the original Heat H edition. The original System and textual Combi menus
// differ, so neither a shared marketing name nor a prefix is sufficient.
export const heatIdentities=new Map([
 ['ideal-logic-max-heat-h12-41-796-17','41-796-17'],
 ['ideal-logic-max-heat-h15-41-796-18','41-796-18'],
 ['ideal-logic-max-heat-h18-41-796-19','41-796-19'],
 ['ideal-logic-max-heat-h24-41-796-20','41-796-20'],
 ['ideal-logic-max-heat-h30-41-796-21','41-796-21'],
]);
export function originalHeatFaultAnswer(row,recordId,question,previousLabel,previousAnswer){
 if(!heatIdentities.has(recordId))return previousAnswer(row,recordId,question,previousLabel);
 const b=row?.boiler,base=previousAnswer(row,recordId,'__original_heat_unmatched__');
 const norm=v=>typeof v==='string'?v.toLowerCase().trim().replace(/\s+/g,' '):'';
 const deny={...base,entries:[],activeLabel:null,message:'Enter one exact original Heat H display code, or choose a saved symptom route. Unknown codes, added cause numbers and codes from another generation cannot be substituted.'};
 const size=recordId.match(/heat-h(12|15|18|24|30)-/)?.[1];
 if(!b||b.id!==recordId||b.manufacturer!=='Ideal'||b.model!=='Logic MAX Heat H'+size||b.productNumber!==null||b.fuel!=='Natural Gas'||b.gcNumber!==heatIdentities.get(recordId)||b.faultCodeFormat!=='ideal-original-heat-short'||typeof question!=='string'||question.length>400)return deny;
 const url='https://www.freeboilermanuals.com/assets/pdf/ideal/logic-max-heat-inst.pdf';
 const entries=(b.faultCodes||[]).filter(e=>e.sourceIds?.length&&e.sourceIds.every(id=>b.sources?.some(s=>s.id===id&&s.documentReference==='UIN 219010 A04'&&s.revision==='February 2019'&&s.url?.split('#')[0]===url)));
 const q=norm(question);
 let chosen=entries.filter(e=>norm(e.label)===q);
 if(!chosen.length){
  const match=question.trim().match(/^(?:(?:fault|error)(?:\s+code)?|code)?\s*([a-z0-9]{2})[?.]?$/i);
  if(match)chosen=entries.filter(e=>e.codeKind==='fault'&&e.code.toUpperCase()===match[1].toUpperCase());
  else if(['no ch','no hw','no display'].includes(q))chosen=entries.filter(e=>e.codeKind==='symptom'&&norm(e.code)===q);
  else if(previousLabel&&/^(what next|next|still the same|checked that|done)$/.test(q))chosen=entries.filter(e=>e.label===previousLabel);
 }
 if(chosen.length!==1)return deny;
 const e=chosen[0];
 return{...base,entries:[{label:e.label,text:e.value,code:e.code,codeKind:e.codeKind,conditions:[e.conditions],sources:e.sourceIds.map(id=>{const s=b.sources.find(s=>s.id===id);return{url:s.url,title:s.title,reference:s.reference};})}],activeLabel:e.label,message:(e.codeKind==='symptom'?'Manufacturer symptom decision tree; this is not a displayed fault code.':'Manufacturer information for the exact original Heat H display code.')+' Follow the original Yes/No branches. No failed component or passed test has been confirmed.'};
}
