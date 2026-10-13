/* Galeri ve Koleksiyon: tıklayınca büyüt, aynı türdeki diğer işleri göster.
   Kaynak: data-tags taşıyan <figure> öğeleri (index.html). */
(function(){
  var figs=[].slice.call(document.querySelectorAll('figure[data-tags]'));
  if(!figs.length) return;

  var LABELS={
    'lambader':['Lambader','lambaderler'],
    'vitrin':['Vitrin','vitrin işleri'],
    'dogum-odasi':['Doğum odası','doğum odası işleri'],
    'nisan':['Nişan','nişan işleri'],
    'dugun':['Düğün','düğün işleri'],
    'organizasyon':['Organizasyon','organizasyon işleri'],
    'kelebek':['Kelebek','kelebekler'],
    'sakayik':['Şakayık','şakayıklar'],
    'lilyum':['Lilyum','lilyumlar'],
    'ayakli':['Ayaklı çiçek','ayaklı çiçekler'],
    'kompozisyon':['Kompozisyon','kompozisyonlar'],
    'magaza':['Mağaza içi','mağaza içi işler'],
    'masa':['Masa lambası','masa lambaları'],
    'gul':['Gül','güller'],
    'gelincik':['Gelincik','gelincikler']
  };
  function label(t,i){return (LABELS[t]||[t,t])[i];}

  var items=figs.map(function(f){
    var img=f.querySelector('img'), cap=f.querySelector('figcaption'), b=cap&&cap.querySelector('b');
    var title=b?b.textContent.trim():(cap?cap.textContent.trim():'');
    var desc=b?cap.textContent.replace(b.textContent,'').trim():'';
    return {fig:f,src:f.getAttribute('data-full')||img.getAttribute('src'),thumb:img.getAttribute('src'),
      alt:img.getAttribute('alt')||'',title:title,desc:desc,tags:f.getAttribute('data-tags').split(/\s+/)};
  });
  function withTag(t){return t?items.filter(function(it){return it.tags.indexOf(t)>-1;}):items;}

  var box=document.createElement('div');
  box.className='lb';box.hidden=true;
  box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Büyük görsel');
  box.setAttribute('data-lenis-prevent','');
  box.innerHTML=
    '<button class="lb-close" type="button" aria-label="Kapat">&times;</button>'+
    '<button class="lb-nav lb-prev" type="button" aria-label="Önceki">&larr;</button>'+
    '<button class="lb-nav lb-next" type="button" aria-label="Sonraki">&rarr;</button>'+
    '<figure class="lb-main"><img alt=""><figcaption><b></b><span></span></figcaption></figure>'+
    '<div class="lb-tags"></div>'+
    '<div class="lb-strip"><p class="lb-strip-h"></p><div class="lb-thumbs"></div></div>';
  document.body.appendChild(box);
  var bigImg=box.querySelector('.lb-main img'), capB=box.querySelector('.lb-main b'), capS=box.querySelector('.lb-main span');
  var tagsEl=box.querySelector('.lb-tags'), stripH=box.querySelector('.lb-strip-h'), thumbs=box.querySelector('.lb-thumbs');

  var list=items, idx=0, filter=null, lastFocus=null;

  function render(){
    var it=list[idx];
    bigImg.src=it.src;bigImg.alt=it.alt;
    capB.textContent=it.title;capS.textContent=it.desc;
    tagsEl.innerHTML='';
    it.tags.forEach(function(t){
      var n=withTag(t).length;
      var c=document.createElement('button');
      c.type='button';c.className='lb-chip'+(t===filter?' on':'');
      c.textContent='Tüm '+label(t,1)+' ('+n+')';
      c.addEventListener('click',function(){setFilter(t);});
      tagsEl.appendChild(c);
    });
    var all=document.createElement('button');
    all.type='button';all.className='lb-chip'+(filter?'':' on');all.textContent='Hepsi ('+items.length+')';
    all.addEventListener('click',function(){setFilter(null);});
    tagsEl.appendChild(all);

    stripH.textContent=filter?('Tüm '+label(filter,1)):'Tüm işler';
    thumbs.innerHTML='';
    list.forEach(function(x,i){
      var t=document.createElement('button');
      t.type='button';t.className='lb-thumb'+(i===idx?' on':'');
      t.setAttribute('aria-label',x.title+(x.desc?', '+x.desc:''));
      t.innerHTML='<img loading="lazy" alt="" src="'+x.thumb+'">';
      t.addEventListener('click',function(){idx=i;render();});
      thumbs.appendChild(t);
    });
    var on=thumbs.querySelector('.on');
    if(on) on.scrollIntoView({block:'nearest',inline:'center'});
    var many=list.length>1;
    box.querySelector('.lb-prev').hidden=!many;box.querySelector('.lb-next').hidden=!many;
  }
  function setFilter(t){
    var cur=list[idx];
    filter=t;list=withTag(t);
    idx=Math.max(0,list.indexOf(cur));
    render();
  }
  function open(it){
    lastFocus=document.activeElement;
    filter=it.tags[0];list=withTag(filter);idx=list.indexOf(it);
    render();
    box.hidden=false;document.documentElement.classList.add('lb-open');
    box.querySelector('.lb-close').focus();
    try{ if(typeof window.gtag==='function') window.gtag('event','view_item',{item_category:filter,item_name:it.title}); }catch(_){}
  }
  function close(){
    box.hidden=true;document.documentElement.classList.remove('lb-open');
    if(lastFocus&&lastFocus.focus) lastFocus.focus();
  }
  function step(d){idx=(idx+d+list.length)%list.length;render();}

  items.forEach(function(it){
    it.fig.classList.add('lb-able');
    var img=it.fig.querySelector('img');
    img.setAttribute('tabindex','0');img.setAttribute('role','button');
    img.setAttribute('aria-label',(it.title?it.title+': ':'')+'büyüt');
    it.fig.addEventListener('click',function(e){ if(!e.defaultPrevented) open(it); });
    img.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();open(it);} });
  });
  box.querySelector('.lb-close').addEventListener('click',close);
  box.querySelector('.lb-prev').addEventListener('click',function(){step(-1);});
  box.querySelector('.lb-next').addEventListener('click',function(){step(1);});
  box.addEventListener('click',function(e){ if(e.target===box) close(); });
  document.addEventListener('keydown',function(e){
    if(box.hidden) return;
    if(e.key==='Escape') close();
    else if(e.key==='ArrowLeft') step(-1);
    else if(e.key==='ArrowRight') step(1);
  });
  /* dokunmatik: yana kaydırarak geç */
  var sx=null;
  bigImg.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  bigImg.addEventListener('touchend',function(e){
    if(sx===null) return; var dx=e.changedTouches[0].clientX-sx; sx=null;
    if(Math.abs(dx)>40) step(dx<0?1:-1);
  });
})();
