type IconName =
  | 'arrow'
  | 'mail'
  | 'whatsapp'
  | 'linkedin'
  | 'sun'
  | 'moon'
  | 'code'
  | 'github'
  | 'download'
  | 'chevronUp'
  | 'close'
  | 'play'
  | 'pause'
  | 'check'
  | 'alert'

// Íconos de interfaz; la identidad de Yoel usa únicamente los SVG originales.
export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === 'arrow' && <><path d="M5 19 19 5M5 5h14v14" /></>}
      {name === 'mail' && <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>}
      {name === 'linkedin' && <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r=".8" fill="currentColor" stroke="none" /><path d="M8 11v6m4 0v-6m0 3a2.5 2.5 0 0 1 5 0v3" /></>}
      {name === 'whatsapp' && <><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-4.8A8.5 8.5 0 1 1 20.5 11.5Z" /><path d="m8.4 7.4 1.6 2-1 1.4a8.1 8.1 0 0 0 4.2 4.2l1.4-1 2 1.6c-.8 2-2.5 2-4.4 1-2.3-1.2-4.1-3-5.3-5.3-1-1.9-1-3.1 1.5-3.9Z" /></>}
      {name === 'sun' && <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
      {name === 'moon' && <path d="M20.8 13.1A9 9 0 0 1 10.9 3.2a9 9 0 1 0 9.9 9.9Z" />}
      {name === 'code' && <><path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" /></>}
      {name === 'github' && <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />}
      {name === 'download' && <><path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>}
      {name === 'chevronUp' && <path d="m18 15-6-6-6 6" />}
      {name === 'close' && <path d="M18 6 6 18M6 6l12 12" />}
      {name === 'play' && <polygon points="6 4 20 12 6 20 6 4" />}
      {name === 'pause' && <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>}
      {name === 'check' && <path d="m5 12 5 5L20 7" />}
      {name === 'alert' && <><circle cx="12" cy="12" r="9" /><path d="M12 8v4m0 4h.01" /></>}
    </svg>
  )
}
