interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        className={`${sizes[size]} w-auto`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer hexagon */}
        <path
          d="M24 2L42 13V35L24 46L6 35V13L24 2Z"
          className="stroke-cyber-500"
          strokeWidth="2"
          fill="url(#logo-gradient)"
        />

        {/* Inner hexagon */}
        <path
          d="M24 10L36 17V31L24 38L12 31V17L24 10Z"
          className="stroke-neon-500"
          strokeWidth="1.5"
          fill="none"
        />

        {/* A letter stylized */}
        <path
          d="M24 18L28 28H26L25 25H23L22 28H20L24 18Z"
          className="fill-cyber-50"
        />
        <circle cx="24" cy="22" r="1.5" className="fill-neon-400" />

        {/* Circuit lines */}
        <line x1="24" y1="2" x2="24" y2="10" className="stroke-cyber-400" strokeWidth="1" />
        <line x1="24" y1="38" x2="24" y2="46" className="stroke-cyber-400" strokeWidth="1" />
        <line x1="6" y1="13" x2="12" y2="17" className="stroke-neon-400" strokeWidth="1" />
        <line x1="42" y1="13" x2="36" y2="17" className="stroke-neon-400" strokeWidth="1" />

        {/* Corner dots */}
        <circle cx="24" cy="2" r="1.5" className="fill-neon-400 animate-pulse-slow" />
        <circle cx="42" cy="13" r="1.5" className="fill-cyber-400 animate-pulse-slow" />
        <circle cx="42" cy="35" r="1.5" className="fill-neon-400 animate-pulse-slow" />
        <circle cx="24" cy="46" r="1.5" className="fill-cyber-400 animate-pulse-slow" />
        <circle cx="6" cy="35" r="1.5" className="fill-neon-400 animate-pulse-slow" />
        <circle cx="6" cy="13" r="1.5" className="fill-cyber-400 animate-pulse-slow" />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="logo-gradient" x1="24" y1="2" x2="24" y2="46">
            <stop offset="0%" className="stop-cyber-900/10" />
            <stop offset="50%" className="stop-neon-900/5" />
            <stop offset="100%" className="stop-cyber-900/20" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col">
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-cyber-500 via-neon-500 to-cyber-600 bg-clip-text text-transparent">
          AESOP
        </span>
        <span className="text-xs tracking-widest text-cyber-400 -mt-1">BLOG</span>
      </div>
    </div>
  );
}
