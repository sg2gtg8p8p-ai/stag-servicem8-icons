// Read bounded metadata before decoding or allocating a canvas. JPEG/PNG only.
export const IMAGE_LIMITS=Object.freeze({bytes:12*1024*1024,pixels:25000000,edge:8000,outputEdge:2000,headerBytes:512*1024});
export function dimensions(bytes){
  const b=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes),v=new DataView(b.buffer,b.byteOffset,b.byteLength);
  if(b.length>=24&&[137,80,78,71,13,10,26,10].every((x,i)=>b[i]===x)&&String.fromCharCode(...b.slice(12,16))==='IHDR')return {type:'image/png',width:v.getUint32(16),height:v.getUint32(20)};
  if(b.length>4&&b[0]===255&&b[1]===216){
    let i=2;
    while(i+3<b.length){
      if(b[i++]!==255)throw Error('The JPEG header is not supported. Crop or retake the label.');
      while(i<b.length&&b[i]===255)i++;
      const marker=b[i++];
      if(marker===0xD9||marker===0xDA)break;
      if(marker===0x01||(marker>=0xD0&&marker<=0xD7))continue;
      if(i+2>b.length)break;
      const length=v.getUint16(i);
      if(length<2)break;
      if([0xC0,0xC1,0xC2,0xC3,0xC5,0xC6,0xC7,0xC9,0xCA,0xCB,0xCD,0xCE,0xCF].includes(marker)&&i+7<=b.length)return {type:'image/jpeg',height:v.getUint16(i+3),width:v.getUint16(i+5)};
      i+=length;
    }
  }
  throw Error('Choose a JPEG or PNG label photo. For HEIC, use a cropped screenshot or export as JPEG.');
}
export function boundedSize(size,limits=IMAGE_LIMITS){
  if(!Number.isInteger(size.width)||!Number.isInteger(size.height)||size.width<1||size.height<1||size.width>limits.edge||size.height>limits.edge||size.width*size.height>limits.pixels)throw Error('This image is too large. Crop closely to the data plate and try again.');
  const scale=Math.min(1,limits.outputEdge/Math.max(size.width,size.height));
  return {width:Math.max(1,Math.round(size.width*scale)),height:Math.max(1,Math.round(size.height*scale))};
}
function abort(){return new DOMException('Reading cancelled.','AbortError');}
export async function prepareImage(file,{signal,doc=globalThis.document,bitmap=globalThis.createImageBitmap,Reader=globalThis.FileReader,ImageType=globalThis.Image}={}){
  if(!file||!Number.isSafeInteger(file.size)||file.size<24||file.size>IMAGE_LIMITS.bytes)throw Error('Choose a JPEG or PNG up to 12 MB. Crop closely to the data plate first.');
  if(signal?.aborted)throw abort();
  const header=await file.slice(0,IMAGE_LIMITS.headerBytes).arrayBuffer();
  const declared=dimensions(header);boundedSize(declared);
  if(signal?.aborted)throw abort();
  let image;
  if(bitmap){
    try{image=await bitmap(file,{imageOrientation:'from-image'});}catch(error){if(signal?.aborted)throw abort();}
  }
  if(!image){
    // Safari fallback: data URL stays on this device, and no blob URL/CSP change
    // or arbitrary image network request is required.
    image=await new Promise((resolve,reject)=>{
      const reader=new Reader(),img=new ImageType();
      const cancel=()=>{reader.abort();img.src='';reject(abort());};
      signal?.addEventListener('abort',cancel,{once:true});
      const done=(fn,value)=>{signal?.removeEventListener('abort',cancel);fn(value);};
      reader.onerror=()=>done(reject,Error('Photo could not be read. Retake a clear label photo.'));
      reader.onload=()=>{if(signal?.aborted){cancel();return;}img.onload=()=>done(resolve,img);img.onerror=()=>done(reject,Error('Photo could not be decoded. Use a JPEG or PNG.'));img.src=reader.result;};
      reader.readAsDataURL(file);
    });
  }
  try{
    if(signal?.aborted)throw abort();
    const actual={width:image.width||image.naturalWidth,height:image.height||image.naturalHeight};
    const output=boundedSize(actual);
    const canvas=doc.createElement('canvas');canvas.width=output.width;canvas.height=output.height;
    const context=canvas.getContext('2d',{alpha:false});if(!context)throw Error('Photo reading is unavailable in this browser. Type the plate details instead.');
    context.fillStyle='white';context.fillRect(0,0,output.width,output.height);context.drawImage(image,0,0,output.width,output.height);
    return canvas;
  }finally{image?.close?.();if(image&&'src'in image)image.src='';}
}
