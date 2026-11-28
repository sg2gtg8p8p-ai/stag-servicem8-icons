// Standalone original-manufacturer reference. Never a S/Y/Hive picker source.
export const UH8_REFERENCE=Object.freeze({
 id:'heatmiser-uh8-dssb-tm4-four-ufh-one-radiator',
 title:'Heatmiser UH8 · four UFH zones + radiator zone 8',
 model:'UH8 wired',thermostat:'DS-SB',timer:'TM4-TS',zone8:'RAD',
 sourceURL:'https://www.heatmiser.com/download/211/english/7487/uh8-manual.pdf',
 sourceSHA256:'ecf4fc0b2230ecd7eeebb6ad814e53e5b01f62bc09be4582be56671ac9ed94b1'
});
const pages=Object.freeze({
 2:'db6a225cb86f9c18ca089444bfff0405c53bca89238dc8302d8e4c5c06e81045',
 4:'6c423682623746267e0e27a2c92289ef3f8e100739bf320efd3bfbf66dccf6cc',
 5:'94b4e316be8c528b2a7001586cad7260cf5afd3ef90fe6092c5a49d974b6076f',
 6:'272da574c2bfc37590781c970c592f78328325022737433d099430922203c199',
 7:'d8bada4c1ee9a81209408296c5bc2e87683f170ddbb514aa9a0ca76e14100384'
});
export function referencePage(page,reference=UH8_REFERENCE){
 if(!reference||Object.keys(UH8_REFERENCE).some(k=>reference[k]!==UH8_REFERENCE[k])||Object.keys(reference).length!==Object.keys(UH8_REFERENCE).length||!Number.isSafeInteger(page)||!Object.hasOwn(pages,page))throw Error('Unknown UH8 manufacturer reference');
 return Object.freeze({title:'UH8 original manufacturer page '+page,page,asset:'diagrams/uh8/page-'+page+'.png',sha256:pages[page],sourceSHA256:UH8_REFERENCE.sourceSHA256});
}
export function renderUH8Reference(root,{doc,make,button,image,enlarge}){
 const scope=make('section',undefined,'swr-context-card');scope.dataset.uh8Scope='exact-manufacturer-reference';
 scope.append(make('h2','Match this exact manufacturer example'),make('p','Wired Heatmiser UH8 with DS-SB thermostats and TM4-TS timer: four UFH zones 1–4 plus radiator zone 8 selected RAD. Zones 5–7 are unused in this drawing. Pages 6 and 7 are the two halves of the same circuit; use both.'));
 scope.append(make('p','Radiator-only demand does not enable the UFH manifold pump or valve. The radiator valve end-switch path and the UFH valve interlock remain exactly as drawn. This is a reference circuit, not confirmation that your installed components match.'));
 const limits=make('section',undefined,'swr-hold');limits.append(make('h2','Check the actual installation first'));
 for(const text of [
  'Not UH8-RF, UH8-RFv2, UH8-N or UH6. No Hive substitution or combined S/Y-plan circuit is provided. Match the exact wired UH8 revision, thermostats, timer, valve auxiliary contacts and zone-8 RAD selection.',
  'The source states 3A RESISTIVE per relay and 5A RESISTIVE total, with a 5A anti-surge fuse. These are not pump motor/inrush ratings or approval for a second pump. Confirm actual loads and component instructions.',
  'Heat Enable LS/LR is described as a volt-free contact. No bridge, boiler terminal voltage, boiler compatibility or pump-overrun/permanent-live arrangement is inferred. Those require the exact boiler instructions and hydraulic design.',
  'The manufacturer recommends a manifold high-limit switch in the UFH pump feed. The GR–OR link shown applies only when the UFH valve is not fitted; it is not a general interlock bypass.',
  'No hot-water cylinder circuit, arbitrary extra zones or second-pump design is established. Isolate every supply and use qualified installation/testing. The manual revision/date and the table 50Hz versus connection-text 50/60Hz difference are not resolved here.'
 ])limits.append(make('p',text));
 root.append(scope,limits);
 const pageSection=(page,caption)=>{
  const d=referencePage(page),section=make('section',undefined,'swr-original');section.dataset.uh8Page=String(page);section.append(make('h2',caption));
  const large=button('Enlarge original page '+page,()=>enlarge(d));section.append(large);
  const preview=button('',()=>enlarge(d));preview.className='swr-diagram-page';preview.setAttribute('aria-label','Enlarge UH8 original page '+page);preview.append(image(d));section.append(preview);return section;
 };
 // Both halves remain visible together; neither is behind a selector or tab.
 root.append(pageSection(6,'Original circuit · left half, page 6'),pageSection(7,'Original circuit · right half, page 7'));
 const context=make('details');context.append(make('summary','Original operating notes, terminals and ratings · pages 2, 4 and 5'));
 for(const [page,title]of [[2,'Demand separation and zone-8 selection · page 2'],[4,'Mains, heat enable and zone terminals · page 4'],[5,'UFH pump/valve, fuse and RESISTIVE ratings · page 5']])context.append(pageSection(page,title));root.append(context);
 const refs=make('section',undefined,'swr-source-card');refs.append(make('h2','Original manufacturer source'),make('p','Heatmiser UH8 Installation Manual. Revision/date not established by the admitted pages; this reference does not approve a different installed revision. Full original page images retain all source ink and alternatives.','swr-help'));
 const link=make('a','Open original UH8 manual · circuit page 6');link.href=UH8_REFERENCE.sourceURL+'#page=6';link.target='_blank';link.rel='noopener noreferrer';refs.append(link);root.append(refs);
}
