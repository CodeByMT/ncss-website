import React from "react";

interface LogoProps {
  className?: string;
  inverse?: boolean;
}

export default function Logo({ className = "h-12", inverse = false }: LogoProps) {
  // Use organization's colors: Dark Navy (#1B2A4A) or Cream (#F5EDD8)
  const mainColor = inverse ? "#F5EDD8" : "#1B2A4A";
  const accentColor = "#D4C4A0";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 180"
      className={className}
      id="ncss-official-logo-svg"
      aria-label="NIT Community Service Society Logo"
    >
      <g>
        {/* === THE TREE OF SERVICE (LEFT FLANK) === */}
        {/* Main Trunk and branching paths */}
        <path
          d="M 55 125 C 58 115, 62 105, 52 98 C 42 91, 35 102, 30 92 C 25 82, 35 75, 42 78 C 49 81, 48 88, 54 85 C 60 82, 53 72, 59 66 C 65 60, 72 65, 75 72 C 78 79, 73 84, 80 81 C 87 78, 85 70, 92 68 C 99 66, 104 74, 98 81 C 92 88, 88 85, 83 93 C 78 101, 88 108, 92 115"
          fill="none"
          stroke={mainColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Secondary branch splits */}
        <path
          d="M 44 95 C 38 90, 26 94, 20 86 C 14 78, 22 72, 28 75 C 34 78, 32 86, 40 86"
          fill="none"
          stroke={mainColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 68 70 C 65 58, 55 52, 48 44 C 41 36, 52 30, 58 36 C 64 42, 60 52, 66 56"
          fill="none"
          stroke={mainColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 76 76 C 85 68, 92 55, 102 52 C 112 49, 115 60, 108 66 C 101 72, 94 68, 84 76"
          fill="none"
          stroke={mainColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* --- Stylized Leaves & Floral Accents --- */}
        {/* Leaf 1 */}
        <path
          d="M 20 86 C 15 82, 12 70, 18 66 C 24 62, 28 76, 20 86 Z"
          fill={mainColor}
          opacity="0.9"
        />
        {/* Leaf 2 */}
        <path
          d="M 28 75 C 24 68, 20 58, 29 54 C 38 50, 34 66, 28 75 Z"
          fill={mainColor}
          opacity="0.95"
        />
        {/* Leaf 3 */}
        <path
          d="M 48 44 C 42 38, 38 28, 48 24 C 58 20, 52 36, 48 44 Z"
          fill={mainColor}
          opacity="0.9"
        />
        {/* Leaf 4 */}
        <path
          d="M 58 36 C 58 25, 66 18, 72 24 C 78 30, 68 35, 58 36 Z"
          fill={mainColor}
        />
        {/* Leaf 5 */}
        <path
          d="M 102 52 C 108 44, 118 38, 122 46 C 126 54, 112 55, 102 52 Z"
          fill={mainColor}
          opacity="0.9"
        />
        {/* Leaf 6 */}
        <path
          d="M 108 66 C 116 64, 126 62, 124 72 C 122 82, 112 74, 108 66 Z"
          fill={mainColor}
        />
        {/* Small cluster leaves */}
        <path d="M 80 81 C 82 86, 90 90, 85 94 C 80 98, 76 90, 80 81 Z" fill={accentColor} />
        <path d="M 52 98 C 50 104, 42 108, 45 112 C 48 116, 54 106, 52 98 Z" fill={accentColor} />

        {/* Stylized Rose-like Flower blossoms from logo */}
        {/* Flower Left Top */}
        <path
          d="M 38 64 C 34 64, 30 58, 35 54 C 40 50, 44 58, 38 64 Z"
          fill={accentColor}
        />
        <circle cx="36" cy="58" r="1.5" fill={mainColor} />

        {/* Flower Right Top */}
        <path
          d="M 88 56 C 84 52, 88 44, 94 48 C 100 52, 92 60, 88 56 Z"
          fill={accentColor}
        />
        <circle cx="91" cy="52" r="1.5" fill={mainColor} />
        
        {/* Flower Center High */}
        <path
          d="M 68 44 C 74 44, 78 38, 72 34 C 66 30, 62 38, 68 44 Z"
          fill={accentColor}
        />
        <circle cx="70" cy="39" r="1.5" fill={mainColor} />


        {/* === NCSS SERIF TEXT === */}
        <text
          x="128"
          y="108"
          fill={mainColor}
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: "bold",
            fontSize: "76px",
            letterSpacing: "4px"
          }}
        >
          NCSS
        </text>


        {/* === NIT COMMUNITY SERVICE SOCIETY PANEL === */}
        {/* Main Line: "NIT COMMUNITY SERVICE" */}
        <text
          x="270"
          y="136"
          textAnchor="middle"
          fill={mainColor}
          style={{
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            fontWeight: "800",
            fontSize: "19px",
            letterSpacing: "5px"
          }}
        >
          NIT COMMUNITY SERVICE
        </text>

        {/* Horizontal parallel framing lines centered */}
        <line x1="25" y1="152" x2="165" y2="152" stroke={mainColor} strokeWidth="2" />
        
        {/* Subtle decorative flower bulb center bottom */}
        <circle cx="210" cy="164" r="5" fill={accentColor} />
        <path d="M 198 164 C 202 161, 206 161, 210 164" stroke={mainColor} strokeWidth="1.5" fill="none" />
        <path d="M 210 164 C 214 161, 218 161, 222 164" stroke={mainColor} strokeWidth="1.5" fill="none" />
        <path d="M 205 168 Q 210 173 215 168" stroke={mainColor} strokeWidth="1.5" fill="none" />

        {/* Text: "SOCIETY" surrounded by Gold dashes */}
         <text
          x="210"
          y="157"
          fill={accentColor}
          textAnchor="middle"
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontWeight: "bold",
            fontSize: "14px",
            letterSpacing: "4px"
          }}
        >
          SOCIETY
        </text>

        <line x1="255" y1="152" x2="395" y2="152" stroke={mainColor} strokeWidth="2" />
      </g>
    </svg>
  );
}
