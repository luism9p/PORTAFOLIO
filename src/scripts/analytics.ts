// Analíticas con consentimiento: GA4, Microsoft Clarity y el píxel de Meta se cargan en diferido y solo si el visitante acepta.
// Eventos: whatsapp_click (todos los enlaces a wa.me), ver_coleccion y producto_hover.
// Meta recibe PageView (cada carga), Contact (cada whatsapp_click) y ViewContent (tarjetas de producto).
type Choice = 'accepted' | 'rejected';

// "-2": el aviso ahora menciona publicidad, así que quien aceptó el texto anterior vuelve a verlo.
const KEY = 'fh-consent-2';
const OLD_KEY = 'fh-consent';
const DEBUG_KEY = 'fh-ga-debug';
const VIEWED_KEY = 'fh-tarjetas-vistas';
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

// ── producto_hover: ver las medidas de una tarjeta (mouse encima ≥ 0,5 s, una vez por producto y página) ──
const seen = new Set<string>();
document.querySelectorAll<HTMLElement>('[data-medidas]').forEach((media) => {
  let timer: number | undefined;
  media.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    timer = window.setTimeout(() => {
      const producto = media.dataset.medidas ?? '';
      if (!active || seen.has(producto)) return;
      seen.add(producto);
      track('producto_hover', { producto });
    }, 500);
  });
  media.addEventListener('pointerleave', () => window.clearTimeout(timer));
});

// ── Tarjetas de producto (Meta ViewContent): mouse encima ≥ 0,5 s o toque/clic, una vez por producto y visita ──
// La visita es la pestaña: la lista se guarda en sessionStorage para no repetir al pasar de una página a otra.
const readViewed = (): string[] => {
  try { return JSON.parse(sessionStorage.getItem(VIEWED_KEY) ?? '[]'); } catch { return []; }
};
const viewed = new Set<string>(readViewed());
function viewCard(producto: string) {
  if (!active || viewed.has(producto)) return;
  viewed.add(producto);
  try { sessionStorage.setItem(VIEWED_KEY, JSON.stringify([...viewed])); } catch {}
  track('tarjeta_producto', { producto });
}
document.querySelectorAll<HTMLElement>('[data-tarjeta]').forEach((card) => {
  const producto = card.dataset.tarjeta ?? '';
  let timer: number | undefined;
  card.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') timer = window.setTimeout(() => viewCard(producto), 500);
  });
  card.addEventListener('pointerleave', () => window.clearTimeout(timer));
  // 'click' cubre el toque en móvil sin contar los deslizamientos del carrusel.
  card.addEventListener('click', () => viewCard(producto), true);
});

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
