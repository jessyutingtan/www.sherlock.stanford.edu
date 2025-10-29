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
  // A's right line is FUSED with E's vertical spine
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

            {/* Special gradient for the SHARED line to emphasize fusion */}
            <linearGradient id="sharedLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>

          <g filter="url(#glow)">
            {/* Letter A - Left stroke */}
            <path
              d="M 20 75 L 40 20"
              stroke="url(#letterGradient)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* SHARED VERTICAL LINE - This is BOTH A's right stroke AND E's left spine */}
            <path
              d="M 40 20 L 40 75"
              stroke="url(#sharedLineGradient)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* A's crossbar */}
            <path
              d="M 25 52 L 40 52"
              stroke="url(#letterGradient)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* E's top horizontal - extends from shared line */}
            <path
              d="M 40 20 L 65 20"
              stroke="url(#letterGradient)"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* E's middle horizontal - extends from shared line */}
            <path
              d="M 40 47.5 L 60 47.5"
              stroke="url(#letterGradient)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* E's bottom horizontal - extends from shared line */}
            <path
              d="M 40 75 L 65 75"
              stroke="url(#letterGradient)"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Accent marks to emphasize the fusion point */}
            <circle
              cx="40"
              cy="20"
              r="3"
              fill="url(#letterGradient)"
              opacity="0.8"
            />
            <circle
              cx="40"
              cy="75"
              r="3"
              fill="url(#letterGradient)"
              opacity="0.8"
            />

            {/* Flowing accent curve at top - emphasizes the fusion */}
            <path
              d="M 38 18 Q 40 15, 42 18"
              stroke="url(#letterGradient)"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
              strokeLinecap="round"
            />
          </g>

          {/* Optional: Subtle background circle for depth */}
          <circle
            cx="45"
            cy="47.5"
            r="38"
            fill="none"
            stroke="url(#letterGradient)"
            strokeWidth="1"
            opacity="0.15"
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
