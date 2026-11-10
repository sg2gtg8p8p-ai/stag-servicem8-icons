import {acceptReviewedSerial} from './badge-text-review.mjs';

// An explicit engineer edit, not an OCR repair or an alternative date rule.
export function acceptCheckedPhotoSerial(review,index,edited,{checkedAgainstBadge=false}={}) {
  const choice=acceptReviewedSerial(review,index,{checkedAgainstBadge});
  if(choice.status!=='ready-for-supported-decoder')return {status:'held',serial:null};
  if(typeof edited!=='string'||edited.length>80||!edited.trim()||!/^[A-Z0-9 /.-]+$/i.test(edited))return {status:'held',serial:null};
  const serial=edited.toUpperCase().replace(/[\s-]/g,'');
  if(!/\d/.test(serial)||serial.length<4)return {status:'held',serial:null};
  return {status:'ready-for-supported-decoder',serial,explicitlyEdited:serial!==choice.serial,originalSerial:choice.serial};
}
