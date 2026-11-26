// Analíticas con consentimiento: GA4 y Microsoft Clarity se cargan en diferido y solo si el visitante acepta.
// Eventos: whatsapp_click (todos los enlaces a wa.me), ver_coleccion y producto_hover.
type Choice = 'accepted' | 'rejected';

const KEY = 'fh-consent';
const DEBUG_KEY = 'fh-ga-debug';
const w = window as any;
const box = document.querySelector<HTMLElement>('[data-consent]');
const gaId = box?.dataset.ga ?? '';
const clarityId = box?.dataset.clarity ?? '';
let active = false;
let debug = false;

const read = (): string | null => {
  try { return localStorage.getItem(KEY); } catch { return null; }
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
}

/** Sin consentimiento no se registra nada. */
function track(name: string, params: Record<string, string>) {
  if (!active) return;
  // La marca va en cada evento: con ponerla solo en 'config', las peticiones no la llevaban y DebugView no los veía.
  w.gtag?.('event', name, debug ? { ...params, debug_mode: true } : params);
  w.clarity?.('event', name);
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

const stored = read();
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
