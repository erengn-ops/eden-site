(function(){
  'use strict';
  /* Sosyal medya sayfası: /data/instagram.json içeriğinden karoları çizer.
     JSON okunamazsa HTML içindeki statik karolar olduğu gibi kalır. */
  var grid=document.getElementById('ig-grid');if(!grid) return;
  var src=grid.getAttribute('data-ig-src')||'/data/instagram.json';
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MAX=24;
  var ICONS={
    VIDEO:'<svg class="ig-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 8.4v7.2l6-3.6z" fill="currentColor"/></svg>',
    CAROUSEL_ALBUM:'<svg class="ig-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="8" y="3" width="13" height="13" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 7.5A3 3 0 0 0 3 10.5v7A3.5 3.5 0 0 0 6.5 21h7a3 3 0 0 0 3-2.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
  };
  var PRE={VIDEO:'Instagram reel: ',CAROUSEL_ALBUM:'Instagram gönderisi (birden fazla fotoğraf): ',IMAGE:'Instagram gönderisi: '};

  function snippet(c,n){
    c=String(c||'').replace(/#\S+/g,'').replace(/\s+/g,' ').trim();
    if(c.length<=n) return c;
    var s=c.slice(0,n),i=s.lastIndexOf(' ');
    if(i>n/2) s=s.slice(0,i);
    return s.replace(/[\s,.;:\-]+$/,'')+'…';
  }
  function plain(s){
    return s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}️‍]/gu,'').replace(/\s+/g,' ').trim();
  }
  function okPost(p){
    return p&&typeof p.permalink==='string'&&/^https:\/\/www\.instagram\.com\//.test(p.permalink)
      &&typeof p.image==='string'&&/^(\/|https:\/\/)/.test(p.image);
  }
  function tile(p,k){
    var type=(ICONS[p.type]||p.type==='IMAGE')?p.type:'IMAGE';
    var snip=snippet(p.caption,100);
    var a=document.createElement('a');
    a.className='ig-tile rv in'+(type==='VIDEO'?' is-video':'');
    a.style.setProperty('--rd',((k%3)*0.09)+'s');
    a.href=p.permalink;a.target='_blank';a.rel='noopener';
    var im=document.createElement('img');
    im.loading='lazy';im.decoding='async';im.src=p.image;
    if(p.w>0&&p.h>0){im.width=p.w;im.height=p.h;}
    im.alt=PRE[type]+(plain(snip)||'Eden Floral Art');
    a.appendChild(im);
    if(ICONS[type]) a.insertAdjacentHTML('beforeend',ICONS[type]);
    var cap=document.createElement('span');
    cap.className='ig-cap';cap.setAttribute('aria-hidden','true');cap.textContent=snip;
    a.appendChild(cap);
    return a;
  }

  fetch(src,{cache:'no-cache'}).then(function(r){if(!r.ok) throw new Error(r.status);return r.json();}).then(function(d){
    var posts=(d&&d.posts||[]).filter(okPost).slice(0,MAX);
    if(!posts.length) return;
    var cur=[].slice.call(grid.querySelectorAll('.ig-tile')).map(function(a){return {permalink:a.href,image:(a.querySelector('img')||{}).src};});
    var same=cur.length===posts.length&&cur.every(function(c,i){
      var u=document.createElement('a');u.href=posts[i].image;
      return c.permalink===posts[i].permalink&&c.image===u.href;
    });
    if(!same){
      var frag=document.createDocumentFragment();
      posts.forEach(function(p,k){frag.appendChild(tile(p,k));});
      grid.textContent='';grid.appendChild(frag);
    }
    var pr=d.profile||{};
    var av=document.getElementById('ig-avatar');
    if(av&&typeof pr.avatar==='string'&&/^\/images\//.test(pr.avatar)){
      var test=new Image();test.onload=function(){av.src=pr.avatar;};test.src=pr.avatar;
    }
    var bio=document.getElementById('ig-bio');
    if(bio&&Array.isArray(pr.bio)&&pr.bio.length){
      var lines=pr.bio.filter(function(x){return typeof x==='string'&&x.trim();}).slice(0,6);
      if(lines.length){bio.textContent='';lines.forEach(function(t){var s=document.createElement('span');s.textContent=t;bio.appendChild(s);});}
    }
    var up=document.getElementById('ig-updated');
    if(up&&d.updated){
      var dt=new Date(d.updated);
      if(!isNaN(dt)){
        try{up.textContent='Son eşitleme: '+dt.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});up.hidden=false;}catch(_){}
      }
    }
  }).catch(function(){/* statik karolar kalır */});
})();
