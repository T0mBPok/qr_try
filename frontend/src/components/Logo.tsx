interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'gradient' | 'white' | 'dark';
  showText?: boolean;
}

export function Logo({ size = 'md', variant = 'gradient', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl' }
  };

  const colors = {
    gradient: {
      text: 'bg-gradient-to-r from-[#7c6afa] to-[#c89afc] bg-clip-text text-transparent',
      primary: 'url(#logo-gradient)',
      accent: '#df5950'
    },
    white: {
      text: 'text-white',
      primary: '#ffffff',
      accent: '#ffffff'
    },
    dark: {
      text: 'text-[#040404]',
      primary: '#040404',
      accent: '#040404'
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Icon - Stylized Q with QR pattern */}
      <svg
        className={sizes[size].icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c6afa" />
            <stop offset="100%" stopColor="#c89afc" />
          </linearGradient>
          
          <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#df5950" />
            <stop offset="100%" stopColor="#ff6b61" />
          </linearGradient>
        </defs>
        
        {/* Main Q shape with modern cut */}
        <path
          d="M50 15 C30 15 15 30 15 50 C15 70 30 85 50 85 C60 85 68 81 74 75 L85 86 L92 79 L81 68 C87 62 90 54 90 45 C90 25 75 10 55 10 C52 10 50 12 50 15 Z M50 25 C64 25 75 36 75 50 C75 55 73 60 70 64 L64 58 C66 55 67 52 67 48 C67 40 61 33 53 31 L53 31 C45 33 40 40 40 48 C40 56 45 63 53 65 L53 65 C56 66 59 65 62 63 L68 69 C63 73 57 75 50 75 C36 75 25 64 25 50 C25 36 36 25 50 25 Z"
          fill={variant === 'gradient' ? colors.gradient.primary : colors[variant].primary}
        />
        
        {/* QR code pattern elements - top left */}
        <g fill={variant === 'gradient' ? colors.gradient.primary : colors[variant].primary}>
          {/* Corner squares */}
          <rect x="32" y="32" width="7" height="7" rx="1.5" />
          <rect x="32" y="41" width="3" height="3" rx="0.5" />
          <rect x="37" y="41" width="3" height="3" rx="0.5" />
          
          {/* Scattered QR pixels */}
          <rect x="42" y="35" width="3" height="3" rx="0.5" />
          <rect x="46" y="32" width="3" height="3" rx="0.5" />
          <rect x="42" y="40" width="3" height="3" rx="0.5" />
        </g>
        
        {/* Accent dot - represents scan point */}
        <circle
          cx="85"
          cy="86"
          r="6"
          fill={variant === 'gradient' ? 'url(#accent-gradient)' : colors[variant].accent}
          className="animate-pulse"
          style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        />
        
        {/* Inner accent dot */}
        <circle
          cx="85"
          cy="86"
          r="3"
          fill="white"
          opacity="0.9"
        />
      </svg>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-0.5">
            <span className={`font-['Roboto'] ${sizes[size].text} tracking-tighter ${colors[variant].text}`} style={{ fontWeight: 700 }}>
              QR
            </span>
            <span className={`font-['Roboto'] ${sizes[size].text} tracking-tight ${colors[variant].text}`} style={{ fontWeight: 400 }}>
              wear
            </span>
          </div>
          <span className={`font-['Roboto'] text-[0.5em] tracking-widest uppercase ${variant === 'gradient' ? 'text-[#df5950]' : colors[variant].text} opacity-80`} style={{ fontWeight: 500 }}>
            Digital Style
          </span>
        </div>
      )}
    </div>
  );
}