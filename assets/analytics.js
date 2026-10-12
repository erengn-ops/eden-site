/* Google Analytics 4 (G-FGPV4CC494) + çerez onayı.
   Onay verilmeden çerez yazılmaz (Consent Mode v2, varsayılan "denied").
   Instagram profiline tıklama "generate_lead" olayı olarak sayılır. */
(function(){
  var GA_ID='G-FGPV4CC494', KEY='eden-consent';
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  window.gtag=gtag;

  var saved=null;
  try{ saved=localStorage.getItem(KEY); }catch(_){}
  var granted=saved==='granted'?'granted':'denied';
  gtag('consent','default',{
    analytics_storage:granted, ad_storage:granted,
    ad_user_data:granted, ad_personalization:granted,
    wait_for_update:500
  });
  gtag('js',new Date());
  gtag('config',GA_ID);

  function setConsent(v){
    try{ localStorage.setItem(KEY,v); }catch(_){}
    gtag('consent','update',{
      analytics_storage:v, ad_storage:v, ad_user_data:v, ad_personalization:v
    });
  }

  /* Instagram profiline tıklama = potansiyel müşteri */
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href*="instagram.com/eden.floralart"]');
    if(!a) return;
    gtag('event','generate_lead',{method:'instagram',link_url:a.href,page_path:location.pathname});
    try{ if(typeof window.fbq==='function') window.fbq('trackCustom','InstagramCTA'); }catch(_){}
  });

  /* Shopier: sepete ekle ve sepete git tıklamaları */
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href*="shopier.com"]');
    if(!a) return;
    if(a.hasAttribute('data-shop-id')){
      var price=parseFloat(a.getAttribute('data-shop-price'))||undefined;
      gtag('event','add_to_cart',{currency:'TRY',value:price,items:[{item_id:a.getAttribute('data-shop-id'),item_name:a.getAttribute('data-shop-name'),price:price,quantity:1}]});
    }else if(a.hasAttribute('data-basket')){
      gtag('event','begin_checkout',{currency:'TRY'});
    }else{
      gtag('event','shopier_click',{link_url:a.href,page_path:location.pathname});
    }
  });

  /* çerez bildirimi: yalnız seçim yapılmamışsa */
  if(saved) return;
  function banner(){
    var d=document.createElement('div');
    d.className='consent';
    d.setAttribute('role','dialog');
    d.setAttribute('aria-label','Çerez tercihi');
    d.innerHTML='<p>Sitemizi geliştirmek için ziyaret istatistiklerini çerezlerle ölçüyoruz. Onay vermezseniz çerez kullanılmaz.</p>'+
      '<div class="consent-btns"><button type="button" data-v="denied">Reddet</button>'+
      '<button type="button" data-v="granted" class="primary">Kabul et</button></div>';
    d.addEventListener('click',function(e){
      var b=e.target.closest('button'); if(!b) return;
      setConsent(b.getAttribute('data-v'));
      d.remove();
    });
    document.body.appendChild(d);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',banner);
  else banner();
})();
