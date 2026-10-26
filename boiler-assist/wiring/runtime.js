(() => {
  // prepared/wiring-full-paths-20261026/boiler-assist/wiring/source-data.mjs
  var freeze = (x) => {
    if (x && typeof x === "object") {
      Object.values(x).forEach(freeze);
      Object.freeze(x);
    }
    return x;
  };
  var DATA = freeze({
    "schemaVersion": 1,
    "sources": {
      "resideo": {
        "id": "resideo",
        "title": "Resideo / Honeywell Home Heating Controls Wiring Guide",
        "edition": "Issue 19 \xB7 \xA92024 \xB7 issue date not stated",
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
        "edition": "20-page guide \xB7 \xA92025 \xB7 issue date not stated",
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
        "edition": "36-page guide \xB7 \xA92017 \xB7 issue date not stated",
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

  // prepared/wiring-full-paths-20261026/boiler-assist/wiring/diagram-data.mjs
  var DIAGRAMS = Object.freeze([
    {
      "id": "s-plan",
      "title": "S-plan",
      "subtitle": "Two 2-port valves",
      "source": "resideo",
      "page": 6,
      "asset": "./diagrams/resideo-6-fee1ef7cb5.png",
      "sha256": "fee1ef7cb531ac42f6c4e718f1c764449ec8e71b75061b3a36e736993dbad059",
      "bytes": 477539,
      "note": "ST9400C programmer, T6360B room thermostat, L641A cylinder thermostat and V4043H valves. Other thermostat and pump-overrun examples are on the same page."
    },
    {
      "id": "y-plan",
      "title": "Y-plan",
      "subtitle": "One mid-position 3-port valve",
      "source": "resideo",
      "page": 12,
      "asset": "./diagrams/resideo-12-68e87d3c03.png",
      "sha256": "68e87d3c032fcf2180807a8457e145ed991afcb58c5590300fa5e84b99adeec3",
      "bytes": 412284,
      "note": "ST9400C programmer, T6360B room thermostat, L641A cylinder thermostat and V4073A valve. The pump-overrun inset is retained."
    },
    {
      "id": "s-plan-plus",
      "title": "S-plan Plus",
      "subtitle": "Two heating zones and hot water",
      "source": "resideo",
      "page": 11,
      "asset": "./diagrams/resideo-11-eabd69bfa7.png",
      "sha256": "eabd69bfa7e84acdcf8134e688ffcd9715be5f6a28468f801d28d33fd53ab90d",
      "bytes": 394221,
      "note": "Three valves with one common pump. This page has separate wired and T6R examples; match the controls shown."
    },
    {
      "id": "w-plan",
      "title": "W-plan",
      "subtitle": "Hot-water priority",
      "source": "resideo",
      "page": 15,
      "asset": "./diagrams/resideo-15-2e78d35074.png",
      "sha256": "2e78d3507491cf54e22aa4b01ec459296cbcd675b30300745d296acd64ff309a",
      "bytes": 368549,
      "note": "V4044C diverter valve with ST9400C, T6360B and L641A controls. The pump-overrun inset is retained."
    },
    {
      "id": "hive-single",
      "title": "Hive OTR1",
      "subtitle": "Single-channel relay / OpenTherm",
      "source": "slt3-current",
      "page": 9,
      "asset": "./diagrams/hive-current-9-fdd865a958.png",
      "sha256": "fdd865a95873f80ac90c47244acf974a4837fc210b4d5b57a363ede418ac0f00",
      "bytes": 387338,
      "note": "OTR1 receiver only. Relay is on the left; OpenTherm is on the right. Read the separate mode and cable-separation notes on the page."
    },
    {
      "id": "hive-dual",
      "title": "Hive dual channel",
      "subtitle": "Heating and hot water",
      "source": "slt3-current",
      "page": 10,
      "asset": "./diagrams/hive-current-10-bcfd98a9f0.png",
      "sha256": "bcfd98a9f046d968b99087c5590fd03d9cf0337bea20a83786d611fb96cd422d",
      "bytes": 308519,
      "note": "Dual-channel receiver. This page includes its terminal labels and separate S-plan / Y-plan notes; it is not an OpenTherm diagram."
    },
    {
      "id": "hive-older",
      "title": "Older Hive receivers",
      "subtitle": "Active Heating 2: single / dual",
      "source": "active-heating2-legacy",
      "page": 13,
      "asset": "./diagrams/hive-legacy-13-3b6755aaab.png",
      "sha256": "3b6755aaabdff7868cfcfd1ddce01f2a24c080fce10872e47eea3b68db9cf871",
      "bytes": 246347,
      "note": "Older Active Heating 2 guide. Single channel is on the left; dual channel is on the right. Its labels differ from OTR1."
    },
    {
      "id": "frost",
      "title": "Frost protection",
      "subtitle": "T4360 frost and L641B pipe thermostats",
      "source": "resideo",
      "page": 22,
      "asset": "./diagrams/resideo-22-bba777691d.png",
      "sha256": "bba777691d146ed2120de681fd2828ae089c449104f628d92f50d0d774464fdc",
      "bytes": 440647,
      "note": "Manufacturer frost-protection page, including the different plan connections and thermostat-location notes."
    }
  ]);

  // prepared/wiring-full-paths-20261026/boiler-assist/wiring/trace-data.mjs
  var common = {
    1: { label: "Permanent live", colour: "#9a4b16" },
    2: { label: "Neutral", colour: "#006fc0" },
    3: { label: "Earth", colour: "#438218" },
    4: { label: "Heating ON", colour: "#4933a5" },
    5: { label: "Heating demand", colour: "#b44e12" },
    6: { label: "Hot water ON", colour: "#9c246c" },
    7: { label: "Hot water OFF / satisfied", colour: "#656565" },
    8: { label: "Hot-water demand", colour: "#b44e12" },
    10: { label: "Boiler / pump demand", colour: "#b44e12" }
  };
  var e = (device, terminal) => ({ device, terminal });
  var mains = { 1: e("Mains supply", "L"), 2: e("Mains supply", "N"), 3: e("Mains supply", "Earth") };
  var programmer = { 1: e("ST9400C programmer", "L"), 2: e("ST9400C programmer", "N"), 4: e("ST9400C programmer", "4 \xB7 CH ON"), 6: e("ST9400C programmer", "3 \xB7 HW ON") };
  var room = { 2: e("T6360B room thermostat", "2"), 4: e("T6360B room thermostat", "1"), 5: e("T6360B room thermostat", "3") };
  var stat = { 6: e("L641A cylinder thermostat", "C"), 8: e("L641A cylinder thermostat", "1") };
  var pump = { 2: e("Pump", "N"), 3: e("Pump", "Earth") };
  var boiler = { 2: e("Boiler", "N"), 3: e("Boiler", "Earth") };
  var valve = (name, wire) => e(name, wire + " wire");
  var row = (n, ends, note = "") => ({ id: String(n), ...common[n], ends, note });
  var TRACE_PLANS = Object.freeze({
    "s-plan": {
      source: "resideo",
      page: 6,
      controls: "ST9400C \xB7 T6360B \xB7 L641A \xB7 two V4043H valves",
      demand: "10",
      rows: [
        row(1, [mains[1], programmer[1], valve("V4043H heating valve", "Grey"), valve("V4043H hot-water valve", "Grey")], "The room thermostat and pump are on switched circuits, not on this permanent-live junction."),
        row(2, [mains[2], programmer[2], room[2], valve("V4043H heating valve", "Blue"), valve("V4043H hot-water valve", "Blue"), pump[2], boiler[2]]),
        row(3, [mains[3], valve("V4043H heating valve", "Green/yellow"), valve("V4043H hot-water valve", "Green/yellow"), pump[3], boiler[3]], "Earth parking at Class II controls is not drawn on the source circuit. Retain protective-conductor continuity."),
        row(4, [programmer[4], room[4]], "The room thermostat switches between terminals 1 and 3; that contact is not a permanent link."),
        row(5, [room[5], valve("V4043H heating valve", "Brown")]),
        row(6, [programmer[6], stat[6]], "The cylinder thermostat switches C to 1 for hot-water demand; that contact is not a permanent link."),
        row(8, [stat[8], valve("V4043H hot-water valve", "Brown")]),
        row(10, [valve("V4043H heating valve", "Orange"), valve("V4043H hot-water valve", "Orange")], "The valve end switches connect grey to orange when operated. They are not permanent links.")
      ]
    },
    "y-plan": {
      source: "resideo",
      page: 12,
      controls: "ST9400C \xB7 T6360B \xB7 L641A \xB7 V4073A mid-position valve",
      demand: "8",
      rows: [
        row(1, [mains[1], programmer[1]], "The valve has no permanent-live connection in this source. Its white and grey leads are separate switched circuits."),
        row(2, [mains[2], programmer[2], room[2], valve("V4073A mid-position valve", "Blue"), pump[2], boiler[2]]),
        row(3, [mains[3], valve("V4073A mid-position valve", "Green/yellow"), pump[3], boiler[3]], "Earth parking at Class II controls is not drawn on the source circuit. Retain protective-conductor continuity."),
        row(4, [programmer[4], room[4]], "The room thermostat switches between terminals 1 and 3; that contact is not a permanent link."),
        row(5, [room[5], valve("V4073A mid-position valve", "White")]),
        row(6, [programmer[6], stat[6]]),
        row(7, [e("ST9400C programmer", "1 \xB7 HW OFF"), e("L641A cylinder thermostat", "2"), valve("V4073A mid-position valve", "Grey")]),
        { ...row(8, [stat[8], valve("V4073A mid-position valve", "Orange")], "The cylinder thermostat switches C to 1 on demand or C to 2 when satisfied. No internal valve contacts are bridged in this view."), label: "Boiler / pump demand" }
      ]
    }
  });
  function getTrace(planId, wireId, arrangement = "switched") {
    const plan = TRACE_PLANS[planId];
    if (!plan || !["switched", "overrun"].includes(arrangement)) return null;
    const original = plan.rows.find((r) => r.id === wireId);
    if (!original && !(wireId === "pump-output" && arrangement === "overrun")) return null;
    const result = original ? structuredClone(original) : { id: "pump-output", label: "Boiler pump output", colour: "#b44e12", ends: [e("Boiler", "PL \xB7 pump live output"), e("Pump", "L")], note: "Separate boiler-controlled pump circuit, as shown in the pump-overrun inset. Follow the boiler\u2019s own pump-output instructions." };
    if (wireId === "1" && arrangement === "overrun") result.ends.push(e("Boiler", "L \xB7 permanent supply"));
    if (wireId === plan.demand) {
      result.ends.push(e("Boiler", arrangement === "overrun" ? "SL \xB7 switched demand" : "L \xB7 switched supply"));
      if (arrangement === "switched") result.ends.push(e("Pump", "L"));
    }
    return { ...result, plan: planId, page: plan.page, arrangement };
  }

  // prepared/wiring-full-paths-20261026/boiler-assist/wiring/flow-data.mjs
  var FLOW_SOURCE = Object.freeze({ source: "resideo", sha256: "ec0b205ad90b01bdb7177c0f757d0e356a2b7c06cf99a891ef5b10e61472bc2b", pages: [6, 12, 24, 26] });
  var MODES = Object.freeze({ heating: "Heating only", hotwater: "Hot water only", both: "Heating and hot water", "heating-satisfied": "Heating \u2014 cylinder already hot" });
  function availableModes(planId, wire) {
    if (!TRACE_PLANS[planId] || ["2", "3"].includes(wire)) return [];
    const heating = ["heating", ...planId === "y-plan" ? ["heating-satisfied"] : [], "both"];
    if (["4", "5"].includes(wire)) return heating;
    if (wire === "6" || planId === "s-plan" && wire === "8") return ["hotwater", "both"];
    if (wire === "7") return planId === "y-plan" ? ["heating", "heating-satisfied"] : [];
    if (["1", TRACE_PLANS[planId].demand, "pump-output"].includes(wire)) return ["heating", ...planId === "y-plan" ? ["heating-satisfied"] : [], "hotwater", "both"];
    return [];
  }
  var step = (id, title, connections, condition, wires, kind = "wire") => ({ id, title, connections, condition, wires, kind });
  function getFlow(planId, wire, arrangement = "switched", requestedMode = "heating") {
    if (!getTrace(planId, wire, arrangement)) return null;
    const options = availableModes(planId, wire);
    if (!options.length) return null;
    const mode = options.includes(requestedMode) ? requestedMode : options[0], heating = mode !== "hotwater", water = mode === "hotwater" || mode === "both", both = mode === "both", s = planId === "s-plan", call = s ? "10" : "8";
    const steps = [step("supply", "Start at the mains", "Mains L \u2192 wiring centre 1 \u2192 ST9400C L", s ? "Centre 1 also feeds the grey leads of both V4043H valves." : "The white and grey valve leads use separate switched feeds below.", ["1"], "supply")];
    if (heating) {
      steps.push(step("heating-clock", "Programmer calls for heating", "ST9400C CH ON 4 \u2192 centre 4 \u2192 T6360B terminal 1", "The heating programme or manual ON enables this path.", ["4"], "contact"));
      steps.push(step("room-stat", "Room thermostat calls", "T6360B 1 \u2192 closed contact \u2192 3 \u2192 centre 5", s ? "Centre 5 \u2192 heating valve brown." : "Centre 5 \u2192 V4073A white.", ["4", "5"], "contact"));
    }
    if (water || mode === "heating-satisfied") {
      steps.push(step("water-clock", "Programmer enables hot water", "ST9400C HW ON 3 \u2192 centre 6 \u2192 L641A C", "This supplies the cylinder thermostat common terminal.", ["6"], "contact"));
      if (water) steps.push(step("cylinder-call", "Cylinder thermostat calls", "L641A C \u2192 closed contact \u2192 1 \u2192 centre 8", s ? "Centre 8 \u2192 hot-water valve brown." : "Centre 8 supplies the boiler demand and is also joined to the valve orange lead.", ["6", "8"], "contact"));
    }
    if (s) {
      const names = both ? "heating and hot-water valves" : heating ? "heating valve" : "hot-water valve";
      steps.push(step("valve-motor", "Valve motor opens the " + (both ? "valves" : "valve"), (both ? "Centre 5 \u2192 heating brown; centre 8 \u2192 hot-water brown." : heating ? "Centre 5 \u2192 heating valve brown." : "Centre 8 \u2192 hot-water valve brown.") + " Blue motor returns \u2192 centre 2 \u2192 mains N.", "V4043H " + names + " must travel open. The motor circuit is separate from the grey/orange end switch.", both ? ["5", "8"] : heating ? ["5"] : ["8"], "motor"));
      steps.push(step("end-switch", "Opened valve closes its end switch", "Separate feed: mains L \u2192 centre 1 \u2192 valve grey \u2192 end switch \u2192 orange \u2192 centre 10", both ? "The end switches are in parallel: either open valve can call the boiler. They are not wired in series." : "The " + names + " end switch supplies the demand after the valve opens.", ["1", "10"], "mechanical"));
    } else if (mode === "heating" || mode === "heating-satisfied") {
      steps.push(mode === "heating" ? step("grey-feed", "Hot-water OFF feed", "ST9400C HW OFF 1 \u2192 centre 7 \u2192 V4073A grey", "Heating-only example with hot water OFF at the programmer. The white feed above also calls for heating.", ["7"], "contact") : step("grey-feed", "Satisfied cylinder feed", "L641A C \u2192 satisfied contact 2 \u2192 centre 7 \u2192 V4073A grey", "Alternative heating-only example: hot water is enabled but the cylinder thermostat is satisfied. The white heating feed is also present.", ["6", "7"], "contact"));
      steps.push(step("mid-position-valve", "Valve reaches heating-only position", "V4073A white from centre 5 + grey from centre 7. Blue \u2192 centre 2 \u2192 mains N.", "The valve opens heating port A. Its internal switching makes orange live only at the heating-only position. No direct grey-to-orange wire link is implied.", ["5", "7"], "motor"));
      steps.push(step("valve-output", "Valve sends the boiler call", "V4073A orange \u2192 centre 8", "This is the heating-only demand output, after the valve reaches the required position.", ["8"], "mechanical"));
    } else {
      steps.push(step("mid-position-valve", both ? "Valve serves heating and hot water" : "Valve rests at hot water", both ? "Centre 5 \u2192 V4073A white; blue \u2192 centre 2 \u2192 mains N." : "No white or grey drive in this hot-water-only example.", both ? "White holds the valve at mid position, opening ports A and B. The calling cylinder thermostat supplies centre 8." : "The spring-return position opens hot-water port B. The cylinder thermostat supplies the boiler call directly; valve movement is not required first.", both ? ["5", "8"] : ["8"], "motor"));
      steps.push(step("water-output", "Cylinder call continues to the boiler", "L641A 1 \u2192 centre 8 \u2192 boiler demand", "The orange valve lead shares centre 8 and may be powered from the cylinder thermostat in this condition. Orange being live alone does not prove valve position.", ["8"], "wire"));
    }
    steps.push(step("boiler", "Demand reaches the boiler", "Centre " + call + " \u2192 boiler " + (arrangement === "overrun" ? "SL (switched demand)" : "L (switched supply)"), arrangement === "overrun" ? "Separate permanent feed: mains L \u2192 centre 1 \u2192 boiler L. Use the boiler\u2019s own terminal requirements." : "This is the switched-supply boiler arrangement in the main drawing. Match the actual boiler requirements.", [call, ...arrangement === "overrun" ? ["1"] : []], "load"));
    steps.push(step("pump", arrangement === "overrun" ? "Boiler controls the pump" : "Pump runs with the demand", arrangement === "overrun" ? "Boiler PL / pump-live output \u2192 pump L" : "Centre " + call + " \u2192 pump L", arrangement === "overrun" ? "The pump has a separate boiler-controlled feed and may continue for overrun. It is not linked directly to the SL demand." : "The pump live shares this demand junction with the boiler in the main drawing.", arrangement === "overrun" ? ["pump-output"] : [call], "load"));
    const neutral = getTrace(planId, "2", arrangement).ends.filter((e2) => e2.device !== "Mains supply").map((e2) => e2.device + " " + e2.terminal).join("; ");
    steps.push(step("neutral-return", "Return to mains neutral", "All shown N / blue returns \u2192 centre 2 \u2192 mains N", neutral, ["2"], "return"));
    return { planId, wire, arrangement, mode, label: MODES[mode], sourcePages: s ? [6, 26] : [12, 24], steps: steps.map((x) => ({ ...x, highlight: x.wires.includes(wire) })), scope: "Normal operating example for the exact listed controls; not a claim that the installed circuit is currently energised." };
  }

  // prepared/wiring-full-paths-20261026/boiler-assist/wiring/ui.mjs
  var mounts = /* @__PURE__ */ new WeakMap();
  function diagramManualURL(diagram) {
    const d = DIAGRAMS.find((x) => x.id === diagram?.id);
    if (!d || d.source !== diagram.source || d.page !== diagram.page || !DATA.sources[d.source]?.pages[String(d.page)]) throw Error("Unknown diagram");
    return DATA.sources[d.source].url + "#page=" + d.page;
  }
  function mount(root, doc = root?.ownerDocument) {
    if (!root || !doc) throw Error("Wiring diagrams unavailable");
    if (DATA.sources.resideo.sha256 !== FLOW_SOURCE.sha256) throw Error("Flow source binding unavailable");
    if (mounts.has(root)) return mounts.get(root);
    const win = doc.defaultView, make = (tag, text, cls) => {
      const el = doc.createElement(tag);
      if (text !== void 0) el.textContent = text;
      if (cls) el.className = cls;
      return el;
    };
    const button = (label, fn) => {
      const b = make("button", label);
      b.type = "button";
      b.addEventListener("click", fn);
      return b;
    };
    const back = root.querySelector("#swr-exit") || button("Back to library", () => {
    });
    back.id = "swr-exit";
    const bar = make("div", void 0, "swr-hostbar");
    bar.append(back);
    const main = make("main", void 0, "swr-main"), heading = make("h1", "Wiring diagrams");
    heading.tabIndex = -1;
    const intro = make("p", "Choose a system. Open its diagram or tap a wire to follow its connections.", "swr-intro");
    const grid = make("div", void 0, "swr-diagram-grid"), detail = make("section");
    detail.hidden = true;
    const dialog = make("dialog");
    dialog.id = "swr-largePage";
    const closeZoom = button("Back to diagram", () => hideZoom());
    const zoomBar = make("div", void 0, "swr-dialog-bar"), zoomTitle = make("h2");
    zoomBar.append(zoomTitle, closeZoom);
    const zoomBody = make("div", void 0, "swr-large-scroll");
    dialog.append(zoomBar, make("p", "Scroll across and down to follow the full-size diagram.", "swr-dialog-help"), zoomBody);
    main.append(heading, intro, grid, detail);
    root.replaceChildren(bar, main, dialog);
    const token = "stag-wiring-" + Date.now().toString(36);
    let selected = null, active = false, onExit = () => {
    }, wire = "1", arrangement = "switched";
    function hideZoom() {
      if (dialog.open) dialog.close();
      zoomBody.replaceChildren();
    }
    function enlarge(d) {
      zoomTitle.textContent = d.title;
      zoomBody.replaceChildren(image(d));
      dialog.showModal();
    }
    function image(d) {
      const img = make("img");
      img.src = new URL("./wiring/" + d.asset.replace(/^\.\//, ""), doc.baseURI).href;
      img.alt = d.title + " \xB7 complete manufacturer diagram, page " + d.page;
      img.decoding = "async";
      return img;
    }
    function home() {
      hideZoom();
      selected = null;
      heading.textContent = "Wiring diagrams";
      intro.hidden = false;
      grid.hidden = false;
      detail.hidden = true;
      detail.replaceChildren();
      back.textContent = "Back to library";
      root.scrollTop = 0;
    }
    function flowDiagram(flow) {
      const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.classList.add("swr-flow-diagram");
      svg.setAttribute("font-family", "system-ui,sans-serif");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", flow.label + " full path from mains through controls to boiler and pump");
      const ns = (tag, attrs, text, parent = svg) => {
        const el = doc.createElementNS(svg.namespaceURI, tag);
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
        if (text) el.textContent = text;
        parent.append(el);
        return el;
      };
      const wrap = (text, max = 27) => {
        const lines = [];
        let line = "";
        for (const word of text.split(/\s+/)) {
          if (line && line.length + word.length + 1 > max) {
            lines.push(line);
            line = word;
          } else line += (line ? " " : "") + word;
        }
        if (line) lines.push(line);
        return lines;
      };
      ns("title", {}, flow.label + " \u2014 " + flow.steps.map((x) => x.title + ": " + x.connections).join("; "));
      let y = 16, lastBottom = null;
      for (const [at, st] of flow.steps.entries()) {
        const titleLines = wrap(st.title, 28), lines = wrap(st.connections, 28), height = 30 + titleLines.length * 22 + lines.length * 23;
        if (lastBottom !== null) ns("path", { d: `M32 ${lastBottom} V${y + 20}`, stroke: "#527670", "stroke-width": 3, "stroke-dasharray": "5 5", fill: "none" });
        const group = ns("g", { "data-step": st.id, "data-highlight": String(st.highlight) });
        ns("circle", { cx: 32, cy: y + 20, r: 18, fill: st.highlight ? "#006e70" : "#527670" }, void 0, group);
        ns("text", { x: 32, y: y + 26, "text-anchor": "middle", fill: "#fff", "font-size": 17, "font-weight": 700 }, String(at + 1), group);
        ns("rect", { x: 62, y, width: 306, height, rx: 10, fill: st.highlight ? "#e6f5f1" : "#fff", stroke: st.highlight ? "#006e70" : "#b5cac5", "stroke-width": st.highlight ? 3 : 1.5 }, void 0, group);
        titleLines.forEach((line, i) => ns("text", { x: 75, y: y + 26 + i * 22, fill: "#173b38", "font-size": 17, "font-weight": 700 }, line, group));
        const start = y + 35 + titleLines.length * 22;
        lines.forEach((line, i) => ns("text", { x: 75, y: start + i * 23, fill: "#173b38", "font-size": 18 }, line, group));
        lastBottom = y + 20;
        y += height + 22;
      }
      svg.setAttribute("viewBox", "0 0 380 " + y);
      return svg;
    }
    function follow(d, box) {
      const plan = TRACE_PLANS[d.id];
      if (!plan) return;
      let flowMode = "heating";
      const label = make("label", "Pump connection");
      const select = make("select");
      select.setAttribute("aria-label", "Pump connection");
      for (const [value, text] of [["switched", "Pump switched with boiler \u2014 main drawing"], ["overrun", "Boiler controls pump \u2014 overrun inset"]]) {
        const option = make("option", text);
        option.value = value;
        select.append(option);
      }
      select.value = arrangement;
      const note = make("p", "Match the exact controls below. Use the boiler\u2019s instructions to choose its pump connection.", "swr-help");
      const controls = make("p", plan.controls, "swr-help"), picker = make("div", void 0, "swr-wire-picker"), route = make("div");
      route.setAttribute("aria-live", "polite");
      const draw = () => {
        picker.replaceChildren();
        const rows = [...plan.rows];
        if (arrangement === "overrun") rows.push({ id: "pump-output", label: "Pump output" });
        for (const r of rows) {
          const b = button(r.label, () => {
            wire = r.id;
            draw();
          });
          b.dataset.wire = r.id;
          b.setAttribute("aria-pressed", String(wire === r.id));
          picker.append(b);
        }
        const trace = getTrace(d.id, wire, arrangement);
        if (!trace) return;
        const title = make("h3", trace.label + (trace.id === "pump-output" ? "" : " \xB7 wiring centre " + trace.id));
        const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg"), height = 94 + trace.ends.length * 78;
        svg.setAttribute("viewBox", "0 0 380 " + height);
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", trace.label + " connections for " + d.title);
        svg.classList.add("swr-wire-diagram");
        const ns = (tag, attrs, text) => {
          const el = doc.createElementNS(svg.namespaceURI, tag);
          for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
          if (text) el.textContent = text;
          svg.append(el);
          return el;
        };
        ns("title", {}, trace.label + " \u2014 " + trace.ends.map((e2) => e2.device + ": " + e2.terminal).join("; "));
        ns("path", { d: `M42 47 V${height - 49}`, stroke: trace.colour, "stroke-width": 5, fill: "none" });
        if (wire === "3") ns("path", { d: `M42 47 V${height - 49}`, stroke: "#ffdf00", "stroke-width": 2, "stroke-dasharray": "9 7", fill: "none" });
        ns("circle", { cx: 42, cy: 35, r: 24, fill: trace.colour });
        ns("text", { x: 42, y: 42, "text-anchor": "middle", fill: "#fff", "font-size": wire === "pump-output" ? 12 : 20, "font-weight": 700 }, wire === "pump-output" ? "PL" : wire);
        ns("text", { x: 82, y: 35, fill: "#173b38", "font-size": 15, "font-weight": 700 }, wire === "pump-output" ? "Separate pump circuit" : "Wiring-centre terminal " + wire);
        trace.ends.forEach((end, i) => {
          const y = 80 + i * 78;
          ns("path", { d: `M42 ${y + 26} H92`, stroke: trace.colour, "stroke-width": 5, fill: "none" });
          ns("circle", { cx: 42, cy: y + 26, r: 5, fill: trace.colour });
          ns("rect", { x: 92, y, width: 276, height: 59, rx: 9, fill: "#fff", stroke: trace.colour, "stroke-width": 2 });
          ns("text", { x: 105, y: y + 23, fill: "#173b38", "font-size": 18, "font-weight": 700 }, end.device);
          ns("text", { x: 105, y: y + 44, fill: "#264c48", "font-size": 18 }, end.terminal);
        });
        const flow = getFlow(d.id, wire, arrangement, flowMode);
        if (flow) {
          flowMode = flow.mode;
          const modeLabel = make("label", "Condition shown"), modes = make("select");
          modes.setAttribute("aria-label", "Condition shown");
          for (const id of availableModes(d.id, wire)) {
            const option = make("option", MODES[id]);
            option.value = id;
            modes.append(option);
          }
          modes.value = flow.mode;
          modes.addEventListener("change", () => {
            flowMode = modes.value;
            draw();
          });
          const exact = make("details");
          exact.append(make("summary", "Exact connections for this wire"), svg, make("p", trace.note || "Every branch here joins the same wiring-centre terminal.", "swr-help"));
          const notes = make("details");
          notes.append(make("summary", "What each switching step means"));
          for (const st of flow.steps) notes.append(make("h3", st.title), make("p", st.condition, "swr-help"));
          route.replaceChildren(title, modeLabel, modes, make("p", flow.label + ": start to finish", "swr-path-heading"), make("p", "Follow the numbered path. Dotted lines show the operating sequence; they are not extra cable links.", "swr-help"), flowDiagram(flow), exact, notes);
        } else route.replaceChildren(title, svg, make("p", trace.note || "Every branch shown connects to this same wiring-centre terminal.", "swr-help"));
      };
      const setup = make("details"), setupTitle = make("summary");
      const pumpLabel = () => {
        setupTitle.textContent = arrangement === "overrun" ? "Pump: boiler-controlled (overrun)" : "Pump: switched with boiler";
      };
      pumpLabel();
      setup.append(setupTitle, label, select, note);
      select.addEventListener("change", () => {
        arrangement = select.value;
        if (wire === "pump-output" && arrangement === "switched") wire = "1";
        pumpLabel();
        draw();
      });
      box.append(controls, setup, make("p", "Tap a wire to follow its connections.", "swr-help"), picker, route, make("p", "Follow the terminal and wire labels. The complete manufacturer circuit is below; earth and neutral have their own full branch views.", "swr-help"));
      draw();
    }
    function show(id, push = false, initial = {}) {
      const d = DIAGRAMS.find((x) => x.id === id);
      if (!d) {
        home();
        return;
      }
      hideZoom();
      selected = d.id;
      arrangement = initial.arrangement === "overrun" ? "overrun" : "switched";
      wire = getTrace(d.id, initial.wire, arrangement) ? initial.wire : "1";
      heading.textContent = d.title;
      intro.hidden = true;
      grid.hidden = true;
      detail.hidden = false;
      detail.replaceChildren();
      back.textContent = "Back to diagrams";
      if (TRACE_PLANS[d.id]) {
        const panel = make("section", void 0, "swr-trace-panel");
        follow(d, panel);
        detail.append(panel);
      }
      const original = make("section", void 0, "swr-original");
      original.append(make("h2", "Complete manufacturer drawing"), make("p", d.note, "swr-help"), button("Enlarge diagram", () => enlarge(d)));
      const page = button("", () => enlarge(d));
      page.className = "swr-diagram-page";
      page.setAttribute("aria-label", "Enlarge " + d.title + " manufacturer diagram");
      page.append(image(d));
      original.append(page);
      detail.append(original);
      const refs = make("details");
      refs.append(make("summary", "Manufacturer guide and notes"));
      const source = DATA.sources[d.source];
      refs.append(make("p", source.title + " \xB7 " + source.edition + " \xB7 page " + d.page, "swr-help"), make("p", "Match the component models and boiler requirements shown. The full page retains its alternatives and notes.", "swr-help"));
      const link = make("a", "Open original manufacturer guide");
      link.href = diagramManualURL(d);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      refs.append(link);
      if (TRACE_PLANS[d.id]) {
        const page2 = d.id === "s-plan" ? 26 : 24;
        const operation = make("a", "Normal operating sequence \xB7 page " + page2);
        operation.href = source.url + "#page=" + page2;
        operation.target = "_blank";
        operation.rel = "noopener noreferrer";
        refs.append(operation);
      }
      detail.append(refs);
      root.scrollTop = 0;
      heading.focus({ preventScroll: true });
      if (push && active) win.history.pushState({ stagWiring: token, diagram: id }, "");
    }
    for (const d of DIAGRAMS) {
      const b = button("", () => show(d.id, true));
      b.className = "swr-diagram-card";
      const img = image(d);
      img.loading = "lazy";
      b.append(img, make("strong", d.title), make("span", d.subtitle));
      grid.append(b);
    }
    const owns = () => win.history.state?.stagWiring === token;
    const pop = () => {
      if (!active) return;
      if (owns()) {
        const id = win.history.state.diagram;
        if (id) show(id);
        else home();
      } else {
        active = false;
        home();
        onExit();
      }
    };
    win.addEventListener("popstate", pop);
    dialog.addEventListener("cancel", () => zoomBody.replaceChildren());
    const api = { start(exit) {
      onExit = exit || (() => {
      });
      active = true;
      home();
      win.history.pushState({ stagWiring: token, diagram: null }, "");
    }, stop() {
      if (!active) return;
      active = false;
      home();
      if (owns()) win.history.back();
    }, back() {
      if (dialog.open) {
        hideZoom();
        return true;
      }
      if (selected) {
        if (owns()) win.history.back();
        else home();
        return true;
      }
      return false;
    }, viewer: { clear: hideZoom }, openDiagram(id, options) {
      show(id, true, options);
    }, get selectedDiagram() {
      return selected;
    }, dispose() {
      win.removeEventListener("popstate", pop);
      hideZoom();
    } };
    mounts.set(root, api);
    home();
    return api;
  }

  // prepared/wiring-full-paths-20261026/boiler-assist/wiring/host.mjs
  var wiringMounts = /* @__PURE__ */ new WeakMap();
  var wiringContracts = { "resideo": { "url": "https://www.resideo.com/gb/en/-/media/EMEA%20Site%20Cluster/Mastersite/Documents/Sales%20Literature/Resideo_HWHome_Wiring%20Guide_May24.pdf/?rv=4a17ca0fc4ee4e588b93905ce95b5d89", "sha256": "ec0b205ad90b01bdb7177c0f757d0e356a2b7c06cf99a891ef5b10e61472bc2b", "bytes": 3033263, "pageCount": 36, "inline": false, "pages": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 32] }, "slt3-current": { "url": "https://assets.ctfassets.net/mijf9lz5yt3u/4LFy5x5QRqycyxGKT3HXYA/92716ffff1c680323bd9397f298920f2/Hive_Thermostat_SLT3_Installation_Guide_LR__1_.pdf", "sha256": "9d06f70e5c586c5071b8962e88517141752fa275148d5d7f0da1e09eb6e5df2d", "bytes": 737078, "pageCount": 20, "inline": true, "pages": [7, 9, 10] }, "active-heating2-legacy": { "url": "https://assets.ctfassets.net/mijf9lz5yt3u/3PJRO1bvewa2mAgYzKJGAV/94f24a8e62f743eb354560e30186c07f/Hive_Active_Heating_2_Wireless_Thermostat_User_Guide_Installation_Guide.pdf", "sha256": "d5cf9bf693e5ad8f4d01a9e6edbaa46c9c2cbfbfbea01f61b7cc8a85a67a4337", "bytes": 876329, "pageCount": 36, "inline": true, "pages": [9, 13, 17] } };
  function validateWiringData(data) {
    if (data?.schemaVersion !== 1 || data.installationApproval !== false || data.invasiveTestSteps !== false || Object.keys(data.sources ?? {}).length !== 3) throw Error("Wiring source data unavailable");
    for (const [id, pin] of Object.entries(wiringContracts)) {
      const s = data.sources[id];
      if (!s || s.url !== pin.url || s.sha256 !== pin.sha256 || s.bytes !== pin.bytes || s.pageCount !== pin.pageCount || s.inline !== pin.inline || JSON.stringify(Object.keys(s.pages).map(Number).sort((a, b) => a - b)) !== JSON.stringify(pin.pages)) throw Error("Wiring source binding unavailable");
    }
    if (data.receivers?.["otr1-relay"]?.terminalLabels?.["2"] !== "Unused" || data.receivers?.["legacy-single"]?.terminalLabels?.["2"] !== "Heating off (NC)" || ["1", "2", "3", "4"].some((n) => data.receivers?.["otr1-opentherm"]?.terminalLabels?.[n] !== "Unused") || data.plans?.splus?.commonPumps !== 1 || data.plans?.splus?.valves?.V4043H !== 3) throw Error("Wiring source qualification unavailable");
    return true;
  }
  function mountWiringHost(doc, { mountUI = mount, data = DATA, observe = globalThis.ResizeObserver } = {}) {
    const root = doc.getElementById("swr-root"), entry = doc.getElementById("swr-open"), message = doc.getElementById("swr-host-status");
    const unavailable = () => {
      if (entry) entry.disabled = true;
      if (message) {
        message.hidden = false;
        message.textContent = "Wiring reference unavailable. Continue using the library or finder.";
      }
    };
    if (!root) {
      unavailable();
      return null;
    }
    if (wiringMounts.has(root)) return wiringMounts.get(root);
    const library = doc.getElementById("baf-library"), bar = doc.getElementById("offlineBar"), exit = root.querySelector("#swr-exit"), finderRoot = doc.getElementById("baf-root"), finderEntry = doc.getElementById("baf-open");
    if (!entry || !message || !library || !bar || !exit) {
      unavailable();
      return null;
    }
    let ui, active = false, saved = null, spacer = null;
    const headerProperties = ["position", "top", "left", "right", "z-index"];
    try {
      validateWiringData(data);
      ui = mountUI(root, doc);
    } catch {
      unavailable();
      return null;
    }
    function geometry() {
      const rect = bar.getBoundingClientRect();
      root.style.setProperty("--swr-top", Math.max(0, rect.bottom) + "px");
      if (spacer) spacer.style.height = rect.height + "px";
    }
    function close() {
      if (!active) return;
      ui.stop?.();
      ui.viewer?.clear();
      root.hidden = true;
      if (saved.visibility) library.style.setProperty("visibility", saved.visibility, saved.visibilityPriority);
      else library.style.removeProperty("visibility");
      library.inert = saved.inert;
      if (saved.aria === null) library.removeAttribute("aria-hidden");
      else library.setAttribute("aria-hidden", saved.aria);
      for (const [name, value, priority] of saved.headerStyle) {
        if (value) bar.style.setProperty(name, value, priority);
        else bar.style.removeProperty(name);
      }
      spacer?.remove();
      spacer = null;
      active = false;
      saved.focus?.focus?.({ preventScroll: true });
    }
    function open() {
      if (active) return;
      if (finderRoot && !finderRoot.hidden) {
        const back = finderRoot.querySelector("#baf-exit");
        if (!back) {
          unavailable();
          return;
        }
        back.click();
        if (!finderRoot.hidden) {
          unavailable();
          return;
        }
      }
      saved = { visibility: library.style.visibility, visibilityPriority: library.style.getPropertyPriority("visibility"), inert: library.inert, aria: library.getAttribute("aria-hidden"), focus: doc.activeElement, headerStyle: headerProperties.map((name) => [name, bar.style.getPropertyValue(name), bar.style.getPropertyPriority(name)]) };
      spacer = doc.createElement("div");
      spacer.id = "swr-header-spacer";
      spacer.setAttribute("aria-hidden", "true");
      spacer.style.height = bar.getBoundingClientRect().height + "px";
      bar.before(spacer);
      for (const [name, value] of [["position", "fixed"], ["top", "0"], ["left", "0"], ["right", "0"], ["z-index", "20"]]) bar.style.setProperty(name, value, "important");
      geometry();
      library.style.setProperty("visibility", "hidden", "important");
      library.inert = true;
      library.setAttribute("aria-hidden", "true");
      root.hidden = false;
      root.scrollTop = 0;
      active = true;
      ui.start?.(close);
      exit.focus({ preventScroll: true });
    }
    entry.addEventListener("click", open);
    exit.addEventListener("click", () => {
      if (!ui.back?.()) close();
    });
    finderEntry?.addEventListener("click", close, true);
    doc.defaultView?.addEventListener("resize", () => {
      if (active) geometry();
    });
    doc.defaultView?.addEventListener("stag-open-standalone-record", close);
    if (observe) {
      const observer = new observe(() => {
        if (active) geometry();
      });
      observer.observe(bar);
    }
    const controller = { open, close, ui, isOpen: () => active };
    wiringMounts.set(root, controller);
    entry.disabled = false;
    entry.replaceChildren(doc.createTextNode("Wiring diagrams"));
    message.hidden = true;
    return controller;
  }
  if (typeof document !== "undefined") mountWiringHost(document);
})();
