// Original System S only. Heat H, System 2 and textual Combi menus differ.
export const systemIdentities=new Map([
 ['ideal-logic-max-system-s15-41-796-13','41-796-13'],
 ['ideal-logic-max-system-s18-41-796-14','41-796-14'],
 ['ideal-logic-max-system-s24-41-796-15','41-796-15'],
 ['ideal-logic-max-system-s30-41-796-16','41-796-16'],
]);
export function originalSystemFaultAnswer(row,recordId,question,previousLabel,previousAnswer){
 if(!systemIdentities.has(recordId))return previousAnswer(row,recordId,question,previousLabel);
 const b=row?.boiler,base=previousAnswer(row,recordId,'__original_system_unmatched__');
 const norm=v=>typeof v==='string'?v.toLowerCase().trim().replace(/\s+/g,' '):'';
 const deny={...base,entries:[],activeLabel:null,message:'Enter one exact original System S display code, or choose a saved symptom route. Unknown codes, added cause numbers and codes from another generation cannot be substituted.'};
 const size=recordId.match(/system-s(15|18|24|30)-/)?.[1];
 if(!b||b.id!==recordId||b.manufacturer!=='Ideal'||b.model!=='Logic MAX System S'+size||b.productNumber!==null||b.fuel!=='Natural Gas'||b.gcNumber!==systemIdentities.get(recordId)||b.faultCodeFormat!=='ideal-original-system-short'||typeof question!=='string'||question.length>400)return deny;
 const url='https://www.freeboilermanuals.com/assets/pdf/ideal/logic-max-system-inst.pdf';
 const entries=(b.faultCodes||[]).filter(e=>e.sourceIds?.length&&e.sourceIds.every(id=>b.sources?.some(s=>s.id===id&&s.documentReference==='UIN 219009 A04'&&s.revision==='February 2019'&&s.url?.split('#')[0]===url)));
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
 return{...base,entries:[{label:e.label,text:e.value,code:e.code,codeKind:e.codeKind,conditions:[e.conditions],sources:e.sourceIds.map(id=>{const s=b.sources.find(s=>s.id===id);return{url:s.url,title:s.title,reference:s.reference};})}],activeLabel:e.label,message:(e.codeKind==='symptom'?'Manufacturer symptom decision tree; this is not a displayed fault code.':'Manufacturer information for the exact original System S display code.')+' Follow the original Yes/No branches. No failed component or passed test has been confirmed.'};
}
