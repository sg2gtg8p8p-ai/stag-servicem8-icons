// Ranked engine copied exactly from src/search.js; manual searches make no AI call.
import {identify,gcTokens} from './logic.mjs';
export function createBoilerSearch(boilers){
 const normal=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/(\d)([a-z])/g,'$1 $2').replace(/([a-z])(\d)/g,'$1 $2').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
 const identifier=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
 const words=s=>normal(s).split(' ').filter(Boolean);
 const redundant=new Set(['greenstar','bosch']);
 const core=s=>words(s).filter(t=>!redundant.has(t)).join(' ');
 const oneEdit=(a,b)=>{if(a===b)return true;if(a.length<4||b.length<4||Math.abs(a.length-b.length)>1||/\d/.test(a+b))return false;let i=0,j=0,edits=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue;}if(++edits>1)return false;if(a.length>=b.length)i++;if(b.length>=a.length)j++;}return edits+(a.length-i)+(b.length-j)<=1;};
 const index=boilers.map(b=>{const aliases=Array.isArray(b.aliases)?b.aliases:[];const models=[b.model,b.designation,...aliases].filter(Boolean);const modelWords=new Set(models.flatMap(words));const identityWords=new Set([b.manufacturer,b.range,...models,b.boilerType,b.fuel,b.variant,b.outputVariant,b.generation].filter(v=>typeof v==='string').flatMap(words));const type=normal(b.boilerType||b.technicalData?.boilerType?.value||'');if(/combi|combination/.test(type)){identityWords.add('c');identityWords.add('combi');}if(/system/.test(type)){identityWords.add('s');identityWords.add('system');}if(b.fuel==='Natural Gas')identityWords.add('ng');return{b,modelWords,identityWords,models:models.map(normal),cores:models.map(core),manufacturerWords:new Set(words(b.manufacturer)),gc:identifier(b.gcNumber),product:identifier(b.productNumber),technical:normal(Object.values(b.technicalData||{}).map(v=>v.value).join(' ')),parts:normal((b.parts||[]).map(v=>v.value).join(' '))};});
 return function find(query,{manufacturer='',browse=false}={}){
  const text=normal(query),raw=identifier(String(query||'').replace(/^\s*(?:gc(?:\s*number)?|product(?:\s*(?:number|code))?)\s*[:#]?\s*/i,''));
  if(!text&&!browse&&!manufacturer)return{matches:[],autoOpen:null,fuzzy:false,query:text};
  const tokens=words(query).filter(t=>!redundant.has(t));let candidates=[];
  for(const x of index){if(manufacturer&&x.b.manufacturer!==manufacturer)continue;let score=0,kind='',fuzzy=false;
   if(text&&x.b.id===String(query).trim()){score=11000;kind='record-id';}
   else if(raw&&x.gc&&raw===x.gc){score=10000;kind='gc';}
   else if(raw&&x.product&&raw===x.product){score=9000;kind='product';}
   else if(!text){score=1;kind='browse';}
   else{
    let changed=0;const matched=tokens.every(t=>{if(x.identityWords.has(t))return true;if([...x.identityWords].some(w=>oneEdit(t,w))){changed++;return true;}return false;});
    if(matched){fuzzy=changed>0;const modifiers=new Set(['ng','natural','gas','lpg']);const withoutBrand=tokens.filter(t=>!x.manufacturerWords.has(t)&&!modifiers.has(t));const exact=x.cores.some(m=>m.split(' ').filter(t=>!x.manufacturerWords.has(t)&&!modifiers.has(t)).join(' ')===withoutBrand.join(' '))||x.models.includes(text);score=fuzzy?1000:exact?5000:3000;score+=tokens.filter(t=>x.modelWords.has(t)).length*10;kind=fuzzy?'suggestion':exact?'model':'identity';}
    // Preserve explicit stored-value/part searches without indexing source prose or other models in manuals.
    else if((/[\d].*(?:l\s*\/\s*min|mbar|ppm|kw|bar)/i.test(query)||/^\d{6,}$/.test(raw))&&tokens.every(t=>words(x.technical+' '+x.parts).includes(t))){score=500;kind='stored-value';}
   }
   if(score)candidates.push({boiler:x.b,score,kind,fuzzy});
  }
  candidates.sort((a,b)=>b.score-a.score||a.boiler.manufacturer.localeCompare(b.boiler.manufacturer)||a.boiler.model.localeCompare(b.boiler.model)||a.boiler.id.localeCompare(b.boiler.id));
  if(candidates[0]&&['gc','product'].includes(candidates[0].kind))candidates=candidates.filter(m=>m.kind===candidates[0].kind);
  // Exact numeric identifiers can resolve lower-ranked identity matches, but duplicate identifiers never auto-open.
  const top=candidates[0],exactIDs=top&&['gc','product'].includes(top.kind)?candidates.filter(m=>m.kind===top.kind):[];
  const autoOpen=top&&!top.fuzzy&&((exactIDs.length===1)||(!exactIDs.length&&candidates.length===1&&top.kind==='model'&&tokens.some(t=>/^\d+$/.test(t))))?top.boiler:null;
  return{matches:candidates,autoOpen,fuzzy:!!top?.fuzzy,query:text};
 };
}
export function manualCandidates(query,records){
 query=typeof query==='string'?query.slice(0,240).trim():'';
 if(!query)return {candidates:[],unmatchedGc:[],message:'Enter a make and model, or a GC number.'};
 if(gcTokens(query).length){
  const result=identify(query,records);
  if(result.unmatchedGc.length&&!result.candidates.length)result.message='That GC code is not in the saved catalogue. Check the digits; no different boiler has been substituted.';
  return result;
 }
 const result=createBoilerSearch(records)(query);
 const candidates=result.matches.filter(m=>m.kind!=='stored-value').map(m=>({record:m.boiler,exactCode:['gc','product'].includes(m.kind),reasons:[m.kind==='gc'?'Exact GC digits':m.kind==='product'?'Exact product code':m.fuzzy?'Possible name match — check model and exact code':'Name match — check exact model and code']}));
 return {candidates,unmatchedGc:[],abstained:!candidates.length,conflict:candidates.length>1,message:candidates.length?'Choose the exact model, output, GC code and fuel from the results. No boiler has been selected automatically.':'No saved boiler matched that search. Check the make/model or enter its GC number.'};
}
