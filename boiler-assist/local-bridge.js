import {dataset,detail} from './decoder.js';
const norm=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]/g,'');
// Build substitutes the exact existing read-only local parts-search function.
async function parts(query,includeTools=false,offset=0){const data=await dataset('parts-search-index'),appliances=new Map(data.appliances.map(a=>[a.id,a])),words=query.trim().toLowerCase().split(/\s+/).filter(Boolean),exact=norm(query);const matches=data.parts.filter(p=>{if(!includeTools&&p.kind!=='spare-part')return false;const a=appliances.get(p.applianceId),text=[p.description,...p.descriptionAliases,p.manufacturerPartNumber,a.manufacturer,a.range,a.model,a.gcNumber,a.productNumber,...a.aliases].join(' ').toLowerCase();return !words.length||words.every(w=>text.includes(w))||(exact&&[p.manufacturerPartNumber,a.gcNumber,a.productNumber].some(v=>norm(v)===exact));}).sort((a,b)=>(norm(b.manufacturerPartNumber)===exact)-(norm(a.manufacturerPartNumber)===exact)||a.description.localeCompare(b.description));return {total:matches.length,offset,results:matches.slice(offset,offset+24).map(p=>({...p,appliance:appliances.get(p.applianceId)}))};}
globalThis.SMClient={init:()=>({invoke:async(name,args={})=>{
  if(name==='boiler_detail'){
    const result=Object.hasOwn(args,'partsQuery')?{partsSearch:await parts(args.partsQuery,args.includeTools,args.partsOffset)}:await detail(args.recordId);
    return {eventResponse:JSON.stringify({kind:name,...result||{error:'Boiler details unavailable'}})};
  }
  if(name==='boiler_return')return {eventResponse:JSON.stringify({kind:name,context:null})};
  throw Error('Live ServiceM8 account actions are unavailable in the offline reference app.');
}})};
