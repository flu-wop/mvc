export default function FlowerDivider() {
  return (
    <div className="flex items-center justify-center py-2" aria-hidden="true">
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none">
        <line x1="0" y1="12" x2="42" y2="12" stroke="currentColor" strokeOpacity="0.25" />
        <g transform="translate(60,12)">
          <circle r="2.5" fill="currentColor" fillOpacity="0.5" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-6"
              rx="2.2"
              ry="5"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.35"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>
        <line x1="78" y1="12" x2="120" y2="12" stroke="currentColor" strokeOpacity="0.25" />
      </svg>
    </div>
  );
}
