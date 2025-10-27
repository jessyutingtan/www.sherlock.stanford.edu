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

  // HIPPO LOGO v3.0 - Minimalist, clean, line-based friendly design
  return (
    <div className={`flex items-center ${sizeConfig.gap} ${className}`}>
      {/* Minimalist Red-Hat Hippo with Scroll - Clean & Friendly */}
      <div className={`${sizeConfig.container} aspect-square relative group`}>
        <svg
          className="w-full h-full transition-all duration-500 ease-out group-hover:scale-105"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Minimalist Hippo Design - Clean, Line-Based, Friendly */}
          <defs>
            {/* Light neutral beige background */}
            <radialGradient id="lightBg" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fdfcfb" />
              <stop offset="100%" stopColor="#f7f6f4" />
            </radialGradient>
          </defs>

          {/* Light beige background */}
          <rect x="0" y="0" width="100" height="100" fill="url(#lightBg)" rx="12"/>

          {/* Centered hippo composition */}
          <g transform="translate(50, 50)">

            {/* HIPPO BODY - Broad, soft, rounded oval shape */}
            <g>
              {/* Main body - circular/oval shape, light grey */}
              <ellipse
                cx="0"
                cy="5"
                rx="20"
                ry="24"
                fill="#d1d1d1"
                stroke="#2d2d2d"
                strokeWidth="1.5"
              />

              {/* HEAD - merges smoothly into body */}
              <circle
                cx="0"
                cy="-10"
                r="16"
                fill="#d1d1d1"
                stroke="#2d2d2d"
                strokeWidth="1.5"
              />

              {/* EARS - Small, rounded, cup-like with inner line */}
              {/* Left ear */}
              <g>
                <ellipse
                  cx="-11"
                  cy="-20"
                  rx="4.5"
                  ry="5.5"
                  fill="#d1d1d1"
                  stroke="#2d2d2d"
                  strokeWidth="1.5"
                />
                {/* Inner ear detail */}
                <ellipse
                  cx="-11"
                  cy="-19"
                  rx="2"
                  ry="2.5"
                  fill="none"
                  stroke="#2d2d2d"
                  strokeWidth="1"
                />
              </g>

              {/* Right ear */}
              <g>
                <ellipse
                  cx="11"
                  cy="-20"
                  rx="4.5"
                  ry="5.5"
                  fill="#d1d1d1"
                  stroke="#2d2d2d"
                  strokeWidth="1.5"
                />
                {/* Inner ear detail */}
                <ellipse
                  cx="11"
                  cy="-19"
                  rx="2"
                  ry="2.5"
                  fill="none"
                  stroke="#2d2d2d"
                  strokeWidth="1"
                />
              </g>

              {/* EYES - Perfectly round, solid black pupils, dewy innocent look */}
              <circle cx="-6" cy="-12" r="2.5" fill="#000000"/>
              <circle cx="6" cy="-12" r="2.5" fill="#000000"/>

              {/* Optional: tiny white highlight for dewy effect */}
              <circle cx="-5.2" cy="-12.8" r="0.8" fill="#ffffff" opacity="0.9"/>
              <circle cx="6.8" cy="-12.8" r="0.8" fill="#ffffff" opacity="0.9"/>

              {/* SNOUT - Broad, rounded area */}
              <ellipse
                cx="0"
                cy="-5"
                rx="8"
                ry="6"
                fill="#c4c4c4"
                stroke="#2d2d2d"
                strokeWidth="1.5"
              />

              {/* NOSTRILS - Two small oval shapes, horizontal */}
              <ellipse cx="-3" cy="-5" rx="1.2" ry="1.8" fill="#2d2d2d"/>
              <ellipse cx="3" cy="-5" rx="1.2" ry="1.8" fill="#2d2d2d"/>

              {/* MOUTH - Wide, gentle, upward-curving smile */}
              <path
                d="M -6 -1 Q 0 1.5, 6 -1"
                stroke="#2d2d2d"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* SIMPLE ARMS holding scroll */}
              {/* Left arm */}
              <path
                d="M -18 10 Q -22 14, -20 18"
                stroke="#2d2d2d"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Right arm */}
              <path
                d="M 18 10 Q 22 14, 20 18"
                stroke="#2d2d2d"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />

            </g>

            {/* SCROLL - Held by hippo, rests on belly */}
            <g transform="translate(0, 18)">
              {/* Main scroll body - parchment beige */}
              <rect
                x="-18"
                y="-5"
                width="36"
                height="10"
                fill="#f5ead6"
                stroke="#2d2d2d"
                strokeWidth="1.5"
              />

              {/* Left scroll roll/spiral */}
              <ellipse cx="-18" cy="0" rx="3" ry="5" fill="#e8dcc4" stroke="#2d2d2d" strokeWidth="1.5"/>
              <ellipse cx="-17" cy="0" rx="1.5" ry="4" fill="#f5ead6" stroke="#2d2d2d" strokeWidth="1"/>

              {/* Right scroll roll/spiral */}
              <ellipse cx="18" cy="0" rx="3" ry="5" fill="#e8dcc4" stroke="#2d2d2d" strokeWidth="1.5"/>
              <ellipse cx="19" cy="0" rx="1.5" ry="4" fill="#f5ead6" stroke="#2d2d2d" strokeWidth="1"/>

              {/* Text lines on scroll - horizontal parallel lines */}
              <line x1="-14" y1="-2.5" x2="-2" y2="-2.5" stroke="#2d2d2d" strokeWidth="0.8"/>
              <line x1="-14" y1="0" x2="10" y2="0" stroke="#2d2d2d" strokeWidth="0.8"/>
              <line x1="-14" y1="2.5" x2="6" y2="2.5" stroke="#2d2d2d" strokeWidth="0.8"/>
            </g>

            {/* RED CONICAL PARTY HAT - Tilted to viewer's right */}
            <g transform="translate(3, -22) rotate(15)">
              {/* Hat cone - vibrant red */}
              <path
                d="M -6 0 L 0 -16 L 6 0 Z"
                fill="#e63946"
                stroke="#2d2d2d"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hat base/brim */}
              <ellipse
                cx="0"
                cy="0"
                rx="6.5"
                ry="1.5"
                fill="#d62828"
                stroke="#2d2d2d"
                strokeWidth="1.5"
              />

              {/* White pom-pom at tip */}
              <circle
                cx="0"
                cy="-16"
                r="2"
                fill="#ffffff"
                stroke="#2d2d2d"
                strokeWidth="1.5"
              />

              {/* Optional: Small shadow/detail on hat for dimension */}
              <path
                d="M -4 0 L 0 -14 L 4 0"
                fill="none"
                stroke="#c41e3a"
                strokeWidth="1"
                opacity="0.4"
              />
            </g>

          </g>
        </svg>
      </div>

      {/* Text - AESOP with warm friendly styling */}
      <div className="flex items-baseline gap-3">
        <div className={`font-black tracking-tight ${sizeConfig.text} relative`}>
          <span
            className="relative z-10 bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent drop-shadow-sm"
            style={{fontWeight: 900}}
          >
            AESOP
          </span>
        </div>
        <span className={`tracking-widest text-red-500 font-black ${sizeConfig.subtext} drop-shadow-sm`}>
          BLOG
        </span>
      </div>
    </div>
  );
}
