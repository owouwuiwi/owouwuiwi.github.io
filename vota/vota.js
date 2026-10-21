(() => {
  'use strict';
  const API='https://owouwuiwi-vota.lore342.chatgpt.site';
  const labels={ritmo:'Ritmo',copertina:'Copertina',taccuino:'Taccuino',attuale:'Lasciala così'};
  const ids=Object.keys(labels), get=id=>document.getElementById(id);
  const form=get('vote-form'),submit=get('submit-vote'),status=get('vote-status'),frame=get('prototype');
  let preview='ritmo',screen='detail',selected=null,saved=null,sending=false,results=null;
  let storage=true,token;
  try{token=localStorage.getItem('nyanime-design-vote-token-v1');}catch{storage=false;}
  if(!/^[a-f0-9]{64}$/.test(token||'')) {
    token=Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,'0')).join('');
    try{localStorage.setItem('nyanime-design-vote-token-v1',token);}catch{storage=false;}
  }
  get('storage-warning').hidden=storage;
  function notify(text){const toast=get('toast');toast.textContent=text;toast.classList.add('visible');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('visible'),2600);}
  async function api(path,body) {
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
    try{
      const r=await fetch(API+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:controller.signal,credentials:'omit',cache:'no-store'});
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||'Il servizio non risponde. Riprova tra poco.');
      return data;
    }finally{clearTimeout(timeout);}
  }
  function renderBars(target,counts,total) {
    target.replaceChildren();
    for(const id of ids){
      const count=Number(counts[id])||0,pct=total?count/total*100:0;
      const row=document.createElement('div'),label=document.createElement('div'),name=document.createElement('strong'),values=document.createElement('span'),track=document.createElement('div'),fill=document.createElement('span');
      label.className='result-label';name.textContent=labels[id];values.textContent=new Intl.NumberFormat('it-IT',{maximumFractionDigits:1}).format(pct)+'%';
      const n=document.createElement('small');n.textContent=count+' '+(count===1?'voto':'voti');
      label.append(name,n,values);track.className='result-track';track.setAttribute('role','meter');track.setAttribute('aria-label',labels[id]+': '+count+' voti');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow',String(pct));
      fill.style.width=pct+'%';track.append(fill);row.append(label,track);target.append(row);
    }
  }
  function showResults(data){
    if(!data.counts||!ids.every(id=>Number.isInteger(data.counts[id])&&data.counts[id]>=0)||data.total!==ids.reduce((s,id)=>s+data.counts[id],0))throw new Error('Risultati non validi. Riprova.');
    results=data;get('real-total').textContent=new Intl.NumberFormat('it-IT').format(data.total);
    get('results-status').textContent=data.total?'Solo voti effettivamente registrati. La simulazione è separata, più sotto.':'Il sondaggio è appena iniziato. Il primo voto potrebbe essere il tuo.';
    renderBars(get('result-bars'),data.counts,data.total);
    get('updated-at').textContent='Ultimo controllo: '+new Date(data.updatedAt).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})+' · aggiornamento ogni 30 secondi mentre la pagina è visibile.';
    get('export-results').disabled=false;
  }
  function updateSubmit(){submit.disabled=!selected||sending;submit.textContent=sending?'Salvataggio del voto…':saved===selected?'Voto confermato · '+labels[selected]:saved?'Cambia voto · '+labels[selected]:selected?'Vota '+labels[selected]:'Seleziona una proposta';}
  function choose(id,scroll=false){if(!ids.includes(id))return;selected=id;form.querySelectorAll('[name=choice]').forEach(r=>r.checked=r.value===id);updateSubmit();if(scroll)get('voto').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
  form.addEventListener('change',e=>{if(e.target.name==='choice')choose(e.target.value);});
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(sending||!selected)return;sending=true;status.dataset.state='';status.textContent='Salvataggio in corso…';updateSubmit();
    try{const data=await api('/api/vote',{token,choice:selected,website:form.elements.website.value});showResults(data);saved=data.choice;status.dataset.state='success';status.textContent='Voto salvato: '+labels[saved]+'. Grazie! Puoi modificarlo quando vuoi.';notify('Il tuo voto è stato registrato.');get('risultati').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
    catch(error){status.dataset.state='error';status.textContent=error.name==='AbortError'?'La connessione è lenta. Riprova: lo stesso invio non duplica il voto.':error.message;}
    finally{sending=false;updateSubmit();}
  });
  async function refresh(){get('refresh-results').disabled=true;try{showResults(await api('/api/results'));}catch{get('results-status').textContent=results?'Aggiornamento non riuscito. Quelli mostrati sono gli ultimi risultati ricevuti.':'Risultati non disponibili al momento. Riprova con «Aggiorna».';}finally{get('refresh-results').disabled=false;}}
  get('refresh-results').addEventListener('click',refresh);get('export-results').disabled=true;
  get('export-results').addEventListener('click',()=>{if(!results)return;const rows=['Proposta,Voti reali,Percentuale',...ids.map(id=>`"${labels[id]}",${results.counts[id]},${results.total?(results.counts[id]/results.total*100).toFixed(2):'0.00'}`)];const url=URL.createObjectURL(new Blob(['\ufeff'+rows.join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='nyanime-voti-reali-'+new Date().toISOString().slice(0,10)+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);});
  renderBars(get('demo-bars'),{ritmo:87,copertina:72,taccuino:48,attuale:93},300);
  function postPreview(){frame.contentWindow?.postMessage({type:'nyanime-preview',design:preview,medium:document.querySelector('[name=medium]:checked').value,theme:document.querySelector('[name=appearance]:checked').value,screen},location.origin);}
  const tabs=[...document.querySelectorAll('[data-preview]')],pill=document.querySelector('.t-tabs-pill');
  function movePill(animate=true){const tab=tabs.find(t=>t.dataset.preview===preview);if(!animate)pill.style.transition='none';pill.style.transform=`translateX(${tab.offsetLeft}px)`;pill.style.width=tab.offsetWidth+'px';if(!animate){void pill.offsetWidth;pill.style.transition='';}}
  function setPreview(id,scroll=false){if(!['ritmo','copertina','taccuino'].includes(id))return;preview=id;tabs.forEach(t=>t.setAttribute('aria-selected',String(t.dataset.preview===id)));get('choose-preview').firstChild.textContent='Scelgo '+labels[id]+' ';get('preview-name').textContent=labels[id]+' · anteprima interattiva';frame.title='Prova interattiva di Nyanime: '+labels[id];movePill();postPreview();if(scroll)get('prova').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
  document.querySelectorAll('[data-try]').forEach(b=>b.addEventListener('click',()=>setPreview(b.dataset.try,true)));tabs.forEach(b=>b.addEventListener('click',()=>setPreview(b.dataset.preview)));
  document.querySelectorAll('[name=medium],[name=appearance]').forEach(i=>i.addEventListener('change',postPreview));
  document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>{screen=b.dataset.screen;document.querySelectorAll('[data-screen]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));postPreview();}));
  get('choose-preview').addEventListener('click',()=>choose(preview,true));frame.addEventListener('load',postPreview);
  window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow||e.data?.type!=='nyanime-preview-size')return;const h=Number(e.data.height);if(Number.isFinite(h)&&h>=250&&h<5000)frame.style.height=Math.ceil(h)+'px';});
  window.addEventListener('resize',()=>movePill(false));requestAnimationFrame(()=>movePill(false));
  tabs.forEach((t,index)=>t.addEventListener('keydown',e=>{let i;if(e.key==='ArrowRight')i=(index+1)%tabs.length;else if(e.key==='ArrowLeft')i=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=tabs.length-1;else return;e.preventDefault();tabs[i].focus();setPreview(tabs[i].dataset.preview);}));
  get('share').addEventListener('click',async()=>{try{const data={title:'Scegli il prossimo stile di Nyanime',text:'Tre proposte da provare. Quale sceglieresti?',url:'https://owouwuiwi.github.io/vota/'};if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(data.url);notify('Link copiato. Condividilo con chi usa Nyanime!');}}catch(error){if(error.name!=='AbortError')notify('Condividi questo link: owouwuiwi.github.io/vota/');}});
  refresh();api('/api/mine',{token}).then(data=>{showResults(data);if(data.choice){saved=data.choice;choose(saved);status.dataset.state='success';status.textContent='Il tuo voto è già registrato: '+labels[saved]+'. Puoi cambiarlo.';}}).catch(()=>{});
  setInterval(()=>{if(!document.hidden&&!sending)refresh();},30000);
})();
