/* İşlerimiz: türe göre süzme */
(function(){
  var bar=document.querySelector('.shop-filter');if(!bar) return;
  var items=[].slice.call(document.querySelectorAll('.works-grid .work-item'));
  bar.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b) return;
    var f=b.getAttribute('data-f');
    bar.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b);});
    items.forEach(function(it){it.hidden=!(f==='all'||it.getAttribute('data-tags').split(' ').indexOf(f)>-1);});
    try{ if(typeof window.gtag==='function') window.gtag('event','select_content',{content_type:'is_turu',item_id:f}); }catch(_){}
  });
})();
