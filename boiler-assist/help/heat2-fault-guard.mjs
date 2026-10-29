import {matchReviewedTextRoute} from './heat2-fault-routes.mjs';
export const heat2Identities=new Map([12,15,18,24,30].map((n,i)=>[`ideal-logic-max-heat-2-h${n}-41-860-${25+i}`,{model:`Logic MAX Heat 2 H${n}`,gc:`41-860-${25+i}`} ]));
export const isHeat2FaultQuestion=value=>matchReviewedTextRoute(value)!==null;
const sourceURL='https://idealheating.com/_gatsby/file/880e104aace600895a7dd5fd16a7edf8/Logic%20MAX%20Heat%20Installation%20&%20Servicing%20-%20November%202025%20UIN%20228292%20A11.pdf?u=https%3A%2F%2Fdownloads.ctfassets.net%2Fsj902orc9wh4%2FP1yL86VVNBAU8d4FGfcLs%2F9a2fbc14bfc80858c0751a8f888c0d24%2FLogic_MAX_Heat_Installation___Servicing_-_November_2025_UIN_228292_A11.pdf';
export function heat2FaultAnswer(row,id,question,last,previous){
 if(!heat2Identities.has(id))return previous(row,id,question,last);
 const b=row?.boiler,identity=heat2Identities.get(id),base=previous(row,id,'__heat2_unmatched__');
 const deny={...base,entries:[],activeLabel:null,message:'Enter this Heat2 model’s exact saved fault text, Fd, or a listed symptom. Other-generation short codes and unreviewed LCD messages cannot be substituted.'};
 if(!b||b.id!==id||b.manufacturer!=='Ideal'||b.model!==identity.model||b.gcNumber!==identity.gc||b.productNumber!==null||b.fuel!=='Natural Gas'||b.faultCodeFormat!=='ideal-max-heat2-a11-text'||typeof question!=='string'||question.length>400)return deny;
 const entries=(b.faultCodes||[]).filter(e=>e.sourceIds?.length&&e.sourceIds.every(k=>b.sources?.some(s=>s.id===k&&s.documentReference==='UIN 228292 A11'&&s.revision==='November 2025'&&s.url?.split('#')[0]===sourceURL)));
 const q=question.trim().toLowerCase().replace(/\s+/g,' ');let chosen=entries.filter(e=>e.label.toLowerCase()===q);
 if(!chosen.length){const route=matchReviewedTextRoute(question);if(route)chosen=entries.filter(e=>e.code===route.key&&e.codeKind===route.kind);else if(last&&/^(what next|next|still the same|checked that|done)$/.test(q))chosen=entries.filter(e=>e.label===last);}
 if(chosen.length!==1)return deny;
 const e=chosen[0];return{...base,entries:[{label:e.label,text:e.value,code:e.code,codeKind:e.codeKind,conditions:[e.conditions],sources:e.sourceIds.map(k=>{const s=b.sources.find(s=>s.id===k);return{url:s.url,title:s.title,reference:s.reference};})}],activeLabel:e.label,message:(e.codeKind==='symptom'?'Manufacturer symptom chart; no displayed fault code is implied.':'Manufacturer information for this exact Heat2 source.')+' Follow the original Yes/No branches and disclosed source ambiguities. No failed component or passed test has been confirmed.'};
}
