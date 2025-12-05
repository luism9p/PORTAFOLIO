import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
})

function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot') as HTMLElement
const cursorOutline = document.querySelector('.cursor-outline') as HTMLElement

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX
    const posY = e.clientY

    // Dot follows immediately
    cursorDot.style.left = `${posX}px`
    cursorDot.style.top = `${posY}px`

    // Outline follows with slight delay (using GSAP for smoothness)
    gsap.to(cursorOutline, {
        x: posX,
        y: posY,
        duration: 0.15,
        ease: 'power2.out'
    })
})

// Magnetic Effect & Hover State
const magneticElements = document.querySelectorAll('.magnetic')

magneticElements.forEach((elem) => {
    elem.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering')
        gsap.to(cursorOutline, { scale: 1.5 })
    })

    elem.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering')
        gsap.to(cursorOutline, { scale: 1 })
    })
})

// Hero Animation (Simple Reveal)
const heroText = document.querySelectorAll('.reveal-text')
gsap.from(heroText, {
    y: 100,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: 'power4.out',
    delay: 0.5
})

// Abstract Canvas Animation (Placeholder for "Systems Engineering" feel)
const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement
if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        // Simple matrix-like or geometric particles
        const particles: { x: number, y: number, speed: number }[] = []
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: Math.random() * 2 + 0.5
            })
        }

        function animateCanvas() {
            if (!ctx) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'

            particles.forEach(p => {
                ctx.fillRect(p.x, p.y, 2, 20) // Vertical lines like code rain
                p.y += p.speed
                if (p.y > canvas.height) p.y = 0
            })
            requestAnimationFrame(animateCanvas)
        }
        animateCanvas()
    }
}

// Ambient Background Hover Effect
const PROYECTOSItems = document.querySelectorAll('.PROYECTOS-item')
const ambientBackground = document.getElementById('ambient-background') as HTMLElement

PROYECTOSItems.forEach((item) => {
    const PROYECTOSItem = item as HTMLElement

    PROYECTOSItem.addEventListener('mouseenter', () => {
        const imageUrl = PROYECTOSItem.getAttribute('data-image')
        if (imageUrl && ambientBackground) {
            ambientBackground.style.backgroundImage = `url(${imageUrl})`
        }
    })

    PROYECTOSItem.addEventListener('mouseleave', () => {
        if (ambientBackground) {
            ambientBackground.style.backgroundImage = 'none'
            // Or set back to a default image if desired, but 'none' reveals the black background color
        }
    })
})

// Services List Reveal Animation
const serviceItems = document.querySelectorAll('.reveal-item')
serviceItems.forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out'
    })
})

// Parallax Effect for NOSOTROS Text
gsap.from('.NOSOTROS-text', {
    scrollTrigger: {
        trigger: '.NOSOTROS-section',
        start: 'top 80%',
        scrub: 1
    },
    y: 100,
    opacity: 0.5
})
