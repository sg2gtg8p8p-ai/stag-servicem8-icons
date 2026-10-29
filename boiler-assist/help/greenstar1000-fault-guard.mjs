const expected=new Map([['worcester-greenstar-1000-24kw-combi-ng-7736902178',{model:'Greenstar 1000 24kW combi NG',gcNumber:'47-800-38',productNumber:'7736902178'}],['worcester-greenstar-1000-30kw-combi-ng-7736902179',{model:'Greenstar 1000 30kW combi NG',gcNumber:'47-800-39',productNumber:'7736902179'}]]);
const source='https://www.worcester-bosch.co.uk/support/literature/download/release/6721835943/47592';
export function greenstar1000FaultAnswer(row,id,question,last,previous){
 if(!expected.has(id))return previous(row,id,question,last);
 const b=row?.boiler,e=expected.get(id);
 const deny={kind:'fault-answer',recordId:id,entries:[],availableLabels:[],activeLabel:null,confirmedDiagnosis:false,partsRecommended:false,message:'Confirm the exact Greenstar1000 NG model, GC, product number and reviewed6721835943(2024/01) source before using its saved fault table.'};
 if(!b||b.id!==id||b.manufacturer!=='Worcester Bosch'||b.fuel!=='Natural Gas'||b.faultCodeFormat!=='worcester-numeric'||Object.entries(e).some(([k,v])=>b[k]!==v)||typeof question!=='string'||question.length>400)return deny;
 if(b.faultCodes?.length!==119||!b.faultCodes.every(f=>f.sourceIds?.length&&f.sourceIds.every(k=>b.sources?.some(s=>s.id===k&&s.documentReference==='6721835943'&&s.revision==='2024/01'&&s.url?.split('#')[0]===source&&s.page===f.sourcePage))))return deny;
 // Literature publication dates are not production-period proof. Preserve catalogue identity,
 // but use the reviewed guide's explicit applicability in this prepared answer.
 const result=previous(row,id,question,last);
 return{...result,applicability:row.presentation?.fullService?.boilers?.[id]?.applicability||'',message:(result.message||'')+' Use the complete original table and disclosed fitted-revision/source ambiguities.'};
}
