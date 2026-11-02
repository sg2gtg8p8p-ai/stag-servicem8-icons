// Exact legacy Minimiser PCB indicators. Do not broaden the shared code grammar.
const models=new Map([
 ['ideal-minimiser-ff30-41-387-16',['Minimiser FF30','41-387-16']],
 ['ideal-minimiser-ff40-41-387-17',['Minimiser FF40','41-387-17']],
 ['ideal-minimiser-ff50-41-387-18',['Minimiser FF50','41-387-18']],
 ['ideal-minimiser-ff60-41-387-19',['Minimiser FF60','41-387-19']],
 ['ideal-minimiser-ff70-41-387-20',['Minimiser FF70','41-387-20']],
 ['ideal-minimiser-ff80-41-387-21',['Minimiser FF80','41-387-21']]
]);
const norm=s=>typeof s==='string'?s.trim().toLowerCase().replace(/\s+/g,' '):'';
export function minimiserIndicatorAnswer(row,id,question,last,fallback){
 if(!models.has(id))return fallback(row,id,question,last);
 const base=fallback(row,id,'__minimiser_indicator_unmatched__',null),b=row?.boiler,[model,gc]=models.get(id);
 const deny={...base,entries:[],activeLabel:null,message:'Use the exact PCB indicator LED2, LED3 or LED4, or select the full symptom. Startup, ignition and lockout are different states; no component failure is inferred.'};
 if(!b||b.id!==id||b.manufacturer!=='Ideal'||b.model!==model||b.gcNumber!==gc||b.fuel!=='Natural Gas'||typeof question!=='string'||question.length>400)return deny;
 const q=norm(question),entries=(base.availableLabels||[]).length?(b.faultCodes||[]).filter(e=>/^LED[234]$/.test(e.code||'')&&e.codeKind==='status'&&Array.isArray(e.sourceIds)&&e.sourceIds.length&&e.sourceIds.every(id=>b.sources?.some(s=>s.id===id&&s.documentReference==='UIN111813'&&s.revision==='A05 February1997'&&s.sha256==='0c98cc8b1206a6af91ef004fb5ed9f4b4eaf0dee97c42c4e2fb6873f5d023e2c'&&s.url?.split('#')[0]==='https://www.freeboilermanuals.com/assets/pdf/ideal/111813-5.pdf'))):[];
 if(entries.length!==3)return deny;
 const exact=entries.filter(e=>norm(e.label)===q),direct=q.match(/^(?:pcb\s+)?led\s*([234])(?:\s+(?:indicator|on|lit))?[?.]?$/);
 let selected=exact.length===1?exact:direct?entries.filter(e=>e.code==='LED'+direct[1]):[];
 if(!selected.length&&last&&/^(?:what next|next|still the same|checked that|done)$/.test(q))selected=entries.filter(e=>e.label===last);
 if(selected.length===1){const e=selected[0];return{...base,entries:[{label:e.label,text:e.value,code:e.code,codeKind:e.codeKind,conditions:[e.conditions],sources:e.sourceIds.map(id=>{const s=b.sources.find(s=>s.id===id);return{url:s.url,title:s.title,reference:s.reference};})}],activeLabel:e.label,message:'Original PCB operating/protective indication for this exact Minimiser. LED2 also illuminates during startup; use the full sequence. No failed component, completed test or service verdict is established.'};}
 if(/\bled\s*\d|^led\b/.test(q))return deny;
 return fallback(row,id,question,last);
}
