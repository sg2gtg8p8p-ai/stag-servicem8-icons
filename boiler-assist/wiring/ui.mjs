import {DATA} from './source-data.mjs';
import {DIAGRAMS} from './diagram-data.mjs';
import {TRACE_PLANS,getTrace} from './trace-data.mjs';
import {FLOW_SOURCE,MODES,availableModes,getFlow} from './flow-data.mjs';
const mounts=new WeakMap();
export function diagramManualURL(diagram){
 const d=DIAGRAMS.find(x=>x.id===diagram?.id);
 if(!d||d.source!==diagram.source||d.page!==diagram.page||!DATA.sources[d.source]?.pages[String(d.page)])throw Error('Unknown diagram');
 return DATA.sources[d.source].url+'#page='+d.page;
}
export function mount(root,doc=root?.ownerDocument){
 if(!root||!doc)throw Error('Wiring diagrams unavailable');if(DATA.sources.resideo.sha256!==FLOW_SOURCE.sha256)throw Error('Flow source binding unavailable');if(mounts.has(root))return mounts.get(root);
 const win=doc.defaultView,make=(tag,text,cls)=>{const el=doc.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
 const button=(label,fn)=>{const b=make('button',label);b.type='button';b.addEventListener('click',fn);return b;};
 const back=root.querySelector('#swr-exit')||button('Back to library',()=>{});back.id='swr-exit';
 const bar=make('div',undefined,'swr-hostbar');bar.append(back);
 const main=make('main',undefined,'swr-main'),heading=make('h1','Wiring diagrams');heading.tabIndex=-1;
 const intro=make('p','Choose a system. Open its diagram or tap a wire to follow its connections.','swr-intro');
 const grid=make('div',undefined,'swr-diagram-grid'),detail=make('section');detail.hidden=true;
 const dialog=make('dialog');dialog.id='swr-largePage';const closeZoom=button('Back to diagram',()=>hideZoom());
 const zoomBar=make('div',undefined,'swr-dialog-bar'),zoomTitle=make('h2');zoomBar.append(zoomTitle,closeZoom);
 const zoomBody=make('div',undefined,'swr-large-scroll');dialog.append(zoomBar,make('p','Scroll across and down to follow the full-size diagram.','swr-dialog-help'),zoomBody);
 main.append(heading,intro,grid,detail);root.replaceChildren(bar,main,dialog);
 const token='stag-wiring-'+Date.now().toString(36);let selected=null,active=false,onExit=()=>{},wire='1',arrangement='switched';
 function hideZoom(){if(dialog.open)dialog.close();zoomBody.replaceChildren();}
 function enlarge(d){zoomTitle.textContent=d.title;zoomBody.replaceChildren(image(d));dialog.showModal();}
 function image(d){const img=make('img');img.src=new URL('./wiring/'+d.asset.replace(/^\.\//,''),doc.baseURI).href;img.alt=d.title+' · complete manufacturer diagram, page '+d.page;img.decoding='async';return img;}
 function home(){hideZoom();selected=null;heading.textContent='Wiring diagrams';intro.hidden=false;grid.hidden=false;detail.hidden=true;detail.replaceChildren();back.textContent='Back to library';root.scrollTop=0;}
 function flowDiagram(flow){
  const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('swr-flow-diagram');svg.setAttribute('font-family','system-ui,sans-serif');svg.setAttribute('role','img');svg.setAttribute('aria-label',flow.label+' full path from mains through controls to boiler and pump');
  const ns=(tag,attrs,text,parent=svg)=>{const el=doc.createElementNS(svg.namespaceURI,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text)el.textContent=text;parent.append(el);return el;};
  const wrap=(text,max=27)=>{const lines=[];let line='';for(const word of text.split(/\s+/)){if(line&&line.length+word.length+1>max){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);return lines;};
  ns('title',{},flow.label+' — '+flow.steps.map(x=>x.title+': '+x.connections).join('; '));let y=16,lastBottom=null;
  for(const[at,st]of flow.steps.entries()){
   const titleLines=wrap(st.title,28),lines=wrap(st.connections,28),height=30+titleLines.length*22+lines.length*23;
   if(lastBottom!==null)ns('path',{d:`M32 ${lastBottom} V${y+20}`,stroke:'#527670','stroke-width':3,'stroke-dasharray':'5 5',fill:'none'});
   const group=ns('g',{'data-step':st.id,'data-highlight':String(st.highlight)});ns('circle',{cx:32,cy:y+20,r:18,fill:st.highlight?'#006e70':'#527670'},undefined,group);ns('text',{x:32,y:y+26,'text-anchor':'middle',fill:'#fff','font-size':17,'font-weight':700},String(at+1),group);
   ns('rect',{x:62,y,width:306,height,rx:10,fill:st.highlight?'#e6f5f1':'#fff',stroke:st.highlight?'#006e70':'#b5cac5','stroke-width':st.highlight?3:1.5},undefined,group);
   titleLines.forEach((line,i)=>ns('text',{x:75,y:y+26+i*22,fill:'#173b38','font-size':17,'font-weight':700},line,group));
   const start=y+35+titleLines.length*22;lines.forEach((line,i)=>ns('text',{x:75,y:start+i*23,fill:'#173b38','font-size':18},line,group));
   lastBottom=y+20;y+=height+22;
  }
  svg.setAttribute('viewBox','0 0 380 '+y);return svg;
 }
 function follow(d,box){
  const plan=TRACE_PLANS[d.id];if(!plan)return;let flowMode='heating';
  const label=make('label','Pump connection');const select=make('select');select.setAttribute('aria-label','Pump connection');
  for(const[value,text]of [['switched','Pump switched with boiler — main drawing'],['overrun','Boiler controls pump — overrun inset']]){const option=make('option',text);option.value=value;select.append(option);}select.value=arrangement;
  const note=make('p','Match the exact controls below. Use the boiler’s instructions to choose its pump connection.','swr-help');
  const controls=make('p',plan.controls,'swr-help'),picker=make('div',undefined,'swr-wire-picker'),route=make('div');route.setAttribute('aria-live','polite');
  const draw=()=>{
   picker.replaceChildren();
   const rows=[...plan.rows];if(arrangement==='overrun')rows.push({id:'pump-output',label:'Pump output'});
   for(const r of rows){const b=button(r.label,()=>{wire=r.id;draw();});b.dataset.wire=r.id;b.setAttribute('aria-pressed',String(wire===r.id));picker.append(b);}
   const trace=getTrace(d.id,wire,arrangement);if(!trace)return;
   const title=make('h3',trace.label+(trace.id==='pump-output'?'':' · wiring centre '+trace.id));
   const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg'),height=94+trace.ends.length*78;svg.setAttribute('viewBox','0 0 380 '+height);svg.setAttribute('role','img');svg.setAttribute('aria-label',trace.label+' connections for '+d.title);svg.classList.add('swr-wire-diagram');
   const ns=(tag,attrs,text)=>{const el=doc.createElementNS(svg.namespaceURI,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text)el.textContent=text;svg.append(el);return el;};
   ns('title',{},trace.label+' — '+trace.ends.map(e=>e.device+': '+e.terminal).join('; '));
   ns('path',{d:`M42 47 V${height-49}`,stroke:trace.colour,'stroke-width':5,fill:'none'});
   if(wire==='3')ns('path',{d:`M42 47 V${height-49}`,stroke:'#ffdf00','stroke-width':2,'stroke-dasharray':'9 7',fill:'none'});
   ns('circle',{cx:42,cy:35,r:24,fill:trace.colour});ns('text',{x:42,y:42,'text-anchor':'middle',fill:'#fff','font-size':wire==='pump-output'?12:20,'font-weight':700},wire==='pump-output'?'PL':wire);
   ns('text',{x:82,y:35,fill:'#173b38','font-size':15,'font-weight':700},wire==='pump-output'?'Separate pump circuit':'Wiring-centre terminal '+wire);
   trace.ends.forEach((end,i)=>{const y=80+i*78;ns('path',{d:`M42 ${y+26} H92`,stroke:trace.colour,'stroke-width':5,fill:'none'});ns('circle',{cx:42,cy:y+26,r:5,fill:trace.colour});ns('rect',{x:92,y,width:276,height:59,rx:9,fill:'#fff',stroke:trace.colour,'stroke-width':2});ns('text',{x:105,y:y+23,fill:'#173b38','font-size':18,'font-weight':700},end.device);ns('text',{x:105,y:y+44,fill:'#264c48','font-size':18},end.terminal);});
   const flow=getFlow(d.id,wire,arrangement,flowMode);
   if(flow){
    flowMode=flow.mode;const modeLabel=make('label','Condition shown'),modes=make('select');modes.setAttribute('aria-label','Condition shown');
    for(const id of availableModes(d.id,wire)){const option=make('option',MODES[id]);option.value=id;modes.append(option);}modes.value=flow.mode;modes.addEventListener('change',()=>{flowMode=modes.value;draw();});
    const exact=make('details');exact.append(make('summary','Exact connections for this wire'),svg,make('p',trace.note||'Every branch here joins the same wiring-centre terminal.','swr-help'));
    const notes=make('details');notes.append(make('summary','What each switching step means'));for(const st of flow.steps)notes.append(make('h3',st.title),make('p',st.condition,'swr-help'));
    route.replaceChildren(title,modeLabel,modes,make('p',flow.label+': start to finish','swr-path-heading'),make('p','Follow the numbered path. Dotted lines show the operating sequence; they are not extra cable links.','swr-help'),flowDiagram(flow),exact,notes);
   }else route.replaceChildren(title,svg,make('p',trace.note||'Every branch shown connects to this same wiring-centre terminal.','swr-help'));

  };
  const setup=make('details'),setupTitle=make('summary');const pumpLabel=()=>{setupTitle.textContent=arrangement==='overrun'?'Pump: boiler-controlled (overrun)':'Pump: switched with boiler';};pumpLabel();setup.append(setupTitle,label,select,note);
  select.addEventListener('change',()=>{arrangement=select.value;if(wire==='pump-output'&&arrangement==='switched')wire='1';pumpLabel();draw();});
  box.append(controls,setup,make('p','Tap a wire to follow its connections.','swr-help'),picker,route,make('p','Follow the terminal and wire labels. The complete manufacturer circuit is below; earth and neutral have their own full branch views.','swr-help'));draw();
 }
 function show(id,push=false,initial={}){
  const d=DIAGRAMS.find(x=>x.id===id);if(!d){home();return;}
  hideZoom();selected=d.id;arrangement=initial.arrangement==='overrun'?'overrun':'switched';wire=getTrace(d.id,initial.wire,arrangement)?initial.wire:'1';heading.textContent=d.title;intro.hidden=true;grid.hidden=true;detail.hidden=false;detail.replaceChildren();back.textContent='Back to diagrams';
  if(TRACE_PLANS[d.id]){const panel=make('section',undefined,'swr-trace-panel');follow(d,panel);detail.append(panel);}
  const original=make('section',undefined,'swr-original');original.append(make('h2','Complete manufacturer drawing'),make('p',d.note,'swr-help'),button('Enlarge diagram',()=>enlarge(d)));
  const page=button('',()=>enlarge(d));page.className='swr-diagram-page';page.setAttribute('aria-label','Enlarge '+d.title+' manufacturer diagram');page.append(image(d));original.append(page);detail.append(original);
  const refs=make('details');refs.append(make('summary','Manufacturer guide and notes'));const source=DATA.sources[d.source];refs.append(make('p',source.title+' · '+source.edition+' · page '+d.page,'swr-help'),make('p','Match the component models and boiler requirements shown. The full page retains its alternatives and notes.','swr-help'));const link=make('a','Open original manufacturer guide');link.href=diagramManualURL(d);link.target='_blank';link.rel='noopener noreferrer';refs.append(link);if(TRACE_PLANS[d.id]){const page=d.id==='s-plan'?26:24;const operation=make('a','Normal operating sequence · page '+page);operation.href=source.url+'#page='+page;operation.target='_blank';operation.rel='noopener noreferrer';refs.append(operation);}detail.append(refs);
  root.scrollTop=0;heading.focus({preventScroll:true});if(push&&active)win.history.pushState({stagWiring:token,diagram:id},'');
 }
 for(const d of DIAGRAMS){const b=button('',()=>show(d.id,true));b.className='swr-diagram-card';const img=image(d);img.loading='lazy';b.append(img,make('strong',d.title),make('span',d.subtitle));grid.append(b);}
 const owns=()=>win.history.state?.stagWiring===token;
 const pop=()=>{if(!active)return;if(owns()){const id=win.history.state.diagram;if(id)show(id);else home();}else{active=false;home();onExit();}};win.addEventListener('popstate',pop);
 dialog.addEventListener('cancel',()=>zoomBody.replaceChildren());
 const api={start(exit){onExit=exit||(()=>{});active=true;home();win.history.pushState({stagWiring:token,diagram:null},'');},stop(){if(!active)return;active=false;home();if(owns())win.history.back();},back(){if(dialog.open){hideZoom();return true;}if(selected){if(owns())win.history.back();else home();return true;}return false;},viewer:{clear:hideZoom},openDiagram(id,options){show(id,true,options);},get selectedDiagram(){return selected;},dispose(){win.removeEventListener('popstate',pop);hideZoom();}};
 mounts.set(root,api);home();return api;
}
