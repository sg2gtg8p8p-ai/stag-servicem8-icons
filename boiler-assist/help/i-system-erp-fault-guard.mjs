// Exact NG i System ErP source/identity guard; source-only until current-base publication.
const identities=new Map([["worcester-greenstar-9i-system-erp-41-406-21",{"model":"Greenstar 9i System ErP","gc":"41-406-21"}],["worcester-greenstar-12i-system-erp-41-406-23",{"model":"Greenstar 12i System ErP","gc":"41-406-23"}],["worcester-greenstar-15i-system-erp-41-406-25",{"model":"Greenstar 15i System ErP","gc":"41-406-25"}],["worcester-greenstar-18i-system-erp-41-406-27",{"model":"Greenstar 18i System ErP","gc":"41-406-27"}],["worcester-greenstar-21i-system-erp-41-406-29",{"model":"Greenstar 21i System ErP","gc":"41-406-29"}],["worcester-greenstar-24i-system-erp-41-406-31",{"model":"Greenstar 24i System ErP","gc":"41-406-31"}]]);
const sourceSHA='10fb9ac42058a8068a24fafdcfe265f0891f83ccd5b2e786534123cf6d59a5f8',url="https://www.freeboilermanuals.com/assets/pdf/worcester_bosh/Greenstar12-24-i-System-ErP.pdf";
export function iSystemErPFaultAnswer(row,id,question,last=null,fallback){
 if(!identities.has(id))return fallback(row,id,question,last);
 const expected=identities.get(id),b=row?.boiler,base=fallback(row,id,'__i_system_erp_no_exact_pair__');
 const deny={...base,entries:[],activeLabel:null,availableLabels:[],confirmedDiagnosis:false,partsRecommended:false,message:'Confirm this exact NG i System ErP appliance and enter its printed primary/cause pair, or a cause whose primary is unspecified in the original table. Unknown/multiple/mismatched codes and another fuel/edition cannot select checks.'};
 if(!b||b.id!==id||b.manufacturer!=='Worcester Bosch'||b.model!==expected.model||b.gcNumber!==expected.gc||b.fuel!=='Natural Gas'||b.faultCodeFormat!=='worcester-paired'||b.catalogue?.evidence?.sha256!==sourceSHA||typeof question!=='string'||question.length>400)return deny;
 const codes=b.faultCodes||[];if(codes.length!==42||codes.some(f=>!f.value||f.sourceIds?.length!==1||!b.sources?.some(s=>s.id===f.sourceIds[0]&&s.documentReference==='6720806945'&&s.revision==='2015/07'&&s.sha256===sourceSHA&&s.hosting==='third-party-archive'&&s.manufacturer==='Worcester Bosch'&&s.models?.includes(b.model)&&[66,67,68,69].includes(s.page)&&s.url===url+'#page='+s.page)))return deny;
 const q=question.trim();if(codes.some(f=>f.label.toLowerCase()===q.toLowerCase()))return fallback(row,id,q,last);
 const simple=/^(?:(?:fault|error|cause|code)(?:\s+code)?\s+)?(?:(?:[a-z][a-z0-9]|[0-9][a-z])[ .\/-]*\d{3}|\d{3}|[a-z][a-z0-9]|[0-9][a-z])[?.!]?$/.test(q.toLowerCase());
 if(!simple)return deny;return fallback(row,id,q,last);
}
