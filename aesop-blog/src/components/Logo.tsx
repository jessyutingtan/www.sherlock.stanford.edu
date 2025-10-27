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
      {/* Adorable Fox Logo */}
      <div className={`${sizeConfig.container} aspect-square relative`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle warm glow */}
          <circle cx="50" cy="50" r="35" fill="url(#warmGlow)" opacity="0.15" />

          {/* Left Ear */}
          <path
            d="M 35 25 L 30 15 L 40 20 Z"
            fill="url(#foxOrange)"
          />
          {/* Inner left ear */}
          <path
            d="M 35 25 L 33 18 L 37 22 Z"
            fill="url(#foxCream)"
          />

          {/* Right Ear */}
          <path
            d="M 65 25 L 70 15 L 60 20 Z"
            fill="url(#foxOrange)"
          />
          {/* Inner right ear */}
          <path
            d="M 65 25 L 67 18 L 63 22 Z"
            fill="url(#foxCream)"
          />

          {/* Fox Head - rounded */}
          <circle cx="50" cy="45" r="18" fill="url(#foxOrange)" />

          {/* White cheek patches */}
          <circle cx="40" cy="48" r="6" fill="url(#foxCream)" opacity="0.9" />
          <circle cx="60" cy="48" r="6" fill="url(#foxCream)" opacity="0.9" />

          {/* Snout area */}
          <ellipse cx="50" cy="52" rx="8" ry="6" fill="url(#foxCream)" />

          {/* Cute nose */}
          <ellipse cx="50" cy="53" rx="3" ry="2.5" fill="#dc2626" />

          {/* Eyes - big and adorable */}
          <ellipse cx="43" cy="42" rx="2.5" ry="3" fill="#1e293b" />
          <circle cx="43.5" cy="41" r="1" fill="#fef3c7" />

          <ellipse cx="57" cy="42" rx="2.5" ry="3" fill="#1e293b" />
          <circle cx="57.5" cy="41" r="1" fill="#fef3c7" />

          {/* Smile */}
          <path
            d="M 46 56 Q 50 58 54 56"
            stroke="#dc2626"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />

          {/* Fox Body */}
          <ellipse cx="50" cy="70" rx="14" ry="12" fill="url(#foxOrange)" />

          {/* Body white patch */}
          <ellipse cx="50" cy="72" rx="8" ry="7" fill="url(#foxCream)" opacity="0.8" />

          {/* Fluffy tail */}
          <path
            d="M 60 70 Q 70 68 75 65 Q 78 63 77 60 Q 75 58 70 60 Q 65 63 62 67 Z"
            fill="url(#foxOrange)"
          />
          {/* Tail tip - white */}
          <circle cx="75" cy="62" r="4" fill="#fef3c7" opacity="0.9" />

          {/* Paws */}
          <ellipse cx="42" cy="80" rx="3" ry="4" fill="url(#foxOrange)" />
          <ellipse cx="58" cy="80" rx="3" ry="4" fill="url(#foxOrange)" />

          {/* Gradients - Warm colors only, NO blue */}
          <defs>
            <radialGradient id="warmGlow">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="foxOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            <linearGradient id="foxCream" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text - AESOP with elegantly linked AE */}
      <div className="flex items-baseline gap-3">
        <div className={`font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent ${sizeConfig.text} relative`}>
          {/* A and E with elegant connection */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ zIndex: 0 }}
          >
            {/* Connection line between A and E */}
            <path
              d="M 35 45 L 65 45"
              stroke="url(#aeGradient)"
              strokeWidth="3"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="aeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ position: 'relative', zIndex: 1 }}>AESOP</span>
        </div>
        <span className={`tracking-widest text-orange-400 font-bold ${sizeConfig.subtext}`}>
          BLOG
        </span>
      </div>
    </div>
  );
}
