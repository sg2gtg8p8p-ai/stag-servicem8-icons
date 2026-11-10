import {inspectAgeBadge,reviewManufactureDates,acceptPrintedDate} from './date-rules.mjs';
import {reviewBadgeText} from './badge-text-review.mjs';
import {acceptCheckedPhotoSerial} from './photo-serial-correction.mjs';
import {createReader} from '../help/ocr.mjs';

export function mountThreeBrandAge(doc=document,reader=createReader(),now=()=>new Date()) {
  const $=id=>doc.getElementById(id),make=(tag,text)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
  const brand=$('age-brand'),result=$('three-age-result'),panel=$('three-age-panel');
  let generation=0,review=null,dates=[],codes=[],preview=null;
  const today=()=>{const d=now();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
  function clearResult(){result.replaceChildren();}
  function stop(){generation++;void reader.cancel().catch(()=>{});$('age-photo-status').textContent='';$('age-photo-cancel').hidden=true;}
  function clearPhoto(){
    stop();review=null;dates=[];codes=[];
    for(const id of ['photo-serial-choice','photo-date-choice','photo-code-choice'])$(id).replaceChildren(make('option','Choose a reading to check'));
    $('age-photo-review').hidden=true;$('photo-reading-confirm').checked=false;
    $('photo-serial-edit').value='';
    $('age-photo-camera').value='';$('age-photo-library').value='';
    $('age-photo-text').textContent='';$('age-photo-preview').hidden=true;$('age-photo-preview').removeAttribute('src');
    if(preview){URL.revokeObjectURL(preview);preview=null;}
  }
  function reset(){
    clearPhoto();clearResult();$('three-age-serial').value='';$('three-manufacture-code').value='';$('three-age-confirm').checked=false;
    const b=brand.value;panel.hidden=!['baxi','viessmann'].includes(b);
    const range=$('three-age-range');range.replaceChildren();
    const ranges=b==='ideal'?[['','Choose the Ideal range'],['logic','Logic / Logic+ / Logic Max'],['classic','Classic'],['mini','Mini'],['other','Other Ideal range']]:b==='viessmann'?[['','Choose the Viessmann range'],['vitodens100-b1ga','Vitodens 100-W Heat Only — type B1GA'],['other','Other Viessmann range']]:[['','Choose the Baxi serial layout'],['baxi-post2003-14','3 letters + 9 digits + 2 letters (14 characters)'],['baxi-other','Older / different Baxi serial layout']];
    for(const [value,label] of ranges){const o=make('option',label);o.value=value;range.append(o);}
    range.value='';$('three-code-wrap').hidden=true;
  }
  function show(r){
    clearResult();result.append(make('h2',r.status==='dated'?'Manufacture age':'Age check'));
    if(r.status==='dated'){
      result.append(make('strong',r.manufactureDate?'Manufactured '+r.manufactureDate:r.week?'Manufactured in '+r.year+', week '+String(r.week).padStart(2,'0'):'Manufactured in '+r.year));
      result.append(make('p','About '+r.approximateYears+' years old as of '+today()+'.'));
    }
    result.append(make('p',r.message));if(r.source){const p=make('p');if(r.sourceURL){const a=make('a',r.source);a.href=r.sourceURL;a.target='_blank';a.rel='noopener noreferrer';p.append(a);}else p.textContent=r.source;result.append(p);}
    return r;
  }
  function lookup(){return show(inspectAgeBadge({brand:brand.value,range:$('three-age-range').value,serial:$('three-age-serial').value,manufactureCode:$('three-manufacture-code').value,confirmed:$('three-age-confirm').checked,asOf:today()}));}
  function reviewText(text){
    review=reviewBadgeText(text);dates=reviewManufactureDates(text);codes=[];
    if(brand.value==='viessmann'&&$('three-age-range').value==='vitodens100-b1ga')for(const line of text.split(/\r?\n/)){
      const m=line.match(/^\s*(?:manufacture code|date code)\s*[:#=-]?\s*(\d{7})\s*$/i);
      if(m&&!codes.includes(m[1]))codes.push(m[1]);
    }
    const sets=[['photo-serial-choice',review.candidates.map(c=>c.raw)],['photo-date-choice',dates.map(c=>c.raw)],['photo-code-choice',codes]];
    for(const [id,values] of sets){const select=$(id);select.replaceChildren();const empty=make('option',values.length?'Choose a reading to check':'No clearly labelled reading found');empty.value='';select.append(empty);values.forEach((value,i)=>{const o=make('option',value);o.value=String(i);select.append(o);});select.value='';}
    $('age-photo-text').textContent=text;$('age-photo-review').hidden=false;
    $('photo-reading-confirm').checked=false;
    $('age-photo-status').textContent='Check the photo and choose a reading below. Nothing has been selected automatically.';
  }
  async function readPhoto(file){
    clearPhoto();clearResult();$('three-age-serial').value='';$('three-manufacture-code').value='';$('three-age-confirm').checked=false;
    if(!file)return;
    const token=generation,selectedBrand=brand.value,selectedRange=$('three-age-range').value;
    if(!['ideal','baxi','viessmann'].includes(selectedBrand))return;
    preview=URL.createObjectURL(file);$('age-photo-preview').src=preview;$('age-photo-preview').hidden=false;$('age-photo-cancel').hidden=false;
    try{
      const text=await reader.read(file,{quarterTurns:Number($('age-photo-rotation').value),onStatus:message=>{if(token===generation)$('age-photo-status').textContent=message;}});
      if(token!==generation||selectedBrand!==brand.value||selectedRange!==$('three-age-range').value)return;
      reviewText(text);
    }catch(error){if(token===generation)$('age-photo-status').textContent=error?.name==='AbortError'?'Photo reading cancelled.':String(error?.message||'Photo reading failed. Type the serial instead.');}
    finally{if(token===generation)$('age-photo-cancel').hidden=true;}
  }
  function useSerial(){
    const value=$('photo-serial-choice').value;
    const accepted=acceptCheckedPhotoSerial(review,value===''?-1:Number(value),$('photo-serial-edit').value,{checkedAgainstBadge:$('photo-reading-confirm').checked});
    clearResult();if(accepted.status!=='ready-for-supported-decoder'){return show({status:'confirmation-required',message:'Choose the complete serial and check it against the photo first.'});}
    $('three-age-serial').value=accepted.serial;$('three-age-confirm').checked=true;return lookup();
  }
  function useCode(){
    const i=$('photo-code-choice').value;
    if(!$('photo-reading-confirm').checked||i===''||!codes[Number(i)])return show({status:'confirmation-required',message:'Choose and check the separate manufacture code first.'});
    $('three-manufacture-code').value=codes[Number(i)];$('three-age-confirm').checked=true;return lookup();
  }
  function useDate(){const i=$('photo-date-choice').value;return show(acceptPrintedDate(i===''?null:dates[Number(i)],{confirmed:$('photo-reading-confirm').checked,asOf:today()}));}
  brand.addEventListener('change',reset);
  $('three-age-range').addEventListener('change',()=>{clearPhoto();clearResult();$('three-age-serial').value='';$('three-manufacture-code').value='';$('three-age-confirm').checked=false;$('three-code-wrap').hidden=!(brand.value==='viessmann'&&$('three-age-range').value==='vitodens100-b1ga');});
  for(const id of ['three-age-serial','three-manufacture-code'])$(id).addEventListener('input',()=>{clearResult();$('three-age-confirm').checked=false;});
  $('three-age-confirm').addEventListener('change',clearResult);
  $('three-age-form').addEventListener('submit',e=>{e.preventDefault();lookup();});
  for(const id of ['age-photo-camera','age-photo-library'])$(id).addEventListener('change',e=>{void readPhoto(e.target.files?.[0]);});
  $('age-photo-cancel').addEventListener('click',()=>{clearPhoto();clearResult();$('age-photo-status').textContent='Photo reading cancelled.';});
  $('age-photo-rotation').addEventListener('change',()=>{clearPhoto();clearResult();$('age-photo-status').textContent='Rotation changed. Choose the photo again.';});
  for(const id of ['photo-serial-choice','photo-date-choice','photo-code-choice'])$(id).addEventListener('change',()=>{clearResult();$('photo-reading-confirm').checked=false;});
  $('photo-serial-choice').addEventListener('change',()=>{const i=$('photo-serial-choice').value;$('photo-serial-edit').value=i===''?'':review?.candidates?.[Number(i)]?.raw||'';});
  $('photo-serial-edit').addEventListener('input',()=>{clearResult();$('photo-reading-confirm').checked=false;});
  $('photo-reading-confirm').addEventListener('change',clearResult);
  $('photo-use-serial').addEventListener('click',useSerial);$('photo-use-date').addEventListener('click',useDate);$('photo-use-code').addEventListener('click',useCode);
  doc.defaultView?.addEventListener('pagehide',reset);doc.defaultView?.addEventListener('pageshow',reset);
  reset();return {reset,lookup,readPhoto,useSerial,useDate,useCode};
}
if(typeof document!=='undefined'&&document.getElementById('three-age-panel'))mountThreeBrandAge();
