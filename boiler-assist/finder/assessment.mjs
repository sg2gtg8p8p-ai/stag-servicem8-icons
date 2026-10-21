// Pure private finder assessment. No browser, storage, SDK, network or catalogue imports.
export class SurveyError extends Error {constructor(errors){super(errors.join(' '));this.errors=errors;}}
export function emptySurvey(){return {
 surveyName:'',property:'not-sure',fuel:'unknown',currentType:'not-sure',preference:'not-sure',bedrooms:'',bathrooms:'',radiators:'',
 dhwUse:'unknown',simultaneousDetails:'',dhwFlowLMin:'',dhwRiseK:'',cylinderRetain:'unknown',cylinderSpace:'unknown',location:'',flue:'',space:'',heightMM:'',widthMM:'',depthMM:'',
 supply:'unknown',waterReadingSource:'unknown',measurementPoint:'unknown',flowLMin:'',dynamicBar:'',dynamicAtFlowLMin:'',staticBar:'',measurementScenario:'unknown',measurementDetails:'',pressureConcern:'unknown',restrictions:'unknown',storageSpace:'unknown',gravityHead:'unknown',boostScope:'unknown',
 chKW:'',chBasis:'unknown',chRegime:'unknown',chTemperatures:'',manufacturer:'all',
 condensateRoute:'unknown',internalCold:'unknown',gravityDrain:'unknown',discharge:'unknown',dischargeDetails:'',routeM:'',externalM:'',liftM:'',existingCondensatePump:'unknown'
};}
const enums={property:['not-sure','house','flat','bungalow','other'],fuel:['unknown','NG','LPG','Oil'],currentType:['not-sure','combi','system','regular'],preference:['not-sure','same','combi','system','regular'],dhwUse:['unknown','single','simultaneous','other'],cylinderRetain:['unknown','yes','no','none'],cylinderSpace:['unknown','yes','no'],supply:['unknown','mains','gravity'],waterReadingSource:['unknown','domestic-tool','heating-gauge'],measurementPoint:['unknown','boiler-inlet','incoming','outlet'],measurementScenario:['unknown','required-demand','single-outlet'],pressureConcern:['unknown','domestic','heating-gauge','both','none'],restrictions:['unknown','checked','not-checked'],storageSpace:['unknown','yes','no'],gravityHead:['unknown','positive','negative'],boostScope:['unknown','hot','cold','both'],chBasis:['unknown','design-loss','measured-load','existing-rating'],chRegime:['unknown','condensing','nonCondensing'],manufacturer:['','all','survey','Baxi','Worcester Bosch','Ideal'],condensateRoute:['unknown','internal','external','mixed'],internalCold:['unknown','yes','no'],gravityDrain:['unknown','yes','no'],discharge:['unknown','yes','no'],existingCondensatePump:['unknown','yes','no']};
const numeric={bedrooms:{integer:true,label:'Bedrooms'},bathrooms:{integer:true,label:'Bathrooms'},radiators:{integer:true,label:'Radiators'},dhwFlowLMin:{positive:true,label:'Required hot-water flow'},dhwRiseK:{positive:true,label:'Hot-water temperature rise'},heightMM:{positive:true,label:'Available height'},widthMM:{positive:true,label:'Available width'},depthMM:{positive:true,label:'Available depth'},flowLMin:{label:'Measured domestic flow'},dynamicBar:{label:'Dynamic domestic pressure'},dynamicAtFlowLMin:{positive:true,label:'Flow at the dynamic-pressure test'},staticBar:{label:'Static domestic pressure'},chKW:{label:'Heating demand'},routeM:{label:'Condensate route length'},externalM:{label:'External condensate length'},liftM:{label:'Condensate lift'}};
const textKeys=['surveyName','simultaneousDetails','location','flue','space','measurementDetails','chTemperatures','dischargeDetails'];
export function validateSurvey(raw){
 const values=emptySurvey(),errors=[];
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return{ok:false,values:null,errors:['Survey inputs are unavailable.']};
 for(const key of Object.keys(raw))if(!Object.hasOwn(values,key))errors.push('Unknown survey field: '+key+'.');
 for(const [key,allowed]of Object.entries(enums)){const v=Object.hasOwn(raw,key)?raw[key]:values[key];if(typeof v!=='string'||!allowed.includes(v))errors.push('Choose a valid '+key+' option.');else values[key]=v;}
 for(const[key,rule]of Object.entries(numeric)){
  const v=Object.hasOwn(raw,key)?raw[key]:'';
  if(v===null||v===undefined||(typeof v==='string'&&v.trim()==='')){values[key]=null;continue;}
  const s=typeof v==='number'?String(v):typeof v==='string'?v.trim():'';
  const n=/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)?Number(s):NaN;
  if(!Number.isFinite(n)||n<0||(rule.positive&&n<=0)||(rule.integer&&!Number.isInteger(n))){errors.push(rule.label+': enter '+(rule.integer?'a whole number of zero or more':rule.positive?'a number greater than zero':'a number of zero or more')+', or leave it unknown.');values[key]=null;}
  else values[key]=n;
 }
 for(const key of textKeys){const v=Object.hasOwn(raw,key)?raw[key]:'';if(typeof v!=='string'||v.length>1000)errors.push('Use a short text entry for '+key+'.');else values[key]=v.trim();}
 if(values.routeM!==null&&values.externalM!==null&&values.externalM>values.routeM)errors.push('External condensate length cannot exceed the whole route length.');
 if(values.condensateRoute==='internal'&&values.externalM>0)errors.push('An internal-only condensate route cannot also have an external length. Review the route choice.');
 return{ok:!errors.length,values,errors};
}
const typeName=t=>({combi:'Combi',system:'System',regular:'Regular / heat-only',cylinder:'Cylinder-based system / regular','not-sure':'Type needs a survey'})[t]??t;
export function chooseType(n){
 let type=n.preference==='same'?n.currentType:n.preference,notes=[];
 if(type==='not-sure'&&n.cylinderRetain==='yes'){type=['system','regular'].includes(n.currentType)?n.currentType:'cylinder';notes.push('Keeping the cylinder takes priority. Confirm the cylinder controls and system layout before choosing system or regular.');}
 if(type==='combi'&&n.cylinderRetain==='yes')return{type:'not-sure',label:'Cylinder preference needs review',state:'evidence-missing',notes:['Keeping the cylinder conflicts with a combi-only replacement. Confirm the intended arrangement; the finder will not discard the cylinder.']};
 if(['system','regular','cylinder'].includes(type))notes.push(n.cylinderRetain==='yes'?'Retain and assess the existing cylinder; its condition, capacity, controls and suitability remain site checks.':n.cylinderSpace==='no'?'No cylinder space was recorded. Resolve the cylinder arrangement before proceeding.':'Confirm a retained or new cylinder and the space, controls and stored hot-water duty.');
 if(type==='combi')notes.push('Combi comparison depends on actual simultaneous hot-water demand and boiler inlet flow/pressure. Bathroom count alone does not decide the type or size.');
 if(type==='not-sure')notes.push('Choose a preferred type or complete the cylinder and water-supply survey. Bedrooms and bathrooms cannot decide the boiler type or kW alone.');
 return{type,label:typeName(type),state:type==='not-sure'?'evidence-missing':'provisional',notes};
}
// General examples are separate from the verified model-capacity assessment.
export const PRELIMINARY_SIZE_GUIDE=Object.freeze({
 id:'vaillant-general-ng-combi-two-examples',reviewedOn:'2026-10-21',
 sourceURLs:Object.freeze(['https://www.vaillant.co.uk/advice/understanding-heating-technology/boilers/what-size-boiler-do-i-need/','https://www.vaillant.co.uk/advice/understanding-heating-technology/boilers/what-is-a-condensing-boiler/']),
 qualification:'General manufacturer guide; confirm heating heat loss and simultaneous hot-water demand.',
 rows:Object.freeze([Object.freeze({bedroomsMin:1,bedroomsMax:2,radiatorsMin:0,radiatorsMax:10,bathroomsMin:1,bathroomsMax:1,minKW:24,maxKW:27}),Object.freeze({bedroomsMin:3,bedroomsMax:4,radiatorsMin:10,radiatorsMax:null,bathroomsMin:2,bathroomsMax:3,minKW:28,maxKW:34})]),
 largerPropertyBandsWithheld:true
});
export function preliminarySizeGuide(raw){
 const v=validateSurvey(raw),base={bandKW:null,qualification:PRELIMINARY_SIZE_GUIDE.qualification,sourceURLs:[...PRELIMINARY_SIZE_GUIDE.sourceURLs],setsHeatingDemand:false,selectsOrExcludesModels:false,finalSuitableOrInstallable:false};
 if(!v.ok)return{...base,state:'invalid',reason:'Correct the invalid entries before updating the guide.'};
 const n=v.values,type=chooseType(n);
 if(n.cylinderRetain==='yes')return{...base,state:'detailed-sizing-needed',reason:'Keeping a hot-water cylinder needs its own sizing assessment; no combi band is shown.'};
 if(n.fuel!=='NG'||type.type!=='combi')return{...base,state:'detailed-sizing-needed',reason:'These examples cover natural-gas combis only. Confirm the fuel and type; other arrangements need detailed sizing.'};
 if([n.bedrooms,n.bathrooms,n.radiators].some(x=>x===null))return{...base,state:'detailed-sizing-needed',reason:'Add bedrooms, bathrooms and radiators to check the two general examples, or continue with detailed sizing.'};
 const row=PRELIMINARY_SIZE_GUIDE.rows.find(r=>n.bedrooms>=r.bedroomsMin&&n.bedrooms<=r.bedroomsMax&&n.bathrooms>=r.bathroomsMin&&n.bathrooms<=r.bathroomsMax&&n.radiators>=r.radiatorsMin&&(r.radiatorsMax===null||n.radiators<=r.radiatorsMax));
 if(!row)return{...base,state:'detailed-sizing-needed',reason:'These counts do not match either reviewed example. Detailed sizing is needed; no range is estimated.'};
 return{...base,state:'preliminary-band',bandKW:{min:row.minKW,max:row.maxKW},reason:'A general catalogue-size range, not a calculated heating load or a model recommendation.'};
}
export function assessSurvey(raw){
 const valid=validateSurvey(raw);if(!valid.ok)return{state:'invalid',errors:valid.errors};
 const n=valid.values,type=chooseType(n),missing=[],notes=[];
 const usableCH=n.chKW!==null&&['design-loss','measured-load'].includes(n.chBasis);
 if(n.chKW===null)missing.push('A calculated or measured heating demand is not recorded.');
 else if(!usableCH)missing.push(n.chBasis==='existing-rating'?'An existing boiler rating is not a design heat loss. Establish the required heating load.':'The basis of the stated heating demand is unknown. Keep the CH comparison provisional.');
 if(n.chRegime==='unknown')missing.push('The proposed CH operating condition is unknown; condensing and non-condensing ranges remain separate.');
 if(!n.chTemperatures)missing.push('The heating design flow/return or other design-temperature basis is not recorded.');
 if(n.dhwFlowLMin===null)missing.push('Record the actual required simultaneous hot-water flow, rather than sizing from bathrooms.');
 if(n.dhwRiseK===null)missing.push('Record the temperature rise used for the hot-water requirement.');

 if(n.dhwUse==='unknown'||!n.simultaneousDetails)missing.push('Describe which hot-water outlets must run together and the demand basis.');
 const domestic=n.waterReadingSource==='domestic-tool';
 if(!domestic)missing.push(n.waterReadingSource==='heating-gauge'?'The sealed heating pressure gauge does not measure incoming domestic water. Record separate domestic-tool readings.':'Confirm that water readings are from the domestic flow/pressure tool.');
 for(const[key,label]of [['flowLMin','Measured domestic flow'],['dynamicBar','Dynamic domestic pressure'],['dynamicAtFlowLMin','Flow during the dynamic-pressure test']])if(n[key]===null)missing.push(label+' is not recorded.');
 if(n.measurementPoint!=='boiler-inlet')missing.push('Verify the available flow and dynamic pressure at the proposed boiler inlet; another test point does not establish inlet performance.');
 if(n.measurementScenario!=='required-demand')missing.push('Water supply has not been measured under the stated simultaneous-demand conditions.');
 if(!n.measurementDetails)missing.push('Record the test location and other hot/cold outlets running during measurement.');
 if(n.dynamicAtFlowLMin!==null&&n.dhwFlowLMin!==null&&n.dynamicAtFlowLMin!==n.dhwFlowLMin)missing.push('Dynamic pressure was measured at '+n.dynamicAtFlowLMin+' L/min, while the requirement is '+n.dhwFlowLMin+' L/min. Verify the pressure at the actual demand; do not extrapolate.');
 if(n.supply==='unknown')missing.push('Confirm mains-fed or gravity-fed domestic supply.');
 if(n.supply==='gravity')missing.push('A gravity-fed arrangement needs its own supply and boosting design before a mains-combi performance comparison can be relied on.');
 if(n.fuel==='unknown')missing.push('Confirm the fuel. No NG fallback is applied.');
 if(type.type==='not-sure')missing.push('The boiler type is not resolved.');
 notes.push('No heating kW is calculated from bedrooms or bathrooms. Lower CH minimum output can be useful for load matching, but it does not automatically identify a best boiler.');
 return{state:missing.length?'evidence-missing':'provisional',errors:[],values:n,type,missing,notes,usableCH,requiredCH:{kw:n.chKW,basis:n.chBasis,regime:n.chRegime,temperatures:n.chTemperatures},requiredDHW:{flowLMin:n.dhwFlowLMin,riseK:n.dhwRiseK,use:n.dhwUse,simultaneous:n.simultaneousDetails},supply:{domesticReadingsUsable:domestic,fullRatedFlowEstablished:false,staticSubstitutesForDynamic:false},finalSuitableOrInstallable:false};
}
function poolGap(n,type){
 if(n.fuel!=='NG')return n.fuel==='unknown'?'Which fuel does the boiler use? Choose Natural gas, LPG or Oil.':'No source-reviewed '+n.fuel+' replacement models are active. NG is not substituted for another fuel.';
 if(type.type==='not-sure')return 'Which boiler type would you like to compare? Choose Combi, System or Regular / heat-only.';
 if(type.type!=='combi')return 'No active '+typeName(type.type).toLowerCase()+' model pool is available. Only eight NG combi variants from Baxi, Worcester Bosch and Ideal are reviewed here; keep the survey and resolve this exact data gap.';
 return null;
}
export function chRatingLines(m){
 if(m.chKW.comparisonPolicy==='source-mean-temperatures-only')return['Non-condensing '+m.chKW.nonCondensing.min+'–'+m.chKW.nonCondensing.max+' kW at 70°C MEAN water temperature','Condensing '+m.chKW.condensing.min+'–'+m.chKW.condensing.max+' kW at 40°C MEAN water temperature'];
 if(m.chKW.kind==='unqualified')return['Published CH range '+m.chKW.range.min+'–'+m.chKW.range.max+' kW; condensing/non-condensing and water-temperature basis not stated.'];
 return['Non-condensing '+m.chKW.nonCondensing.min+'–'+m.chKW.nonCondensing.max+' kW','Condensing '+m.chKW.condensing.min+'–'+m.chKW.condensing.max+' kW'];
}
export function dhwRatingLine(m){
 const output=m.dhwKW===null?'DHW output not separately verified':m.dhwKW+' kW DHW';
 return output+' · '+Object.entries(m.dhwFlowsLMin).map(([rise,flow])=>flow+' L/min at '+rise+' K').join(' · ');
}
export function matchModels(raw,data,manufacturer){
 const a=assessSurvey(raw);if(a.state==='invalid')return{state:'invalid',errors:a.errors,models:[],gap:'Correct the survey entries first.'};
 const n=a.values,gap=poolGap(n,a.type);if(gap)return{state:'evidence-missing',gap,models:[],assessment:a};
 const brand=manufacturer??n.manufacturer;
 if(brand==='survey')return{state:'evidence-missing',gap:'Survey only: no manufacturer or model has been selected.',models:[],assessment:a};
 if(!brand)return{state:'evidence-missing',gap:'Choose a manufacturer after reviewing the type and demand, or choose Survey only.',models:[],assessment:a};
 const held=data.heldManufacturers.find(m=>m.manufacturer===brand);if(held)return{state:'evidence-missing',gap:brand+' source review is pending. '+held.reason,models:[],assessment:a};
 const pool=data.models.filter(m=>(brand==='all'||m.manufacturer===brand)&&m.fuel===n.fuel&&m.type===a.type.type);
 if(!pool.length)return{state:'evidence-missing',gap:'No exact source-backed model data is active for this manufacturer, fuel and type.',models:[],assessment:a};
 const models=pool.map(m=>{
  const reasons=[],cautions=[],missing=[...a.missing],unqualified=m.chKW.kind==='unqualified',meanOnly=m.chKW.comparisonPolicy==='source-mean-temperatures-only';
  const requiredChecks=[...(meanOnly?[]:[unqualified?'The manufacturer publishes one CH range without a condensing/non-condensing or water-temperature basis. Do not treat it as equivalent to either Baxi category.':'The manufacturer HTML does not give exact CH water temperatures. Verify its CH basis against the design; do not assume 50/30 or 80/60.']),
   'Full rated-flow dynamic pressure is not supplied by this source. Passing minimum operation or a static-pressure condition does not establish full hot-water delivery.',
   'Confirm installation manual, fuel, flue, gas supply, controls, clearances and condensate arrangement on site.'];
  const source=data.sources.find(s=>s.id===m.sourceId),linked=m.sourceIds.map(id=>data.sources.find(s=>s.id===id));
  if(!source?.currentListingObserved||linked.some(s=>!s)||!m.sourceIds.includes(m.shared.sourceId))return{...m,state:'evidence-missing',reasons:[],cautions:['Current model source binding is unavailable.'],requiredChecks,sourceURL:null,sourceURLs:[],supplyFullRatedFlowEstablished:false,finalSuitableOrInstallable:false};
  if(unqualified)missing.push('This model has an unqualified CH range; its operating/water-temperature basis needs verification against the design.');
  if(meanOnly){missing.push('CH sizing comparison withheld: match the design basis to the source 70°C MEAN non-condensing / 40°C MEAN condensing water temperatures. A generic category or free-text flow/return entry does not verify equivalence.');requiredChecks.push(m.shared.minimumPressureMeaning);}
  if(a.usableCH&&!meanOnly){
   const range=unqualified?m.chKW.range:n.chRegime==='unknown'?null:m.chKW[n.chRegime];
   const maximum=range?.max??Math.max(m.chKW.condensing.max,m.chKW.nonCondensing.max);
   if(n.chKW>maximum)reasons.push(unqualified?'Stated heating demand '+n.chKW+' kW exceeds the published unqualified CH maximum '+maximum+' kW. No condensing equivalence is assumed.':'Stated heating demand '+n.chKW+' kW exceeds '+(range?'the listed '+(n.chRegime==='condensing'?'condensing':'non-condensing')+' CH maximum ':'both listed CH maxima (highest ')+maximum+' kW'+(range?'':')')+'.');
   if(range&&n.chKW<range.min)cautions.push(unqualified?'The stated load is below the published unqualified CH minimum '+range.min+' kW. Verify the rating basis and load profile; no best-model ranking is inferred.':'The stated heating demand is below the listed '+(n.chRegime==='condensing'?'condensing':'non-condensing')+' CH minimum '+range.min+' kW. Assess modulation, zoning and the load profile; this alone is not an exclusion or a best-model ranking.');
  }
  const ratedFlow=n.dhwRiseK===null?undefined:m.dhwFlowsLMin[String(n.dhwRiseK)];
  if(ratedFlow===undefined){missing.push('No verified DHW rating at '+(n.dhwRiseK===null?'an unknown rise':n.dhwRiseK+' K')+' for this exact model. No interpolation or scaling is performed.');cautions.push('Verified flow bases: '+Object.keys(m.dhwFlowsLMin).join(' K / ')+' K only.');}
  else if(n.dhwFlowLMin!==null&&n.dhwFlowLMin>ratedFlow)reasons.push('Required hot-water flow '+n.dhwFlowLMin+' L/min at '+n.dhwRiseK+' K exceeds the source rating '+ratedFlow+' L/min at '+n.dhwRiseK+' K.');
  const relevant=a.supply.domesticReadingsUsable&&n.measurementPoint==='boiler-inlet'&&n.measurementScenario==='required-demand';
  if(relevant&&n.flowLMin!==null&&n.dhwFlowLMin!==null&&n.flowLMin<n.dhwFlowLMin)reasons.push('Measured available domestic flow '+n.flowLMin+' L/min under the stated demand is below the required '+n.dhwFlowLMin+' L/min. A pump is not assumed to fix it.');
  const opFlow=m.shared.minimumDhwFlowLMin,opPressure=m.shared.minimumDhwOperatingPressureBar;
  if(opFlow!==null&&relevant&&n.flowLMin!==null&&n.flowLMin<opFlow)reasons.push(meanOnly?'Measured domestic flow is below the source minimum DHW delivery '+opFlow+' L/min; this is not a full-flow guarantee.':'Measured domestic flow is below the source minimum operation '+opFlow+' L/min; that minimum is not a full-flow guarantee.');
  const pressureComparable=relevant&&n.dynamicBar!==null&&n.dynamicAtFlowLMin!==null&&n.dhwFlowLMin!==null&&n.dynamicAtFlowLMin===n.dhwFlowLMin;
  if(opPressure!==null&&pressureComparable&&n.dynamicBar<opPressure)reasons.push('Dynamic pressure '+n.dynamicBar+' bar at the stated demand is below the source minimum operating '+opPressure+' bar. Full-rated pressure requirements remain unverified.');
  if(opPressure===null||opFlow===null)missing.push('Minimum OPERATING dynamic pressure/flow is not separately verified for this model; Baxi 0.5 bar / 2 L/min is not transferred.');
  const staticMinimum=m.shared.minimumStaticMainsPressureForMaximumFlowBar;
  if(staticMinimum!==undefined&&staticMinimum!==null){
   if(!a.supply.domesticReadingsUsable||n.measurementPoint!=='boiler-inlet'||n.supply!=='mains'||n.staticBar===null)missing.push('Verify STATIC mains pressure at the boiler inlet against the source '+staticMinimum+' bar condition for maximum flow. Dynamic pressure cannot substitute for STATIC.');
   else if(n.staticBar<staticMinimum){
    const message='Recorded STATIC mains pressure '+n.staticBar+' bar is below this exact model’s '+staticMinimum+' bar STATIC condition for maximum flow; this is not an operating dynamic minimum.';
    if(ratedFlow!==undefined&&n.dhwFlowLMin!==null&&n.dhwFlowLMin>=ratedFlow)reasons.push(message+' The requested rated flow is therefore not established.');
    else missing.push(message+' Performance at a lower requested flow remains unverified.');
   }else cautions.push('Recorded STATIC pressure meets the published '+staticMinimum+' bar maximum-flow condition only. Dynamic/full-flow delivery still needs verification.');
  }
  for(const[key,dimension,label]of [['heightMM','height','height'],['widthMM','width','width'],['depthMM','depth','depth']])if(n[key]!==null&&n[key]<m.shared.dimensionMM[dimension])reasons.push('Recorded space '+label+' '+n[key]+' mm is smaller than the boiler body '+m.shared.dimensionMM[dimension]+' mm. Passing body dimensions would not establish clearance or fit.');
  const minFailure=(opFlow!==null&&relevant&&n.flowLMin!==null&&n.flowLMin<opFlow)||(opPressure!==null&&pressureComparable&&n.dynamicBar<opPressure);
  const observedMinima=opFlow!==null&&opPressure!==null&&relevant&&n.flowLMin!==null&&n.flowLMin>=opFlow&&pressureComparable&&n.dynamicBar>=opPressure;
  return{...m,state:reasons.length?'excluded':missing.length?'evidence-missing':'provisional',reasons,cautions,evidenceMissing:missing,requiredChecks,sourceURL:source.url,sourceURLs:linked.map(s=>({id:s.id,url:s.url})),minimumOperationStatus:minFailure?'known-failure':observedMinima?'observed-minima-only':'not-established',supplyFullRatedFlowEstablished:false,finalSuitableOrInstallable:false};
 });
 return{state:models.every(m=>m.state==='excluded')?'excluded':models.some(m=>m.state==='provisional')?'provisional':'evidence-missing',gap:null,models,assessment:a,ranking:'Source order only; no best-boiler ranking or automatic selection.'};
}

export function installationChecks(raw,data){
 const a=assessSurvey(raw);if(a.state==='invalid')return{state:'invalid',errors:a.errors};const n=a.values;
 const domestic=a.supply.domesticReadingsUsable;
 const lowFlow=domestic&&n.measurementScenario==='required-demand'&&(a.type.type==='combi'||n.measurementPoint==='outlet')&&n.flowLMin!==null&&n.dhwFlowLMin!==null&&n.flowLMin<n.dhwFlowLMin;
 const applicableMinimum=n.fuel==='NG'&&a.type.type==='combi'&&n.manufacturer==='Baxi'?data?.models.find(m=>m.manufacturer==='Baxi'&&m.fuel==='NG'&&m.type==='combi')?.shared.minimumDhwOperatingPressureBar:null;
 const lowPressure=domestic&&n.measurementPoint==='boiler-inlet'&&applicableMinimum!==null&&applicableMinimum!==undefined&&n.dynamicBar!==null&&n.dynamicBar<applicableMinimum&&n.dynamicAtFlowLMin!==null&&n.dhwFlowLMin!==null&&n.dynamicAtFlowLMin===n.dhwFlowLMin&&n.measurementScenario==='required-demand';
 const water=[],waterSources=['domestic-water-conditions'];let boostAssessment=false;
 if(n.pressureConcern==='heating-gauge'||n.waterReadingSource==='heating-gauge')water.push('A low sealed-heating gauge reading is a separate heating-system issue. Do not prescribe a domestic booster to correct that gauge.');
 if(lowFlow||lowPressure){boostAssessment=true;water.push('Investigate the measured domestic supply shortfall, restrictions and faults. Recheck representative inlet flow/pressure before assuming a booster is appropriate.');}
 else water.push('Full domestic supply performance is not established. No pump purchase or guaranteed flow is inferred from static pressure, minimum operation or a bedroom count.');
 if(n.restrictions!=='checked')water.push('Check existing inlet/outlet restrictions and supply faults before selecting any boosting arrangement.');
 if(n.supply==='mains'){
  waterSources.push('mains-boosting','booster-notification');
  if(boostAssessment)water.push('Mains-fed: assess a manufacturer-permitted inline booster, stored-water set or accumulator against the actual inlet conditions, flow/pressure duty and storage space. No exact pump is selected.');
  else water.push('Mains-fed: verify supply under simultaneous use; an inline booster, stored set or accumulator is only an assessment option if a real shortfall is established.');
  water.push('For a pump inducing demand exceeding 12 L/min, directly or indirectly connected, confirm the water undertaker notification process and other applicable requirements. Being at or below that figure is not blanket approval.');
 }else if(n.supply==='gravity'){
  boostAssessment=true;waterSources.push('gravity-boosting');water.push('Gravity-fed: assess actual positive/negative head and hot/cold boosting needs with the exact pump instructions. Do not transfer a gravity shower-pump arrangement to a mains-fed combi.');
 }else water.push('Supply type is unknown. Identify mains versus gravity before choosing a domestic boosting approach.');
 const condensate=[],condensateSources=['condensate-route'];let condensatePumpAssessment=false;
 if(n.gravityDrain==='no'){condensatePumpAssessment=true;condensateSources.push('condensate-pump-context');condensate.push('Gravity drainage is not practicable as recorded. Assess a proprietary boiler-condensate pump, conditional on a suitable discharge and verified duty; a domestic booster is a different product.');}
 else if(n.gravityDrain==='yes')condensate.push('Gravity drainage is reported possible. Prefer a suitable internal foul-water route where practicable and confirm the exact boiler fall/discharge instructions. External routing alone does not require a pump.');
 else condensate.push('Survey whether gravity drainage can meet the exact boiler instructions over the actual route. No automatic condensate-pump decision is made.');
 const freezeReview=['external','mixed'].includes(n.condensateRoute)||n.internalCold==='yes';
 if(freezeReview)condensate.push('Review freezing risk for every external or unheated section, including an internal loft/garage. Verify source-specific material, diameter, fall, run length, insulation/protection and termination; no generic pipe dimensions supplied.');
 else if(n.condensateRoute==='unknown'||n.internalCold==='unknown')condensate.push('Route or cold-space exposure is unknown. An internal label alone does not establish freeze protection.');
 if(n.discharge!=='yes')condensate.push('A suitable discharge connection is not established. A pump does not create drain permission or make an unsuitable termination acceptable.');
 if(condensatePumpAssessment||n.existingCondensatePump==='yes'){
  condensateSources.push('condensate-pump-context');condensate.push('For an existing or proposed condensate pump, verify chemistry/temperature compatibility, flow at actual lift and run, discharge connection, maintenance access and overflow/alarm interlock instructions. No exact model or duty is selected.');
  if(n.liftM===null||n.routeM===null)condensate.push('Record actual route length and lift before an exact condensate-pump duty check.');
 }
 return{state:'conditional-survey-checks',water:{boostAssessment,items:water,sourceIds:[...new Set(waterSources)],guaranteedBoost:false,pumpModel:null},condensate:{pumpAssessment:condensatePumpAssessment,freezeReview,items:condensate,sourceIds:[...new Set(condensateSources)],pumpModel:null},site:['Verify exact flue route, terminal, kit and clearance compatibility using the selected boiler installation instructions.','Confirm the recorded location/body space, service access, gas supply and exact controls/interface; body dimensions alone are not installation fit.','No parts compatibility, merchant pricing, stock, warranty or installation approval is established.'],finalSuitableOrInstallable:false};
}

export const FIELD_LABELS={surveyName:'Survey name',property:'Property',fuel:'Fuel',currentType:'Current type',preference:'Type preference',bedrooms:'Bedrooms',bathrooms:'Bathrooms',radiators:'Radiators',dhwUse:'Hot-water use',simultaneousDetails:'Outlets running together / demand basis',dhwFlowLMin:'Required hot water (L/min)',dhwRiseK:'Required temperature rise (K)',cylinderRetain:'Keep cylinder',cylinderSpace:'Cylinder space',location:'Location constraints',flue:'Flue constraints',space:'Space / access constraints',heightMM:'Available height (mm)',widthMM:'Available width (mm)',depthMM:'Available depth (mm)',supply:'Domestic supply',waterReadingSource:'Water reading source',measurementPoint:'Water measurement point',flowLMin:'Measured domestic flow (L/min)',dynamicBar:'Dynamic domestic pressure (bar)',dynamicAtFlowLMin:'Flow at dynamic-pressure test (L/min)',staticBar:'Static domestic pressure (bar)',measurementScenario:'Measurement scenario',measurementDetails:'Measurement location / concurrent use',pressureConcern:'Reported pressure concern',restrictions:'Restrictions / faults checked',storageSpace:'Domestic storage space',gravityHead:'Gravity supply head',boostScope:'Gravity boosting need',chKW:'Heating demand (kW)',chBasis:'Heating demand basis',chRegime:'CH operating category',chTemperatures:'CH design water temperatures / basis',manufacturer:'Manufacturer choice',condensateRoute:'Condensate route',internalCold:'Internal unheated section',gravityDrain:'Gravity drainage feasible',discharge:'Suitable discharge established',dischargeDetails:'Discharge notes',routeM:'Condensate route length (m)',externalM:'External condensate length (m)',liftM:'Condensate lift (m)',existingCondensatePump:'Existing condensate pump'};
const optionText={all:'All available makes','not-sure':'Not sure',unknown:'Unknown',NG:'Natural gas',LPG:'LPG',Oil:'Oil',combi:'Combi',system:'System',regular:'Regular / heat-only',same:'Keep current type',none:'None / not applicable',single:'Single outlet',simultaneous:'Simultaneous outlets',other:'Other',mains:'Mains-fed',gravity:'Gravity-fed','domestic-tool':'Domestic flow/pressure tool','heating-gauge':'Sealed heating gauge','boiler-inlet':'Proposed boiler inlet',incoming:'Incoming supply (inlet performance not yet verified)',outlet:'Outlet only (inlet performance not yet verified)','required-demand':'Representative stated simultaneous demand','single-outlet':'Single-outlet test','not-checked':'Not checked','design-loss':'Calculated design heat loss','measured-load':'Measured delivered heating demand','existing-rating':'Existing boiler rating (not a design load)',nonCondensing:'Non-condensing',condensing:'Condensing',survey:'Survey only',internal:'Internal',external:'External',mixed:'Mixed',positive:'Positive head',negative:'Negative / unsuitable positive head',hot:'Hot water',cold:'Cold water',both:'Both',yes:'Yes',no:'No',checked:'Checked'};
export function surveySummary(raw,result,data){
 const v=validateSurvey(raw);if(!v.ok)throw new SurveyError(v.errors);if(!result||result.assessment.state==='invalid')throw new SurveyError(['Review the current survey before copying.']);
 if(JSON.stringify(v.values)!==JSON.stringify(result.assessment.values))throw new SurveyError(['Inputs changed. Review the current survey before copying.']);
 const n=v.values,lines=['BOILER FINDER — PROVISIONAL SURVEY','Temporary in-page information; no model is approved for installation.',''];
 for(const key of Object.keys(FIELD_LABELS)){const value=n[key];lines.push(FIELD_LABELS[key]+': '+(value===null||value===''?'Not recorded':optionText[value]??String(value)));}
 const g=result.sizeGuide??preliminarySizeGuide(raw);lines.push('','PRELIMINARY SIZE GUIDE',g.bandKW?g.bandKW.min+'–'+g.bandKW.max+' kW general catalogue-size band':'No preliminary band',g.reason,g.qualification,'Room counts do not set the heating load or select/exclude a model.',...g.sourceURLs.map(url=>'Guide source: '+url));
 const a=result.assessment;lines.push('','TYPE / DEMAND',a.type.label,...a.type.notes,'CH requirement: '+(a.requiredCH.kw===null?'unknown':a.requiredCH.kw+' kW')+'; basis '+(optionText[a.requiredCH.basis]??a.requiredCH.basis)+'.','DHW requirement: '+(a.requiredDHW.flowLMin===null?'unknown':a.requiredDHW.flowLMin+' L/min')+' at '+(a.requiredDHW.riseK===null?'unknown rise':a.requiredDHW.riseK+' K')+'.',...a.missing.map(x=>'Evidence missing: '+x),'','CURRENT MODEL COMPARISON (eight NG combi variants across three makes)');
 if(result.matches.gap)lines.push(result.matches.gap);
 for(const m of result.matches.models)lines.push(m.manufacturer+' '+m.model+' / '+m.productCode+' — '+m.state,...chRatingLines(m),dhwRatingLine(m),...m.reasons,...m.cautions,...(m.evidenceMissing??[]).map(x=>'Evidence missing: '+x),...m.requiredChecks,...m.sourceURLs.map(s=>'Source: '+s.url));
 lines.push('','CONDITIONAL INSTALLATION CHECKS',...result.installation.water.items,...result.installation.condensate.items,...result.installation.site,'','SOURCES / LIMITS','Original Baxi/Worcester source observation: '+data.priorSourceObservation.sourceObservedAt.slice(0,10)+'. Ideal listing observation: '+data.sources.find(s=>s.id==='ideal-logic-max-combi2-current-listing').observedAtUTC.slice(0,10)+'. No live price, stock, warranty or full-market coverage.');
 const sourceIds=new Set([...result.matches.models.flatMap(m=>m.sourceIds),...result.installation.water.sourceIds,...result.installation.condensate.sourceIds]);
 for(const s of data.sources)if(sourceIds.has(s.id))lines.push(s.id+': '+s.url);
 return lines.join('\n');
}
export function createSurveyStore(data){
 let survey=emptySurvey(),revision=0,result=null,copy=null;
 const snapshot=()=>structuredClone({survey,revision,result,copy});
 return{getState:snapshot,reset(){survey=emptySurvey();revision++;result=null;copy=null;return snapshot();},update(patch){for(const key of Object.keys(patch))if(!Object.hasOwn(survey,key))throw new SurveyError(['Unknown survey field: '+key]);survey={...survey,...patch};revision++;result=null;copy=null;return snapshot();},assess(){const assessment=assessSurvey(survey);if(assessment.state==='invalid'){result=null;copy=null;return{ok:false,errors:assessment.errors};}result={revision,assessment,matches:matchModels(survey,data),installation:installationChecks(survey,data),sizeGuide:preliminarySizeGuide(survey)};copy=null;return{ok:true,result:structuredClone(result)};},prepareCopy(){if(!result||result.revision!==revision)throw new SurveyError(['Inputs changed. Review the current survey before copying.']);copy={revision,text:surveySummary(survey,result,data)};return structuredClone(copy);},isCurrentCopy(rev){return !!copy&&copy.revision===revision&&rev===revision;}};
}
