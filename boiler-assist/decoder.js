// Reuses the existing packed-catalogue browser decoder with bounded decoding.
const allowed=new Set(['search-index','details-packed','gas-fire-index','gas-fire-details','parts-search-index']);
const loaded=new Map(),chunks=new Map();
export async function dataset(name){
  if(!allowed.has(name))throw Error('Unknown offline dataset');
  if(!loaded.has(name))loaded.set(name,fetch(new URL('./data/'+name+'.json',import.meta.url),{credentials:'omit'}).then(r=>{if(!r.ok)throw Error('Saved library unavailable. Reconnect and verify the offline download.');return r.json();}).catch(e=>{loaded.delete(name);throw e;}));
  return loaded.get(name);
}
export async function detail(id){
  if(typeof id!=='string'||id.length>160)return null;
  for(const name of ['details-packed','gas-fire-details']){
    const packed=await dataset(name);
    if(!Object.hasOwn(packed.records,id))continue;
    const [chunk,position]=packed.records[id],key=name+':'+chunk;
    if(!chunks.has(key)){
      if(!globalThis.DecompressionStream)throw Error('This browser cannot open the saved catalogue. A supported current Safari version is required.');
      const bytes=Uint8Array.from(atob(packed.chunks[chunk]),c=>c.charCodeAt(0));
      chunks.set(key,(async()=>{const raw=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();if(raw.byteLength>1024*1024)throw Error('Offline catalogue size limit exceeded');const rows=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));if(!Array.isArray(rows))throw Error('Offline catalogue format unavailable');return rows;})().catch(e=>{chunks.delete(key);throw e;}));
    }
    const records=await chunks.get(key),v=records[position];
    if(v?.boiler?.id!==id)throw Error('Offline catalogue identity mismatch');
    return structuredClone(v);
  }
  return null;
}
