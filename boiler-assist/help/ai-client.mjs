// The phone holds only a revocable, budget-limited device token. Never an API key.
export const AI_ENDPOINT='https://18.170.128.213';
export const CATALOGUE_SHA256='1b75c9e2312cc7f1ad1a7c0c49407a49a726aa1f30567fb954648763f5de90c4';
export const REFERENCE_QUESTIONS=Object.freeze({dimensions:'dimensions weight',output:'output',notes:'notes',manuals:'manuals',fullService:'service',serviceMode:'mode',adjustments:'gas valve',combustion:'combustion',parts:'parts',faultCodes:'fault codes'});
const STORAGE_KEY='stag-ai-device-v1',MAX_REPLY=160*1024;
function fail(message){throw Error(message);}
function boundedString(value,max){return typeof value==='string'&&value.length>0&&value.length<=max;}
async function readJSON(response){
  let text='';
  if(response.body?.getReader){
    const reader=response.body.getReader(),decoder=new TextDecoder('utf-8',{fatal:true});let bytes=0;
    try{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>MAX_REPLY){await reader.cancel();fail('The AI reply was too large. No retry was made.');}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}
    finally{reader.releaseLock();}
  }else{text=await response.text();if(new TextEncoder().encode(text).byteLength>MAX_REPLY)fail('The AI reply was too large. No retry was made.');}
  try{return JSON.parse(text);}catch{fail('The AI reply was not readable. No retry was made.');}
}
export function createAIClient({fetcher=globalThis.fetch,storage,now=()=>Date.now(),Abort=globalThis.AbortController}={}){
  let credential=null,persistent=true;
  if(storage===undefined)try{storage=globalThis.localStorage;}catch{storage=null;persistent=false;}
  function discard(){credential=null;try{storage?.removeItem(STORAGE_KEY);}catch{persistent=false;}}
  try{const saved=JSON.parse(storage?.getItem(STORAGE_KEY)||'null');if(saved&&boundedString(saved.device_token,256)&&typeof saved.expires_at==='string'&&Date.parse(saved.expires_at)>now())credential=saved;else if(saved)discard();}catch{discard();}
  function hasSession(){if(credential&&Date.parse(credential.expires_at)<=now())discard();return !!credential;}
  function version(data){if(data?.catalogue_sha256!==CATALOGUE_SHA256)fail('The AI service and saved library have different versions. Use the saved guide until they are updated together.');}
  async function request(path,body,{anonymous=false}={}){
    if(!anonymous&&!hasSession())fail('Connect this device to AI first.');
    const controller=new Abort(),timer=setTimeout(()=>controller.abort(),65000);
    try{
      const headers={'Accept':'application/json'};if(body!==undefined)headers['Content-Type']='application/json';if(!anonymous)headers.Authorization='Bearer '+credential.device_token;
      const response=await fetcher(AI_ENDPOINT+path,{method:body===undefined?'GET':'POST',headers,body:body===undefined?undefined:JSON.stringify(body),mode:'cors',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',signal:controller.signal});
      const data=await readJSON(response);
      if(!response.ok){if(response.status===401)discard();fail(response.status===401?'This device connection has expired. Connect it again.':response.status===429?'The AI usage or request limit has been reached. Use the saved guide.':'The AI service could not complete that request. No retry was made.');}
      return data;
    }catch(error){if(error?.name==='AbortError')fail('The AI request timed out. It may already have used credit; no retry was made.');if(error?.message&&/^(The AI|This device|Connect this)/.test(error.message))throw error;fail('The AI connection is unavailable. Use on-device reading or the saved guide; no retry was made.');}
    finally{clearTimeout(timer);}
  }
  return {
    hasSession,
    async pair(code){
      if(!boundedString(code,256))fail('Enter the one-time phone code from setup.');
      if(/^sk-/i.test(code.trim()))fail('Use the one-time phone code here, never the OpenAI API key.');
      const data=await request('/v1/pair',{pairing_code:code},{anonymous:true});version(data);
      if(!boundedString(data.device_token,256)||typeof data.expires_at!=='string'||!(Date.parse(data.expires_at)>now()))fail('The AI connection was not valid. Nothing has been saved.');
      credential={device_token:data.device_token,expires_at:data.expires_at};
      try{storage?.setItem(STORAGE_KEY,JSON.stringify(credential));if(!storage)persistent=false;}catch{persistent=false;}
      return {connected:true,persistent,expires_at:credential.expires_at,budget:data.budget};
    },
    async status(){if(!hasSession())return {connected:false,ready:false,persistent};const data=await request('/v1/status');version(data);return {...data,connected:true,persistent};},
    async disconnect(){try{if(hasSession())await request('/v1/revoke',{});}finally{discard();}},
    async ask(boilerId,question){
      if(!boundedString(boilerId,160)||!boundedString(question,400))fail('Choose the exact boiler and enter a short question.');
      const data=await request('/v1/ask',{boiler_id:boilerId,question,catalogue_sha256:CATALOGUE_SHA256});version(data);
      if(data.boiler_id!==boilerId||!Object.hasOwn(REFERENCE_QUESTIONS,data.reference_key)||!['generated','route','unavailable'].includes(data.kind)||typeof data.answer_text!=='string'||data.answer_text.length>12000)fail('The AI reply did not match the confirmed boiler and saved references. Use the saved guide.');
      return data;
    },
    async photo({mime,image_base64}){
      if(!['image/jpeg','image/png'].includes(mime)||!boundedString(image_base64,410000)||!/^[A-Za-z0-9+/]*={0,2}$/.test(image_base64))fail('Crop the label more closely and try again.');
      const data=await request('/v1/photo',{mime,image_base64,catalogue_sha256:CATALOGUE_SHA256});version(data);
      if(!Array.isArray(data.visible_identifiers)||data.visible_identifiers.length>8||data.visible_identifiers.some(v=>typeof v!=='string'||v.length>80)||typeof data.uncertain!=='boolean')fail('AI did not return a supported label transcript. Type the exact code instead.');
      return data;
    }
  };
}
export async function canvasPhotoPayload(canvas){
  // Prepare locally under the existing server cap; no upload or AI request here.
  const cap=300*1024,edge=Math.max(canvas.width,canvas.height);
  if(!Number.isInteger(edge)||edge<1||edge>2000||canvas.width*canvas.height>4000000)fail('Choose a clear JPEG or PNG label photo.');
  const steps=[[edge,0.82],[edge,0.68],[Math.min(edge,1600),0.72],[Math.min(edge,1280),0.68],[Math.min(edge,1024),0.60],[Math.min(edge,800),0.60]];
  const tried=new Set();let scratch=null,blob=null;
  try{
    for(const [target,quality] of steps){
      const key=target+':'+quality;if(tried.has(key))continue;tried.add(key);
      let image=canvas;
      if(target<edge){
        scratch??=canvas.ownerDocument.createElement('canvas');
        const scale=target/edge;scratch.width=Math.max(1,Math.round(canvas.width*scale));scratch.height=Math.max(1,Math.round(canvas.height*scale));
        const context=scratch.getContext('2d',{alpha:false});if(!context)fail('Photo preparation is unavailable. Retake a clear label photo or type the code.');
        context.fillStyle='white';context.fillRect(0,0,scratch.width,scratch.height);context.drawImage(canvas,0,0,scratch.width,scratch.height);image=scratch;
      }
      blob=await new Promise(resolve=>image.toBlob(resolve,'image/jpeg',quality));
      if(!blob||blob.type!=='image/jpeg')fail('Photo could not be prepared. Retake a clear label photo or type the code.');
      if(blob.size>0&&blob.size<=cap)break;blob=null;
    }
    if(!blob)fail('This photo could not be reduced clearly enough. Take a closer photo showing just the boiler label, or type its code.');
    const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
    return {mime:'image/jpeg',image_base64:btoa(binary)};
  }finally{if(scratch)scratch.width=scratch.height=1;}
}
