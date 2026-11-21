/* FlowHive — lógica compartida
   - Datos de productos y envíos
   - Encabezado, pie, carrito lateral (se inyectan en todas las páginas)
   - Pedido y formularios se envían por WhatsApp: el sitio no recibe ni guarda datos de pago. */

/* ---------- configuración ---------- */
const SHOP = {
  whatsapp: '51904767959',
  whatsappHuman: '+51 904 767 959',
  email: 'portocarrerolopezluisangel@gmail.com',
  city: 'Piura, Perú',
  freeShipFrom: 250,
};
// TODO: confirmar tarifas reales con el courier/agencia.
const ZONES = [
  {id:'recojo',   name:'Recojo en taller',                 detail:'Piura · coordinamos día y hora por WhatsApp', price:0,  free:false},
  {id:'piura',    name:'Delivery Piura metropolitana',     detail:'Piura, Castilla y Veintiséis de Octubre · 24–48 h', price:8,  free:true},
  {id:'region',   name:'Resto de la región Piura',         detail:'Sullana, Paita, Talara, Sechura, Máncora… · agencia, 1–2 días', price:15, free:true},
  {id:'nacional', name:'Resto del Perú',                    detail:'Shalom u Olva · 2–5 días hábiles', price:20, free:true},
];
const PAYMENTS = [
  {id:'yape', name:'Yape', detail:'Te enviamos el número al confirmar el pedido'},
  {id:'plin', name:'Plin', detail:'Te enviamos el número al confirmar el pedido'},
  {id:'transferencia', name:'Transferencia bancaria', detail:'BCP o Interbank · te enviamos la cuenta'},
  {id:'contraentrega', name:'Pago contra entrega', detail:'Solo delivery en Piura metropolitana', zones:['piura','recojo']},
];

const COLORS = {
  'Arena':'#E6D8C3','Hueso':'#F1ECE2','Carbón':'#3A3836','Terracota':'#C46A45','Salvia':'#A7B39A',
  'Océano':'#5F84A0','Coral':'#E8957A','Lavanda':'#B9AFCF','Musgo':'#6F7B4F','Arcilla':'#B88B6B','Niebla':'#B8C4CC','Miel':'#E2B15B',
  'Oliva':'#A3A85A','Ciruela':'#5E3A8C'
};
// Fotos reales: img/productos/<id>-<n>-<vista>.webp — orden de la galería: principal, ambiente/complementaria, medidas, detalle.
const IMG = 'img/productos/';
const photos = (id, views) => views.map(([file, alt]) => ({src: IMG + `${id}-${file}.webp`, alt}));
// TODO: confirmar precios de Faro, Brisa, Bruma, Remolino, Medusa, Junco, Salitre, Alga y Duna (son provisionales).
const PRODUCTS = [
  {id:'faro', name:'Lámpara Faro', cat:'Lámparas', price:319, shape:'tower', colors:['Terracota'], badge:'Nuevo', size:'Alto 25 cm', time:'Impresa a pedido en Piura', light:'Foco LED E27 cálido incluido',
    desc:'Un aro continuo en terracota que abraza una pantalla de luz blanca. Encendida, la pantalla brilla como la linterna de un faro de la costa piurana y el aro se tiñe de un naranja cálido. Pensada para aparadores, repisas y escritorios; de cerca se aprecian sus capas finas, con un acabado mate casi cerámico.',
    photos: photos('faro', [['1-principal','Lámpara Faro en terracota sobre pedestal de piedra'],['2-ambiente','Lámpara Faro encendida sobre un aparador al atardecer'],['3-medidas','Lámpara Faro con medidas: 250 mm de alto'],['4-detalle','Detalle de la textura de capas de la Lámpara Faro en terracota']])},
  {id:'brisa', name:'Lámpara Brisa', cat:'Lámparas', price:299, shape:'cone', colors:['Carbón'], badge:'Nuevo', size:'Alto 31 cm', time:'Impresa a pedido en Piura', light:'Foco LED E27 cálido incluido',
    desc:'Una base escultórica en carbón que se curva como una rama empujada por el viento del norte, coronada por una pantalla arena de textura acanalada. Da una luz suave y difusa, ideal para mesas de noche y rincones de lectura.',
    photos: photos('brisa', [['1-principal','Lámpara Brisa con base escultórica carbón y pantalla arena'],['2-ambiente','Lámpara Brisa encendida junto a la cama'],['3-medidas','Lámpara Brisa con medidas: 310 mm de alto'],['4-detalle','Detalle de la textura acanalada de la pantalla de la Lámpara Brisa']])},
  {id:'bruma', name:'Lámpara Bruma', cat:'Lámparas', price:279, shape:'globe', colors:['Hueso'], badge:'Nuevo', size:'Alto 26,6 cm', time:'Impresa a pedido en Piura', light:'Foco LED E27 cálido incluido',
    desc:'Tres volúmenes acanalados apilados sobre un trípode. Al encenderla, las estrías filtran la luz y llenan el ambiente de un brillo cálido y nebuloso, como la bruma de la mañana en la playa. Luce sobre una mesa baja, una repisa o en el piso junto al sofá.',
    photos: photos('bruma', [['1-principal','Lámpara Bruma acanalada sobre pedestal de piedra'],['2-ambiente','Lámpara Bruma encendida junto a un sofá'],['3-medidas','Lámpara Bruma con medidas: 266 mm de alto'],['4-detalle','Detalle de las estrías iluminadas de la Lámpara Bruma']])},
  {id:'remolino', name:'Lámpara Remolino', cat:'Lámparas', price:299, shape:'cone', colors:['Hueso'], badge:'Nuevo', size:'Alto 22 cm', time:'Impresa a pedido en Piura', light:'Foco LED E27 cálido incluido',
    desc:'Una pieza escultórica que gira sobre sí misma como un remolino de arena en el desierto de Sechura. Sus estrías en espiral siguen la torsión y, al encenderla, la luz cálida recorre cada curva. Funciona como lámpara y como objeto decorativo en aparadores, repisas y mesas de centro.',
    photos: photos('remolino', [['1-principal','Lámpara Remolino en hueso iluminada sobre pedestal blanco'],['2-ambiente','Lámpara Remolino encendida sobre un aparador junto a una monstera al atardecer'],['3-medidas','Lámpara Remolino con medidas: 220 mm de alto'],['4-detalle','Detalle de las estrías en espiral de la Lámpara Remolino encendida']])},
  {id:'medusa', name:'Lámpara Medusa', cat:'Lámparas', price:289, shape:'mush', colors:['Ciruela'], badge:'Nuevo', size:'Alto 24,3 cm', time:'Impresa a pedido en Piura', light:'Foco LED E27 cálido incluido',
    desc:'Una pantalla crema plisada que flota sobre una base ciruela acanalada, como una medusa en el mar de Máncora. Da una luz baja y envolvente, perfecta para mesas de noche, salas y rincones de lectura. El contraste entre la pantalla y la base la vuelve protagonista incluso apagada.',
    photos: photos('medusa', [['1-principal','Lámpara Medusa con pantalla crema y base ciruela sobre pedestal'],['2-ambiente','Lámpara Medusa encendida en una mesa junto al sofá'],['3-medidas','Lámpara Medusa con medidas: 243 mm de alto'],['4-detalle','Detalle de la pantalla plisada y la base ciruela acanalada de la Lámpara Medusa']])},
  {id:'junco', name:'Lámpara Junco', cat:'Lámparas', price:269, shape:'tower', colors:['Oliva'], badge:'Nuevo', size:'Alto 20 cm', time:'Impresa a pedido en Piura', light:'Foco LED E27 cálido incluido',
    desc:'Un cubo translúcido en verde oliva con estrías finas, como un haz de juncos de los humedales del norte, sobre una base de madera. Encendida, la luz se filtra en líneas doradas y tiñe el ambiente de un verde cálido. Ideal para alféizares, escritorios y mesas auxiliares.',
    photos: photos('junco', [['1-principal','Lámpara Junco en verde oliva con base de madera sobre pedestal'],['2-ambiente','Lámpara Junco encendida en el alféizar al atardecer'],['3-medidas','Lámpara Junco con medidas: 200 mm de alto'],['4-detalle','Detalle de las estrías translúcidas y la base de madera de la Lámpara Junco']])},
  {id:'salitre', name:'Lámpara Salitre', cat:'Lámparas', price:259, shape:'tower', colors:['Hueso'], badge:'Nuevo', size:'Alto 21 cm', time:'Impresa a pedido en Piura', light:'Foco LED E27 cálido incluido',
    desc:'Un cilindro de textura granulada, como la sal que se cristaliza en las salinas de la costa piurana, sobre una base plateada. Encendida, su superficie brilla con una luz cálida y uniforme, sin reflejos. Perfecta para mesas de noche y repisas.',
    photos: photos('salitre', [['1-principal','Lámpara Salitre blanca con base plateada sobre pedestal'],['2-ambiente','Lámpara Salitre encendida en la mesa de noche junto a la cama'],['3-medidas','Lámpara Salitre con medidas: 210 mm de alto'],['4-detalle','Detalle de la textura granulada de la Lámpara Salitre encendida']])},
  {id:'alga', name:'Jarrón Alga', cat:'Floreros y Jarrones', price:119, shape:'slim', colors:['Musgo','Hueso'], badge:'Nuevo', size:'Alto 20,4 cm', time:'Impreso a pedido en Piura',
    desc:'Un jarrón cilíndrico con relieves ondulados que suben como algas meciéndose bajo el agua. Funciona solo o en pareja: el musgo y el marfil se complementan. Perfecto para ramas de olivo, eucalipto seco y flores preservadas.',
    photos: photos('alga', [['1-principal','Jarrones Alga en marfil y musgo con eucalipto seco sobre pedestal'],['2-ambiente','Jarrón Alga en musgo con ramas de olivo junto a la ventana'],['3-medidas','Jarrón Alga con medidas: 204 mm de alto'],['4-detalle','Detalle del relieve ondulado del Jarrón Alga en marfil']])},
  {id:'duna', name:'Jarrón Duna', cat:'Floreros y Jarrones', price:99, shape:'vase', colors:['Terracota'], badge:'Nuevo', size:'Alto 17,2 cm', time:'Impreso a pedido en Piura',
    desc:'Cuerpo redondeado con estrías verticales profundas, como las crestas que el viento dibuja en las dunas del norte. En terracota luce con pampas, espigas y flores secas. Su tamaño compacto va bien en mesas de centro, repisas y libreros.',
    photos: photos('duna', [['1-principal','Jarrón Duna en terracota con pampas'],['2-ambiente','Jarrón Duna con flores secas junto a una vela dorada'],['3-medidas','Jarrón Duna con medidas: 172 mm de alto'],['4-detalle','Detalle de las estrías del Jarrón Duna con hierbas secas']])},
];
const CATS = ['Todo','Lámparas','Floreros y Jarrones'];

/* ---------- utilidades ---------- */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => 'S/ ' + n.toFixed(2);
const byId = id => PRODUCTS.find(p => p.id === id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const waLink = text => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;
function tone(hex, amt){
  const n = parseInt(hex.slice(1),16); let r=n>>16,g=n>>8&255,b=n&255;
  const t = amt<0?0:255, p=Math.abs(amt);
  r=Math.round((t-r)*p+r); g=Math.round((t-g)*p+g); b=Math.round((t-b)*p+b);
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}

/* ---------- ilustraciones de producto (provisionales hasta tener fotos) ---------- */
let uid = 0;
const SHAPES = {
  dome:  {parts:['M40 132C40 72 68 42 100 42s60 30 60 90Z','M84 132h32l6 86H78Z'], glow:[100,110]},
  mush:  {parts:['M28 122C28 76 62 52 100 52s72 24 72 70q-72-12-144 0Z','M88 116h24l4 102H84Z'], glow:[100,100]},
  tower: {parts:['M64 38h72v164H64Z','M56 202h88v16H56Z'], glow:[100,120]},
  cone:  {parts:['M72 62h56l38 80H34Z','M92 142h16l4 76H88Z'], glow:[100,110]},
  globe: {parts:['M100 52a62 62 0 1 1-.1 0Z','M80 168h40l6 50H74Z'], glow:[100,112]},
  vase:  {parts:['M82 30h36c0 30 32 58 32 110 0 50-20 78-50 78s-50-28-50-78c0-52 32-80 32-110Z'], h:true},
  slim:  {parts:['M86 22h28l12 196H74Z']},
  pot:   {parts:['M46 104h108l-12 114H58Z'], plant:true, h:true},
  bowl:  {parts:['M38 132h124c0 56-26 86-62 86s-62-30-62-86Z'], plant:true, h:true},
  candle:{parts:['M66 150h68v68H66Z'], candle:true},
  plate: {parts:['M24 186h152l-8 30H32Z'], h:true},
  tray:  {parts:['M100 70c42 0 70 40 70 80 0 30-30 64-70 64s-70-34-70-64c0-40 28-80 70-80Z'], h:true},
};
function art(shape, colorName, opts={}){
  const c = COLORS[colorName] || colorName, s = SHAPES[shape], id = 'a'+(uid++), h = opts.horizontal ?? s.h;
  const defs = `<linearGradient id="g${id}" x1="0" y1="0" x2="${h?0:1}" y2="${h?1:0}"><stop offset="0" stop-color="${tone(c,.28)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${tone(c,-.22)}"/></linearGradient>`
    + `<pattern id="f${id}" width="${h?200:9}" height="${h?9:240}" patternUnits="userSpaceOnUse"><rect width="${h?200:9}" height="${h?9:240}" fill="url(#g${id})"/></pattern>`
    + `<linearGradient id="l${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>`
    + `<radialGradient id="r${id}"><stop offset="0" stop-color="#FFE3B0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE3B0" stop-opacity="0"/></radialGradient>`;
  let g = '';
  if(s.glow) g += `<circle cx="${s.glow[0]}" cy="${s.glow[1]}" r="95" fill="url(#r${id})"/>`;
  g += `<ellipse cx="100" cy="222" rx="70" ry="6" fill="#000" opacity=".09"/>`;
  if(s.plant) g += `<path d="M100 110c-6-30-30-44-46-40 8 18 22 34 46 40Zm0 0c4-36 22-58 44-60-4 24-20 46-44 60Zm0 0c-2-24 4-44 0-66-10 20-8 46 0 66Z" fill="#6F7B4F"/>`;
  if(s.candle) g += `<rect x="88" y="112" width="24" height="40" rx="2" fill="#FBF6EC"/><path d="M100 92c6 8 6 14 0 18-6-4-6-10 0-18Z" fill="#E9A23B"/>`;
  s.parts.forEach(p => { g += `<path d="${p}" fill="url(#f${id})"/><path d="${p}" fill="url(#l${id})"/>`; });
  const vb = opts.zoom ? '30 40 140 160' : '0 0 200 240';
  return `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(opts.label||'')}"><defs>${defs}</defs>${g}</svg>`;
}
function media(p, color, opts={}){
  if(p.photos && !opts.zoom)
    return `<img src="${p.photos[0].src}" alt="${esc(p.photos[0].alt)}" loading="lazy">`;
  if(p.img && color === p.colors[0] && !opts.zoom)
    return `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" onerror="this.outerHTML=art('${p.shape}','${color}')">`;
  return art(p.shape, color, {label:`${p.name} ${color}`, ...opts});
}

/* ---------- carrito ---------- */
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d }catch(e){ return d } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)) }catch(e){} }
};
let cart = store.get('fh-cart', []).filter(l => byId(l.id) && l.q > 0);
const cartCount = () => cart.reduce((a,l)=>a+l.q,0);
const cartSubtotal = () => cart.reduce((a,l)=>a+l.q*byId(l.id).price,0);
function shippingFor(zoneId, sub = cartSubtotal()){
  const z = ZONES.find(x=>x.id===zoneId); if(!z) return null;
  return z.free && sub >= SHOP.freeShipFrom ? 0 : z.price;
}
function saveCart(){ store.set('fh-cart', cart); renderCart(); document.dispatchEvent(new Event('cart:change')); }
function addToCart(id, color, q=1){
  const p = byId(id); color = color || p.colors[0];
  const l = cart.find(x=>x.id===id && x.c===color);
  l ? l.q += q : cart.push({id, c:color, q});
  saveCart(); toast(`${p.name} (${color}) agregado al carrito`);
}
function setQty(i, q){ if(q<=0) cart.splice(i,1); else cart[i].q = q; saveCart(); }

/* ---------- layout compartido ---------- */
const ICON_HIVE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z"/><path d="M12 7.5l4 2.3v4.4l-4 2.3-4-2.3V9.8z"/></svg>`;
function layout(){
  const page = document.body.dataset.page || '';
  const nav = [
    ['index.html#tienda','Tienda','tienda'],
    ['index.html#serie','Colecciones','colecciones'],
    ['nosotros.html','Nosotros','nosotros'],
    ['mayoristas.html','Mayoristas','mayoristas'],
  ];
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="announce">Hecho en Piura · Envíos a todo el Perú · <b>Envío gratis desde ${money(SHOP.freeShipFrom).replace('.00','')}</b></div>
    <header class="site"><div class="wrap hdr">
      <nav class="nav" aria-label="Principal">${nav.map(([h,t,k])=>`<a href="${h}" class="${k===page?'on':''}">${t}</a>`).join('')}</nav>
      <button class="menu-btn" data-menu aria-label="Abrir menú">Menú</button>
      <a href="index.html" class="logo" aria-label="FlowHive inicio">${ICON_HIVE}FLOWHIVE</a>
      <div class="hdr-r">
        <a href="contacto.html" class="hide-m ${page==='contacto'?'link':''}">Contacto</a>
        <button class="cart-btn" data-cart aria-label="Abrir carrito">Carrito <span class="cart-count" id="cartCount">0</span></button>
      </div>
    </div></header>
    <nav class="mnav" id="mnav" aria-label="Menú móvil">
      <button class="close" data-close aria-label="Cerrar menú" style="margin-left:auto;margin-bottom:12px">×</button>
      ${nav.map(([h,t])=>`<a href="${h}">${t}</a>`).join('')}<a href="contacto.html">Contacto</a><a href="faq.html">Preguntas frecuentes</a>
    </nav>`);
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="site"><div class="wrap">
      <div class="foot">
        <div>
          <a href="index.html" class="logo">FLOWHIVE</a>
          <p class="muted" style="margin-top:12px;max-width:320px;font-size:14px">Objetos de diseño impresos en 3D en Piura. Recibe nuevas colecciones y colores antes que nadie.</p>
          <form class="news" data-news><input type="email" required placeholder="Tu correo" aria-label="Tu correo"><button type="submit">SUSCRIBIRME</button></form>
        </div>
        <div><h4>Tienda</h4><ul>
          <li><a href="index.html#tienda">Todo</a></li><li><a href="index.html?cat=Lámparas#tienda">Lámparas</a></li>
          <li><a href="index.html?cat=Floreros%20y%20Jarrones#tienda">Floreros y jarrones</a></li><li><a href="index.html#serie">Colecciones</a></li>
          <li><a href="/catalogo">Catálogo 3D</a></li></ul></div>
        <div><h4>Ayuda</h4><ul>
          <li><a href="envios.html">Envíos y devoluciones</a></li><li><a href="materiales.html">Materiales</a></li>
          <li><a href="cuidado.html">Cuidado y garantía</a></li><li><a href="faq.html">Preguntas frecuentes</a></li></ul></div>
        <div><h4>FlowHive</h4><ul>
          <li><a href="nosotros.html">Nosotros</a></li><li><a href="mayoristas.html">Mayoristas</a></li>
          <li><a href="contacto.html">Contacto</a></li><li><a href="https://wa.me/${SHOP.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li></ul>
          <a href="libro-reclamaciones.html" class="libro"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v16H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M4 20.5A1.5 1.5 0 0 0 5.5 22H19v-3"/><path d="M8 8h7M8 11h5"/></svg>Libro de Reclamaciones</a>
        </div>
      </div>
      <div class="bigword" aria-hidden="true">FLOWHIVE</div>
      <div class="legal"><span>© ${new Date().getFullYear()} FlowHive · ${SHOP.city}</span><span><a href="terminos.html">Términos y condiciones</a> · <a href="privacidad.html">Privacidad</a> · <a href="libro-reclamaciones.html">Libro de reclamaciones</a></span></div>
    </div></footer>
    <div class="scrim" id="scrim"></div>
    <aside class="drawer" id="drawer" aria-label="Carrito">
      <div class="dr-head"><h3>Tu carrito</h3><button class="close" data-close aria-label="Cerrar">×</button></div>
      <div class="dr-body" id="drBody"></div><div class="dr-foot" id="drFoot"></div>
    </aside>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`);
}

function cartLinesHTML(){
  return cart.map((l,i)=>{ const p = byId(l.id); return `
    <div class="line"><a class="thumb" href="producto.html?id=${p.id}&c=${encodeURIComponent(l.c)}">${media(p,l.c)}</a>
      <div><h4>${p.name}</h4><small>${l.c} · ${money(p.price)}</small><br>
        <div class="qty"><button data-dec="${i}" aria-label="Quitar uno">−</button><span>${l.q}</span><button data-inc="${i}" aria-label="Agregar uno">+</button></div></div>
      <div style="text-align:right"><div class="price">${money(p.price*l.q)}</div><button class="rm" data-rm="${i}">Quitar</button></div></div>`}).join('');
}
function renderCart(){
  const cc = $('#cartCount'); if(!cc) return;
  cc.textContent = cartCount(); cc.classList.add('bump'); setTimeout(()=>cc.classList.remove('bump'),200);
  if(!cart.length){
    $('#drBody').innerHTML = `<div class="dr-empty"><p style="font-size:18px;color:var(--ink);margin-bottom:8px">Tu carrito está vacío</p><p>Cada pieza se imprime a pedido en nuestro taller de Piura.</p><a class="btn btn-line" style="margin-top:24px" href="index.html#tienda">Ir a la tienda</a></div>`;
    $('#drFoot').innerHTML = ''; return;
  }
  const sub = cartSubtotal(), left = SHOP.freeShipFrom - sub;
  $('#drBody').innerHTML = cartLinesHTML();
  $('#drFoot').innerHTML = `
    <div class="ship-msg">${left>0?`Te faltan <b>${money(left)}</b> para envío gratis`:'¡Tu pedido tiene envío gratis!'}</div>
    <div class="ship-bar"><i style="width:${Math.min(100,sub/SHOP.freeShipFrom*100)}%"></i></div>
    <div class="row"><span>Subtotal</span><span>${money(sub)}</span></div>
    <div class="row muted" style="font-size:13px"><span>Envío</span><span>Se calcula al finalizar</span></div>
    <a class="btn btn-dark" href="carrito.html" style="margin-top:14px">Finalizar pedido</a>
    <p class="dr-note">Pagas con Yape, Plin o transferencia al confirmar por WhatsApp.</p>`;
}

/* ---------- UI global ---------- */
let tt;
function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('on'); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('on'),2400); }
function closeAll(){ ['#drawer','#scrim','#mnav'].forEach(s=>$(s)?.classList.remove('on')); }
function openCart(){ closeAll(); $('#drawer').classList.add('on'); $('#scrim').classList.add('on'); }

function productCard(p, color){
  color = color || p.colors[0];
  return `<article class="card" data-card="${p.id}">
    <div class="card-img">
      ${p.badge?`<span class="badge">${p.badge}</span>`:''}
      ${media(p,color)}
      <a class="cover" href="producto.html?id=${p.id}&c=${encodeURIComponent(color)}" aria-label="Ver ${esc(p.name)}"></a>
      <button class="quick" data-add="${p.id}" data-color="${esc(color)}" aria-label="Agregar ${esc(p.name)} al carrito">Agregar al carrito</button>
    </div>
    <a href="producto.html?id=${p.id}&c=${encodeURIComponent(color)}" class="card-info">
      <div><h3>${p.name}</h3><div class="cat">${color}</div></div><div class="price">${money(p.price)}</div>
    </a>
    <div class="swatches">${p.colors.slice(0,5).map(c=>`<button class="sw ${c===color?'on':''}" style="background:${COLORS[c]}" data-sw="${p.id}" data-c="${esc(c)}" aria-label="Color ${c}" title="${c}"></button>`).join('')}${p.colors.length>5?`<span class="muted" style="font-size:11px">+${p.colors.length-5}</span>`:''}</div>
  </article>`;
}

document.addEventListener('click', e => {
  const t = e.target.closest('button,a'); if(!t) return;
  if(t.dataset.add){ e.preventDefault(); addToCart(t.dataset.add, t.dataset.color); return; }
  if(t.dataset.sw){ // cambiar color en tarjeta
    const card = t.closest('[data-card]'); card.outerHTML = productCard(byId(t.dataset.sw), t.dataset.c); return; }
  if(t.hasAttribute('data-cart')){ openCart(); return; }
  if(t.hasAttribute('data-menu')){ $('#mnav').classList.add('on'); $('#scrim').classList.add('on'); return; }
  if(t.hasAttribute('data-close')){ closeAll(); return; }
  if(t.dataset.inc){ setQty(+t.dataset.inc, cart[+t.dataset.inc].q+1); return; }
  if(t.dataset.dec){ setQty(+t.dataset.dec, cart[+t.dataset.dec].q-1); return; }
  if(t.dataset.rm){ setQty(+t.dataset.rm, 0); return; }
  if(t.closest('#mnav') && t.tagName==='A') closeAll();
});
document.addEventListener('keydown', e => { if(e.key==='Escape') closeAll(); });
document.addEventListener('submit', e => {
  const f = e.target;
  if(f.matches('[data-news]')){ e.preventDefault(); toast('¡Gracias! Te avisaremos de nuevos lanzamientos.'); f.reset(); }
  // Formularios simples → WhatsApp. Cada campo con name y data-label entra al mensaje.
  if(f.matches('[data-wa]')){
    e.preventDefault();
    const lines = $$('[data-label]', f).map(el => {
      if(el.type==='radio' && !el.checked) return null;
      const v = el.value.trim(); return v ? `${el.dataset.label}: ${v}` : null;
    }).filter(Boolean);
    window.open(waLink(`${f.dataset.wa}\n\n${lines.join('\n')}`), '_blank', 'noopener');
    toast('Abriendo WhatsApp con tu mensaje…');
  }
});

/* ---------- páginas ---------- */
const pages = {
  home(){
    const params = new URLSearchParams(location.search);
    let filter = CATS.includes(params.get('cat')) ? params.get('cat') : 'Todo', sort = 'feat';
    const draw = () => {
      $('#chips').innerHTML = CATS.map(c=>`<button class="chip ${c===filter?'on':''}" data-cat="${c}">${c}</button>`).join('');
      let list = PRODUCTS.filter(p=>filter==='Todo'||p.cat===filter);
      if(sort==='asc') list=[...list].sort((a,b)=>a.price-b.price);
      if(sort==='desc') list=[...list].sort((a,b)=>b.price-a.price);
      $('#grid').innerHTML = list.length ? list.map(p=>productCard(p)).join('') : `<p class="empty">Pronto habrá piezas en esta categoría.</p>`;
    };
    $('#chips').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if(b){ filter=b.dataset.cat; draw(); } });
    $('#sort').addEventListener('change', e => { sort=e.target.value; draw(); });
    draw();
    // Colecciones: cada producto con su foto de ambiente (2.ª de la galería)
    $('#seriesGrid').innerHTML = PRODUCTS.filter(p=>p.photos).map(p=>{ const f = p.photos[1] || p.photos[0];
      return `<a class="series-item" href="producto.html?id=${p.id}"><img src="${f.src}" alt="${esc(f.alt)}" loading="lazy"><p>${p.name}</p><span>${money(p.price)}</span></a>`; }).join('');
    // Hero: producto destacado con foto real
    const hero = byId('faro'), hf = hero.photos[0], ha = $('#heroArt');
    ha.href = `producto.html?id=${hero.id}`;
    ha.insertAdjacentHTML('afterbegin', `<img src="${hf.src}" alt="${esc(hf.alt)}">`);
    $('.hero-tag', ha).innerHTML = `<span>${hero.name} — ${hero.colors[0]}</span><span>${money(hero.price)}</span>`;
  },

  producto(){
    const params = new URLSearchParams(location.search);
    const p = byId(params.get('id'));
    if(!p){ $('#pdp').innerHTML = `<div class="nf" style="grid-column:1/-1"><div><p class="label">Producto no encontrado</p><h2 style="font-size:40px;margin:16px 0 24px">Esta pieza ya no está disponible.</h2><a class="btn btn-dark" href="index.html#tienda">Ver la tienda</a></div></div>`; return; }
    let color = p.colors.includes(params.get('c')) ? params.get('c') : p.colors[0], qty = 1, view = 0;
    document.title = `${p.name} — FlowHive`;
    $('#crumbCat').textContent = p.cat; $('#crumbCat').href = `index.html?cat=${encodeURIComponent(p.cat)}#tienda`;
    $('#crumbName').textContent = p.name;
    const views = c => p.photos ? p.photos.map((f,i)=>`<img src="${f.src}" alt="${esc(f.alt)}" ${i?'loading="lazy"':''}>`) : [media(p,c), art(p.shape,c,{zoom:true,label:p.name+' detalle'}), art(p.shape,c,{label:p.name+' vista', horizontal: !(SHAPES[p.shape].h)})];
    const draw = () => {
      const v = views(color);
      $('#pdp').innerHTML = `
      <div class="pdp-gallery${p.photos?' has-photos':''}">
        <div class="pdp-thumbs">${v.map((h,i)=>`<button class="${i===view?'on':''}" data-view="${i}" aria-label="${p.photos?esc(p.photos[i].alt):'Vista '+(i+1)}">${h}</button>`).join('')}</div>
        <div class="pdp-main">${p.badge?`<span class="badge">${p.badge}</span>`:''}${v[view]}</div>
      </div>
      <div class="pdp-info">
        <span class="label">${p.cat}</span>
        <h1>${p.name}</h1>
        <div class="price">${money(p.price)}</div>
        <p class="lead">${p.desc}</p>
        <div class="opt"><span class="label">Color — <b>${color}</b></span>
          <div class="swatches">${p.colors.map(c=>`<button class="sw ${c===color?'on':''}" style="background:${COLORS[c]}" data-pc="${esc(c)}" aria-label="Color ${c}" title="${c}"></button>`).join('')}</div></div>
        <div class="buy">
          <div class="qty big"><button data-q="-1" aria-label="Menos">−</button><span>${qty}</span><button data-q="1" aria-label="Más">+</button></div>
          <button class="btn btn-dark" data-buy>Agregar al carrito — ${money(p.price*qty)}</button>
        </div>
        <a class="btn btn-line" style="width:100%" target="_blank" rel="noopener" href="${waLink(`Hola FlowHive, me interesa: ${qty} × ${p.name} (${color}). ¿Me ayudan con el pedido?`)}">Consultar por WhatsApp</a>
        <div class="perks">
          <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/></svg>Impreso a pedido en Piura · listo en 5 a 7 días hábiles</div>
          <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10z"/></svg>PLA de origen vegetal</div>
          <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/></svg>Garantía de 6 meses por defectos de fabricación</div>
        </div>
        <div class="acc">
          <details open><summary>Detalles</summary><div class="body">
            <table class="table"><tr><td>Medidas</td><td>${p.size}</td></tr><tr><td>Fabricación</td><td>${p.time}</td></tr><tr><td>Material</td><td>PLA de origen vegetal</td></tr>${p.light?`<tr><td>Iluminación</td><td>${p.light}</td></tr>`:''}</table>
            <p>Cada pieza se imprime capa por capa, así que puede tener pequeñas líneas y variaciones que la hacen única.</p></div></details>
          <details><summary>Envío y entrega</summary><div class="body">
            <p>Recojo gratis en nuestro taller de Piura o delivery en Piura, Castilla y Veintiséis de Octubre desde S/ 8. Al resto del Perú enviamos por Shalom u Olva.</p>
            <p>Envío gratis en pedidos desde ${money(SHOP.freeShipFrom)}. <a class="link" href="envios.html">Ver detalles</a></p></div></details>
          <details><summary>Cuidado</summary><div class="body">
            <p>Limpia con un paño seco o ligeramente húmedo. Evita el sol directo prolongado, el interior de autos y fuentes de calor de más de 50 °C.</p>
            <p><a class="link" href="cuidado.html">Guía completa de cuidado</a></p></div></details>
          <details><summary>¿Lo quieres personalizado?</summary><div class="body">
            <p>Podemos cambiar el color, la medida o agregar tu logo o iniciales. Escríbenos y te cotizamos sin compromiso.</p></div></details>
        </div>
      </div>`;
    };
    $('#pdp').addEventListener('click', e => {
      const b = e.target.closest('button'); if(!b) return;
      if(b.dataset.pc){ color=b.dataset.pc; history.replaceState(null,'',`?id=${p.id}&c=${encodeURIComponent(color)}`); draw(); }
      if(b.dataset.view){ view=+b.dataset.view; draw(); }
      if(b.dataset.q){ qty=Math.max(1,Math.min(20,qty+ +b.dataset.q)); draw(); }
      if(b.hasAttribute('data-buy')){ addToCart(p.id,color,qty); openCart(); }
    });
    draw();
    const related = PRODUCTS.filter(x=>x.id!==p.id && x.cat===p.cat).concat(PRODUCTS.filter(x=>x.cat!==p.cat)).slice(0,4);
    $('#related').innerHTML = related.map(x=>productCard(x)).join('');
  },

  carrito(){
    const f = $('#checkoutForm');
    $('#zones').innerHTML = ZONES.map((z,i)=>`<label class="radio"><input type="radio" name="zona" value="${z.id}" ${i===1?'checked':''}><div><b>${z.name}</b><span>${z.detail}</span></div><span class="r-price" data-zp="${z.id}"></span></label>`).join('');
    $('#payments').innerHTML = PAYMENTS.map((p,i)=>`<label class="radio" data-pay="${p.id}"><input type="radio" name="pago" value="${p.id}" ${i===0?'checked':''}><div><b>${p.name}</b><span>${p.detail}</span></div></label>`).join('');
    const zone = () => f.zona.value;
    const draw = () => {
      const sub = cartSubtotal(), ship = shippingFor(zone(), sub), empty = !cart.length;
      $('#coLines').innerHTML = empty ? `<div class="dr-empty" style="padding:40px 0"><p style="font-size:18px;color:var(--ink);margin-bottom:8px">Tu carrito está vacío</p><a class="btn btn-line" style="margin-top:16px" href="index.html#tienda">Ir a la tienda</a></div>` : cartLinesHTML();
      ZONES.forEach(z => { const s = shippingFor(z.id, sub); $(`[data-zp="${z.id}"]`).textContent = s===0 ? 'Gratis' : money(s); });
      $('#coTotals').innerHTML = `
        <div class="row"><span>Subtotal</span><span>${money(sub)}</span></div>
        <div class="row"><span>Envío</span><span>${ship===0?'Gratis':money(ship)}</span></div>
        <div class="row total"><span>Total</span><span>${money(sub+ship)}</span></div>`;
      $('#addrFields').style.display = zone()==='recojo' ? 'none' : '';
      $$('#addrFields [data-req]').forEach(el => el.required = zone()!=='recojo');
      PAYMENTS.forEach(p => {
        const ok = !p.zones || p.zones.includes(zone()); const el = $(`[data-pay="${p.id}"]`);
        el.style.display = ok ? '' : 'none';
        if(!ok && el.querySelector('input').checked) f.querySelector('input[name="pago"]').checked = true;
      });
      $('#placeOrder').disabled = empty;
    };
    f.addEventListener('change', draw);
    document.addEventListener('cart:change', draw);
    f.addEventListener('submit', e => {
      e.preventDefault(); if(!cart.length) return;
      const sub = cartSubtotal(), z = ZONES.find(x=>x.id===zone()), ship = shippingFor(z.id, sub);
      const pay = PAYMENTS.find(p=>p.id===f.pago.value);
      const items = cart.map(l=>{ const p=byId(l.id); return `• ${l.q} × ${p.name} (${l.c}) — ${money(p.price*l.q)}`; });
      const addr = z.id==='recojo' ? 'Recojo en taller' : `${f.direccion.value.trim()}, ${f.distrito.value.trim()}${f.referencia.value.trim()?` (Ref: ${f.referencia.value.trim()})`:''}`;
      const msg = [
        'Hola FlowHive, quiero hacer este pedido:', '', ...items, '',
        `Subtotal: ${money(sub)}`, `Envío (${z.name}): ${ship===0?'Gratis':money(ship)}`, `Total: ${money(sub+ship)}`, '',
        `Nombre: ${f.nombre.value.trim()}`, `Celular: ${f.celular.value.trim()}`, `Entrega: ${addr}`, `Pago: ${pay.name}`,
        f.notas.value.trim() ? `Notas: ${f.notas.value.trim()}` : null,
      ].filter(x=>x!==null).join('\n');
      window.open(waLink(msg), '_blank', 'noopener');
      $('#coDone').hidden = false; $('#coDone').scrollIntoView({behavior:'smooth', block:'center'});
    });
    $('#clearCart').addEventListener('click', () => { cart = []; saveCart(); $('#coDone').hidden = true; });
    draw();
  },

  reclamo(){
    // El Libro de Reclamaciones virtual debe registrar y numerar cada hoja y enviar copia al consumidor.
    // TODO: conectar a un backend o servicio de libro de reclamaciones. Mientras tanto se envía por correo.
    $('#fecha').value = new Date().toLocaleDateString('es-PE');
    $('#reclamoForm').addEventListener('submit', e => {
      e.preventDefault(); const f = e.target;
      const body = $$('[data-label]', f).map(el => {
        if(el.type==='radio' && !el.checked) return null;
        return el.value.trim() ? `${el.dataset.label}: ${el.value.trim()}` : null; }).filter(Boolean).join('\n');
      location.href = `mailto:${SHOP.email}?subject=${encodeURIComponent('Libro de Reclamaciones — '+f.tipo.value)}&body=${encodeURIComponent(body)}`;
      $('#recDone').hidden = false;
    });
  },
};

/* ---------- arranque ---------- */
layout(); renderCart();
$('#scrim').addEventListener('click', closeAll);
const pg = document.body.dataset.init; if(pg && pages[pg]) pages[pg]();
const mq = $('#mq');
if(mq){ const w=['Hecho en Piura','Material vegetal','Impreso a pedido','Diseño del norte','Envíos a todo el Perú','Piezas a medida']; mq.innerHTML=[...w,...w,...w,...w].map(x=>`<span>✺</span>${x}`).join(''); }
