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
      {/* Ultra-Premium Sophisticated Fox - High-Tier Savvy Design */}
      <div className={`${sizeConfig.container} aspect-square relative group`}>
        <svg
          className="w-full h-full transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-3"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ultra-Sophisticated Fox Design - Premium High-Tier Savvy Aesthetics */}
          <defs>
            {/* Elite Premium Gradient System */}
            <linearGradient id="eliteGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="30%" stopColor="#fbbf24" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="eliteOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="25%" stopColor="#fdba74" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="75%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            <linearGradient id="eliteAccent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#fef3c7" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#fde68a" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="eliteRoseGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="33%" stopColor="#f59e0b" />
              <stop offset="66%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            <radialGradient id="sophisticatedGlow" cx="50%" cy="42%">
              <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.35" />
              <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.22" />
              <stop offset="70%" stopColor="#f97316" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="premiumHalo" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#fed7aa" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>

            {/* Enhanced shadow filters for premium depth */}
            <filter id="eliteShadow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="0" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.4"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.2"/>
              <feOffset dx="0" dy="0" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5"/>
              </feComponentTransfer>
              <feFlood floodColor="#fbbf24" floodOpacity="0.6"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Premium multi-layered ambient glow */}
          <g transform="translate(50, 50)">
            <ellipse cx="0" cy="-2" rx="48" ry="44" fill="url(#premiumHalo)"/>
            <ellipse cx="0" cy="-5" rx="44" ry="40" fill="url(#sophisticatedGlow)"/>

            {/* Ultra-refined fox silhouette with elite details */}
            <g filter="url(#eliteShadow)">
              {/* Sophisticated head shape with enhanced contours */}
              <path
                d="M 0 -34
                   C -3.5 -34, -6.5 -32, -9 -28.5
                   L -15 -37 C -17 -40, -19 -38, -18 -34.5
                   L -13 -25.5
                   C -16 -21, -17.5 -15.5, -17.5 -9
                   C -17.5 2, -14 10, -8.5 15
                   C -6 17.5, -3.5 18.5, -1.5 19
                   L -1.5 21.5
                   C -1.5 23.5, -0.75 24.5, 0 24.5
                   C 0.75 24.5, 1.5 23.5, 1.5 21.5
                   L 1.5 19
                   C 3.5 18.5, 6 17.5, 8.5 15
                   C 14 10, 17.5 2, 17.5 -9
                   C 17.5 -15.5, 16 -21, 13 -25.5
                   L 18 -34.5 C 19 -38, 17 -40, 15 -37
                   L 9 -28.5
                   C 6.5 -32, 3.5 -34, 0 -34 Z"
                fill="url(#eliteOrange)"
                stroke="url(#eliteGold)"
                strokeWidth="0.6"
                opacity="0.98"
              />

              {/* Premium ears with gradient layering */}
              <path
                d="M -11 -30 L -16.5 -39 C -17.5 -41, -15.5 -41, -14.5 -39 L -10 -30 Z"
                fill="url(#eliteGold)"
                opacity="0.94"
              />
              <path
                d="M 11 -30 L 16.5 -39 C 17.5 -41, 15.5 -41, 14.5 -39 L 10 -30 Z"
                fill="url(#eliteGold)"
                opacity="0.94"
              />

              {/* Inner ear detail - elite sophistication */}
              <path
                d="M -12 -32 L -15 -38 L -11.5 -32 Z"
                fill="url(#eliteAccent)"
                opacity="0.65"
              />
              <path
                d="M 12 -32 L 15 -38 L 11.5 -32 Z"
                fill="url(#eliteAccent)"
                opacity="0.65"
              />

              {/* Savvy, intelligent eyes - expressive and warm */}
              <ellipse cx="-7.5" cy="-7" rx="2.5" ry="3.5" fill="#18181b" opacity="0.92"/>
              <ellipse cx="7.5" cy="-7" rx="2.5" ry="3.5" fill="#18181b" opacity="0.92"/>

              {/* Premium eye sparkles - triple layer for depth */}
              <circle cx="-6.5" cy="-8.2" r="1.1" fill="#fffbeb" opacity="0.98"/>
              <circle cx="8.5" cy="-8.2" r="1.1" fill="#fffbeb" opacity="0.98"/>
              <circle cx="-7.3" cy="-6.2" r="0.6" fill="#fef3c7" opacity="0.75"/>
              <circle cx="7.7" cy="-6.2" r="0.6" fill="#fef3c7" opacity="0.75"/>
              <circle cx="-6.8" cy="-5" r="0.35" fill="#fde68a" opacity="0.55"/>
              <circle cx="8.2" cy="-5" r="0.35" fill="#fde68a" opacity="0.55"/>

              {/* Elite muzzle with enhanced shading */}
              <ellipse cx="0" cy="2.5" rx="5" ry="5.8" fill="url(#eliteAccent)" opacity="0.7"/>
              <ellipse cx="0" cy="3" rx="3.5" ry="4" fill="#fffbeb" opacity="0.3"/>

              {/* Premium sculptured nose */}
              <path
                d="M -1.8 1.5 C -1.8 0.3, -1 -0.5, 0 -0.5
                   C 1 -0.5, 1.8 0.3, 1.8 1.5
                   C 1.8 3, 1 3.8, 0 3.8
                   C -1 3.8, -1.8 3, -1.8 1.5 Z"
                fill="#27272a"
                opacity="0.95"
              />
              <circle cx="-0.4" cy="0.8" r="0.6" fill="#fffbeb" opacity="0.5"/>

              {/* Elegant whisker points - enhanced detail */}
              <circle cx="-12" cy="-1.5" r="0.7" fill="#27272a" opacity="0.5"/>
              <circle cx="-12" cy="1" r="0.7" fill="#27272a" opacity="0.45"/>
              <circle cx="-12" cy="3.5" r="0.6" fill="#27272a" opacity="0.4"/>
              <circle cx="12" cy="-1.5" r="0.7" fill="#27272a" opacity="0.5"/>
              <circle cx="12" cy="1" r="0.7" fill="#27272a" opacity="0.45"/>
              <circle cx="12" cy="3.5" r="0.6" fill="#27272a" opacity="0.4"/>

              {/* Luxurious flowing tail - multi-layered premium */}
              <g filter="url(#glowEffect)">
                <path
                  d="M 15 11
                     Q 24 9, 30 3
                     Q 35 -4, 34 -10
                     C 34 -12, 32 -11.5, 31.5 -9
                     Q 29 -4, 25.5 2
                     Q 20 9, 15 11
                     Z"
                  fill="url(#eliteRoseGold)"
                  opacity="0.92"
                />
              </g>

              {/* Tail highlight layers - premium detailing */}
              <path
                d="M 17 9.5 Q 25 7, 29 1 Q 32 -4, 31.5 -8.5"
                stroke="url(#eliteAccent)"
                strokeWidth="1.6"
                fill="none"
                opacity="0.65"
                strokeLinecap="round"
              />

              <path
                d="M 19 8.5 Q 24 6.5, 27.5 2"
                stroke="url(#eliteGold)"
                strokeWidth="1.2"
                fill="none"
                opacity="0.45"
                strokeLinecap="round"
              />

              <path
                d="M 21 7.5 Q 24 6, 26 3"
                stroke="#fffbeb"
                strokeWidth="0.6"
                fill="none"
                opacity="0.25"
                strokeLinecap="round"
              />

              {/* Enhanced chest/body with gradient */}
              <ellipse cx="0" cy="20" rx="10" ry="7" fill="url(#eliteOrange)" opacity="0.28"/>
              <ellipse cx="0" cy="21" rx="7" ry="4.5" fill="url(#eliteAccent)" opacity="0.15"/>
            </g>
          </g>
        </svg>
      </div>

      {/* Enhanced Text - AESOP with sophisticated styling */}
      <div className="flex items-baseline gap-3">
        <div className={`font-black tracking-tight ${sizeConfig.text} relative`}>
          {/* Elegantly enhanced intertwining design */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 300 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Premium intertwining curves */}
            <path
              d="M 42 58 Q 68 46, 94 56 Q 122 66, 148 56"
              stroke="url(#aeElite)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              d="M 48 52 Q 73 62, 98 52 Q 125 42, 152 52"
              stroke="url(#aeElite2)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M 45 55 Q 70 50, 95 55 Q 120 60, 145 55"
              stroke="url(#aeShimmer)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.45"
            />
            <defs>
              <linearGradient id="aeElite" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="25%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="75%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#fcd34d" />
              </linearGradient>
              <linearGradient id="aeElite2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="33%" stopColor="#fbbf24" />
                <stop offset="66%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="aeShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="50%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#fffbeb" />
              </linearGradient>
            </defs>
          </svg>
          <span
            className="relative z-10 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm"
            style={{fontWeight: 900}}
          >
            AESOP
          </span>
        </div>
        <span className={`tracking-widest text-orange-500 font-black ${sizeConfig.subtext} drop-shadow-sm`}>
          BLOG
        </span>
      </div>
    </div>
  );
}
