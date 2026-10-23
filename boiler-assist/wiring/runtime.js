// Deterministic scoped wiring runtime. HTML SRI covers all executed new code and source data.
(()=>{
'use strict';
const SWR_MODULE_BASE=new URL('./viewer.mjs',document.currentScript?.src||new URL('./wiring/runtime.js',document.baseURI)).href;
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const DATA=freeze({
  "schemaVersion": 1,
  "sources": {
    "resideo": {
      "id": "resideo",
      "title": "Resideo / Honeywell Home Heating Controls Wiring Guide",
      "edition": "Issue 19 · ©2024 · issue date not stated",
      "url": "https://www.resideo.com/gb/en/-/media/EMEA%20Site%20Cluster/Mastersite/Documents/Sales%20Literature/Resideo_HWHome_Wiring%20Guide_May24.pdf/?rv=4a17ca0fc4ee4e588b93905ce95b5d89",
      "sha256": "ec0b205ad90b01bdb7177c0f757d0e356a2b7c06cf99a891ef5b10e61472bc2b",
      "bytes": 3033263,
      "pageCount": 36,
      "inline": false,
      "accessNote": "Open the original manual. Inline display is unavailable here; the source response did not expose cross-origin access.",
      "pages": {
        "6": {
          "printed": 6,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "7": {
          "printed": 7,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "8": {
          "printed": 8,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "9": {
          "printed": 9,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "10": {
          "printed": 10,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "11": {
          "printed": 11,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "12": {
          "printed": 12,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "13": {
          "printed": 13,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "14": {
          "printed": 14,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": true
        },
        "15": {
          "printed": 15,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "16": {
          "printed": 16,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "17": {
          "printed": 17,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "18": {
          "printed": 18,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "19": {
          "printed": 19,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "20": {
          "printed": 20,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": true
        },
        "21": {
          "printed": 21,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "22": {
          "printed": 22,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": false
        },
        "32": {
          "printed": 32,
          "caption": "Complete original page, including notes and any alternative pump-overrun inset.",
          "identityHold": true
        }
      },
      "manualIndexPages": [
        2,
        4,
        23,
        24,
        25,
        26,
        27,
        28
      ]
    },
    "slt3-current": {
      "id": "slt3-current",
      "title": "Hive Thermostat - Professional Installation Guide",
      "edition": "20-page guide · ©2025 · issue date not stated",
      "url": "https://assets.ctfassets.net/mijf9lz5yt3u/4LFy5x5QRqycyxGKT3HXYA/92716ffff1c680323bd9397f298920f2/Hive_Thermostat_SLT3_Installation_Guide_LR__1_.pdf",
      "sha256": "9d06f70e5c586c5071b8962e88517141752fa275148d5d7f0da1e09eb6e5df2d",
      "bytes": 737078,
      "pageCount": 20,
      "inline": true,
      "accessNote": "Original manual page; source integrity is checked before display.",
      "pages": {
        "7": {
          "printed": 7,
          "caption": "Complete original page and notes. Receiver or zone illustrations do not establish a pump circuit.",
          "identityHold": false
        },
        "9": {
          "printed": 9,
          "caption": "Whole page contains BOTH OTR1 relay and OpenTherm diagrams plus boiler notes. Only the selected source mode is being referenced.",
          "identityHold": false
        },
        "10": {
          "printed": 10,
          "caption": "Complete original page and notes. Receiver or zone illustrations do not establish a pump circuit.",
          "identityHold": false
        }
      },
      "manualIndexPages": [
        6,
        8,
        11,
        13,
        14,
        19,
        20
      ]
    },
    "active-heating2-legacy": {
      "id": "active-heating2-legacy",
      "title": "Hive Active Heating - Thermostat installation guide",
      "edition": "36-page guide · ©2017 · issue date not stated",
      "url": "https://assets.ctfassets.net/mijf9lz5yt3u/3PJRO1bvewa2mAgYzKJGAV/94f24a8e62f743eb354560e30186c07f/Hive_Active_Heating_2_Wireless_Thermostat_User_Guide_Installation_Guide.pdf",
      "sha256": "d5cf9bf693e5ad8f4d01a9e6edbaa46c9c2cbfbfbea01f61b7cc8a85a67a4337",
      "bytes": 876329,
      "pageCount": 36,
      "inline": true,
      "accessNote": "Original manual page; source integrity is checked before display.",
      "pages": {
        "9": {
          "printed": 8,
          "caption": "Complete original page and notes. Receiver or zone illustrations do not establish a pump circuit.",
          "identityHold": false
        },
        "13": {
          "printed": 12,
          "caption": "Whole page contains BOTH single- and dual-channel diagrams. The other variant is context, not evidence that it matches the selected receiver.",
          "identityHold": false
        },
        "17": {
          "printed": 16,
          "caption": "Complete original page and notes. Receiver or zone illustrations do not establish a pump circuit.",
          "identityHold": false
        }
      },
      "manualIndexPages": [
        8,
        15,
        16,
        18,
        32,
        36
      ]
    }
  },
  "plans": {
    "s": {
      "title": "S Plan",
      "text": "The illustrated system uses separate V4043H two-port valves for heating and stored hot water, with one common pump. Match the exact controls, valve variants and boiler interface before using the original diagram.",
      "models": [
        "V4043H",
        "L641A",
        "T6360B",
        "DT90E",
        "T3",
        "T4",
        "CM907",
        "ST9400C",
        "42002116-001"
      ],
      "valves": {
        "V4043H": 2
      },
      "source": "resideo",
      "page": 6,
      "commonPumps": 1,
      "notes": [
        "The full page includes source-specific control alternatives. It is not a Hive conversion.",
        "Boiler demand, permanent supply and pump-overrun connections require the exact boiler instructions."
      ]
    },
    "splus": {
      "title": "S Plan Plus",
      "text": "The illustrated system has two heating zones and stored hot water through three V4043H valves. Each circuit shows one common pump. This diagram does not establish a system with three separate pumps.",
      "models": [
        "V4043H",
        "L641A",
        "T6360B",
        "T3",
        "T4",
        "ST9400C",
        "R6H911RF",
        "T6R"
      ],
      "valves": {
        "V4043H": 3
      },
      "source": "resideo",
      "page": 11,
      "commonPumps": 1,
      "notes": [
        "V4043H two-port valves; two heating zones and stored hot water. The lower example uses two R6H911RF receivers.",
        "Each complete circuit shows ONE common pump. The overrun inset is an alternative, not an extra pump."
      ]
    },
    "y": {
      "title": "Y Plan",
      "text": "The illustrated system uses a V4073A three-port mid-position valve. The cylinder call and satisfied paths are part of this plan. A diverter valve or separate zone valves require a different reference.",
      "models": [
        "V4073A",
        "L641A",
        "T6360B",
        "DT90E",
        "T3",
        "T4",
        "CM907",
        "ST9400C",
        "42002116-001"
      ],
      "valves": {
        "V4073A": 1
      },
      "source": "resideo",
      "page": 12,
      "commonPumps": 1,
      "notes": [
        "The full page includes source-specific control alternatives. It is not a Hive conversion.",
        "Boiler demand, permanent supply and pump-overrun connections require the exact boiler instructions."
      ]
    },
    "w": {
      "title": "W Plan",
      "text": "The illustrated system uses a V4044C three-port diverter valve with hot-water priority. It is a different arrangement from Y Plan. Match the actual valve and complete system before using the original diagram.",
      "models": [
        "V4044C",
        "L641A",
        "T6360B",
        "DT90E",
        "T3",
        "T4",
        "CM907",
        "ST9400C",
        "42002116-001"
      ],
      "valves": {
        "V4044C": 1
      },
      "source": "resideo",
      "page": 15,
      "commonPumps": 1,
      "notes": [
        "The full page includes source-specific control alternatives. It is not a Hive conversion.",
        "Boiler demand, permanent supply and pump-overrun connections require the exact boiler instructions."
      ]
    }
  },
  "receivers": {
    "otr1-relay": {
      "id": "otr1-relay",
      "source": "slt3-current",
      "channel": "single",
      "model": "OTR1",
      "switchPosition": 2,
      "interface": "separate-common-relay-contact",
      "terminalLabels": {
        "N": "Permanent neutral",
        "L": "Permanent live",
        "1": "Common",
        "2": "Unused",
        "3": "Heating on",
        "4": "Unused"
      },
      "page": 9,
      "printed": 9
    },
    "otr1-opentherm": {
      "id": "otr1-opentherm",
      "source": "slt3-current",
      "channel": "single",
      "model": "OTR1",
      "switchPosition": 1,
      "interface": "OpenTherm-bus",
      "terminalLabels": {
        "N": "Permanent neutral",
        "L": "Permanent live",
        "1": "Unused",
        "2": "Unused",
        "3": "Unused",
        "4": "Unused",
        "OT1": "OpenTherm connection",
        "OT2": "OpenTherm connection"
      },
      "page": 9,
      "printed": 9
    },
    "current-dual": {
      "id": "current-dual",
      "source": "slt3-current",
      "channel": "dual",
      "model": null,
      "switchPosition": null,
      "interface": "dual-mains-plan-outputs",
      "terminalLabels": {
        "N": "Permanent neutral",
        "L": "Permanent live",
        "1": "Hot water off",
        "2": "Heating off",
        "3": "Hot water on",
        "4": "Heating on"
      },
      "page": 10,
      "printed": 10
    },
    "legacy-single": {
      "id": "legacy-single",
      "source": "active-heating2-legacy",
      "channel": "single",
      "model": null,
      "switchPosition": null,
      "interface": "separate-common-relay-contact",
      "terminalLabels": {
        "N": "Permanent neutral",
        "L": "Permanent live",
        "1": "Common",
        "2": "Heating off (NC)",
        "3": "Heating on (NO)",
        "4": "Unused"
      },
      "page": 13,
      "printed": 12
    },
    "legacy-dual": {
      "id": "legacy-dual",
      "source": "active-heating2-legacy",
      "channel": "dual",
      "model": null,
      "switchPosition": null,
      "interface": "dual-mains-plan-outputs",
      "terminalLabels": {
        "N": "Permanent neutral",
        "L": "Permanent live",
        "1": "Hot water off (NC)",
        "2": "Heating off (NC)",
        "3": "Hot water on (NO)",
        "4": "Heating on (NO)"
      },
      "page": 13,
      "printed": 12
    }
  },
  "conflicts": [
    {
      "id": "cylinder",
      "text": "Issue19 p25 refers to terminal C in a cylinder-stat fault statement; p26 uses C & 1 for hot-water demand. This ambiguity is unresolved. It does not support a fault verdict from a single reading.",
      "source": "resideo",
      "pages": [
        25,
        26
      ]
    },
    {
      "id": "frost",
      "text": "Issue19 p32 frost S/Y labels differ from p22 and the valve-block context. Frost mapping is held; no corrected links or connections are supplied.",
      "source": "resideo",
      "pages": [
        22,
        32
      ]
    },
    {
      "id": "p14",
      "text": "Issue19 p14 names ST9420 in a caption but ST9400C in the diagram. Exact control identity is unresolved.",
      "source": "resideo",
      "pages": [
        14
      ]
    },
    {
      "id": "p20",
      "text": "Issue19 p20 replacement-table descriptions conflict with some wired/wireless variant labels, including the p17 T4R context. No replacement mapping is inferred.",
      "source": "resideo",
      "pages": [
        20,
        17
      ]
    },
    {
      "id": "wstate",
      "text": "Issue19 p28 mixes call/satisfied qualifications in its combined-demand column. Those states must not be turned into one test expectation.",
      "source": "resideo",
      "pages": [
        27,
        28
      ]
    }
  ],
  "receiverNotes": {
    "current": "OTR1 is named only for the single-channel receiver. Exact dual model is not named. The shared code IG70003650517V1 and thermostat SLT3 do not establish receiver generation.",
    "older": "This older guide does not establish exact receiver part numbers. Its single-channel NC label belongs to this source only.",
    "zonesCurrent": "The 20-page guide p11 states unlimited zones, but excludes OpenTherm for its described multizone central-heating arrangement. This is a source statement, not a load or site-capacity approval.",
    "zonesOlder": "The 36-page guide PDF17 / printed16 states up to 3 heating zones and 1 hot-water zone: 3 single receivers OR 1 dual + 2 single. It is not a three-pump design. Nano1 exclusion is on PDF32 / printed31.",
    "blue": "Blue-status meanings are variant-specific: the20-page guide distinguishes dual gravity mode from OTR1 unsupported blue status. No reset or commissioning steps are provided.",
    "dualScope": "The 20-page guide p10 says dual receivers have no mode switch; p11 broader all-receivers position2 wording must not be applied to a dual device."
  },
  "invasiveTestSteps": false,
  "installationApproval": false
});

const options={section:['home','plans','hive','cylinder','fault'],plan:['unknown','s','splus','y','w','three'],generation:['unknown','slt3-current','active-heating2-legacy'],channel:['unknown','single','dual'],mode:['unknown','relay','ot','dual'],zones:['unknown','single','multiple'],interface:['unknown','mains','contact','ot'],demand:['unknown','heating','hw','both','satisfied']};
const LABELS={plan:{unknown:'Unknown / not confirmed',s:'S-plan · two-port valves',splus:'S-plan Plus · one common pump',y:'Y-plan · mid-position three-port',w:'W-plan · diverter / hot-water priority',three:'3 separate pumps / 3 valves'},generation:{unknown:'Unknown / not confirmed','slt3-current':'20-page SLT3-linked guide · ©2025','active-heating2-legacy':'36-page Active Heating2 guide · ©2017'},channel:{unknown:'Unknown / not confirmed',single:'Single channel',dual:'Dual channel'},mode:{unknown:'Unknown / not confirmed',relay:'Single-channel relay',ot:'Single-channel OpenTherm',dual:'Dual-channel relay reference'},zones:{unknown:'Unknown / not confirmed',single:'Single heating zone',multiple:'Multiple heating zones'},interface:{unknown:'Unknown / not confirmed',mains:'Recorded mains-switched demand',contact:'Recorded separate dry-contact demand',ot:'Recorded OpenTherm input'},demand:{unknown:'Unknown / not confirmed',heating:'Heating demand',hw:'Hot-water demand',both:'Heating and hot-water demand',satisfied:'Recorded satisfied / no demand'}};
function emptySelection(){return{section:'home',plan:'unknown',generation:'unknown',channel:'unknown',mode:'unknown',confirmed:false,zones:'unknown',boiler:'',interface:'unknown',valveModel:'',cylinderModel:'',demand:'unknown'};}
function normalizeSelection(raw){
 const out=emptySelection();for(const k of Object.keys(raw))if(!Object.hasOwn(out,k))throw Error('Unknown reference field');
 for(const k of Object.keys(options)){const v=raw[k]??out[k];if(!options[k].includes(v))throw Error('Invalid '+k);out[k]=v;}
 for(const k of ['boiler','valveModel','cylinderModel'])out[k]=String(raw[k]??'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,140);
 if(raw.confirmed!==undefined&&typeof raw.confirmed!=='boolean')throw Error('Invalid receiver confirmation');out.confirmed=raw.confirmed??false;return out;
}
const ref=(source,page,purpose)=>{const s=DATA.sources[source];if(!s?.pages[String(page)])throw Error('Page is not an accepted figure context');return{source,page,purpose,kind:'figure'};};
const indexRef=(source,page,purpose)=>{const s=DATA.sources[source];if(!s?.manualIndexPages.includes(page))throw Error('Page is not an accepted manual index');return{source,page,purpose,kind:'index'};};
const basicMissing=['Exact boiler manufacturer input, permanent supply and pump-overrun requirements have not been matched.','Receiver, valve and pump contact/load ratings are unverified. A 3A supply fuse is not a relay or pump-load rating.','Actual component identity, system topology, isolation/prove-dead and protective conditions have not been accepted.'];
const threeMissing=['Exact three-pump / three-valve hydraulic and electrical arrangement is missing.','All three pump models and individual running/start loads are needed.','All three valve/actuator models, control contacts and controller/receiver generations are needed.','A matching manufacturer-supported demand, interlock and pump-overrun design is needed.'];
function interfaceConflict(recorded,context){
 if(recorded==='unknown')return false;
 if(context.interface==='OpenTherm-bus')return recorded!=='ot';
 if(recorded==='ot')return true;
 return context.interface==='dual-mains-plan-outputs'&&recorded==='contact';
}
function selectHive(s){
 const notes=[DATA.receiverNotes[s.generation==='slt3-current'?'current':'older']],missing=[],references=[];let context=null;
 if(s.generation==='unknown')return{notes:['Select the exact source guide and receiver type. Unknown selections withhold terminal-specific information.'],missing:['Receiver generation and matching source guide are not confirmed.'],references,context:null,held:true};
 references.push(ref(s.generation,s.generation==='slt3-current'?7:9,'Receiver identification only. Both channel variants appear; this does not prove the installed variant.'));
 if(s.channel==='unknown')missing.push('Receiver channel is not confirmed.');
 if(s.mode==='unknown')missing.push('Receiver operating mode is not confirmed.');
 if(!s.confirmed)missing.push('The physical receiver and matching guide/mode have not been confirmed.');
 if(s.channel!=='unknown'&&s.mode!=='unknown'){
  let id=null;
  if(s.channel==='dual'&&s.mode==='dual')id=s.generation==='slt3-current'?'current-dual':'legacy-dual';
  else if(s.channel==='single'&&s.mode==='relay')id=s.generation==='slt3-current'?'otr1-relay':'legacy-single';
  else if(s.channel==='single'&&s.mode==='ot'&&s.generation==='slt3-current')id='otr1-opentherm';
  if(!id)missing.push('This source/channel/mode combination is not supported by the reviewed guide. No terminal panel is selected.');
  else{
   const candidate=DATA.receivers[id];
   if(s.mode==='ot'&&s.zones==='multiple')missing.push('The 20-page guide p11 excludes OpenTherm for its described multizone heating arrangement. Terminal information is withheld.');
   else if(interfaceConflict(s.interface,candidate))missing.push('The recorded boiler input type conflicts with this source interface. No matching terminal panel is selected.');
   else if(s.confirmed)context=candidate;
  }
 }
 if(context){references.splice(0,1,ref(context.source,context.page,context.id==='otr1-opentherm'?'OTR1 OpenTherm reference: RIGHT diagram only. Full page also contains the relay variant.':context.id==='otr1-relay'?'OTR1 relay reference: LEFT diagram only. Full page also contains the OpenTherm variant.':context.source==='active-heating2-legacy'?'Selected '+context.channel+'-channel reference. Full page contains both single and dual variants.':'Dual-channel source reference. Exact part number is not named.'));
  notes.push(context.model?'Source names '+context.model+'. Source switch position: '+context.switchPosition+'. This selects reference information, not a change to an installed device.':'Exact receiver model part number is not named by this source; no part number is inferred.');
  if(context.channel==='dual')notes.push(context.source==='slt3-current'?'This source says dual receivers have no mode switch. No dual OpenTherm mode is established.':'This older dual diagram retains its own explicit NO/NC labels. No OpenTherm mode is established.');
  notes.push(context.interface==='OpenTherm-bus'?'OT1/OT2 are a distinct bus interface; numbered relay positions 1–4 are unused in this mode. Exact boiler compatibility and low/high-voltage separation remain unverified.':context.interface==='dual-mains-plan-outputs'?'Mains-plan outputs are distinct from dry contacts and OpenTherm. No low-voltage or bus equivalence is implied.':'The separate common/contact interface is distinct from receiver mains supply. No L-to-common bridge or actual control voltage is inferred.');
 }
 notes.push(s.generation==='slt3-current'?DATA.receiverNotes.zonesCurrent:DATA.receiverNotes.zonesOlder,DATA.receiverNotes.blue);
 if(s.generation==='slt3-current')notes.push(DATA.receiverNotes.dualScope);
 missing.push('Exact receiver contact voltage/current ratings and boiler interface compatibility are unverified.');
 return{notes,missing,references,context,held:!context};
}
function analyseReference(raw){
 const s=normalizeSelection(raw),out={selectionKey:JSON.stringify(s),section:s.section,title:'Wiring reference',notes:[],missing:[...basicMissing],references:[],issues:[],terminalLabels:null,receiverContext:null,held:false,designAvailable:false,installationApproved:false,sourceReferenceOnly:true};
 if(!s.boiler)out.missing.unshift('Exact boiler model/revision is not recorded.');
 if(s.interface==='unknown')out.missing.push('The actual boiler demand interface is unknown.');
 if(s.plan==='three')out.missing.push(...threeMissing);
 if(s.section==='plans'){
  if(s.plan==='unknown'){out.title='Choose a system plan';out.held=true;out.missing.push('System plan has not been identified.');}
  else if(s.plan==='three'){
   out.title='3 separate pumps / 3 valves';out.notes=['An exact source-matched design is not available in this reference pack.','S-plan Plus has three valves and ONE common pump in each illustrated circuit. It does not establish three separately controlled pumps.','Related references below explain a different plan or control interface; they are not a design for this topology.'];out.references=[ref('resideo',11,'S-plan Plus: THREE valves and ONE common pump. Related reference only.'),ref('resideo',18,'Boiler supply and demand examples. Related interface reference only.'),ref('active-heating2-legacy',17,'Receiver/zone configurations only. Not a pump/valve circuit.')];out.held=true;
  }else{
   const p=DATA.plans[s.plan];out.title=p.title;out.notes=[p.text,...p.notes,'Source controller context: '+p.models.join(', ')+'.','Boiler power supply, mains-switched demand, a separate dry contact and OpenTherm are distinct functions. The exact boiler interface is not established by selecting a plan.'];out.references=[ref(p.source,p.page,'Selected '+p.title+' source context; full page and alternative inset retained.'),ref('resideo',18,'Separate boiler supply/demand examples; exact boiler requirements remain unknown.')];
   if(s.plan==='y')out.issues.push(DATA.conflicts.find(c=>c.id==='p14'));
   out.issues.push(DATA.conflicts.find(c=>c.id==='p20'));if(s.plan==='w')out.issues.push(DATA.conflicts.find(c=>c.id==='wstate'));
  }
 }else if(s.section==='hive'){
  out.title='Hive receiver reference';const h=selectHive(s);out.notes=h.notes;out.missing.push(...h.missing);out.references=h.references;out.held=h.held;out.receiverContext=h.context?.id??null;out.terminalLabels=h.context?.terminalLabels??null;
  out.notes.push('Plan and receiver selections are independent source references. No combined circuit or Hive-to-Resideo terminal translation is created.');
 }else if(s.section==='cylinder'){
  out.title='Cylinder controls';out.notes=['The Resideo reference uses L641A cylinder controls. Call and satisfied paths have different roles in S, Y and W plans.','Confirm the exact cylinder thermostat, valve type and recorded demand state before choosing the complete original plan. A model typed here is unverified user information.','A single reading does not establish a faulty thermostat. No live testing, links or bypass instructions are provided.'];
  const key=['s','splus','y','w'].includes(s.plan)?s.plan:null;out.references=(key?[ref('resideo',DATA.plans[key].page,'L641A in the selected source plan.')]:[ref('resideo',6,'L641A in S-plan.'),ref('resideo',12,'L641A in Y-plan.'),ref('resideo',15,'L641A in W-plan.')]);
  out.issues=DATA.conflicts.filter(c=>['cylinder','frost'].includes(c.id));if(s.plan==='w'||s.plan==='unknown')out.issues.push(DATA.conflicts.find(c=>c.id==='wstate'));if(!s.cylinderModel)out.missing.push('Exact cylinder-control model is unknown.');if(!s.valveModel)out.missing.push('Exact valve/actuator model is unknown.');if(s.demand==='unknown')out.missing.push('The relevant call/satisfied demand context is unknown.');
 }else if(s.section==='fault'){
  out.title='Fault-finding reference';out.notes=['Identify the exact control and receiver generation, valve model/plan, boiler interface, and heating/hot-water call or satisfied state.','Source tables depend on their full wiring and demand context; they do not prove a faulty part from an isolated reading.','Boiler power supply is separate from the control input. Mains-switched, dry-contact and OpenTherm references must not be interchanged.','This index supplies no energised tests, probing, voltage injection, jumper/bypass links or repair steps. Competent-person isolation/prove-dead and actual conditions remain outside this reference.'];out.references=[indexRef('resideo',23,'Y-plan context index: original pp23–24.'),indexRef('resideo',25,'S/S-plan Plus context index: original pp25–26; cylinder wording held.'),indexRef('resideo',27,'W-plan context index: original pp27–28; mixed call-state wording held.')];out.issues=DATA.conflicts;
  if(!s.valveModel)out.missing.push('Exact valve/actuator model is unknown.');if(!s.cylinderModel)out.missing.push('Cylinder-control identity is unknown.');if(s.demand==='unknown')out.missing.push('Recorded demand state is unknown.');
 }else{out.title='Wiring reference';out.notes=['Choose a source reference. No complete circuit or installation approval is produced.'];out.held=true;}
 out.missing=[...new Set(out.missing)];return out;
}
function referenceSummary(raw,result){
 const s=normalizeSelection(raw);if(!result||result.selectionKey!==JSON.stringify(s))throw Error('Review the current choices before copying.');
 const lines=['STAG WIRING — SOURCE REFERENCE ONLY',result.title,'No complete circuit, boiler compatibility or installation approval is established.','Plan: '+LABELS.plan[s.plan],'Receiver source: '+LABELS.generation[s.generation],'Channel: '+LABELS.channel[s.channel]+'; mode: '+LABELS.mode[s.mode],'Physical receiver / matching guide confirmation: '+(s.confirmed?'User confirmed for reference selection only':'Not confirmed'),'Zones: '+LABELS.zones[s.zones],'Boiler (unverified user entry): '+(s.boiler||'Unknown'),'Boiler demand interface (unverified): '+LABELS.interface[s.interface],'Valve/actuator (unverified): '+(s.valveModel||'Unknown'),'Cylinder control (unverified): '+(s.cylinderModel||'Unknown'),'Recorded demand: '+LABELS.demand[s.demand],'Terminal-specific panel: '+(result.receiverContext||'Withheld / not selected'),''];
 if(result.terminalLabels)lines.push('Source labels only: '+Object.entries(result.terminalLabels).map(([k,v])=>k+': '+v).join('; '),'');
 lines.push(...result.notes,'','MISSING EVIDENCE',...result.missing.map(x=>'- '+x));if(result.issues.length)lines.push('','SOURCE QUALIFICATIONS',...result.issues.map(x=>x.text));
 lines.push('','ORIGINAL SOURCES');for(const id of new Set(result.references.map(r=>r.source))){const source=DATA.sources[id],pages=[...new Set(result.references.filter(r=>r.source===id).map(r=>r.page))];lines.push(source.title+' · '+source.edition,'PDF pages: '+pages.join(', '),'Source SHA256: '+source.sha256,source.url);}
 return lines.join('\n');
}
function createReferenceStore(initial={}){
 let selection=normalizeSelection({...emptySelection(),...initial}),revision=0,result=null,summary=null;
 return{getState:()=>({selection:structuredClone(selection),revision,result:result?structuredClone(result):null,summary}),update(patch){let next=normalizeSelection({...selection,...patch});if(['generation','channel','mode'].some(k=>next[k]!==selection[k]))next.confirmed=false;if(JSON.stringify(next)===JSON.stringify(selection))return false;selection=next;revision++;result=null;summary=null;return true;},review(){result={...analyseReference(selection),revision};summary=referenceSummary(selection,result);return this.getState();},copyText(expectedRevision){if(!result||summary===null||result.revision!==revision||expectedRevision!==revision)throw Error('Choices changed. Review the current reference before copying.');return summary;}};
}

class StaleSelectionError extends Error{constructor(){super('Reference selection changed.');this.name='StaleSelectionError';}}
function makePageRequest(sourceId,page){const s=DATA.sources[sourceId];if(!Object.hasOwn(DATA.sources,sourceId)||!s)throw Error('Unknown original source.');const req={sourceId,url:s.url,sha256:s.sha256,bytes:s.bytes,pageCount:s.pageCount,page};validatePageRequest(req);return Object.freeze(req);}
function validatePageRequest(req){
 const s=DATA.sources[req?.sourceId];if(!s||!Object.hasOwn(DATA.sources,req?.sourceId)||req.url!==s.url||req.sha256!==s.sha256||req.bytes!==s.bytes||req.pageCount!==s.pageCount)throw Error('Original source identity does not match.');
 if(!Number.isSafeInteger(req.page)||!Object.hasOwn(s.pages,String(req.page)))throw Error('This page is not an accepted original figure context.');return s;
}
function originalManualURL(reference){
 const s=DATA.sources[reference?.source];if(!s||!Object.hasOwn(DATA.sources,reference?.source)||!['index','figure'].includes(reference.kind))throw Error('Unknown manual.');const allowed=reference.kind==='index'?s.manualIndexPages.includes(reference.page):Object.hasOwn(s.pages,String(reference.page));if(!allowed||!Number.isSafeInteger(reference.page))throw Error('Manual page is outside its source index.');return s.url+'#page='+reference.page;
}
const hex=bytes=>[...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('');
async function verifyPDFBytes(raw,expected,subtle=globalThis.crypto?.subtle){
 if(!subtle?.digest)throw Error('Secure source verification is unavailable. Open the original manual.');
 if(!(raw instanceof ArrayBuffer)||raw.byteLength!==expected.bytes)throw Error('Original manual byte count does not match.');
 const head=new Uint8Array(raw,0,Math.min(5,raw.byteLength));if(String.fromCharCode(...head)!=='%PDF-')throw Error('The source response is not the expected PDF.');
 if(hex(await subtle.digest('SHA-256',raw))!==expected.sha256)throw Error('Original manual integrity does not match.');return raw;
}
function verifyDocumentCount(pdf,expected){if(!pdf||pdf.numPages!==expected.pageCount)throw Error('Original manual page count does not match.');return pdf;}
let libraryPromise;
async function defaultLibrary(){
 if(!libraryPromise)libraryPromise=import(new URL('../vendor/pdf.min.mjs',SWR_MODULE_BASE).href).then(lib=>{lib.GlobalWorkerOptions.workerSrc=new URL('../vendor/pdf.worker.min.mjs',SWR_MODULE_BASE).href;return lib;});return libraryPromise;
}
function createDocumentLoader({fetchImpl=globalThis.fetch?.bind(globalThis),subtle=globalThis.crypto?.subtle,loadLibrary=defaultLibrary}={}){
 const pending=new Map();let disposed=false;
 return{get(req){
  const source=validatePageRequest(req);if(disposed)return Promise.reject(Error('Source viewer is closed.'));if(!source.inline)return Promise.reject(Error('This source uses the original-manual link only.'));
  const key=req.url+'|'+req.sha256;
  if(!pending.has(key))pending.set(key,(async()=>{
   if(typeof fetchImpl!=='function')throw Error('Source loading is unavailable.');
   const response=await fetchImpl(source.url,{mode:'cors',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer'});
   if(!response?.ok)throw Error('The original manual could not be loaded.');if(response.url&&response.url!==source.url)throw Error('The original source address changed.');
   if(!String(response.headers?.get('content-type')??'').toLowerCase().includes('application/pdf'))throw Error('The original source did not return a PDF.');
   const bytes=await verifyPDFBytes(await response.arrayBuffer(),source,subtle);
   if(disposed)throw Error('Source viewer is closed.');const lib=await loadLibrary();
   const task=lib.getDocument({data:new Uint8Array(bytes),isEvalSupported:false,useSystemFonts:true,disableAutoFetch:true,disableStream:true,disableRange:true,stopAtErrors:true});
   let pdf;try{pdf=await task.promise;verifyDocumentCount(pdf,source);if(disposed)throw Error('Source viewer is closed.');}catch(e){if(pdf)await pdf.destroy?.();else await task.destroy?.();throw e;}return pdf;
  })());
  return pending.get(key);
 },dispose(){disposed=true;for(const promise of pending.values())promise.then(pdf=>pdf.destroy?.()).catch(()=>{});pending.clear();},get sharedSourcePromises(){return pending.size;}};
}
function createRenderGate(){let revision=0;return{invalidate(){return++revision;},current(token){return token===revision;},get revision(){return revision;}};}
function commitIfCurrent(isCurrent,commit){if(!isCurrent())throw new StaleSelectionError();return commit();}
async function prepareVerifiedPage(loader,req,isCurrent){
 validatePageRequest(req);const pdf=await loader.get(req);if(!isCurrent())throw new StaleSelectionError();verifyDocumentCount(pdf,DATA.sources[req.sourceId]);
 const page=await pdf.getPage(req.page);if(!isCurrent())throw new StaleSelectionError();return page;
}
function mountPageViewer({root,scopeRoot=root,dialog,isSelectionCurrent,loader=createDocumentLoader()}){
 const doc=root.ownerDocument,get=id=>scopeRoot.querySelector('#swr-'+id),status=get('viewerStatus'),host=get('pageCanvas'),fallback=get('viewerManual'),caption=get('viewerCaption'),enlarge=get('enlargePage'),modalHost=get('largeCanvas'),modalTitle=get('largeTitle');
 const gate=createRenderGate(),tasks=new Set();let selected=null,selectionRevision=null,modalRevision=0;
 const current=token=>gate.current(token)&&isSelectionCurrent(selectionRevision);
 function cancelTasks(){for(const task of tasks){try{task.cancel();}catch{}}tasks.clear();}
 function closeLarge(){modalRevision++;if(dialog.open)dialog.close();modalHost.replaceChildren();}
 function clear(){gate.invalidate();cancelTasks();closeLarge();selected=null;selectionRevision=null;host.replaceChildren();status.textContent='';caption.textContent='';enlarge.hidden=true;root.hidden=true;}
 async function render(req,target,token,large=false,largeToken=0){
  const isCurrent=()=>current(token)&&(!large||largeToken===modalRevision&&dialog.open);
  const page=await prepareVerifiedPage(loader,req,isCurrent);if(!isCurrent())throw new StaleSelectionError();
  // PDF.js full-page viewport handles the current guide's nonzero page-box origin.
  const unit=page.getViewport({scale:1}),cssWidth=large?Math.max(760,Math.min(1100,(doc.defaultView?.innerWidth??390)*1.8)):Math.max(280,Math.min(900,host.clientWidth||340));
  const ratio=Math.min(2,doc.defaultView?.devicePixelRatio||1),viewport=page.getViewport({scale:cssWidth*ratio/unit.width});
  const canvas=doc.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);canvas.style.width=large?cssWidth+'px':'100%';canvas.style.height='auto';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',DATA.sources[req.sourceId].title+', original full PDF page '+req.page);
  const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw Error('Page drawing is unavailable. Open the original manual.');
  const task=page.render({canvasContext:ctx,viewport,background:'#ffffff'});tasks.add(task);try{await task.promise;}finally{tasks.delete(task);}
  commitIfCurrent(isCurrent,()=>target.replaceChildren(canvas));return canvas;
 }
 async function show(reference,revision){
  clear();selectionRevision=revision;const token=gate.revision;root.hidden=false;
  // Working official link exists before any loading/verification promise begins.
  fallback.href=originalManualURL(reference);fallback.textContent='Open original manual · PDF page '+reference.page;fallback.hidden=false;
  const source=DATA.sources[reference.source],info=source.pages[String(reference.page)];caption.textContent=source.title+' · '+source.edition+' · PDF '+reference.page+' / printed '+(info?.printed??reference.page)+'. '+(info?.caption??reference.purpose);
  if(reference.kind==='index'||!source.inline){status.textContent=reference.kind==='index'?'Source index link only. No test table is adapted into a procedure.':source.accessNote;return;}
  const req=makePageRequest(reference.source,reference.page);selected=req;status.textContent='Loading original full page…';
  try{await render(req,host,token);if(!current(token))return;status.textContent='Verified original full page. Other variants on the page are context, not proof of a match.';enlarge.hidden=false;}
  catch(e){if(!current(token)||e instanceof StaleSelectionError)return;host.replaceChildren();enlarge.hidden=true;status.textContent=(e?.message||'The original page could not be displayed.')+' Use the original-manual link.';}
 }
 enlarge.addEventListener('click',async()=>{
  if(!selected||!current(gate.revision))return;const token=gate.revision,req=selected,largeToken=++modalRevision;modalHost.replaceChildren();modalTitle.textContent='Original full page · PDF '+req.page;dialog.showModal();const loading=doc.createElement('p');loading.textContent='Loading full page…';modalHost.append(loading);
  try{await render(req,modalHost,token,true,largeToken);}catch(e){if(!current(token)||largeToken!==modalRevision||e instanceof StaleSelectionError)return;const p=doc.createElement('p');p.textContent=(e?.message||'The page could not be enlarged.')+' The original-manual link remains available.';modalHost.replaceChildren(p);}
 });
 get('closeLarge').addEventListener('click',closeLarge);dialog.addEventListener('cancel',()=>{modalRevision++;modalHost.replaceChildren();});dialog.addEventListener('close',()=>{if(!dialog.open){modalRevision++;modalHost.replaceChildren();}});
 return{show,clear,dispose(){clear();loader.dispose();}};
}

const wiringUIMounts=new WeakMap();
function mount(root,doc=root?.ownerDocument){
 if(!root||!doc)throw Error('Wiring reference root unavailable');if(wiringUIMounts.has(root))return wiringUIMounts.get(root);
 const get=id=>root.querySelector('#swr-'+id),store=createReferenceStore(),titles={home:'Wiring reference',plans:'System plans',hive:'Hive receivers',cylinder:'Cylinder controls',fault:'Fault-finding reference'},sections={home:'homeSection',plans:'plansSection',hive:'hiveSection',cylinder:'cylinderSection',fault:'faultSection'};
 const make=(tag,text,cls)=>{const e=doc.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls.split(/\s+/).filter(Boolean).map(c=>'swr-'+c).join(' ');return e;};
 const viewer=mountPageViewer({root:get('pageViewer'),scopeRoot:root,dialog:get('largePage'),isSelectionCurrent:rev=>{const s=store.getState();return !root.hidden&&s.revision===rev&&s.result!==null;}});
 const displayLabels={
  generation:{unknown:'Not sure / not confirmed','slt3-current':'Hive installation guide (©2025)','active-heating2-legacy':'Active Heating 2 guide (©2017)'},
  channel:{unknown:'Choose what it controls',single:'Heating only (single channel)',dual:'Heating and hot water (dual channel)'},
  mode:{unknown:'Choose the fitted connection',relay:'Relay (on/off) — single channel',ot:'OpenTherm — single channel',dual:'Relay — heating and hot water'}
 };
 function populate(id,key){for(const[v,t]of Object.entries(LABELS[key])){const option=make('option',displayLabels[key]?.[v]??t);option.value=v;get(id).append(option);}}
 for(const key of ['plan','generation','channel','mode','zones','interface','demand'])populate(key,key);populate('cylinderPlan','plan');
 function clearResult(){viewer.clear();get('result').replaceChildren();get('result').hidden=true;get('summarySection').hidden=true;get('summaryText').value='';get('copySummary').disabled=true;get('copyStatus').textContent='';get('editStatus').textContent='Choices changed. Show the current reference before copying.';}
 function sync(){const s=store.getState().selection;for(const[key,id]of Object.entries(sections))get(id).hidden=s.section!==key;get('sectionTitle').textContent=titles[s.section];get('actionRow').hidden=s.section==='home';get('plan').value=s.plan;get('cylinderPlan').value=s.plan;get('confirmed').checked=s.confirmed;get('contextBadge').textContent=s.boiler?'· '+s.boiler+' (unverified)':'· unverified';}
 function update(patch){if(store.update(patch)){clearResult();sync();}}
 function navigate(section){update({section});get('sectionTitle').focus({preventScroll:true});root.scrollTop=0;}
 get('homeButton').addEventListener('click',()=>navigate('home'));
 for(const button of root.querySelectorAll('[data-swr-section]'))button.addEventListener('click',()=>navigate(button.dataset.swrSection));
 get('selectionForm').addEventListener('input',e=>{const field=e.target;if(field?.type!=='text')return;if(field.name?.startsWith('swr-'))update({[field.name.slice(4)]:field.value});});
 get('selectionForm').addEventListener('change',e=>{const field=e.target,key=field?.dataset?.swrField||(field?.name?.startsWith('swr-')?field.name.slice(4):'');if(!key||field.type==='text')return;update({[key]:field.type==='checkbox'?field.checked:field.value});});
 function sourceCard(reference,revision){
  const source=DATA.sources[reference.source],info=source.pages[String(reference.page)],card=make('article',undefined,'source-card');card.append(make('p',source.title,'source-title'),make('p',source.edition+' · PDF '+reference.page+' / printed '+(info?.printed??reference.page),'help'),make('p',reference.purpose,'help'));
  const link=make('a','Open original manual · page '+reference.page);link.href=originalManualURL(reference);link.target='_blank';link.rel='noopener noreferrer';card.append(link);
  if(reference.kind==='figure'&&source.inline){const button=make('button','View whole original page');button.type='button';button.addEventListener('click',()=>{if(store.getState().revision===revision&&store.getState().result)viewer.show(reference,revision);});card.append(button);}
  else card.append(make('p',reference.kind==='index'?'Manual index only; no live-test procedure is adapted.':source.accessNote,'help'));return card;
 }
 function renderResult(state){
  const {result,revision,summary}=state,box=get('result');box.replaceChildren();box.hidden=false;box.append(make('h2',result.title));
  if(result.held)box.append(make('p',result.section==='hive'?'Choose the matching receiver details and confirm them to show its terminal information.':result.section==='plans'?'A matching circuit design is not established.':'Reference selection is incomplete.','hold'));
  for(const note of result.notes)box.append(make('p',note));
  if(result.terminalLabels){box.append(make('h3','Labels in this exact source'),make('p','Source labels only. No boiler compatibility, links or load ratings are established.','help'));const labels=make('dl',undefined,'reference-labels');for(const[k,v]of Object.entries(result.terminalLabels))labels.append(make('dt',k),make('dd',v));box.append(labels);}
  if(result.issues.length){const section=make('section',undefined,'issues');section.append(make('h3','Unresolved source qualifications'));for(const issue of result.issues)section.append(make('p',issue.text,'hold'));box.append(section);}
  const missing=make('details');missing.open=true;missing.append(make('summary','Evidence still needed'));const list=make('ul');for(const text of result.missing)list.append(make('li',text));missing.append(list);box.append(missing);
  if(result.references.length){box.append(make('h3',result.section==='plans'&&store.getState().selection.plan==='three'?'Related source references':'Original source references'));for(const reference of result.references)box.append(sourceCard(reference,revision));}
  get('summarySection').hidden=false;get('summaryText').value=summary;get('copySummary').disabled=false;get('editStatus').textContent='Current reference shown. It does not approve an installation.';
  if(result.references.length)viewer.show(result.references[0],revision);
 }
 get('selectionForm').addEventListener('submit',e=>{e.preventDefault();if(store.getState().selection.section==='home')return;try{renderResult(store.review());}catch(error){clearResult();get('editStatus').textContent=error.message;}});
 get('copySummary').addEventListener('click',async()=>{
  const revision=store.getState().revision;let text;try{text=store.copyText(revision);}catch(error){get('copyStatus').textContent=error.message;return;}
  try{if(!doc.defaultView?.navigator?.clipboard?.writeText)throw Error('Clipboard unavailable');await doc.defaultView.navigator.clipboard.writeText(text);get('copyStatus').textContent=store.getState().revision===revision?'Reference summary copied.':'Choices changed while copying. The clipboard may contain the earlier reference; review and copy again.';}
  catch{if(store.getState().revision!==revision){get('copyStatus').textContent='Choices changed. Review the current reference before copying.';return;}get('summaryText').focus();get('summaryText').select();get('copyStatus').textContent='Text selected. Touch and hold, then choose Copy.';}
 });
 doc.defaultView?.addEventListener('pagehide',event=>{if(event.persisted)viewer.clear();else viewer.dispose();});sync();const controller={store,viewer};wiringUIMounts.set(root,controller);return controller;
}


const wiringMounts=new WeakMap();
const wiringContracts={"resideo":{"url":"https://www.resideo.com/gb/en/-/media/EMEA%20Site%20Cluster/Mastersite/Documents/Sales%20Literature/Resideo_HWHome_Wiring%20Guide_May24.pdf/?rv=4a17ca0fc4ee4e588b93905ce95b5d89","sha256":"ec0b205ad90b01bdb7177c0f757d0e356a2b7c06cf99a891ef5b10e61472bc2b","bytes":3033263,"pageCount":36,"inline":false,"pages":[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,32]},"slt3-current":{"url":"https://assets.ctfassets.net/mijf9lz5yt3u/4LFy5x5QRqycyxGKT3HXYA/92716ffff1c680323bd9397f298920f2/Hive_Thermostat_SLT3_Installation_Guide_LR__1_.pdf","sha256":"9d06f70e5c586c5071b8962e88517141752fa275148d5d7f0da1e09eb6e5df2d","bytes":737078,"pageCount":20,"inline":true,"pages":[7,9,10]},"active-heating2-legacy":{"url":"https://assets.ctfassets.net/mijf9lz5yt3u/3PJRO1bvewa2mAgYzKJGAV/94f24a8e62f743eb354560e30186c07f/Hive_Active_Heating_2_Wireless_Thermostat_User_Guide_Installation_Guide.pdf","sha256":"d5cf9bf693e5ad8f4d01a9e6edbaa46c9c2cbfbfbea01f61b7cc8a85a67a4337","bytes":876329,"pageCount":36,"inline":true,"pages":[9,13,17]}};
function validateWiringData(data){
 if(data?.schemaVersion!==1||data.installationApproval!==false||data.invasiveTestSteps!==false||Object.keys(data.sources??{}).length!==3)throw Error('Wiring source data unavailable');
 for(const[id,pin]of Object.entries(wiringContracts)){
  const s=data.sources[id];if(!s||s.url!==pin.url||s.sha256!==pin.sha256||s.bytes!==pin.bytes||s.pageCount!==pin.pageCount||s.inline!==pin.inline||JSON.stringify(Object.keys(s.pages).map(Number).sort((a,b)=>a-b))!==JSON.stringify(pin.pages))throw Error('Wiring source binding unavailable');
 }
 if(data.receivers?.['otr1-relay']?.terminalLabels?.['2']!=='Unused'||data.receivers?.['legacy-single']?.terminalLabels?.['2']!=='Heating off (NC)'||['1','2','3','4'].some(n=>data.receivers?.['otr1-opentherm']?.terminalLabels?.[n]!=='Unused')||data.plans?.splus?.commonPumps!==1||data.plans?.splus?.valves?.V4043H!==3)throw Error('Wiring source qualification unavailable');
 return true;
}
function mountWiringHost(doc,{mountUI=mount,data=DATA,observe=globalThis.ResizeObserver}={}){
 const root=doc.getElementById('swr-root'),entry=doc.getElementById('swr-open'),message=doc.getElementById('swr-host-status');
 const unavailable=()=>{if(entry)entry.disabled=true;if(message){message.hidden=false;message.textContent='Wiring reference unavailable. Continue using the library or finder.';}};
 if(!root){unavailable();return null;}if(wiringMounts.has(root))return wiringMounts.get(root);
 const library=doc.getElementById('baf-library'),bar=doc.getElementById('offlineBar'),exit=root.querySelector('#swr-exit'),finderRoot=doc.getElementById('baf-root'),finderEntry=doc.getElementById('baf-open');
 if(!entry||!message||!library||!bar||!exit){unavailable();return null;}
 let ui,active=false,saved=null,wiringY=0,spacer=null;const headerProperties=['position','top','left','right','z-index'];
 try{validateWiringData(data);ui=mountUI(root,doc);}catch{unavailable();return null;}
 function geometry(){const rect=bar.getBoundingClientRect();root.style.setProperty('--swr-top',Math.max(0,rect.bottom)+'px');if(spacer)spacer.style.height=rect.height+'px';}
 function close(){
  if(!active)return;wiringY=root.scrollTop;ui.viewer?.clear();root.hidden=true;
  if(saved.visibility)library.style.setProperty('visibility',saved.visibility,saved.visibilityPriority);else library.style.removeProperty('visibility');library.inert=saved.inert;if(saved.aria===null)library.removeAttribute('aria-hidden');else library.setAttribute('aria-hidden',saved.aria);
  for(const[name,value,priority]of saved.headerStyle){if(value)bar.style.setProperty(name,value,priority);else bar.style.removeProperty(name);}spacer?.remove();spacer=null;active=false;saved.focus?.focus?.({preventScroll:true});
 }
 function open(){
  if(active)return;
  // Use the existing finder Back action rather than touching its survey or state.
  if(finderRoot&&!finderRoot.hidden){const back=finderRoot.querySelector('#baf-exit');if(!back){unavailable();return;}back.click();if(!finderRoot.hidden){unavailable();return;}}
  saved={visibility:library.style.visibility,visibilityPriority:library.style.getPropertyPriority('visibility'),inert:library.inert,aria:library.getAttribute('aria-hidden'),focus:doc.activeElement,headerStyle:headerProperties.map(name=>[name,bar.style.getPropertyValue(name),bar.style.getPropertyPriority(name)])};
  spacer=doc.createElement('div');spacer.id='swr-header-spacer';spacer.setAttribute('aria-hidden','true');spacer.style.height=bar.getBoundingClientRect().height+'px';bar.before(spacer);
  for(const[name,value]of [['position','fixed'],['top','0'],['left','0'],['right','0'],['z-index','20']])bar.style.setProperty(name,value,'important');
  geometry();library.style.setProperty('visibility','hidden','important');library.inert=true;library.setAttribute('aria-hidden','true');root.hidden=false;root.scrollTop=wiringY;active=true;exit.focus({preventScroll:true});
 }
 entry.addEventListener('click',open);exit.addEventListener('click',close);
 // Capture runs before the existing finder entry handler and restores the shared host.
 finderEntry?.addEventListener('click',close,true);
 doc.defaultView?.addEventListener('resize',()=>{if(active)geometry();});doc.defaultView?.addEventListener('stag-open-standalone-record',close);
 if(observe){const observer=new observe(()=>{if(active)geometry();});observer.observe(bar);}
 const controller={open,close,ui,isOpen:()=>active};wiringMounts.set(root,controller);entry.disabled=false;message.hidden=true;return controller;
}
if(typeof document!=='undefined')mountWiringHost(document);

})();
