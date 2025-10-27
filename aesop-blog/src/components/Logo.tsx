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
      {/* Eagle Silhouette Logo */}
      <div className={`${sizeConfig.container} aspect-square relative`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background glow layer */}
          <circle cx="50" cy="45" r="35" fill="url(#bgGlow)" opacity="0.3" />

          {/* Back wing - Layer 1 (deepest) */}
          <path
            d="M 30 60 Q 20 50 15 40 Q 12 30 18 25 Q 25 22 35 28 L 45 40 Z"
            fill="url(#wingGradient1)"
            opacity="0.6"
          >
            <animate attributeName="d"
              values="M 30 60 Q 20 50 15 40 Q 12 30 18 25 Q 25 22 35 28 L 45 40 Z;
                      M 30 60 Q 18 48 13 38 Q 10 28 16 23 Q 23 20 33 26 L 45 40 Z;
                      M 30 60 Q 20 50 15 40 Q 12 30 18 25 Q 25 22 35 28 L 45 40 Z"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>

          {/* Back wing right - Layer 1 */}
          <path
            d="M 70 60 Q 80 50 85 40 Q 88 30 82 25 Q 75 22 65 28 L 55 40 Z"
            fill="url(#wingGradient2)"
            opacity="0.6"
          >
            <animate attributeName="d"
              values="M 70 60 Q 80 50 85 40 Q 88 30 82 25 Q 75 22 65 28 L 55 40 Z;
                      M 70 60 Q 82 48 87 38 Q 90 28 84 23 Q 77 20 67 26 L 55 40 Z;
                      M 70 60 Q 80 50 85 40 Q 88 30 82 25 Q 75 22 65 28 L 55 40 Z"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>

          {/* Front wing left - Layer 2 */}
          <path
            d="M 35 55 Q 22 45 12 35 Q 8 25 14 18 Q 22 14 35 22 L 48 38 Z"
            fill="url(#wingGradient3)"
            opacity="0.8"
          >
            <animate attributeName="d"
              values="M 35 55 Q 22 45 12 35 Q 8 25 14 18 Q 22 14 35 22 L 48 38 Z;
                      M 35 55 Q 20 43 10 33 Q 6 23 12 16 Q 20 12 33 20 L 48 38 Z;
                      M 35 55 Q 22 45 12 35 Q 8 25 14 18 Q 22 14 35 22 L 48 38 Z"
              dur="3s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </path>

          {/* Front wing right - Layer 2 */}
          <path
            d="M 65 55 Q 78 45 88 35 Q 92 25 86 18 Q 78 14 65 22 L 52 38 Z"
            fill="url(#wingGradient4)"
            opacity="0.8"
          >
            <animate attributeName="d"
              values="M 65 55 Q 78 45 88 35 Q 92 25 86 18 Q 78 14 65 22 L 52 38 Z;
                      M 65 55 Q 80 43 90 33 Q 94 23 88 16 Q 80 12 67 20 L 52 38 Z;
                      M 65 55 Q 78 45 88 35 Q 92 25 86 18 Q 78 14 65 22 L 52 38 Z"
              dur="3s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </path>

          {/* Eagle body - Layer 3 */}
          <ellipse cx="50" cy="48" rx="12" ry="18" fill="url(#bodyGradient)" />
          <path
            d="M 45 48 Q 50 52 55 48 L 52 65 Q 50 70 48 65 Z"
            fill="url(#tailGradient)"
          />

          {/* Eagle head - Layer 4 */}
          <circle cx="50" cy="32" r="8" fill="url(#headGradient)" />

          {/* Beak */}
          <path
            d="M 58 32 L 65 30 L 62 33 Z"
            fill="url(#beakGradient)"
          />

          {/* Eye */}
          <circle cx="53" cy="31" r="1.5" fill="#1e293b" />
          <circle cx="53.5" cy="30.5" r="0.7" fill="#fbbf24" className="animate-pulse" />

          {/* Crown/Head feathers */}
          <path
            d="M 48 26 Q 50 22 52 26"
            stroke="url(#crownGradient)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Accent feathers on wings */}
          <path d="M 25 35 Q 30 38 35 40" stroke="#f59e0b" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
          <path d="M 75 35 Q 70 38 65 40" stroke="#f59e0b" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
          <path d="M 20 30 Q 28 34 35 36" stroke="#ec4899" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
          <path d="M 80 30 Q 72 34 65 36" stroke="#ec4899" strokeWidth="1" opacity="0.6" strokeLinecap="round" />

          {/* Gradients */}
          <defs>
            {/* Background glow */}
            <radialGradient id="bgGlow">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>

            {/* Wing gradients - vibrant colors */}
            <linearGradient id="wingGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>

            <linearGradient id="wingGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            <linearGradient id="wingGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>

            <linearGradient id="wingGradient4" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d946ef" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>

            {/* Body gradients */}
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            <linearGradient id="tailGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>

            <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="beakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
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
