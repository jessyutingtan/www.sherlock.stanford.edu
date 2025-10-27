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
      {/* Professional Fox Silhouette */}
      <div className={`${sizeConfig.container} aspect-square relative`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Professional Fox Silhouette - Clean and Iconic */}
          <g opacity="0.95">
            {/* Fox silhouette in one unified shape */}
            <path
              d="M 50 20
                 L 35 10 L 38 25
                 L 30 30
                 Q 25 35, 25 45
                 Q 25 55, 30 60
                 L 35 80 L 40 85
                 L 45 82 L 48 70
                 L 50 85
                 L 52 70 L 55 82
                 L 60 85 L 65 80
                 L 70 60
                 Q 75 55, 75 45
                 Q 75 35, 70 30
                 L 62 25 L 65 10
                 Z"
              fill="url(#foxSilhouette)"
              stroke="url(#foxOutline)"
              strokeWidth="0.5"
            />

            {/* Tail - elegant curve */}
            <path
              d="M 65 75 Q 80 70, 85 60 Q 88 55, 85 50 Q 83 48, 80 50 Q 75 55, 70 65 L 65 75"
              fill="url(#foxSilhouette)"
              opacity="0.9"
            />

            {/* Accent highlights for dimension */}
            <ellipse cx="42" cy="42" rx="3" ry="4" fill="#fef3c7" opacity="0.8" />
            <ellipse cx="58" cy="42" rx="3" ry="4" fill="#fef3c7" opacity="0.8" />

            {/* Subtle nose */}
            <circle cx="50" cy="50" r="2" fill="#dc2626" opacity="0.9" />
          </g>

          {/* Gradients for professional look */}
          <defs>
            <linearGradient id="foxSilhouette" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            <linearGradient id="foxOutline" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text - AESOP with elegantly intertwined AE */}
      <div className="flex items-baseline gap-3">
        <div className={`font-black tracking-tight ${sizeConfig.text} relative`}>
          {/* Elegantly intertwined AE connection */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 300 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Elegant intertwining design between A and E */}
            <path
              d="M 45 55 Q 70 45, 95 55 Q 120 65, 145 55"
              stroke="url(#aeConnection)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M 50 50 Q 75 60, 100 50 Q 125 40, 150 50"
              stroke="url(#aeConnection2)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
            <defs>
              <linearGradient id="aeConnection" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="aeConnection2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>
          <span className="relative z-10 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            AESOP
          </span>
        </div>
        <span className={`tracking-widest text-orange-400 font-bold ${sizeConfig.subtext}`}>
          BLOG
        </span>
      </div>
    </div>
  );
}
