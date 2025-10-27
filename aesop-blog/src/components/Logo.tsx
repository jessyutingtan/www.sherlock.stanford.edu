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
          {/* Ultra-Sophisticated Fox Design - High-Tier Premium */}
          <defs>
            {/* Premium gradient system */}
            <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="premiumOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            <linearGradient id="premiumAccent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#fde68a" stopOpacity="0.85" />
            </linearGradient>

            <radialGradient id="sophisticatedGlow" cx="50%" cy="45%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#f97316" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>

            <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
              <feOffset dx="0" dy="1" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Sophisticated composition */}
          <g transform="translate(50, 50)">
            {/* Premium ambient glow */}
            <ellipse cx="0" cy="-5" rx="42" ry="38" fill="url(#sophisticatedGlow)"/>

            {/* Refined fox silhouette */}
            <g filter="url(#softShadow)">
              {/* Elegant head shape */}
              <path
                d="M 0 -32
                   C -3 -32, -6 -30, -8 -27
                   L -14 -35 C -16 -38, -18 -36, -17 -33
                   L -12 -24
                   C -15 -20, -16 -15, -16 -9
                   C -16 0, -13 8, -8 13
                   C -6 15, -4 16, -2 16.5
                   L -2 19
                   C -2 21, -1 22, 0 22
                   C 1 22, 2 21, 2 19
                   L 2 16.5
                   C 4 16, 6 15, 8 13
                   C 13 8, 16 0, 16 -9
                   C 16 -15, 15 -20, 12 -24
                   L 17 -33 C 18 -36, 16 -38, 14 -35
                   L 8 -27
                   C 6 -30, 3 -32, 0 -32 Z"
                fill="url(#premiumOrange)"
                stroke="url(#premiumGold)"
                strokeWidth="0.5"
                opacity="0.98"
              />

              {/* Refined ears */}
              <path
                d="M -10 -28 L -15 -36 C -16 -38, -14 -38, -13 -36 L -9 -28 Z"
                fill="url(#premiumGold)"
                opacity="0.92"
              />
              <path
                d="M 10 -28 L 15 -36 C 16 -38, 14 -38, 13 -36 L 9 -28 Z"
                fill="url(#premiumGold)"
                opacity="0.92"
              />

              {/* Inner ear detail - subtle sophistication */}
              <path
                d="M -11 -30 L -13.5 -35 L -10.5 -30 Z"
                fill="url(#premiumAccent)"
                opacity="0.5"
              />
              <path
                d="M 11 -30 L 13.5 -35 L 10.5 -30 Z"
                fill="url(#premiumAccent)"
                opacity="0.5"
              />

              {/* Sophisticated eyes - soulful and warm */}
              <ellipse cx="-7" cy="-6" rx="2.2" ry="3" fill="#1c1917" opacity="0.85"/>
              <ellipse cx="7" cy="-6" rx="2.2" ry="3" fill="#1c1917" opacity="0.85"/>

              {/* Eye highlights - premium sparkle */}
              <circle cx="-6.2" cy="-7" r="0.9" fill="#fef3c7" opacity="0.95"/>
              <circle cx="7.8" cy="-7" r="0.9" fill="#fef3c7" opacity="0.95"/>
              <circle cx="-6.8" cy="-5.5" r="0.5" fill="#fde68a" opacity="0.6"/>
              <circle cx="7.2" cy="-5.5" r="0.5" fill="#fde68a" opacity="0.6"/>

              {/* Refined muzzle */}
              <ellipse cx="0" cy="2" rx="4.5" ry="5" fill="url(#premiumAccent)" opacity="0.6"/>

              {/* Premium nose */}
              <path
                d="M -1.5 1 C -1.5 0, -0.75 -0.5, 0 -0.5
                   C 0.75 -0.5, 1.5 0, 1.5 1
                   C 1.5 2.5, 0.75 3, 0 3
                   C -0.75 3, -1.5 2.5, -1.5 1 Z"
                fill="#292524"
                opacity="0.9"
              />
              <circle cx="-0.3" cy="0.5" r="0.5" fill="#fef3c7" opacity="0.4"/>

              {/* Elegant whisker marks */}
              <circle cx="-11" cy="-1" r="0.6" fill="#292524" opacity="0.4"/>
              <circle cx="-11" cy="1.5" r="0.6" fill="#292524" opacity="0.35"/>
              <circle cx="11" cy="-1" r="0.6" fill="#292524" opacity="0.4"/>
              <circle cx="11" cy="1.5" r="0.6" fill="#292524" opacity="0.35"/>

              {/* Luxurious tail - flowing and refined */}
              <path
                d="M 14 10
                   Q 22 8, 28 2
                   Q 32 -4, 31 -9
                   C 31 -10.5, 29.5 -10, 29 -8
                   Q 27 -3, 24 2
                   Q 19 8, 14 10
                   Z"
                fill="url(#premiumOrange)"
                opacity="0.88"
              />

              {/* Tail highlight - premium detail */}
              <path
                d="M 16 8 Q 23 6, 27 0 Q 29 -4, 28.5 -7"
                stroke="url(#premiumAccent)"
                strokeWidth="1.3"
                fill="none"
                opacity="0.5"
                strokeLinecap="round"
              />

              {/* Tail inner glow */}
              <path
                d="M 18 7 Q 22 5, 25 1"
                stroke="url(#premiumGold)"
                strokeWidth="0.8"
                fill="none"
                opacity="0.3"
                strokeLinecap="round"
              />

              {/* Subtle chest/body indication */}
              <ellipse cx="0" cy="18" rx="9" ry="6" fill="url(#premiumOrange)" opacity="0.25"/>
            </g>
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
