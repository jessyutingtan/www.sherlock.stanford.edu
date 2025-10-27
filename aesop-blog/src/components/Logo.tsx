interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { container: 'h-12', text: 'text-2xl', subtext: 'text-xs', gap: 'gap-3' },
    md: { container: 'h-16', text: 'text-3xl', subtext: 'text-sm', gap: 'gap-4' },
    lg: { container: 'h-24', text: 'text-5xl', subtext: 'text-lg', gap: 'gap-5' },
    xl: { container: 'h-32', text: 'text-7xl', subtext: 'text-2xl', gap: 'gap-6' },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`flex items-center ${sizeConfig.gap} ${className}`}>
      {/* Geometric A+E Logo */}
      <div className={`${sizeConfig.container} aspect-square relative`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background frame with corners */}
          <path d="M 0 10 L 0 0 L 10 0" stroke="url(#gradient1)" strokeWidth="2" fill="none" />
          <path d="M 70 0 L 80 0 L 80 10" stroke="url(#gradient1)" strokeWidth="2" fill="none" />
          <path d="M 80 70 L 80 80 L 70 80" stroke="url(#gradient2)" strokeWidth="2" fill="none" />
          <path d="M 10 80 L 0 80 L 0 70" stroke="url(#gradient2)" strokeWidth="2" fill="none" />

          {/* Integrated A and E structure */}
          {/* A - Left side with sharp geometric design */}
          <path
            d="M 20 60 L 28 25 L 36 60 M 24 48 L 32 48"
            stroke="url(#gradient1)"
            strokeWidth="4"
            strokeLinecap="square"
            fill="none"
          />

          {/* Connecting element - shared vertical bar between A and E */}
          <rect
            x="34"
            y="25"
            width="4"
            height="35"
            fill="url(#gradient3)"
            className="animate-pulse-slow"
          />

          {/* E - Right side with horizontal bars */}
          <path
            d="M 38 25 L 58 25 M 38 42.5 L 54 42.5 M 38 60 L 58 60"
            stroke="url(#gradient2)"
            strokeWidth="4"
            strokeLinecap="square"
            fill="none"
          />

          {/* Accent lines - circuit-like connections */}
          <line x1="28" y1="25" x2="28" y2="18" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="50" y1="25" x2="50" y2="18" stroke="#14b8a6" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </line>
          <line x1="28" y1="60" x2="28" y2="67" stroke="#14b8a6" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="1s" repeatCount="indefinite" />
          </line>
          <line x1="50" y1="60" x2="50" y2="67" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="1.5s" repeatCount="indefinite" />
          </line>

          {/* Digital nodes */}
          <circle cx="28" cy="18" r="2" fill="#06b6d4" className="animate-pulse" />
          <circle cx="50" cy="18" r="2" fill="#14b8a6" className="animate-pulse" />
          <circle cx="28" cy="67" r="2" fill="#14b8a6" className="animate-pulse" />
          <circle cx="50" cy="67" r="2" fill="#06b6d4" className="animate-pulse" />

          {/* Corner accent dots */}
          <circle cx="5" cy="5" r="1.5" fill="#06b6d4" opacity="0.8" />
          <circle cx="75" cy="5" r="1.5" fill="#14b8a6" opacity="0.8" />
          <circle cx="75" cy="75" r="1.5" fill="#06b6d4" opacity="0.8" />
          <circle cx="5" cy="75" r="1.5" fill="#14b8a6" opacity="0.8" />

          {/* Animated scanning line */}
          <line x1="15" y1="0" x2="15" y2="80" stroke="url(#scanGradient)" strokeWidth="1" opacity="0.4">
            <animate attributeName="x1" values="15;65;15" dur="4s" repeatCount="indefinite" />
            <animate attributeName="x2" values="15;65;15" dur="4s" repeatCount="indefinite" />
          </line>

          {/* Gradients */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* Text - AESOP and BLOG in same row */}
      <div className="flex items-baseline gap-3">
        <span className={`font-black tracking-tight bg-gradient-to-r from-cyan-400 via-cyan-300 to-neon-400 bg-clip-text text-transparent ${sizeConfig.text}`}>
          AESOP
        </span>
        <span className={`tracking-widest text-cyan-400 font-bold ${sizeConfig.subtext}`}>
          BLOG
        </span>
      </div>
    </div>
  );
}
