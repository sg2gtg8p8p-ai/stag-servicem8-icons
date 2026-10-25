// Shared, deterministic lookup over the exact selected manufacturer's record.
// No generated diagnostic steps, part recommendation, supplier call or user data storage.
export function faultAnswer(row,recordId,question,previousLabel=null){
 const b=row?.boiler,clean=v=>typeof v==='string'?v:'',norm=v=>clean(v).toLowerCase().replace(/[\u2010-\u2015]/g,'-').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' '),q=norm(question);
 const safe=u=>{try{const v=new URL(u);return v.protocol==='https:'&&!v.username&&!v.password?v.href:null;}catch{return null;}};
 if(!b||b.id!==recordId||!q||clean(question).length>400)return{kind:'unavailable',message:'Select the exact boiler and enter a fault code or the words on its display.',entries:[]};
 const identity=[b.manufacturer,b.model,b.gcNumber?'GC '+b.gcNumber:'',b.productNumber?'Product '+b.productNumber:'',b.fuel,b.generation].filter(Boolean).join(' · ');
 const sources=Array.isArray(b.sources)?b.sources:[],rows=Array.isArray(b.faultCodes)?b.faultCodes:[];
 const available=rows.flatMap((f,index)=>{const ids=Array.isArray(f.sourceIds)?f.sourceIds:[];const links=ids.map(id=>sources.find(s=>s.id===id&&safe(s.url)));return ids.length&&links.every(Boolean)&&typeof f.label==='string'&&typeof f.value==='string'?[{index,label:f.label,text:f.value,code:f.code||null,codeKind:f.codeKind||null,conditions:[f.conditions,f.condition,f.applicability,f.notes,f.note].filter(Boolean),sources:links.map(s=>({url:safe(s.url),title:s.title||'Manufacturer fault guide',reference:s.reference||s.documentReference||''}))}]:[];});
 const links=(b.manuals||[]).filter(s=>safe(s.url)).map(s=>({url:safe(s.url),title:s.label||'Manufacturer manual',reference:s.value||''}));
 const base={kind:'fault-answer',recordId,identity,availableLabels:available.map(e=>e.label),entries:[],links,activeLabel:null,applicability:clean(b.applicability),notes:Array.isArray(b.notes)?b.notes:[],completePresentation:row.presentation?.boilers?.[b.id]?.faultCodes||null,confirmedDiagnosis:false,partsRecommended:false};
 // Only bounded exact code matches. F.28 must never match F.280, or another model's table.
 const codes=[...clean(question).toUpperCase().matchAll(/\b(?:[A-Z]{1,2}[. -]?\d{1,4}(?:[. -]\d{1,3})?|\d{3})\b/g)].map(m=>m[0].replace(/[^A-Z0-9]/g,''));
 const codeOf=e=>clean(e.code||e.label.match(/^\s*(?:(?:FAULT|STATUS|DIAGNOSTIC|MAINTENANCE)\s*[—:-]\s*)?([A-Za-z]{1,2}[. -]?\d{1,4}(?:[. -]\d{1,3})?|\d{3})(?=\s|[—:–-]|$)/)?.[1]).toUpperCase().replace(/[^A-Z0-9]/g,'');
 let selected=[];
 if(codes.length){selected=available.filter(e=>codes.includes(codeOf(e)));if(!selected.length||codes.some(c=>!available.some(e=>codeOf(e)===c)))return{...base,message:'That exact code is not in the saved fault information for this boiler. Check the code and any subcode on the display; use this model’s manufacturer manual. No meaning or checks have been guessed.'};}
 else{
  selected=available.filter(e=>{const label=norm(e.label.replace(/^(FAULT|STATUS|DIAGNOSTIC|MAINTENANCE)\s*[—:-]\s*/i,'').split(/[—–]/)[0]);return label.length>3&&(q===label||(' '+q+' ').includes(' '+label+' '));});
  if(!selected.length&&previousLabel&&/^(what (next|now|else|should i check)|what do i check( next)?|next|still (the same|not working)|that (is|s) (ok|fine)|checked( that)?|done)$/.test(q))selected=available.filter(e=>e.label===previousLabel);
 }
 if(selected.length===1)return{...base,entries:selected,activeLabel:selected[0].label,message:'Manufacturer fault information and checks for this exact boiler. Follow the linked decision tree in order; a code alone does not prove a failed part. '+(previousLabel===selected[0].label?'Your previous fault is retained. Report the actual check result; no test has been marked passed automatically.':'')};
 if(selected.length>1)return{...base,entries:selected,message:'More than one saved entry matches. Choose the exact code, subcode or display wording before deciding which checks apply.'};
 return{...base,message:available.length?'Tell me the exact fault code and subcode, or choose the display wording below. A symptom alone does not establish the cause.':'No source-linked fault information is saved for this exact entry. Open its manufacturer manual; no checks have been invented.'};
}
