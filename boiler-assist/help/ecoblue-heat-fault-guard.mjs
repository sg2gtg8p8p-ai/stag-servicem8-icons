// Exact EcoBlue Advance Heat ErP colour/count guard. Prepared source only.
const identities=new Map([
 ['baxi-ecoblue-advance-13-heat-erp-41-470-34','41-470-34'],['baxi-ecoblue-advance-16-heat-erp-41-470-35','41-470-35'],
 ['baxi-ecoblue-advance-19-heat-erp-41-470-36','41-470-36'],['baxi-ecoblue-advance-21-heat-erp-41-470-55','41-470-55'],
 ['baxi-ecoblue-advance-25-heat-erp-41-470-37','41-470-37'],['baxi-ecoblue-advance-30-heat-erp-41-470-38','41-470-38']
]);
const norm=v=>typeof v==='string'?v.toLowerCase().trim().replace(/[?.!]$/,'').replace(/\s+/g,' '):'';
const pattern=/^([1-6]) (green|red) flash(?:es)?$/;
export function ecoBlueHeatFaultAnswer(row,id,question,last=null,fallback){
 if(!identities.has(id))return fallback(row,id,question,last);
 const b=row?.boiler;const base=fallback(row,id,'__ecoblue_heat_colour_count_unmatched__');
 const deny={...base,entries:[],activeLabel:null,availableLabels:[],confirmedDiagnosis:false,partsRecommended:false,message:'Give both the colour and 1–6 flashes on the EcoBlue Advance Heat ErP chimney-sweep button, for example 3 green flashes. A count alone, another code family or mixed colours cannot select checks.'};
 if(!b||b.model!==('EcoBlue Advance '+id.split('-')[3]+' Heat ErP')||b.id!==id||b.manufacturer!=='Baxi'||b.gcNumber!==identities.get(id)||b.fuel!=='Natural Gas'||b.faultCodeFormat!=='baxi-ecoblue-heat-erp-colour-flashes'||b.catalogue?.evidence?.sha256!=='699bec71e72734665ab62fb9b8b71cf7643b69899cee90942f6676fce5a8aebf'||typeof question!=='string'||question.length>240)return deny;
 const url='https://www.freeboilermanuals.com/assets/pdf/baxi/baxi-eco-blue-advance-install.pdf';
 const entries=(b.faultCodes||[]).flatMap(f=>{const m=norm(f.label).match(pattern);if(!m)return[];const n=Number(m[1]),colour=m[2],page=colour==='green'?56:57;
 const sources=(f.sourceIds||[]).map(sourceId=>b.sources?.find(s=>s.id===sourceId&&s.kind==='official-manufacturer'&&s.hosting==='third-party-archive'&&s.sha256==='699bec71e72734665ab62fb9b8b71cf7643b69899cee90942f6676fce5a8aebf'&&s.documentReference==='7684198-01'&&s.revision==='06/17'&&s.manufacturer==='Baxi'&&s.models?.includes(b.model)&&s.page===page&&s.url===url+'#page='+page));
 if(!sources.length||sources.some(s=>!s)||typeof f.value!=='string'||!f.value.trim())return[];
 return[{label:f.label,text:f.value,code:colour.toUpperCase()+'-'+n,codeKind:colour==='green'?'diagnostic':'fault',colour,flashes:n,conditions:['Exact EcoBlue Advance Heat ErP Natural Gas 7684198-01 (06/17) appliance only. Colour and count must both be physically observed. No failed component or passed test is confirmed.'],sources:sources.map(s=>({url:s.url,title:s.title,reference:s.reference}))}];});
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
