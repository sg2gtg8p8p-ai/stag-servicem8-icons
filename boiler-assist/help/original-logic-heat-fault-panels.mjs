export function renderOriginalLogicHeatFaultPages(parent,selected,section,node,safeLink,bundles,assetBase){
 const bundle=bundles.find(b=>b.identity.id===selected?.id);
 if(!bundle||['manufacturer','model','gcNumber','productNumber','fuel'].some(k=>(selected[k]??null)!==(bundle.identity[k]??null)))return;
 const source=bundle.source;
 if(!selected.sources?.some(s=>s.documentReference===source.documentReference&&s.revision===source.revision&&s.url?.split('#')[0]===source.url))return;
 const pages=bundle.sections[section];if(!pages?.length)return;
 const group=node('details',undefined,'manufacturer-original-logic-heat-fault-pages');
 group.append(node('summary','Original manufacturer diagrams and procedures'));
 group.open=section==='parts';
 group.append(node('p',selected.model+' · GC '+selected.gcNumber+' · Natural Gas G20. '+source.documentReference+' ('+source.revision+'). '+(source.hosting==='manufacturer-hosted'?'Manufacturer-hosted source.':'Manufacturer-authored manual, preserved by an independent archive.'),'fga-note'));
 if(bundle.notes?.[section])group.append(node('p',bundle.notes[section],'fga-note'));
 for(const page of pages){
  const asset=bundle.assets.find(a=>a.page===page);if(!asset)throw Error('Exact-model original page missing');
  const title=bundle.titles[String(page)]||'Manufacturer original';
  const details=node('details',undefined,'manufacturer-source-page');
  details.append(node('summary','Page '+page+' — '+title));
  details.open=section==='parts'&&page===pages[0];
  const image=node('img');image.src=assetBase+source.documentReference+'/'+asset.file;
  image.alt=selected.model+': '+title;image.loading='lazy';image.width=asset.width;image.height=asset.height;
  Object.assign(image.style,{width:'100%',maxWidth:'100%',height:'auto',display:'block',background:'#fff'});
  const viewport=node('div');Object.assign(viewport.style,{overflow:'auto',maxHeight:'75vh'});viewport.append(image);
  const enlarge=node('button','Loading original page…');enlarge.type='button';enlarge.disabled=true;let zoom=false;
  image.addEventListener('load',()=>{enlarge.disabled=false;enlarge.textContent='Enlarge original page';});
  image.addEventListener('error',()=>{enlarge.disabled=true;enlarge.textContent='Page unavailable — open the source PDF';});
  enlarge.addEventListener('click',()=>{if(enlarge.disabled)return;zoom=!zoom;image.style.width=zoom?String(image.naturalWidth||asset.width)+'px':'100%';image.style.maxWidth=zoom?'none':'100%';enlarge.textContent=zoom?'Fit page to screen':'Enlarge original page';});
  details.append(enlarge,viewport);
  const link=safeLink(source.hosting==='manufacturer-hosted'?'Manufacturer PDF source ↗':'Archived manufacturer PDF ↗',source.url+'#page='+page,'manual-button');
  if(link)details.append(link);group.append(details);
 }
 parent.append(group);return true;
}

export function renderOriginalLogicHeatFaultChart(doc,parent,id,entry,configuration){
 const identity=configuration.identities.find(b=>b.id===id),chart=configuration.charts.find(c=>c.label===entry?.label);
 if(!identity||identity.fuel!=='Natural Gas'||!chart||!entry.sources?.some(s=>s.url===configuration.manualURL+'#page='+chart.page))return false;
 const asset=configuration.assets.find(a=>a.page===chart.page);if(!asset)return false;
 const el=(tag,text)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 const group=el('section');group.className='ideal-original-logic-heat-fault-chart';group.append(el('h4','Original diagnostic chart — page '+chart.page),el('p',identity.model+' · GC '+identity.gcNumber+' · Natural Gas · '+configuration.reference+'. Manufacturer-authored archived copy. Follow the original Yes/No branches.'));
 const image=el('img');image.src=configuration.assetBase+asset.file;image.alt='Original manufacturer chart: '+entry.label;image.width=asset.width;image.height=asset.height;image.loading='eager';Object.assign(image.style,{width:'100%',maxWidth:'100%',height:'auto',display:'block',background:'#fff'});
 const viewport=el('div');Object.assign(viewport.style,{overflow:'auto',maxHeight:'75vh'});viewport.append(image);const zoom=el('button','Loading original chart…');zoom.type='button';zoom.disabled=true;let enlarged=false;
 image.addEventListener('load',()=>{zoom.disabled=false;zoom.textContent='Enlarge original chart';});image.addEventListener('error',()=>{zoom.disabled=true;zoom.textContent='Chart unavailable — use the archived manufacturer PDF below';});
 zoom.addEventListener('click',()=>{if(zoom.disabled)return;enlarged=!enlarged;image.style.width=enlarged?String(image.naturalWidth||asset.width)+'px':'100%';image.style.maxWidth=enlarged?'none':'100%';zoom.textContent=enlarged?'Fit chart to screen':'Enlarge original chart';});
 group.append(zoom,viewport);parent.append(group);return true;
}

export function patchOriginalLogicHeatFaultPages(html,bundles,{native=false,assetBase='./manual-pages/ideal-original-logic-heat-faults-20261029/'}={}){
 const hook=native?'    content.replaceChildren(node("h3", sections[activeSection]));':'    renderEngineerGuide(content);';
 if(html.split(hook).length!==2||html.includes('manufacturer-original-logic-heat-fault-pages'))throw Error('Exact original Logic Heat fault-page hook');
 return html.replace(hook,()=>hook+'\n    ('+renderOriginalLogicHeatFaultPages.toString()+')(content,selected,activeSection,node,safeLink,'+JSON.stringify(bundles).replace(/</g,'\\u003c')+','+JSON.stringify(assetBase)+');');
}

export function patchOriginalLogicHeatFaultCharts(html,configuration){
 if(typeof html!=='string'||html.includes('ideal-original-logic-heat-fault-chart'))throw Error('Unpatched original Logic Heat fault client required');
 const hooks=['for(const s of e.sources||[])link(card,s);','for (const s of e.sources || []) link(card, s);'].filter(s=>html.split(s).length===2);if(hooks.length!==1)throw Error('Exact native source hook');
 return html.replace(hooks[0],()=> '('+renderOriginalLogicHeatFaultChart.toString()+')(document,card,id,e,'+JSON.stringify(configuration).replace(/</g,'\\u003c')+');'+hooks[0]);
}

export const originalLogicHeatFaultConfiguration={"identities":[{"id":"ideal-logic-heat-original-12-ng-41-399-99","manufacturer":"Ideal","model":"Logic Heat 12","gcNumber":"41-399-99","productNumber":null,"fuel":"Natural Gas"},{"id":"ideal-logic-heat-original-15-ng-41-409-93","manufacturer":"Ideal","model":"Logic Heat 15","gcNumber":"41-409-93","productNumber":null,"fuel":"Natural Gas"},{"id":"ideal-logic-heat-original-18-ng-41-409-94","manufacturer":"Ideal","model":"Logic Heat 18","gcNumber":"41-409-94","productNumber":null,"fuel":"Natural Gas"},{"id":"ideal-logic-heat-original-24-ng-41-409-95","manufacturer":"Ideal","model":"Logic Heat 24","gcNumber":"41-409-95","productNumber":null,"fuel":"Natural Gas"},{"id":"ideal-logic-heat-original-30-ng-41-409-96","manufacturer":"Ideal","model":"Logic Heat 30","gcNumber":"41-409-96","productNumber":null,"fuel":"Natural Gas"}],"charts":[{"label":"L1 — Flow-temperature trip","page":51},{"label":"L2 — Ignition lockout","page":51},{"label":"L5 — Repeated-reset limit","page":50},{"label":"L6 — Unexpected flame indication","page":51},{"label":"F2 — Flame lost","page":52},{"label":"F3 — Fan circuit fault","page":52},{"label":"F4 — Heating flow sensor fault","page":52},{"label":"F5 — Heating return sensor fault","page":52},{"label":"F6 — Outdoor sensor fault","page":53},{"label":"F7 — Mains voltage too low","page":50},{"label":"F9 — PCB fault indication","page":50},{"label":"FA — Flow and return reversed","page":53},{"label":"FD — Water flow not detected","page":53},{"label":"F0 — Boiler chip card absent","page":50},{"label":"C2 — Boiler chip card fault","page":53},{"label":"C0 — Reset-required display","page":50},{"label":"No central heating","page":54},{"label":"No hot water","page":54},{"label":"Blank display","page":54}],"assets":[{"page":47,"file":"page-47.png","width":974,"height":1351,"bytes":498564,"sha256":"3b2528beacdd0d4dd6a4535abc14f4ffc0509b4a3595b7a3548adf192f091209"},{"page":50,"file":"page-50.png","width":974,"height":1351,"bytes":206248,"sha256":"db388d82939c6ad4ce7d9f44bc50fb0f5596f700fc44ec2976717d7add913d60"},{"page":51,"file":"page-51.png","width":974,"height":1351,"bytes":308156,"sha256":"279e896047acbe1b78395afcdbfea4afba4c588c02b34952aa09c9099fafe2b0"},{"page":52,"file":"page-52.png","width":974,"height":1351,"bytes":299048,"sha256":"0493643f3af1694ab95256528d9448f2ec6578eb625f6aa3dd87f93b46e7f3df"},{"page":53,"file":"page-53.png","width":974,"height":1351,"bytes":223730,"sha256":"c644cb98658e2489c21ec20bdbafa61d3553a40ba977b9ab393f2fa176dd940e"},{"page":54,"file":"page-54.png","width":974,"height":1351,"bytes":342771,"sha256":"6a4ef2113b003fe2f3185c13f727055caf84f9964819c4077bf4397ebca48e3a"}],"manualURL":"https://www.freeboilermanuals.com/assets/pdf/ideal/Logic-Heat-Installation-Manual.compressed.pdf","reference":"UIN 205862 A06 (January 2014)","assetBase":"./manual-pages/ideal-original-logic-heat-faults-20261029/UIN%20205862%20A06/"};
