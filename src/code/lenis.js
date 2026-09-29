import Lenis from "lenis";
const lenis = new Lenis({
    wheelMultiplier: 2,
    smoothWheel: true,
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Body gets `.no-scroll` (position: fixed) while the intro preloader or the
// mobile menu is animating, which makes Lenis measure a scroll limit of 0
// and silently no-op any scrollTo. Wait for that class to actually clear
// (event-driven, since the preloader's duration varies with font load time)
// before resizing and scrolling.
function whenScrollReady(callback) {
    if (!document.body.classList.contains("no-scroll")) {
        callback();
        return;
    }
    const observer = new MutationObserver(() => {
        if (!document.body.classList.contains("no-scroll")) {
            observer.disconnect();
            callback();
        }
    });
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
    });
}

function scrollToHash(hash) {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;
    whenScrollReady(() => {
        lenis.resize();
        lenis.scrollTo(target, { offset: -80 });
    });
}

document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href*="#"]');
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (url.pathname === window.location.pathname && url.hash) {
        e.preventDefault();
        history.pushState(null, "", url.hash);
        scrollToHash(url.hash);
    }
});

if (window.location.hash) {
    window.addEventListener("load", () => scrollToHash(window.location.hash));
}
