/**
 * Animated hero illustration — Solana/Superteam theme: nodes, rocket, building blocks.
 * Uses CSS animations (float, pulse) for a living feel without JS.
 */
const HeroIllustration = () => {
  return (
    <div
      className="relative w-full max-w-[480px] mx-auto lg:mx-0 lg:max-w-none aspect-square flex items-center justify-center animate-hero-illustration-in opacity-0"
      style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
      aria-hidden
    >
      {/* Glow behind illustration */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-90 animate-hero-orb-pulse" />

      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="hero-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(257 85% 68%)" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="hero-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
          </linearGradient>
          <filter id="hero-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Floating orbit rings */}
        <ellipse
          cx="200"
          cy="200"
          rx="140"
          ry="50"
          stroke="hsl(var(--primary) / 0.25)"
          strokeWidth="1"
          fill="none"
          className="origin-center animate-float-slow"
          style={{ animationDelay: "0s" }}
        />
        <ellipse
          cx="200"
          cy="200"
          rx="120"
          ry="45"
          stroke="hsl(var(--primary) / 0.15)"
          strokeWidth="1"
          fill="none"
          className="origin-center animate-float-slower"
          style={{ animationDelay: "1s" }}
        />

        {/* Central rocket / build icon */}
        <g filter="url(#hero-glow)" className="origin-center animate-float">
          <path
            d="M200 140 L220 200 L200 220 L180 200 Z"
            fill="url(#hero-grad-1)"
            className="transition-opacity duration-300"
          />
          <path
            d="M200 160 L210 195 L200 205 L190 195 Z"
            fill="hsl(var(--background))"
            fillOpacity="0.4"
          />
          <path
            d="M185 200 L200 230 L215 200"
            fill="hsl(var(--primary) / 0.4)"
          />
        </g>

        {/* Orbiting nodes */}
        {[
          { cx: 100, cy: 180, delay: "0s" },
          { cx: 300, cy: 185, delay: "0.5s" },
          { cx: 120, cy: 300, delay: "1s" },
          { cx: 280, cy: 295, delay: "1.5s" },
          { cx: 95, cy: 260, delay: "0.3s" },
          { cx: 305, cy: 255, delay: "0.8s" },
        ].map((node, i) => (
          <g key={i} className="animate-float-slow" style={{ animationDelay: node.delay }}>
            <circle
              cx={node.cx}
              cy={node.cy}
              r="8"
              fill="url(#hero-grad-2)"
              stroke="hsl(var(--primary) / 0.4)"
              strokeWidth="1.5"
            />
            <circle cx={node.cx} cy={node.cy} r="3" fill="hsl(var(--primary))" />
          </g>
        ))}

        {/* Connection lines (subtle) */}
        <path
          d="M200 200 L100 180 M200 200 L300 185 M200 200 L120 300 M200 200 L280 295"
          stroke="hsl(var(--primary) / 0.12)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 6"
        />

        {/* Small sparkles */}
        {[
          { x: 150, y: 150 },
          { x: 250, y: 155 },
          { x: 160, y: 270 },
          { x: 240, y: 265 },
        ].map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r="2"
            fill="hsl(var(--primary))"
            className="animate-pulse-glow"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </svg>
    </div>
  );
};

export default HeroIllustration;
