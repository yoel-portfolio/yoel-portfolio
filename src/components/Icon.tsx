type IconName = 'arrow' | 'mail' | 'whatsapp' | 'sun' | 'moon' | 'code'

// Íconos de interfaz; la identidad de Yoel usa únicamente los SVG originales.
export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === 'arrow' && <><path d="M5 19 19 5M5 5h14v14" /></>}
      {name === 'mail' && <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>}
      {name === 'whatsapp' && <><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-4.8A8.5 8.5 0 1 1 20.5 11.5Z" /><path d="m8.4 7.4 1.6 2-1 1.4a8.1 8.1 0 0 0 4.2 4.2l1.4-1 2 1.6c-.8 2-2.5 2-4.4 1-2.3-1.2-4.1-3-5.3-5.3-1-1.9-1-3.1 1.5-3.9Z" /></>}
      {name === 'sun' && <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
      {name === 'moon' && <path d="M20.8 13.1A9 9 0 0 1 10.9 3.2a9 9 0 1 0 9.9 9.9Z" />}
      {name === 'code' && <><path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" /></>}
    </svg>
  )
}
