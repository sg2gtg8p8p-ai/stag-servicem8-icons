// Identity candidates and deterministic reference retrieval. No generated advice.
export const MAX_TEXT=12000;
export const SECTIONS={technicalData:'Technical data',fullService:'Full Service Procedure',serviceMode:'Modes & controls',serviceProcedure:'Additional service notes',combustion:'Combustion / FGA',adjustments:'Gas valve / fan',spareParts:'Spare Parts',parts:'Components & test points',faultCodes:'Fault codes',manuals:'Official manuals',notes:'Manufacturer notes',sources:'Sources & applicability'};
const clean=value=>typeof value==='string'?value:'';
const words=value=>clean(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function gcTokens(text){
  const normalized=clean(text).slice(0,MAX_TEXT).replace(/[\u2010-\u2015\u2212]/g,'-').replace(/\bGC(?=\d)/gi,'GC ');
  return [...new Set([...normalized.matchAll(/(?<![a-z0-9])(\d{2}[\s-]?\d{3}[\s-]?\d{2})(?![a-z0-9])/gi)].map(m=>m[1].replace(/\D/g,'')))];
}
function gcIdentity(value){const s=clean(value).trim();return /^\d{2}[\s-]?\d{3}[\s-]?\d{2}$/.test(s)?s.replace(/\D/g,''):null;}
function productMatch(text,code){
  const value=clean(code).trim();
  // Never interpret wildcard/pattern identifiers or short numbers as exact codes.
  if(!/^[a-z0-9][a-z0-9 -]{3,39}[a-z0-9]$/i.test(value)||!/\d/.test(value))return false;
  const normalized=value.replace(/[ -]/g,'');
  if(normalized.length<5)return false;
  const pattern=[...normalized].map(escape).join('[ -]?');
  return new RegExp('(?<![a-z0-9])'+pattern+'(?![a-z0-9])','i').test(text);
}
export function identify(text,records){
  text=clean(text).slice(0,MAX_TEXT);const tokens=gcTokens(text),normalized=' '+words(text)+' ';
  const candidates=[];const matchedGc=new Set();
  for(const record of records){
    if(!record||typeof record.id!=='string')continue;
    const reasons=[];const gc=gcIdentity(record.gcNumber);
    if(gc&&tokens.includes(gc)){reasons.push('Exact GC digits');matchedGc.add(gc);}
    const products=[record.productNumber,...(Array.isArray(record.productNumbers)?record.productNumbers:[])];
    if(products.some(code=>productMatch(text,code)))reasons.push('Exact product code');
    const brand=words(record.manufacturer),model=words(record.model),designation=words(record.designation);
    if(brand&&normalized.includes(' '+brand+' ')&&[model,designation].some(name=>name.length>=5&&normalized.includes(' '+name+' ')))reasons.push('Name match — check exact code');
    if(reasons.length)candidates.push({record,reasons,exactCode:reasons.some(r=>r.startsWith('Exact'))});
  }
  const unmatchedGc=tokens.filter(token=>!matchedGc.has(token));
  const exact=candidates.filter(c=>c.exactCode),names=candidates.filter(c=>!c.exactCode);
  // Keep all matching records, including variants that share a name or code.
  return {candidates:[...exact,...names],gcTokens:tokens,unmatchedGc,
    conflict:exact.length>1||unmatchedGc.length>0,
    abstained:candidates.length===0,
    message:candidates.length?'Choose the exact catalogue entry only after checking the data plate, fuel and installed setup.':'No supported match. Retake a close, clear label photo or type the exact GC/product code. A photo of the casing alone cannot confirm a boiler or part.'};
}
export function identityLabel(record){return [record.manufacturer,record.model,record.gcNumber?'GC '+record.gcNumber:'',record.productNumber?'Product '+record.productNumber:'',record.fuel||'Fuel not specified',record.generation].filter(Boolean).join(' · ');}
export function identityEqual(a,b){return !!a&&!!b&&['id','manufacturer','model','gcNumber','productNumber','fuel','generation'].every(key=>(a[key]??null)===(b[key]??null));}
export function safeURL(value){try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}}
export function manualLinks(row){
  const boiler=row?.boiler;if(!boiler)return [];
  const entries=[...(Array.isArray(boiler.manuals)?boiler.manuals:[]),...(Array.isArray(boiler.sources)?boiler.sources:[])];
  const seen=new Set();return entries.flatMap(s=>{const url=safeURL(s.url);if(!url||seen.has(url))return [];seen.add(url);return [{url,label:clean(s.label)||clean(s.title)||'Saved source',reference:clean(s.reference)}];});
}
export function questionTopic(question){
  const q=words(question);if(!q)return null;
  if(/\b(gas valve|offset|co2|co 2|combustion|flue gas|fga|calibrat\w*|burner|nozzle|oil|gas pressure|gas rate|air ratio|adjust\w*|purge|tightness|electrod\w*|ignit\w*|repair|replac\w*|wire|wiring|electric\w*|screw|turn|torque|fan speed)\b/.test(q))return {section:/\b(oil|burner|nozzle|electrod\w*|repair|replac\w*)\b/.test(q)?'fullService':/\b(fga|combustion|co2|co 2|flue gas)\b/.test(q)?'combustion':'adjustments',routeOnly:true};
  if(/\b(set|setting|settings|increase|decrease|pressuris\w*|bleed|fill|drain|test|measure|bypass|override|safety)\b/.test(q))return {section:'fullService',routeOnly:true};
  if(/\b(fault|error|lockout|code)\b/.test(q))return {section:'faultCodes',routeOnly:true};
  if(/\b(service|servicing|clean|cleaning)\b/.test(q))return {section:'fullService',routeOnly:true};
  if(/\b(mode|controls|reset|info|chimney|menu)\b/.test(q))return {section:'serviceMode',routeOnly:true};
  if(/\b(part|parts|component|spare)\b/.test(q))return {section:'parts',routeOnly:true};
  if(/\b(manual|instructions|source|sources|document)\b/.test(q))return {section:'manuals',routeOnly:false};
  if(/\b(note|notes|applicability|generation)\b/.test(q))return {section:'notes',routeOnly:false};
  if(/\b(height|width|depth|dimension|dimensions|weight|size|output|rating|technical|specification|specifications|capacity)\b/.test(q))return {section:'technicalData',routeOnly:false};
  return null;
}
function linkedSources(block,row){
  const ids=Array.isArray(block?.sourceIds)?block.sourceIds:[];
  const sources=Array.isArray(row.boiler.sources)?row.boiler.sources:[];
  // An unresolved source ID is not evidence. Preserve the complete block rather
  // than manufacture an answer for unreferenced values.
  return ids.length&&ids.every(id=>sources.some(s=>s.id===id&&safeURL(s.url)))?sources.filter(s=>ids.includes(s.id)):[];
}
export function retrieve(row,confirmed,question){
  if(!identityEqual(row?.boiler,confirmed))return {kind:'unavailable',message:'Confirm the exact boiler again before looking up a question.',links:[]};
  const links=manualLinks(row),topic=questionTopic(question);
  const context={identity:identityLabel(row.boiler),applicability:clean(row.boiler.applicability),
    notes:structuredClone(Array.isArray(row.boiler.notes)?row.boiler.notes:[]),
    fuel:clean(row.boiler.fuel),status:'Saved reference only. Coverage is partial; confirm the data plate, fuel, generation and fitted configuration. No measured result, part fit or completed work is established.'};
  if(!topic)return {kind:'unavailable',message:'That question is not covered by this saved-guide lookup. Open the exact manual or use the complete library sections.',links,context};
  if(topic.routeOnly)return {kind:'section',section:topic.section,title:SECTIONS[topic.section],context,links,message:'Use the complete existing section, including its setup selection, source conditions and unresolved items. This lookup does not provide a separate adjustment, repair or diagnostic procedure.'};
  if(topic.section==='manuals')return {kind:'manuals',section:'manuals',context,links,message:links.length?'Saved manual/source links for this exact catalogue entry. External documents need a connection.':'No source-linked manual is available for this entry.'};
  if(topic.section==='technicalData'&&!/\b(height|width|depth|dimension|dimensions|weight|size|output|rating|capacity)\b/.test(words(question)))return {kind:'section',section:topic.section,title:SECTIONS[topic.section],context,links,message:'Open the complete technical section to read its full applicability, source conditions and setup choices.'};
  const selection=row.boiler.fga?.selection;
  if(selection?.required||selection?.contexts?.length>1||row.presentation?.boilers?.[row.boiler.id]?.engineerGuides?.[topic.section])return {kind:'section',section:topic.section,title:SECTIONS[topic.section],context,links,message:'This section has configuration choices or a complete contextual guide. Open it in the library and read its full conditions before using any value.'};
  const native=row.boiler[topic.section];
  let blocks=Array.isArray(native)?native:Object.entries(native&&typeof native==='object'?native:{}).map(([key,value])=>({key,value}));
  if(!Array.isArray(native)){
    const q=words(question);
    const filter=/\b(height|width|depth|dimension|dimensions|weight|size)\b/.test(q)?/height|width|depth|dimension|weight/i:/\b(output|rating|capacity)\b/.test(q)?/output|rating|capacity/i:null;
    blocks=blocks.filter(item=>!filter||filter.test(item.key+' '+clean(item.value?.label))).map(item=>item.value);
  }
  if(blocks.some(block=>block?.contextIds?.length||block?.contexts||block?.contextId))return {kind:'section',section:topic.section,title:SECTIONS[topic.section],context,links,message:'These entries have configuration-specific conditions. Use the complete section and its setup choices instead of an isolated answer.'};
  const referenced=blocks.filter(block=>block&&typeof block==='object').map(block=>({block:structuredClone(block),sources:structuredClone(linkedSources(block,row))})).filter(item=>item.sources.length);
  // Also retain the WHOLE original native section and associated presentation in
  // the result for auditing. The UI displays only complete resolved source blocks.
  return {kind:referenced.length?'references':'unavailable',section:topic.section,title:SECTIONS[topic.section],context,links,blocks:referenced,
    message:referenced.length?'Complete source-linked saved entries are shown below. They are reference specifications, not new advice or verified readings.':'No supported source-linked answer is available here. Open the complete section or the exact manual; do not infer missing values.',
    completePresentation:structuredClone(row.presentation?.boilers?.[row.boiler.id]?.[topic.section]??null)};
}
export function createSession(){
  let generation=0,confirmed=null;
  return {token:()=>generation,valid:token=>token===generation,
    invalidate(){generation++;confirmed=null;return generation;},
    confirm(record){generation++;confirmed=structuredClone(record);return generation;},
    confirmed:()=>confirmed?structuredClone(confirmed):null};
}
