export const DIAGRAMS=Object.freeze([
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
