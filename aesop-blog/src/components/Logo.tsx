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
      {/* Legendary Eagle Logo */}
      <div className={`${sizeConfig.container} aspect-square relative`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Radiant glow background */}
          <circle cx="60" cy="55" r="45" fill="url(#royalGlow)" opacity="0.4">
            <animate attributeName="r" values="45;50;45" dur="4s" repeatCount="indefinite" />
          </circle>

          {/* Lightning bolt accents */}
          <path
            d="M 35 30 L 30 40 L 35 40 L 28 52"
            stroke="url(#lightningGradient)"
            strokeWidth="2"
            opacity="0.6"
            fill="none"
          >
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          </path>
          <path
            d="M 85 30 L 90 40 L 85 40 L 92 52"
            stroke="url(#lightningGradient)"
            strokeWidth="2"
            opacity="0.6"
            fill="none"
          >
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" begin="1s" repeatCount="indefinite" />
          </path>

          {/* Legendary Spread Wings - Left Wing (Full Spread) */}
          <path
            d="M 45 60 Q 35 50 25 42 Q 15 34 8 30 Q 2 25 5 20 Q 10 15 18 18 Q 28 22 35 28 Q 42 35 48 45 Z"
            fill="url(#wingLeft1)"
            opacity="0.7"
            filter="url(#glow)"
          >
            <animate attributeName="d"
              values="M 45 60 Q 35 50 25 42 Q 15 34 8 30 Q 2 25 5 20 Q 10 15 18 18 Q 28 22 35 28 Q 42 35 48 45 Z;
                      M 45 60 Q 33 48 23 40 Q 13 32 6 28 Q 0 23 3 18 Q 8 13 16 16 Q 26 20 33 26 Q 40 33 48 45 Z;
                      M 45 60 Q 35 50 25 42 Q 15 34 8 30 Q 2 25 5 20 Q 10 15 18 18 Q 28 22 35 28 Q 42 35 48 45 Z"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Wing feather details - Left */}
          <path d="M 25 30 Q 20 25 15 22" stroke="url(#featherGold)" strokeWidth="1.5" opacity="0.8" fill="none" />
          <path d="M 30 35 Q 25 30 20 27" stroke="url(#featherGold)" strokeWidth="1.5" opacity="0.8" fill="none" />
          <path d="M 35 40 Q 30 35 25 32" stroke="url(#featherGold)" strokeWidth="1.5" opacity="0.8" fill="none" />

          {/* Legendary Spread Wings - Right Wing */}
          <path
            d="M 75 60 Q 85 50 95 42 Q 105 34 112 30 Q 118 25 115 20 Q 110 15 102 18 Q 92 22 85 28 Q 78 35 72 45 Z"
            fill="url(#wingRight1)"
            opacity="0.7"
            filter="url(#glow)"
          >
            <animate attributeName="d"
              values="M 75 60 Q 85 50 95 42 Q 105 34 112 30 Q 118 25 115 20 Q 110 15 102 18 Q 92 22 85 28 Q 78 35 72 45 Z;
                      M 75 60 Q 87 48 97 40 Q 107 32 114 28 Q 120 23 117 18 Q 112 13 104 16 Q 94 20 87 26 Q 80 33 72 45 Z;
                      M 75 60 Q 85 50 95 42 Q 105 34 112 30 Q 118 25 115 20 Q 110 15 102 18 Q 92 22 85 28 Q 78 35 72 45 Z"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Wing feather details - Right */}
          <path d="M 95 30 Q 100 25 105 22" stroke="url(#featherGold)" strokeWidth="1.5" opacity="0.8" fill="none" />
          <path d="M 90 35 Q 95 30 100 27" stroke="url(#featherGold)" strokeWidth="1.5" opacity="0.8" fill="none" />
          <path d="M 85 40 Q 90 35 95 32" stroke="url(#featherGold)" strokeWidth="1.5" opacity="0.8" fill="none" />

          {/* Front layer wings - Left */}
          <path
            d="M 50 55 Q 38 45 28 38 Q 18 30 12 25 Q 8 20 12 16 Q 18 12 28 16 Q 38 22 46 32 Q 52 42 55 50 Z"
            fill="url(#wingLeft2)"
            opacity="0.9"
          >
            <animate attributeName="d"
              values="M 50 55 Q 38 45 28 38 Q 18 30 12 25 Q 8 20 12 16 Q 18 12 28 16 Q 38 22 46 32 Q 52 42 55 50 Z;
                      M 50 55 Q 36 43 26 36 Q 16 28 10 23 Q 6 18 10 14 Q 16 10 26 14 Q 36 20 44 30 Q 50 40 55 50 Z;
                      M 50 55 Q 38 45 28 38 Q 18 30 12 25 Q 8 20 12 16 Q 18 12 28 16 Q 38 22 46 32 Q 52 42 55 50 Z"
              dur="3.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Front layer wings - Right */}
          <path
            d="M 70 55 Q 82 45 92 38 Q 102 30 108 25 Q 112 20 108 16 Q 102 12 92 16 Q 82 22 74 32 Q 68 42 65 50 Z"
            fill="url(#wingRight2)"
            opacity="0.9"
          >
            <animate attributeName="d"
              values="M 70 55 Q 82 45 92 38 Q 102 30 108 25 Q 112 20 108 16 Q 102 12 92 16 Q 82 22 74 32 Q 68 42 65 50 Z;
                      M 70 55 Q 84 43 94 36 Q 104 28 110 23 Q 114 18 110 14 Q 104 10 94 14 Q 84 20 76 30 Q 70 40 65 50 Z;
                      M 70 55 Q 82 45 92 38 Q 102 30 108 25 Q 112 20 108 16 Q 102 12 92 16 Q 82 22 74 32 Q 68 42 65 50 Z"
              dur="3.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Powerful Eagle Body */}
          <ellipse cx="60" cy="52" rx="14" ry="20" fill="url(#bodyGradient)" />

          {/* Chest armor/feather pattern */}
          <path
            d="M 55 45 Q 60 48 65 45"
            stroke="url(#chestPattern)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 54 50 Q 60 53 66 50"
            stroke="url(#chestPattern)"
            strokeWidth="2"
            fill="none"
          />

          {/* Sharp Talons */}
          <g>
            <path d="M 55 70 L 52 78 L 53 79" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 58 71 L 56 79 L 57 80" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 62 71 L 64 79 L 63 80" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 65 70 L 68 78 L 67 79" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>

          {/* Tail feathers - majestic spread */}
          <path
            d="M 50 65 Q 55 72 50 78 M 60 65 Q 60 73 60 80 M 70 65 Q 65 72 70 78"
            stroke="url(#tailGradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Legendary Eagle Head */}
          <circle cx="60" cy="35" r="10" fill="url(#headGradient)" />

          {/* Fierce Beak - Hooked */}
          <path
            d="M 70 35 Q 76 34 78 36 Q 77 38 74 38 Q 72 37 70 36 Z"
            fill="url(#beakGradient)"
            filter="url(#glow)"
          />

          {/* Sharp Eye - Piercing */}
          <ellipse cx="65" cy="33" rx="2" ry="2.5" fill="#1e293b" />
          <circle cx="65.5" cy="32.5" r="1" fill="#fbbf24">
            <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Imperial Crown - Multiple Feathers */}
          <path
            d="M 52 28 Q 54 22 56 28"
            stroke="url(#crownGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 58 26 Q 60 20 62 26"
            stroke="url(#crownGradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 64 28 Q 66 22 68 28"
            stroke="url(#crownGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Crown jewel */}
          <circle cx="60" cy="20" r="2" fill="#fbbf24">
            <animate attributeName="r" values="2;2.5;2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="20" r="1" fill="#fef3c7" className="animate-pulse" />

          {/* Energy aura rings */}
          <circle cx="60" cy="55" r="40" stroke="url(#auraGradient)" strokeWidth="1" fill="none" opacity="0.3">
            <animate attributeName="r" values="38;42;38" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
          </circle>

          {/* Gradients */}
          <defs>
            {/* Royal glow */}
            <radialGradient id="royalGlow">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#7c3aed" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
            </radialGradient>

            {/* Lightning */}
            <linearGradient id="lightningGradient">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Wing gradients - Royal colors */}
            <linearGradient id="wingLeft1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>

            <linearGradient id="wingRight1" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>

            <linearGradient id="wingLeft2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            <linearGradient id="wingRight2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            <linearGradient id="featherGold">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Body - Royal gold */}
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="chestPattern">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>

            <linearGradient id="tailGradient">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            {/* Head - Golden crown */}
            <radialGradient id="headGradient">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>

            <linearGradient id="beakGradient">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="crownGradient">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>

            <linearGradient id="auraGradient">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
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
