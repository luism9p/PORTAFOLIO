// Analíticas con consentimiento: GA4, Microsoft Clarity y el píxel de Meta se cargan en diferido y solo si el visitante acepta.
// Eventos: whatsapp_click (todos los enlaces a wa.me), ver_coleccion y producto_hover.
// Meta recibe PageView (cada carga), Contact (cada whatsapp_click) y ViewContent (tarjetas de producto).
type Choice = 'accepted' | 'rejected';

// "-2": el aviso ahora menciona publicidad, así que quien aceptó el texto anterior vuelve a verlo.
const KEY = 'fh-consent-2';
const OLD_KEY = 'fh-consent';
const DEBUG_KEY = 'fh-ga-debug';
const w = window as any;
const box = document.querySelector<HTMLElement>('[data-consent]');
const gaId = box?.dataset.ga ?? '';
const clarityId = box?.dataset.clarity ?? '';
const metaId = box?.dataset.meta ?? '';
let active = false;
let debug = false;

const read = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const save = (choice: Choice) => {
  try { localStorage.setItem(KEY, choice); } catch {}
};

/** ?ga_debug=1 manda los eventos a DebugView; se recuerda mientras dure la pestaña. */
const isDebug = () => {
  const inUrl = new URLSearchParams(location.search).has('ga_debug');
  try {
    if (inUrl) sessionStorage.setItem(DEBUG_KEY, '1');
    return inUrl || sessionStorage.getItem(DEBUG_KEY) === '1';
  } catch { return inUrl; }
};

/** Ejecuta cuando la página terminó de cargar y el navegador está libre. */
const whenIdle = (fn: () => void) => {
  const run = () => ('requestIdleCallback' in w ? w.requestIdleCallback(fn, { timeout: 3000 }) : setTimeout(fn, 1));
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
};

const addScript = (src: string) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

function start() {
  if (active) return;
  active = true;

  if (gaId) {
    // La cola se crea ya mismo: un clic anterior a que baje gtag.js queda guardado y se envía después.
    w.dataLayer = w.dataLayer || [];
    // gtag necesita el objeto `arguments`, no un array.
    w.gtag = function () { w.dataLayer.push(arguments); };
    w.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    w.gtag('js', new Date());
    debug = isDebug();
    w.gtag('config', gaId, debug ? { debug_mode: true } : {});
    whenIdle(() => addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`));
  }

  if (clarityId) {
    w.clarity = w.clarity || function () { (w.clarity.q = w.clarity.q || []).push(arguments); };
    w.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
    whenIdle(() => addScript(`https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`));
  }

  // Sin la imagen <noscript> del código de Meta: se pediría aunque no haya consentimiento.
  if (metaId) {
    if (!w.fbq) {
      // La cola de Meta: guarda las llamadas hasta que baje fbevents.js, que necesita el objeto `arguments`.
      const fbq: any = function () {
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
        else fbq.queue.push(arguments);
      };
      fbq.queue = [];
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      w.fbq = w._fbq = fbq;
    }
    // Un PageView por carga: sin esto, Meta añade otro cada vez que cambia el historial.
    w.fbq.disablePushState = true;
    // Sin eventos automáticos (SubscribedButtonClick y similares): solo PageView, Contact y ViewContent. Va antes de 'init'.
    w.fbq('set', 'autoConfig', false, metaId);
    w.fbq('init', metaId);
    w.fbq('track', 'PageView');
    whenIdle(() => addScript('https://connect.facebook.net/en_US/fbevents.js'));
  }
}

type Params = Record<string, string>;

/** Eventos que también van a Meta, con su nombre estándar y sus datos. */
const META_EVENTS: Record<string, (p: Params) => [string, Params]> = {
  whatsapp_click: ({ ubicacion, producto }) =>
    ['Contact', { content_category: ubicacion, ...(producto ? { content_name: producto } : {}) }],
  tarjeta_producto: ({ producto }) => ['ViewContent', { content_name: producto }],
};
/** Estos no van a GA4 ni a Clarity (allí las tarjetas ya se miden con producto_hover). */
const META_ONLY = new Set(['tarjeta_producto']);

/** Una sola llamada por evento para todos los destinos. Sin consentimiento no se registra nada. */
function track(name: string, params: Params) {
  if (!active) return;
  if (!META_ONLY.has(name)) {
    // La marca va en cada evento: con ponerla solo en 'config', las peticiones no la llevaban y DebugView no los veía.
    w.gtag?.('event', name, debug ? { ...params, debug_mode: true } : params);
    w.clarity?.('event', name);
  }
  const meta = META_EVENTS[name]?.(params);
  if (meta) w.fbq?.('track', ...meta);
}

// ── Clics: delegados en el documento, así cubren también los enlaces cuyo mensaje cambia con la variante ──
function onClick(event: Event) {
  const target = event.target instanceof Element ? event.target : null;
  const wa = target?.closest<HTMLAnchorElement>('a[href*="wa.me/"]');
  if (wa) {
    const producto = wa.closest<HTMLElement>('[data-producto]')?.dataset.producto;
    track('whatsapp_click', { ubicacion: wa.dataset.waUbicacion ?? 'otro', ...(producto ? { producto } : {}) });
    return;
  }
  const collection = target?.closest<HTMLElement>('[data-ver-coleccion]');
  if (collection) track('ver_coleccion', { ubicacion: collection.dataset.verColeccion ?? 'otro' });
}
document.addEventListener('click', onClick, true);
// clic con la rueda (abrir en pestaña nueva)
document.addEventListener('auxclick', (e) => { if (e.button === 1) onClick(e); }, true);

// ── Tarjetas de producto: producto_hover (GA4 y Clarity) y ViewContent (Meta) ──
/**
 * Llama a `fn` cuando alguien mueve el mouse sobre `el` y se queda 0,5 s. No usa pointerenter: también se
 * dispara si la tarjeta pasa bajo un puntero quieto al hacer scroll, y ahí la posición en pantalla no cambia.
 */
function onMouseInterest(el: HTMLElement, fn: () => void) {
  let origin: { x: number; y: number } | undefined;
  let timer: number | undefined;
  el.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || timer !== undefined) return;
    origin ??= { x: e.screenX, y: e.screenY };
    // al menos 4 px de recorrido: descarta los temblores y los eventos sin movimiento
    if (Math.hypot(e.screenX - origin.x, e.screenY - origin.y) >= 4) timer = window.setTimeout(fn, 500);
  });
  el.addEventListener('pointerleave', () => {
    window.clearTimeout(timer);
    timer = origin = undefined;
  });
}

/** Un evento por producto y visita (la pestaña: se recuerda en sessionStorage al pasar de una página a otra). */
function watchCards(attr: 'medidas' | 'tarjeta', event: string) {
  const key = `fh-visto-${event}`;
  let stored: string[] = [];
  try { stored = JSON.parse(sessionStorage.getItem(key) ?? '[]'); } catch {}
  const seen = new Set<string>(stored);
  document.querySelectorAll<HTMLElement>(`[data-${attr}]`).forEach((el) => {
    const producto = el.dataset[attr] ?? '';
    const send = () => {
      if (!active || seen.has(producto)) return;
      seen.add(producto);
      try { sessionStorage.setItem(key, JSON.stringify([...seen])); } catch {}
      track(event, { producto });
    };
    onMouseInterest(el, send);
    // 'click' es el toque en móvil (los deslizamientos del carrusel no lo disparan) y el clic con el mouse.
    el.addEventListener('click', send, true);
  });
}
watchCards('medidas', 'producto_hover'); // tarjetas de la home que muestran las medidas
watchCards('tarjeta', 'tarjeta_producto'); // todas las tarjetas de producto

// ── Aviso de cookies ──
// --consent-h deja que en móvil el botón de WhatsApp y la barra de compra suban mientras el aviso está visible.
const setHeight = () => {
  const height = box && !box.hidden ? box.offsetHeight + 12 : 0;
  document.documentElement.style.setProperty('--consent-h', `${height}px`);
};
const showBanner = (show: boolean) => {
  if (!box) return;
  box.hidden = !show;
  setHeight();
};

// Un rechazo anterior se respeta sin volver a preguntar.
const stored = read(KEY) ?? (read(OLD_KEY) === 'rejected' ? 'rejected' : null);
if (stored === 'accepted') start();
else if (stored !== 'rejected') showBanner(true);

box?.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach((button) =>
  button.addEventListener('click', () => {
    const choice = button.dataset.consentChoice as Choice;
    save(choice);
    showBanner(false);
    if (choice === 'accepted') start();
  })
);
window.addEventListener('resize', setHeight, { passive: true });
