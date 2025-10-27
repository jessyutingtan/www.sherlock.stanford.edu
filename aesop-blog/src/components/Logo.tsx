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
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Elegant, Artistic Fox Design */}
          <defs>
            {/* Sophisticated gradient palette */}
            <linearGradient id="foxMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="30%" stopColor="#f97316" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>

            <linearGradient id="foxAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.7" />
            </linearGradient>

            <radialGradient id="foxGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Elegant fox shape with refined curves */}
          <g transform="translate(60, 60)">
            {/* Artistic glow effect */}
            <circle r="45" fill="url(#foxGlow)" opacity="0.6" />

            {/* Main fox head - elegant proportions */}
            <path
              d="M -15 -25 Q -20 -40, -12 -45 L -8 -30 Q -5 -35, 0 -35 Q 5 -35, 8 -30 L 12 -45 Q 20 -40, 15 -25
                 Q 18 -20, 18 -10 Q 18 5, 15 10
                 Q 12 15, 8 18 L 8 22 Q 5 25, 0 25 Q -5 25, -8 22
                 L -8 18 Q -12 15, -15 10
                 Q -18 5, -18 -10 Q -18 -20, -15 -25 Z"
              fill="url(#foxMainGradient)"
              stroke="#ea580c"
              strokeWidth="0.8"
              opacity="0.95"
            />

            {/* Elegant ears with detail */}
            <path
              d="M -10 -32 Q -15 -42, -10 -43 Q -8 -40, -8 -32 Z"
              fill="url(#foxMainGradient)"
              opacity="0.9"
            />
            <path
              d="M 10 -32 Q 15 -42, 10 -43 Q 8 -40, 8 -32 Z"
              fill="url(#foxMainGradient)"
              opacity="0.9"
            />

            {/* Inner ear highlights - artistic touch */}
            <ellipse cx="-9" cy="-36" rx="2" ry="3" fill="url(#foxAccent)" opacity="0.6" />
            <ellipse cx="9" cy="-36" rx="2" ry="3" fill="url(#foxAccent)" opacity="0.6" />

            {/* Expressive eyes - warm and inviting */}
            <ellipse cx="-8" cy="-8" rx="2.5" ry="3.5" fill="#422006" opacity="0.8" />
            <ellipse cx="8" cy="-8" rx="2.5" ry="3.5" fill="#422006" opacity="0.8" />

            {/* Eye sparkles - adds life */}
            <circle cx="-7" cy="-9" r="1" fill="#fef3c7" opacity="0.9" />
            <circle cx="9" cy="-9" r="1" fill="#fef3c7" opacity="0.9" />

            {/* Elegant snout */}
            <path
              d="M -5 0 Q -3 5, 0 6 Q 3 5, 5 0 L 3 -2 Q 0 -1, -3 -2 Z"
              fill="url(#foxAccent)"
              opacity="0.7"
            />

            {/* Sophisticated nose */}
            <ellipse cx="0" cy="2" rx="2" ry="2.5" fill="#422006" opacity="0.8" />
            <circle cx="0" cy="1" r="0.8" fill="#fef3c7" opacity="0.5" />

            {/* Elegant whisker dots */}
            <circle cx="-12" cy="-3" r="0.8" fill="#422006" opacity="0.5" />
            <circle cx="12" cy="-3" r="0.8" fill="#422006" opacity="0.5" />

            {/* Graceful tail - flowing curves */}
            <path
              d="M 15 15 Q 25 12, 30 5 Q 35 -2, 33 -8 Q 32 -10, 30 -8 Q 28 -3, 25 3 Q 20 10, 15 12 Z"
              fill="url(#foxMainGradient)"
              opacity="0.85"
            />

            {/* Tail highlight - adds dimension */}
            <path
              d="M 18 10 Q 24 8, 28 2 Q 30 -2, 29 -5"
              stroke="url(#foxAccent)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
              strokeLinecap="round"
            />

            {/* Subtle body suggestion - artistic */}
            <ellipse cx="0" cy="20" rx="10" ry="8" fill="url(#foxMainGradient)" opacity="0.3" />
          </g>
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
