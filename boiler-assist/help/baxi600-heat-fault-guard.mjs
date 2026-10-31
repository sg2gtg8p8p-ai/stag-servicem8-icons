// Exact original Baxi600Heat colour/count guard; prepared only, not installed.
const identities=new Map([
 ['baxi-baxi-612-heat-erp-41-470-66','41-470-66'],['baxi-baxi-615-heat-erp-41-470-67','41-470-67'],
 ['baxi-baxi-618-heat-erp-41-470-68','41-470-68'],['baxi-baxi-624-heat-erp-41-470-69','41-470-69'],['baxi-baxi-630-heat-erp-41-470-70','41-470-70']
]);
const norm=v=>typeof v==='string'?v.toLowerCase().trim().replace(/[?.!]$/,'').replace(/\s+/g,' '):'';
const pattern=/^([1-6]) (green|red) flash(?:es)?$/;
export function baxi600HeatFaultAnswer(row,id,question,last=null,fallback){
 if(!identities.has(id))return fallback(row,id,question,last);
 const b=row?.boiler;const base=fallback(row,id,'__baxi600_colour_count_unmatched__');
 const deny={...base,entries:[],activeLabel:null,availableLabels:[],confirmedDiagnosis:false,partsRecommended:false,message:'Give both the colour and1–6 flashes on the original600Heat chimney-sweep button, for example3 green flashes. A count alone, another code family or mixed colours cannot select checks.'};
 if(!b||b.id!==id||b.manufacturer!=='Baxi'||b.gcNumber!==identities.get(id)||b.fuel!=='Natural Gas'||b.faultCodeFormat!=='baxi-600-heat-colour-flashes'||b.enrichment?.documentReference!=='7726858-01'||b.enrichment?.revision!=='1/19'||typeof question!=='string'||question.length>240)return deny;
 const url=b.enrichment.manualUrl;
 const entries=(b.faultCodes||[]).flatMap(f=>{const m=norm(f.label).match(pattern);if(!m)return[];const n=Number(m[1]),colour=m[2],page=colour==='green'?56:57;
 const sources=(f.sourceIds||[]).map(sourceId=>b.sources?.find(s=>s.id===sourceId&&s.kind==='official-manufacturer'&&s.documentReference==='7726858-01'&&s.revision==='1/19'&&s.manufacturer==='Baxi'&&s.models?.includes(b.model)&&s.page===page&&s.url===url+'#page='+page));
 if(!sources.length||sources.some(s=>!s)||typeof f.value!=='string'||!f.value.trim())return[];
 return[{label:f.label,text:f.value,code:colour.toUpperCase()+'-'+n,codeKind:colour==='green'?'diagnostic':'fault',colour,flashes:n,conditions:['Exact original600Heat NaturalGas7726858-01(1/19) appliance only. Colour and count must both be physically observed. No failed component or passed test is confirmed.'],sources:sources.map(s=>({url:s.url,title:s.title,reference:s.reference}))}];});
 const available={...deny,availableLabels:entries.map(e=>e.label)};
 if(entries.length!==12||new Set(entries.map(e=>e.code)).size!==12)return available;
 let q=norm(question).replace(/\b(one|two|three|four|five|six)\b/g,word=>String(['one','two','three','four','five','six'].indexOf(word)+1));
 if(/^(?:[1-6] )?orange flash(?:es)?$/.test(q)||q==='orange flashing')return{...available,message:'The source describes orange flashes at a heating demand as an output indication, not one of the green blocking/red lock-out entries. No output rating or model is inferred from that count. Confirm the observed colour and demand before selecting fault checks.'};
 let chosen=[];const match=q.match(/^(?:(?:fault|error|status) )?(?:([1-6]) (green|red) flash(?:es)?|(green|red) ([1-6]) flash(?:es)?|([1-6]) flash(?:es)? (green|red))$/);
 if(match){const n=Number(match[1]||match[4]||match[5]),colour=match[2]||match[3]||match[6];chosen=entries.filter(e=>e.flashes===n&&e.colour===colour);}
 else if(last&&/^(?:next|what next|still the same|checked that|done)$/.test(q))chosen=entries.filter(e=>e.label===last);
 if(chosen.length!==1)return available;
 const e=chosen[0];return{...available,entries:[e],activeLabel:e.label,message:(e.colour==='green'?'Manufacturer auto-reset/blocking condition. Normal operation may resume when its cause clears; persistent conditions may lock out. ':'Manufacturer red lock-out condition. Repeating faults require investigation; no automatic reset is performed. ')+'Follow this exact manufacturer entry. No failed part, passed test or completed repair is confirmed.'};
}
