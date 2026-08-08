export default function MarbleBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-ink ${className}`}>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="marbleTexture" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.004"
              numOctaves={5}
              seed={12}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.009 0.004;0.011 0.005;0.009 0.004"
                dur="50s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      1.4 1.4 1.4 0 -1.1"
              result="veins"
            />
            <feComponentTransfer in="veins" result="veinsSharp">
              <feFuncA type="gamma" exponent="3.5" amplitude="1" offset="0" />
            </feComponentTransfer>
            <feFlood floodColor="#e8e2d5" result="veinColor" />
            <feComposite in="veinColor" in2="veinsSharp" operator="in" result="veinsFinal" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="veinsFinal" />
            </feMerge>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#0a0a0a" />
        <rect width="100%" height="100%" fill="#0a0a0a" filter="url(#marbleTexture)" opacity="0.9" />
      </svg>

      {/* Warm gold catch-light + gentle vignette on top */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 90%, rgba(201,163,86,0.08), transparent 60%), " +
            "radial-gradient(ellipse 60% 50% at 15% 10%, rgba(255,255,255,0.05), transparent 55%)",
        }}
      />
      <div className="absolute inset-0 bg-ink/25" />
    </div>
  );
}
