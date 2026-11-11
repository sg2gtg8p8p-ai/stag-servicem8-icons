// Ideal Installer Support, 11 November 2026: a SEPARATE YYWW group
// after the serial on the barcode sticker; explicit example 2501 = 2025/W01.
// The engineer explicitly selects/checks the 2000-onwards era. It is never
// inferred from serial digits, model production spans, OCR or the current year.
export function inspectIdealDateCode({range,code,confirmed,asOf}) {
  if(range!=='ideal-barcode-2000')return {status:'source-held',message:'Older or different Ideal stickers are not decoded. Use a clearly printed manufacture date or manufacturer confirmation.'};
  if(!confirmed)return {status:'confirmation-required',message:'Check the Ideal badge, the 2000-onwards era and the separate four-digit code after the serial first.'};
  if(!/^\d{4}$/.test(String(code)))return {status:'invalid',message:'Enter only the separate four-digit YYWW date code after the serial. Keep leading zeros. Do not enter the serial or a number from inside it.'};
  const today=new Date(asOf+'T12:00:00Z');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(asOf||'')||!Number.isFinite(+today)||today.toISOString().slice(0,10)!==asOf)return {status:'invalid',message:'Check the current date.'};
  const year=2000+Number(code.slice(0,2)),week=Number(code.slice(2));
  if(week<1||week>53)return {status:'invalid',message:'The manufacture week must be 01–53. The 0000 in Ideal’s diagram is a placeholder, not a usable date code.'};
  // A manufacturing week is not assumed to use an ISO calendar. Do not invent
  // its first/last day. A conservative current-week bound rejects clear futures.
  const days=Math.floor((+today-Date.UTC(today.getUTCFullYear(),0,1))/86400000);
  const latestWeek=Math.min(53,Math.ceil((days+7)/7));
  if(year>today.getUTCFullYear()||year===today.getUTCFullYear()&&week>latestWeek)return {status:'future',message:'That code would be in the future for the selected 2000-onwards era. Check the badge; no age has been assigned.'};
  return {status:'dated',year,week,precision:'year-week',basis:'manufacture',approximateYears:today.getUTCFullYear()-year,centuryBasis:'Engineer selected and checked 2000-onwards barcode era',source:'Ideal Heating Installer Support — YYWW barcode guidance, 11 November 2026',message:'From the separate YYWW code, using the 2000-onwards era you checked. This does not establish an exact build day, installation date or warranty expiry. Older or different stickers remain unverified.'};
}

export function reviewIdealDateCodes(text) {
  if(typeof text!=='string'||text.length>12000)return [];
  const found=[];
  for(const line of text.split(/\r?\n/)) {
    // A four-digit group on its own, or explicitly labelled as a date code.
    // No slicing a serial, GC/product/article/CE number or full calendar date.
    const m=line.match(/^\s*(?:(?:manufacture|manufacturing|date)\s+code\s*[:#=-]?\s*)?(\d{4})\s*$/i);
    if(m&&!found.includes(m[1]))found.push(m[1]);
  }
  return found.slice(0,12);
}
