interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { container: 'h-16', text: 'text-3xl', subtext: 'text-sm', gap: 'gap-3' },
    md: { container: 'h-24', text: 'text-5xl', subtext: 'text-lg', gap: 'gap-4' },
    lg: { container: 'h-32', text: 'text-6xl', subtext: 'text-2xl', gap: 'gap-5' },
    xl: { container: 'h-48', text: 'text-8xl', subtext: 'text-4xl', gap: 'gap-6' },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`flex items-center ${sizeConfig.gap} ${className}`}>
      {/* Minimalist Eagle Logo */}
      <div className={`${sizeConfig.container} aspect-square relative`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simple background glow */}
          <circle cx="50" cy="50" r="35" fill="url(#simpleGlow)" opacity="0.15" />

          {/* Left Wing - Simple geometric shape */}
          <path
            d="M 50 45 Q 35 35 20 30 L 25 40 Q 40 42 50 50 Z"
            fill="url(#wingGradient)"
            opacity="0.9"
          />

          {/* Right Wing - Simple geometric shape */}
          <path
            d="M 50 45 Q 65 35 80 30 L 75 40 Q 60 42 50 50 Z"
            fill="url(#wingGradient)"
            opacity="0.9"
          />

          {/* Eagle Body - Simple circle */}
          <circle cx="50" cy="55" r="12" fill="url(#bodyGradient)" />

          {/* Eagle Head - Simple circle */}
          <circle cx="50" cy="35" r="8" fill="url(#headGradient)" />

          {/* Simple Beak */}
          <path
            d="M 58 35 L 65 33 L 62 37 Z"
            fill="#f59e0b"
          />

          {/* Simple Eye */}
          <circle cx="53" cy="34" r="1.5" fill="#1e293b" />
          <circle cx="53.5" cy="33.5" r="0.6" fill="#fbbf24" />

          {/* Minimal tail */}
          <path
            d="M 50 67 L 48 75 M 50 67 L 52 75"
            stroke="url(#tailGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Gradients - Simple and clean */}
          <defs>
            <radialGradient id="simpleGlow">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>

            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <radialGradient id="headGradient">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fbbf24" />
            </radialGradient>

            <linearGradient id="tailGradient">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text - AESOP and BLOG in same row */}
      <div className="flex items-baseline gap-3">
        <span className={`font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent ${sizeConfig.text}`}>
          AESOP
        </span>
        <span className={`tracking-widest text-orange-400 font-bold ${sizeConfig.subtext}`}>
          BLOG
        </span>
      </div>
    </div>
  );
}
