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

// Selected Work Hover Reveal
const workItems = document.querySelectorAll('.work-item')
const previewMedia = document.querySelector('.work-preview-media') as HTMLElement

workItems.forEach((item) => {
    const workItem = item as HTMLElement

    workItem.addEventListener('mouseenter', () => {
        const imageUrl = workItem.getAttribute('data-image')
        if (imageUrl) {
            // In a real app, we would load the image/video here
            // For now, we'll just change the background color to simulate content
            previewMedia.style.backgroundColor = '#333'
            // previewMedia.style.backgroundImage = `url(${imageUrl})` // Uncomment when images exist
            previewMedia.style.backgroundSize = 'cover'
        }

        gsap.to(previewMedia, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.3
        })
    })

    workItem.addEventListener('mouseleave', () => {
        gsap.to(previewMedia, {
            autoAlpha: 0,
            scale: 0.8,
            duration: 0.3
        })
    })

    workItem.addEventListener('mousemove', (e) => {
        const x = e.clientX
        const y = e.clientY

        // Move the preview container near the cursor
        gsap.to(previewMedia, {
            x: x - window.innerWidth / 2 + 20, // Offset to not cover cursor
            y: y - window.innerHeight / 2 + 20,
            duration: 0.5,
            ease: 'power2.out'
        })
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

// Parallax Effect for About Text
gsap.from('.about-text', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
        scrub: 1
    },
    y: 100,
    opacity: 0.5
})
