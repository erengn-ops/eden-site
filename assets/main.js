(function(){
  'use strict';
  var root=document.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header=document.querySelector('.site-header');
  var sticky=document.querySelector('.sticky-cta');
  var hero=document.querySelector('.hero');

  /* stagger delays for grouped reveals */
  document.querySelectorAll('.facts,.steps,.refs-grid,.faq-list').forEach(function(g){
    g.querySelectorAll('.rv').forEach(function(el,i){el.style.setProperty('--rd',(i*0.09)+'s');});
  });

  /* reveals via IntersectionObserver */
  var items=[].slice.call(document.querySelectorAll('.rv,.img-reveal'));
  function showAll(){items.forEach(function(el){el.classList.add('in');});}
  if(reduce||!('IntersectionObserver' in window)){showAll();}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:0});
    items.forEach(function(el){io.observe(el);});
    setTimeout(function(){ if(!document.querySelector('.rv.in')) showAll(); },4000); /* failsafe */
  }

  /* header + sticky cta */
  function onScroll(){
    var y=window.scrollY||window.pageYOffset;
    header.classList.toggle('solid',y>40);
    if(sticky&&hero){sticky.classList.toggle('show',y>hero.offsetHeight*0.6);}
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* mobile menu */
  var mb=document.querySelector('.menu-btn'),nav=document.getElementById('site-nav');
  if(mb&&nav){
    var setMenu=function(o){nav.classList.toggle('open',o);mb.setAttribute('aria-expanded',o?'true':'false');mb.setAttribute('aria-label',o?'Menüyü kapat':'Menüyü aç');};
    mb.addEventListener('click',function(){setMenu(!nav.classList.contains('open'));});
    nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});
  }

  /* magnetic buttons (pointer devices only) */
  if(!reduce&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.magnetic').forEach(function(b){
      b.addEventListener('pointermove',function(e){
        var r=b.getBoundingClientRect();
        var x=(e.clientX-r.left-r.width/2)*0.22,y=(e.clientY-r.top-r.height/2)*0.32;
        b.style.transform='translate('+x+'px,'+y+'px)';
      });
      b.addEventListener('pointerleave',function(){b.style.transform='';});
    });
  }

  /* galeri: yatay kaydırma şeridi (sabitleme yok), oklar + sürükleme */
  (function(){
    var track=document.querySelector('.gallery-track');if(!track) return;
    var bar=document.querySelector('.g-progress span');
    var btns=document.querySelectorAll('.g-btn');
    function upd(){
      var max=track.scrollWidth-track.clientWidth;
      var p=max>0?track.scrollLeft/max:0;
      if(bar) bar.style.transform='scaleX('+Math.min(1,Math.max(0,p))+')';
      btns.forEach(function(b){var d=+b.getAttribute('data-dir');b.disabled=d<0?track.scrollLeft<=2:track.scrollLeft>=max-2;});
    }
    track.addEventListener('scroll',upd,{passive:true});
    window.addEventListener('resize',upd);window.addEventListener('load',upd);
    track.querySelectorAll('img').forEach(function(im){if(!im.complete)im.addEventListener('load',upd,{once:true});});
    btns.forEach(function(b){b.addEventListener('click',function(){
      track.scrollBy({left:+b.getAttribute('data-dir')*track.clientWidth*0.7,behavior:reduce?'auto':'smooth'});
    });});
    if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
      var down=false,sx=0,sl=0,moved=false;
      track.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;sx=e.clientX;sl=track.scrollLeft;});
      window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;track.classList.add('dragging');}if(moved)track.scrollLeft=sl-dx;});
      window.addEventListener('pointerup',function(){if(!down)return;down=false;track.classList.remove('dragging');});
      track.addEventListener('click',function(e){if(moved){e.preventDefault();moved=false;}},true);
    }
    upd();
  })();

  /* heavy motion: Lenis + GSAP (progressive enhancement) */
  function init(){
    if(reduce||!window.gsap||!window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var lenis=null;
    if(window.Lenis&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
      lenis=new Lenis({duration:1.15,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t));}});
      lenis.on('scroll',ScrollTrigger.update);
      gsap.ticker.add(function(t){lenis.raf(t*1000);});
      gsap.ticker.lagSmoothing(0);
      document.querySelectorAll('a[href^="#"]').forEach(function(a){
        a.addEventListener('click',function(e){
          var id=a.getAttribute('href');
          var t=id.length>1&&document.querySelector(id);
          if(t){e.preventDefault();lenis.scrollTo(t,{offset:-10});}
        });
      });
    }

    /* parallax on images: transform only */
    document.querySelectorAll('[data-parallax]').forEach(function(img){
      var amt=parseFloat(img.getAttribute('data-parallax'))||.06;
      var frame=img.parentElement;
      gsap.fromTo(img,{yPercent:-amt*100},{yPercent:amt*100,ease:'none',scrollTrigger:{trigger:frame,start:'top bottom',end:'bottom top',scrub:true}});
    });

    /* hero copy drifts up slightly */
    gsap.to('.hero-copy',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.petals',{yPercent:18,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});

    var rt;function refresh(){clearTimeout(rt);rt=setTimeout(function(){ScrollTrigger.refresh();},150);}
    ScrollTrigger.refresh();
    /* lazy görseller yüklendikçe konumları yeniden hesapla */
    document.querySelectorAll('img').forEach(function(im){if(!im.complete)im.addEventListener('load',refresh,{once:true});});
    window.addEventListener('resize',refresh);
    window.addEventListener('orientationchange',refresh);
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(refresh);}
  }
  if(document.readyState==='complete') init(); else window.addEventListener('load',init);
})();
