interface DistrictShape {
  id: string;
  name: string;
  path: string;
  labelX: number;
  labelY: number;
}

// Simplified SVG paths for Oslo's 16 districts
const districtShapes: DistrictShape[] = [
  {
    id: "vestre-aker",
    name: "VESTRE AKER",
    path: "M 80 80 L 155 55 L 210 70 L 240 110 L 260 160 L 250 220 L 220 270 L 175 290 L 130 270 L 95 230 L 60 190 L 50 140 Z",
    labelX: 155,
    labelY: 175,
  },
  {
    id: "nordre-aker",
    name: "NORDRE AKER",
    path: "M 210 70 L 280 50 L 350 55 L 380 80 L 370 130 L 350 180 L 310 210 L 260 220 L 250 220 L 260 160 L 240 110 Z",
    labelX: 300,
    labelY: 135,
  },
  {
    id: "sagene",
    name: "SAGENE",
    path: "M 310 210 L 350 180 L 370 200 L 380 240 L 360 270 L 330 280 L 300 270 L 280 240 Z",
    labelX: 330,
    labelY: 240,
  },
  {
    id: "grorud",
    name: "GRORUD",
    path: "M 380 80 L 450 60 L 520 70 L 540 100 L 530 140 L 510 180 L 480 200 L 440 210 L 410 200 L 390 170 L 370 130 Z",
    labelX: 460,
    labelY: 135,
  },
  {
    id: "stovner",
    name: "STOVNER",
    path: "M 520 70 L 590 55 L 640 80 L 650 130 L 630 170 L 590 190 L 550 195 L 510 180 L 530 140 L 540 100 Z",
    labelX: 580,
    labelY: 130,
  },
  {
    id: "bjerke",
    name: "BJERKE",
    path: "M 370 200 L 390 170 L 410 200 L 440 210 L 460 240 L 450 280 L 420 300 L 390 290 L 360 270 L 380 240 Z",
    labelX: 415,
    labelY: 250,
  },
  {
    id: "ullern",
    name: "ULLERN",
    path: "M 50 140 L 60 190 L 95 230 L 130 270 L 140 310 L 130 360 L 100 390 L 60 380 L 30 340 L 20 280 L 25 210 Z",
    labelX: 80,
    labelY: 290,
  },
  {
    id: "st-hanshaugen",
    name: "ST. HANSHAUGEN",
    path: "M 220 270 L 250 220 L 260 220 L 280 240 L 300 270 L 310 300 L 290 330 L 260 340 L 230 330 L 210 300 Z",
    labelX: 260,
    labelY: 290,
  },
  {
    id: "alna",
    name: "ALNA",
    path: "M 480 200 L 510 180 L 550 195 L 590 190 L 610 220 L 620 270 L 600 330 L 560 360 L 520 350 L 480 320 L 460 280 L 450 280 L 460 240 L 440 210 Z",
    labelX: 535,
    labelY: 275,
  },
  {
    id: "frogner",
    name: "FROGNER",
    path: "M 130 270 L 175 290 L 220 270 L 210 300 L 230 330 L 240 370 L 220 410 L 180 420 L 150 400 L 140 360 L 140 310 Z",
    labelX: 185,
    labelY: 350,
  },
  {
    id: "grunerløkka",
    name: "GRÜNERLØKKA",
    path: "M 330 280 L 360 270 L 390 290 L 400 320 L 390 360 L 360 380 L 330 370 L 310 340 L 310 300 L 300 270 Z",
    labelX: 350,
    labelY: 330,
  },
  {
    id: "sentrum",
    name: "SENTRUM",
    path: "M 230 330 L 260 340 L 290 330 L 310 340 L 310 370 L 300 400 L 270 420 L 240 410 L 240 370 Z",
    labelX: 270,
    labelY: 375,
  },
  {
    id: "gamle-oslo",
    name: "GAMLE OSLO",
    path: "M 310 370 L 330 370 L 360 380 L 390 360 L 400 320 L 420 300 L 450 310 L 480 320 L 500 360 L 490 410 L 460 440 L 420 460 L 380 460 L 340 440 L 310 420 L 300 400 Z",
    labelX: 395,
    labelY: 400,
  },
  {
    id: "østensjø",
    name: "ØSTENSJØ",
    path: "M 500 360 L 520 350 L 560 360 L 580 400 L 570 450 L 540 490 L 500 510 L 460 500 L 440 470 L 460 440 L 490 410 Z",
    labelX: 515,
    labelY: 430,
  },
  {
    id: "nordstrand",
    name: "NORDSTRAND",
    path: "M 270 420 L 300 400 L 310 420 L 340 440 L 380 460 L 420 460 L 440 470 L 460 500 L 450 550 L 420 590 L 380 620 L 340 630 L 300 610 L 270 570 L 260 510 L 260 460 Z",
    labelX: 360,
    labelY: 540,
  },
  {
    id: "søndre-nordstrand",
    name: "SØNDRE NORDSTRAND",
    path: "M 260 510 L 270 570 L 300 610 L 340 630 L 380 620 L 420 590 L 450 620 L 440 680 L 410 730 L 360 760 L 300 760 L 250 730 L 220 680 L 220 620 L 240 560 Z",
    labelX: 335,
    labelY: 690,
  },
];

interface OsloMapProps {
  selectedDistrict: string | null;
  hoveredDistrict: string | null;
  onSelectDistrict: (id: string | null) => void;
  onHoverDistrict: (id: string | null) => void;
}

export function OsloMap({
  selectedDistrict,
  hoveredDistrict,
  onSelectDistrict,
  onHoverDistrict,
}: OsloMapProps) {
  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 680 800"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(96, 165, 250, 0.3)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.15)" />
          </linearGradient>
        </defs>

        {districtShapes.map((district) => {
          const isSelected = selectedDistrict === district.id;
          const isHovered = hoveredDistrict === district.id;
          const isActive = isSelected || isHovered;

          return (
            <g key={district.id}>
              <path
                d={district.path}
                fill={
                  isSelected
                    ? "rgba(28, 37, 50, 0.9)"
                    : isHovered
                    ? "rgba(28, 37, 50, 0.7)"
                    : "rgba(17, 23, 32, 0.5)"
                }
                stroke={
                  isSelected
                    ? "rgba(96, 165, 250, 0.8)"
                    : isHovered
                    ? "rgba(90, 103, 120, 0.6)"
                    : "rgba(48, 58, 72, 0.4)"
                }
                strokeWidth={isSelected ? 2 : 1}
                className="cursor-pointer transition-all duration-200"
                onClick={() =>
                  onSelectDistrict(isSelected ? null : district.id)
                }
                onMouseEnter={() => onHoverDistrict(district.id)}
                onMouseLeave={() => onHoverDistrict(null)}
                filter={isSelected ? "url(#glow)" : undefined}
              />
              <text
                x={district.labelX}
                y={district.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none select-none"
                fill={isActive ? "rgba(255, 255, 255, 0.95)" : "rgba(203, 213, 225, 0.7)"}
                fontSize={district.name.length > 14 ? 9 : 11}
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.5"
              >
                {district.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}