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

  // HIPPO LOGO v2.0 - Adorable red-hatted hippo with premium design
  return (
    <div className={`flex items-center ${sizeConfig.gap} ${className}`}>
      {/* Adorable Red-Hatted Hippo - Cute, Warming, Savvy & Special */}
      <div className={`${sizeConfig.container} aspect-square relative group`}>
        <svg
          className="w-full h-full transition-all duration-700 ease-out group-hover:scale-110 group-hover:-rotate-2"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Adorable Hippo Design - Cute, Warming, Savvy, Special, Good Taste */}
          <defs>
            {/* Premium Hippo Body Gradients - Warm & Soft */}
            <linearGradient id="hippoBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="25%" stopColor="#fca5a5" />
              <stop offset="50%" stopColor="#f9a8d4" />
              <stop offset="75%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#fce7f3" />
            </linearGradient>

            <linearGradient id="hippoBodyLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="33%" stopColor="#fed7aa" />
              <stop offset="66%" stopColor="#fecdd3" />
              <stop offset="100%" stopColor="#fce7f3" />
            </linearGradient>

            {/* Vibrant Red Hat Gradients */}
            <linearGradient id="redHat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="33%" stopColor="#dc2626" />
              <stop offset="66%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>

            <linearGradient id="redHatHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f87171" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.5" />
            </linearGradient>

            {/* Warm Coral/Pink Accents */}
            <linearGradient id="warmAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="50%" stopColor="#f9a8d4" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>

            {/* Soft Ambient Glow */}
            <radialGradient id="warmGlow" cx="50%" cy="45%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#fecdd3" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#f9a8d4" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="cuteHalo" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#ffe4e6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#fce7f3" stopOpacity="0" />
            </radialGradient>

            {/* Premium Shadow Filters */}
            <filter id="softShadow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="0" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.35"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="hatGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
              <feOffset dx="0" dy="0" result="offsetblur"/>
              <feFlood floodColor="#dc2626" floodOpacity="0.5"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Ambient Glow Background */}
          <g transform="translate(50, 50)">
            <ellipse cx="0" cy="0" rx="48" ry="45" fill="url(#cuteHalo)"/>
            <ellipse cx="0" cy="-2" rx="44" ry="42" fill="url(#warmGlow)"/>

            {/* Adorable Hippo with Red Hat */}
            <g filter="url(#softShadow)">

              {/* Cute Rounded Body */}
              <ellipse cx="0" cy="8" rx="22" ry="18" fill="url(#hippoBody)" opacity="0.95"/>

              {/* Round Head */}
              <circle cx="0" cy="-8" r="20" fill="url(#hippoBody)" opacity="0.95"/>

              {/* Lighter Belly/Face Highlight */}
              <ellipse cx="0" cy="8" rx="16" ry="13" fill="url(#hippoBodyLight)" opacity="0.4"/>
              <ellipse cx="0" cy="-6" rx="14" ry="12" fill="url(#hippoBodyLight)" opacity="0.35"/>

              {/* Adorable Small Ears */}
              <ellipse
                cx="-14"
                cy="-15"
                rx="5"
                ry="6"
                fill="url(#warmAccent)"
                opacity="0.9"
                transform="rotate(-20 -14 -15)"
              />
              <ellipse
                cx="14"
                cy="-15"
                rx="5"
                ry="6"
                fill="url(#warmAccent)"
                opacity="0.9"
                transform="rotate(20 14 -15)"
              />

              {/* Inner ear pink detail */}
              <ellipse
                cx="-14"
                cy="-15"
                rx="2.5"
                ry="3"
                fill="#fbcfe8"
                opacity="0.7"
                transform="rotate(-20 -14 -15)"
              />
              <ellipse
                cx="14"
                cy="-15"
                rx="2.5"
                ry="3"
                fill="#fbcfe8"
                opacity="0.7"
                transform="rotate(20 14 -15)"
              />

              {/* Stylish Red Hat (Beret-style) */}
              <g filter="url(#hatGlow)">
                {/* Hat crown */}
                <ellipse
                  cx="0"
                  cy="-22"
                  rx="18"
                  ry="8"
                  fill="url(#redHat)"
                  opacity="0.95"
                />

                {/* Hat brim/rim */}
                <ellipse
                  cx="0"
                  cy="-18"
                  rx="20"
                  ry="4"
                  fill="url(#redHat)"
                  opacity="0.98"
                />

                {/* Hat highlight (gives it dimension) */}
                <ellipse
                  cx="-5"
                  cy="-24"
                  rx="8"
                  ry="4"
                  fill="url(#redHatHighlight)"
                  opacity="0.6"
                />

                {/* Cute little pom-pom on top */}
                <circle
                  cx="0"
                  cy="-28"
                  r="2.5"
                  fill="#ef4444"
                  opacity="0.95"
                />
                <circle
                  cx="0"
                  cy="-28"
                  r="1.5"
                  fill="#fca5a5"
                  opacity="0.7"
                />
              </g>

              {/* Big Friendly Eyes - Warm & Savvy */}
              <g>
                {/* Left eye */}
                <ellipse cx="-7" cy="-8" rx="3.5" ry="4.5" fill="#1c1917" opacity="0.9"/>
                {/* Eye white highlight */}
                <ellipse cx="-7" cy="-9" rx="2.5" ry="3" fill="#ffffff" opacity="0.15"/>
                {/* Double sparkle for cuteness */}
                <circle cx="-5.5" cy="-9.5" r="1.3" fill="#ffffff" opacity="0.95"/>
                <circle cx="-6.5" cy="-7" r="0.7" fill="#fef3c7" opacity="0.8"/>

                {/* Right eye */}
                <ellipse cx="7" cy="-8" rx="3.5" ry="4.5" fill="#1c1917" opacity="0.9"/>
                {/* Eye white highlight */}
                <ellipse cx="7" cy="-9" rx="2.5" ry="3" fill="#ffffff" opacity="0.15"/>
                {/* Double sparkle for cuteness */}
                <circle cx="8.5" cy="-9.5" r="1.3" fill="#ffffff" opacity="0.95"/>
                <circle cx="7.5" cy="-7" r="0.7" fill="#fef3c7" opacity="0.8"/>
              </g>

              {/* Gentle Smile - Warming Expression */}
              <path
                d="M -5 -1 Q 0 1, 5 -1"
                stroke="#1c1917"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                opacity="0.7"
              />

              {/* Cute Hippo Snout/Muzzle */}
              <ellipse cx="0" cy="2" rx="8" ry="7" fill="url(#warmAccent)" opacity="0.5"/>
              <ellipse cx="0" cy="3" rx="6" ry="5" fill="#fef3c7" opacity="0.3"/>

              {/* Adorable Nostrils */}
              <ellipse cx="-3" cy="3" rx="1.5" ry="1.8" fill="#1c1917" opacity="0.6"/>
              <ellipse cx="3" cy="3" rx="1.5" ry="1.8" fill="#1c1917" opacity="0.6"/>
              {/* Nostril highlights */}
              <ellipse cx="-2.5" cy="2.5" rx="0.6" ry="0.7" fill="#ffffff" opacity="0.3"/>
              <ellipse cx="3.5" cy="2.5" rx="0.6" ry="0.7" fill="#ffffff" opacity="0.3"/>

              {/* Chubby Cheeks - Extra Cuteness */}
              <circle cx="-11" cy="-2" r="4" fill="#f9a8d4" opacity="0.3"/>
              <circle cx="11" cy="-2" r="4" fill="#f9a8d4" opacity="0.3"/>

              {/* Cute Little Arms */}
              <ellipse
                cx="-18"
                cy="12"
                rx="4"
                ry="6"
                fill="url(#warmAccent)"
                opacity="0.8"
                transform="rotate(-25 -18 12)"
              />
              <ellipse
                cx="18"
                cy="12"
                rx="4"
                ry="6"
                fill="url(#warmAccent)"
                opacity="0.8"
                transform="rotate(25 18 12)"
              />

              {/* Adorable Little Feet/Legs */}
              <ellipse cx="-8" cy="23" rx="5" ry="4" fill="url(#warmAccent)" opacity="0.85"/>
              <ellipse cx="8" cy="23" rx="5" ry="4" fill="url(#warmAccent)" opacity="0.85"/>

              {/* Toe details */}
              <circle cx="-10" cy="24" r="1.2" fill="#fbcfe8" opacity="0.6"/>
              <circle cx="-8" cy="24.5" r="1.2" fill="#fbcfe8" opacity="0.6"/>
              <circle cx="-6" cy="24" r="1.2" fill="#fbcfe8" opacity="0.6"/>
              <circle cx="6" cy="24" r="1.2" fill="#fbcfe8" opacity="0.6"/>
              <circle cx="8" cy="24.5" r="1.2" fill="#fbcfe8" opacity="0.6"/>
              <circle cx="10" cy="24" r="1.2" fill="#fbcfe8" opacity="0.6"/>

              {/* Special Touch: Tiny Heart Detail (showing warmth & good taste) */}
              <g opacity="0.5">
                <path
                  d="M 0 -3
                     L -0.8 -4
                     C -1.2 -4.4, -1.2 -5, -0.8 -5.4
                     C -0.4 -5.8, 0 -5.6, 0 -5
                     C 0 -5.6, 0.4 -5.8, 0.8 -5.4
                     C 1.2 -5, 1.2 -4.4, 0.8 -4
                     Z"
                  fill="#f472b6"
                  opacity="0.6"
                />
              </g>

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
            {/* Premium intertwining curves with warm colors */}
            <path
              d="M 42 58 Q 68 46, 94 56 Q 122 66, 148 56"
              stroke="url(#aeWarm)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              d="M 48 52 Q 73 62, 98 52 Q 125 42, 152 52"
              stroke="url(#aeWarm2)"
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
              <linearGradient id="aeWarm" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="25%" stopColor="#f472b6" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="75%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="aeWarm2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="33%" stopColor="#fbbf24" />
                <stop offset="66%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="aeShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="50%" stopColor="#fce7f3" />
                <stop offset="100%" stopColor="#fffbeb" />
              </linearGradient>
            </defs>
          </svg>
          <span
            className="relative z-10 bg-gradient-to-r from-amber-400 via-pink-400 to-red-400 bg-clip-text text-transparent drop-shadow-sm"
            style={{fontWeight: 900}}
          >
            AESOP
          </span>
        </div>
        <span className={`tracking-widest text-pink-500 font-black ${sizeConfig.subtext} drop-shadow-sm`}>
          BLOG
        </span>
      </div>
    </div>
  );
}
