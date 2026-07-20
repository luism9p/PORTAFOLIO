// Same 5 destinations the old Header/MobileNav pointed to. Hover colors
// alternate between the site's two accents (lime, blue) rather than the
// component demo's rainbow palette, and rotation follows the reference's
// own -8/8/8/8/-8 pattern (tuned to this exact 5-item count's CSS).
export const navItems = [
  {
    label: 'TRABAJOS',
    href: '#works',
    ariaLabel: 'Trabajos',
    rotation: -8,
    hoverStyles: { bgColor: '#C8FF00', textColor: '#000000' },
  },
  {
    label: 'SERVICIOS',
    href: '#expertise',
    ariaLabel: 'Servicios',
    rotation: 8,
    hoverStyles: { bgColor: '#0055FF', textColor: '#ffffff' },
  },
  {
    label: 'NOSOTROS',
    href: '#about',
    ariaLabel: 'Nosotros',
    rotation: 8,
    hoverStyles: { bgColor: '#C8FF00', textColor: '#000000' },
  },
  {
    label: 'BLOG',
    href: '#insights',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: '#0055FF', textColor: '#ffffff' },
  },
  {
    label: 'CONTACTO',
    href: '#footer',
    ariaLabel: 'Contacto',
    rotation: -8,
    hoverStyles: { bgColor: '#C8FF00', textColor: '#000000' },
  },
];
