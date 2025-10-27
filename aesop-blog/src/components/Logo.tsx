interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'simple';
}

export default function Logo({ className = '', size = 'md', variant = 'default' }: LogoProps) {
  const sizes = {
    sm: { container: 'h-10', text: 'text-xl', subtext: 'text-[8px]' },
    md: { container: 'h-14', text: 'text-2xl', subtext: 'text-[10px]' },
    lg: { container: 'h-20', text: 'text-4xl', subtext: 'text-xs' },
  };

  const sizeConfig = sizes[size];

  if (variant === 'simple') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`${sizeConfig.container} aspect-square relative`}>
          <svg
            className="w-full h-full"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer rotating ring */}
            <circle
              cx="32"
              cy="32"
              r="28"
              className="stroke-cyan-400"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 4"
              opacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 32 32"
                to="360 32 32"
                dur="20s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Middle pulsing ring */}
            <circle
              cx="32"
              cy="32"
              r="20"
              className="stroke-neon-400"
              strokeWidth="2"
              fill="none"
            >
              <animate
                attributeName="r"
                values="20;22;20"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Inner glowing core */}
            <circle
              cx="32"
              cy="32"
              r="16"
              className="fill-gradient-to-br from-cyber-500 to-neon-500"
              filter="url(#glow)"
            />

            {/* Letter A with circuit design */}
            <path
              d="M32 20L38 36H36L34.5 32H29.5L28 36H26L32 20Z M30.5 30H33.5L32 26L30.5 30Z"
              className="fill-white"
              strokeWidth="0.5"
              stroke="white"
            />

            {/* Digital elements */}
            <circle cx="32" cy="24" r="1.5" className="fill-cyan-300 animate-pulse" />
            <line x1="32" y1="15" x2="32" y2="18" className="stroke-cyan-400" strokeWidth="1.5" />
            <line x1="32" y1="46" x2="32" y2="49" className="stroke-neon-400" strokeWidth="1.5" />
            <line x1="15" y1="32" x2="18" y2="32" className="stroke-cyan-400" strokeWidth="1.5" />
            <line x1="46" y1="32" x2="49" y2="32" className="stroke-neon-400" strokeWidth="1.5" />

            {/* Corner accents */}
            <path d="M 8 8 L 12 8 L 12 12" className="stroke-cyan-400" strokeWidth="2" fill="none" />
            <path d="M 56 8 L 52 8 L 52 12" className="stroke-neon-400" strokeWidth="2" fill="none" />
            <path d="M 8 56 L 12 56 L 12 52" className="stroke-neon-400" strokeWidth="2" fill="none" />
            <path d="M 56 56 L 52 56 L 52 52" className="stroke-cyan-400" strokeWidth="2" fill="none" />

            {/* Gradient and filter definitions */}
            <defs>
              <linearGradient id="logo-gradient-simple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="stop-color-cyan-500" />
                <stop offset="100%" className="stop-color-neon-500" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tight bg-gradient-to-r from-cyan-400 via-neon-400 to-cyan-500 bg-clip-text text-transparent ${sizeConfig.text}`}>
            AESOP
          </span>
          <span className={`tracking-[0.3em] text-cyan-300 font-bold ${sizeConfig.subtext}`}>
            BLOG
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeConfig.container} aspect-square relative`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer rotating ring */}
          <circle
            cx="32"
            cy="32"
            r="28"
            className="stroke-cyan-400"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4 4"
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 32 32"
              to="360 32 32"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Middle pulsing ring */}
          <circle
            cx="32"
            cy="32"
            r="20"
            className="stroke-neon-400"
            strokeWidth="2"
            fill="none"
          >
            <animate
              attributeName="r"
              values="20;22;20"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0.8;0.4"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Inner glowing core */}
          <circle
            cx="32"
            cy="32"
            r="16"
            fill="url(#logo-gradient)"
            filter="url(#glow)"
          />

          {/* Letter A with circuit design */}
          <path
            d="M32 20L38 36H36L34.5 32H29.5L28 36H26L32 20Z M30.5 30H33.5L32 26L30.5 30Z"
            className="fill-white"
            strokeWidth="0.5"
            stroke="white"
          />

          {/* Digital elements */}
          <circle cx="32" cy="24" r="1.5" className="fill-cyan-300 animate-pulse" />
          <line x1="32" y1="15" x2="32" y2="18" className="stroke-cyan-400" strokeWidth="1.5" />
          <line x1="32" y1="46" x2="32" y2="49" className="stroke-neon-400" strokeWidth="1.5" />
          <line x1="15" y1="32" x2="18" y2="32" className="stroke-cyan-400" strokeWidth="1.5" />
          <line x1="46" y1="32" x2="49" y2="32" className="stroke-neon-400" strokeWidth="1.5" />

          {/* Corner accents */}
          <path d="M 8 8 L 12 8 L 12 12" className="stroke-cyan-400" strokeWidth="2" fill="none" />
          <path d="M 56 8 L 52 8 L 52 12" className="stroke-neon-400" strokeWidth="2" fill="none" />
          <path d="M 8 56 L 12 56 L 12 52" className="stroke-neon-400" strokeWidth="2" fill="none" />
          <path d="M 56 56 L 52 56 L 52 52" className="stroke-cyan-400" strokeWidth="2" fill="none" />

          {/* Gradient and filter definitions */}
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-black tracking-tight bg-gradient-to-r from-cyan-400 via-neon-400 to-cyan-500 bg-clip-text text-transparent ${sizeConfig.text}`}>
          AESOP
        </span>
        <span className={`tracking-[0.3em] text-cyan-300 font-bold ${sizeConfig.subtext}`}>
          BLOG
        </span>
      </div>
    </div>
  );
}
