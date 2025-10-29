interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { container: 'h-12 w-12', text: 'text-2xl', subtext: 'text-xs', gap: 'gap-2' },
    md: { container: 'h-16 w-16', text: 'text-4xl', subtext: 'text-sm', gap: 'gap-3' },
    lg: { container: 'h-24 w-24', text: 'text-5xl', subtext: 'text-lg', gap: 'gap-4' },
    xl: { container: 'h-32 w-32', text: 'text-7xl', subtext: 'text-2xl', gap: 'gap-5' },
  };

  const sizeConfig = sizes[size];

  // Intertwined A+E Logo - Elegant, Fluid, Memorable
  return (
    <div className={`flex items-center ${sizeConfig.gap} ${className}`}>
      {/* Intertwined A and E Logo */}
      <div className={`${sizeConfig.container} relative group`}>
        <svg
          className="w-full h-full transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Elegant gradient for the letters */}
            <linearGradient id="letterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>

            {/* Glow effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Letter A - Left side */}
          <g filter="url(#glow)">
            {/* Left stroke of A */}
            <path
              d="M 25 75 L 40 20"
              stroke="url(#letterGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right stroke of A - This FUSES into E's vertical line */}
            <path
              d="M 40 20 L 55 75"
              stroke="url(#letterGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Crossbar of A */}
            <path
              d="M 30 52 L 50 52"
              stroke="url(#letterGradient)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>

          {/* Letter E - Right side, FUSED to A */}
          <g filter="url(#glow)">
            {/* Vertical spine of E (continues from A's right stroke) */}
            <path
              d="M 55 25 L 55 75"
              stroke="url(#letterGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Top horizontal of E */}
            <path
              d="M 55 25 L 75 25"
              stroke="url(#letterGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Middle horizontal of E */}
            <path
              d="M 55 50 L 70 50"
              stroke="url(#letterGradient)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Bottom horizontal of E */}
            <path
              d="M 55 75 L 75 75"
              stroke="url(#letterGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>

          {/* Flowing accent curve - adds fluidity */}
          <path
            d="M 40 20 Q 50 15, 55 25"
            stroke="url(#letterGradient)"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Text - AESOP with elegant styling */}
      <div className="flex items-baseline gap-3">
        <div className={`font-black tracking-tight ${sizeConfig.text} relative`}>
          <span
            className="relative z-10 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-lg"
            style={{fontWeight: 900}}
          >
            AESOP
          </span>
        </div>
        <span className={`tracking-widest text-purple-600 font-bold ${sizeConfig.subtext} drop-shadow-sm`}>
          BLOG
        </span>
      </div>
    </div>
  );
}
