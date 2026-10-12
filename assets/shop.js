/* Mağaza: kategoriye göre süzme */
(function(){
  var bar=document.querySelector('.shop-filter');if(!bar) return;
  var cards=[].slice.call(document.querySelectorAll('.shop-grid .shop-card'));
  bar.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b) return;
    var f=b.getAttribute('data-f');
    bar.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b);});
    cards.forEach(function(c){c.hidden=!(f==='all'||c.getAttribute('data-cat')===f);});
    try{ if(typeof window.gtag==='function') window.gtag('event','select_item_list',{item_list_name:f}); }catch(_){}
  });
})();
