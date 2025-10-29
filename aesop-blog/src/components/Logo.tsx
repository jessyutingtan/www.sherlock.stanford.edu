interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { container: 'h-12 w-16', text: 'text-2xl', subtext: 'text-xs', gap: 'gap-2' },
    md: { container: 'h-16 w-20', text: 'text-4xl', subtext: 'text-sm', gap: 'gap-3' },
    lg: { container: 'h-24 w-32', text: 'text-5xl', subtext: 'text-lg', gap: 'gap-4' },
    xl: { container: 'h-32 w-40', text: 'text-7xl', subtext: 'text-2xl', gap: 'gap-5' },
  };

  const sizeConfig = sizes[size];

  // Intertwined A+E Logo - Simple, Bold, Clear
  return (
    <div className={`flex items-center ${sizeConfig.gap} ${className}`}>
      {/* Intertwined A and E Logo */}
      <div className={`${sizeConfig.container} relative group`}>
        <svg
          className="w-full h-full transition-all duration-300 ease-out group-hover:scale-105"
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background for contrast */}
          <rect x="0" y="0" width="120" height="100" fill="transparent" rx="8"/>

          {/* Letter A - Left Side */}
          <g>
            {/* A's left stroke - diagonal from bottom to top */}
            <line
              x1="15"
              y1="85"
              x2="42"
              y2="20"
              stroke="#8B5CF6"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* A's crossbar */}
            <line
              x1="22"
              y1="60"
              x2="42"
              y2="60"
              stroke="#EC4899"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>

          {/* SHARED VERTICAL LINE - This is BOTH A's right side AND E's left side */}
          <line
            x1="42"
            y1="20"
            x2="42"
            y2="85"
            stroke="#F97316"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Letter E - Right Side (all bars extend from the shared line) */}
          <g>
            {/* E's top bar */}
            <line
              x1="42"
              y1="20"
              x2="75"
              y2="20"
              stroke="#8B5CF6"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* E's middle bar */}
            <line
              x1="42"
              y1="52.5"
              x2="70"
              y2="52.5"
              stroke="#EC4899"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* E's bottom bar */}
            <line
              x1="42"
              y1="85"
              x2="75"
              y2="85"
              stroke="#8B5CF6"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>

          {/* Fusion point markers - emphasize the connection */}
          <circle
            cx="42"
            cy="20"
            r="6"
            fill="#EC4899"
          />
          <circle
            cx="42"
            cy="85"
            r="6"
            fill="#EC4899"
          />

          {/* Small accent at middle to show continuity */}
          <circle
            cx="42"
            cy="52.5"
            r="4"
            fill="#F97316"
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
