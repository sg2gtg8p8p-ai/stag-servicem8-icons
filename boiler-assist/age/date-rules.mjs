import {inspectIdealDateCode} from './ideal-date-code.mjs';
// Device-only, evidence-bound rules. No network, storage or model calls.
export function inspectAgeBadge({brand, range='', serial='', manufactureCode='', confirmed=false, asOf}) {
  if (!['ideal','baxi','viessmann'].includes(brand)) return {status:'unsupported',message:'Choose Ideal, Baxi or Viessmann.'};
  const today=new Date(asOf+'T12:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf||'')||!Number.isFinite(+today)||today.toISOString().slice(0,10)!==asOf)
    return {status:'invalid',message:'Check the current date.'};
  if (!confirmed) return {status:'confirmation-required',message:'Check the make, model and complete code against the boiler badge first.'};
  if(brand==='ideal')return inspectIdealDateCode({range,code:String(manufactureCode).trim(),confirmed,asOf});
  const sn=String(serial).replace(/[\s-]/g,'').toUpperCase();
  if (sn.length>80||sn&&!/^[A-Z0-9/.]+$/.test(sn)) return {status:'invalid',message:'Check every serial letter and digit. No characters have been corrected automatically.'};
  if (brand==='baxi'&&range==='baxi-post2003-14') {
    // Baxi's own fourteen-character diagram: product3 / YY / WW /
    // appliance-in-week5 / manufacture-point2. Its accompanying image
    // explicitly depicts UK GC appliances (including ecoBlue 47-075-81).
    // Keep this layout scoped; neither 7/12-character partials nor older
    // formats establish the full boiler identity/date here.
    if(!/^[A-Z]{3}\d{9}[A-Z]{2}$/.test(sn))return {status:'unsupported',message:'This rule needs the complete 14-character base serial: three letters, nine digits, then two letters. Older, shortened or different layouts are not decoded. Keep any extra badge suffix separately. Recheck every character against the badge; the app does not correct letters or digits automatically.'};
    const year=2000+Number(sn.slice(3,5)),week=Number(sn.slice(5,7));
    if(year<2004)return {status:'unsupported',message:'This is the post-2003 layout. A 2003 or older year code needs its own manufacturer confirmation.'};
    if(week<1||week>53)return {status:'invalid',message:'The production week must be 01–53. Check the complete serial.'};
    const days=Math.floor((+today-Date.UTC(today.getUTCFullYear(),0,1))/86400000),generousWeek=Math.min(53,Math.ceil((days+7)/7));
    if(year>today.getUTCFullYear()||year===today.getUTCFullYear()&&week>generousWeek)return {status:'future',message:'This code would be in the future. Check the serial; no age has been assigned.'};
    return {status:'dated',year,week,approximateYears:today.getUTCFullYear()-year,precision:'year-week',basis:'manufacture',source:'Baxi manufacturer serial-date diagram — matching post-2003 14-character layout',sourceURL:'https://www.baxiboilers.com/contractor/faqs',message:'Manufacture year '+year+', week '+String(week).padStart(2,'0')+'. The exact build day, installation date and warranty expiry are not established.'};
  }
  const code=String(manufactureCode).trim();
  if (brand==='viessmann'&&range==='vitodens100-b1ga'&&code) {
    // Viessmann 6194585 GB, 3/2023, cover + p8. This is a SEPARATE code,
    // never a seven-digit slice of the sixteen-digit boiler serial.
    if (!/^\d{7}$/.test(code)) return {status:'invalid',message:'Enter the separate seven-digit manufacture code, keeping leading zeros. Do not shorten the serial number.'};
    const year=2000+Number(code[3]+code[5]),week=Number(code[2]+code[6]),day=Number(code[4]);
    if (week<1||week>53||day<1||day>7) return {status:'invalid',message:'The manufacture code contains an invalid calendar week or day.'};
    const jan4=new Date(Date.UTC(year,0,4));
    const monday=+jan4-((jan4.getUTCDay()+6)%7)*86400000;
    const date=new Date(monday+((week-1)*7+day-1)*86400000);
    const thursday=new Date(monday+((week-1)*7+3)*86400000);
    if (thursday.getUTCFullYear()!==year) return {status:'invalid',message:'That year does not have this calendar week. Check the code.'};
    const manufactureDate=date.toISOString().slice(0,10);
    if (manufactureDate>asOf) return {status:'future',message:'That manufacture code would be in the future. No age has been assigned.'};
    return {status:'dated',year,week,day,manufactureDate,approximateYears:today.getUTCFullYear()-year,precision:'day',basis:'manufacture',source:'Viessmann 6194585 GB, 3/2023, page 8',message:'Decoded from the separate B1GA manufacture code. This is the build date, not the installation date or warranty expiry.'};
  }
  // Viessmann's own 25 March 2021 explanation covers both 13 and 16
  // digits and explicitly says the decade is absent. Keep that uncertainty
  // even when a plausible model, current decade or serial prefix is known.
  const viessmannSerialSource='https://community.viessmann.de/t5/Off-Topic-Smalltalk/Woher-weiss-ich-wie-alt-meine-Anlage-ist/td-p/168710';
  if (brand==='viessmann'&&/^(?:\d{13}|\d{16})$/.test(sn))
    return {status:'ambiguous',yearDigit:Number(sn[7]),serialLength:sn.length,source:'Viessmann — manufacture-year guidance, 25 March 2021',sourceURL:viessmannSerialSource,message:'The eighth serial digit is '+sn[7]+'. It does not establish the decade, so no year or age has been assigned. A separate supported manufacture code, clearly printed manufacture date or manufacturer confirmation is needed.'};
  if (brand==='viessmann'&&/^(?:\d{6}|\d{12})$/.test(sn))
    return {status:'source-held',serialLength:sn.length,source:'Viessmann — manufacture-year guidance, 25 March 2021',sourceURL:viessmannSerialSource,message:'For this older '+sn.length+'-digit serial format, Viessmann directs you to the manufacture year on the type plate. No serial-to-year rule is established here. Photograph the printed manufacture date if present; the app does not infer a date from a CE mark.'};
  return {status:'source-held',message:brand==='ideal'?'This Ideal serial layout is not supported by the verified manufacturer information in this app. No year or age has been assigned. A clearly printed manufacture date can be read from a badge photo.':brand==='baxi'?'This UK Baxi serial layout is not supported by the verified manufacturer information in this app. No year or age has been assigned. A clearly printed manufacture date can be read from a badge photo.':'This code is not covered by the checked B1GA manufacture-code key. No year or age has been assigned.'};
}

// Extract ONLY explicitly labelled manufacture dates, preserving all alternatives.
// Two-digit dates and dates embedded in a serial are deliberately not interpreted.
export function reviewManufactureDates(text) {
  if(typeof text!=='string'||text.length>12000)return [];
  const found=[];
  for(const line of text.split(/\r?\n/)) {
    const m=line.match(/^\s*(?:date\s+of\s+manufacture|manufacture\s+date|manufactured(?:\s+on)?|mfg\.?\s+date|baujahr)\s*[:#=-]?\s*(.*?)\s*$/i);
    if(!m)continue;
    const raw=m[1];let year,month=null,day=null;
    let date=raw.match(/^(\d{4})[-/.](\d{2})[-/.](\d{2})$/);
    if(date){year=+date[1];month=+date[2];day=+date[3];}
    else if((date=raw.match(/^(\d{2})[/.](\d{2})[/.](\d{4})$/))){day=+date[1];month=+date[2];year=+date[3];}
    else if(/^\d{4}$/.test(raw))year=+raw;
    else continue;
    if(year<1900||year>2099)continue;
    if(month!==null){const d=new Date(Date.UTC(year,month-1,day));if(d.getUTCFullYear()!==year||d.getUTCMonth()!==month-1||d.getUTCDate()!==day)continue;}
    const manufactureDate=month===null?null:[year,String(month).padStart(2,'0'),String(day).padStart(2,'0')].join('-');
    if(!found.some(x=>x.year===year&&x.manufactureDate===manufactureDate))found.push({raw,year,month,day,manufactureDate,precision:month===null?'year':'day'});
  }
  return found;
}

export function acceptPrintedDate(candidate,{confirmed=false,asOf}={}) {
  // Reparse the label, rather than trusting a caller-supplied candidate object.
  const checked=reviewManufactureDates('Manufacture date: '+(candidate?.raw||''))[0];
  if(!confirmed||!checked)return {status:'confirmation-required',message:'Choose and check the printed manufacture date against the badge.'};
  if(!/^\d{4}-\d{2}-\d{2}$/.test(asOf||''))return {status:'invalid',message:'Check the current date.'};
  const date=new Date(asOf+'T12:00:00Z');
  if(!Number.isFinite(+date)||date.toISOString().slice(0,10)!==asOf)return {status:'invalid',message:'Check the current date.'};
  if(checked.year>date.getUTCFullYear()||checked.manufactureDate&&checked.manufactureDate>asOf)return {status:'future',message:'That printed date is in the future. No age has been assigned.'};
  return {...checked,status:'dated',basis:'manufacture',approximateYears:date.getUTCFullYear()-checked.year,message:'Age from the manufacture date you checked on the badge. The serial number has not independently verified this printed date.'};
}
