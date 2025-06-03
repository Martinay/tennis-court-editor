import { useFacilities, LineId, AnchorId } from "../store/FacilityContext";

interface Props {
  facilityId: string;
  courtIndex: number;
}

export default function TennisCourtSVG({ facilityId, courtIndex }: Props) {
  const [facs, dispatch] = useFacilities();
  const court = facs
    .find(f => f.id === facilityId)!
    .courts[courtIndex];

  const active = (v:boolean) => (v ? "#10b981" : "#ffffff");  return (
    <svg 
      viewBox="0 0 400 780" 
      className="w-full h-full max-w-full max-h-full select-none drop-shadow-lg" 
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Court background with gradient */}
      <defs>
        <radialGradient id="courtGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#16803d" />
          <stop offset="100%" stopColor="#14532d" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      <rect x="0" y="0" width="400" height="780" fill="url(#courtGradient)" rx="8" />
      
      {/* Outer court boundary (doubles court) */}
      <rect x="50" y="50" width="300" height="680" fill="none" stroke="#ffffff" strokeWidth="4" filter="url(#shadow)" />

      {/* Singles court */}
      <rect x="95" y="50" width="210" height="680" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.9" />      {/* Baselines */}
      {(["baselineNear","baselineFar"] as LineId[]).map((id, i) => (
        <line key={id}
          x1="50" x2="350"
          y1={i ? 730 : 50} y2={i ? 730 : 50}
          stroke={active(court.lines[id]) === "#10b981" ? "#fbbf24" : "#ffffff"} 
          strokeWidth="4"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => dispatch({ type:"TOGGLE_LINE", fid:facilityId, court:courtIndex, line:id })}
        />
      ))}

      {/* Sidelines (doubles) */}
      {(["sidelineLeft","sidelineRight"] as LineId[]).map((id, i) => (
        <line key={id}
          y1="50" y2="730"
          x1={i ? 350 : 50}  x2={i ? 350 : 50}
          stroke={active(court.lines[id]) === "#10b981" ? "#fbbf24" : "#ffffff"} 
          strokeWidth="4"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => dispatch({ type:"TOGGLE_LINE", fid:facilityId, court:courtIndex, line:id })}
        />
      ))}

      {/* Singles sidelines */}
      <line y1="50" y2="730" x1="95" x2="95" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
      <line y1="50" y2="730" x1="305" x2="305" stroke="#ffffff" strokeWidth="3" opacity="0.9" />

      {/* Service line (center) */}
      <line
        x1="50" y1="390" x2="350" y2="390"
        stroke={active(court.lines.serviceLine) === "#10b981" ? "#fbbf24" : "#ffffff"} 
        strokeWidth="3"
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => dispatch({ type:"TOGGLE_LINE", fid:facilityId, court:courtIndex, line:"serviceLine" })}
      />

      {/* Service boxes */}
      <line x1="95" y1="220" x2="305" y2="220" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
      <line x1="95" y1="560" x2="305" y2="560" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
      <line x1="200" y1="220" x2="200" y2="560" stroke="#ffffff" strokeWidth="2" opacity="0.8" />

      {/* Net */}
      <line x1="50" y1="390" x2="350" y2="390" stroke="#374151" strokeWidth="8" opacity="0.9" />
      <rect x="195" y="385" width="10" height="10" fill="#6b7280" rx="2" />

      {/* Net posts */}
      <circle cx="50" cy="390" r="6" fill="#4b5563" stroke="#374151" strokeWidth="2" />
      <circle cx="350" cy="390" r="6" fill="#4b5563" stroke="#374151" strokeWidth="2" />      {/* ---------------- 4 Anchors ------------------------------------------------ */}
      {(["a1","a2","a3","a4"] as AnchorId[]).map((id,i)=>(
        <circle key={id}
          cx={i%2===0?95:305}
          cy={i<2?50:730}
          r={10} 
          fill={active(court.anchors[id]) === "#10b981" ? "#ef4444" : "#ffffff"} 
          stroke="#374151" 
          strokeWidth="3"
          className="cursor-pointer hover:scale-110 transition-transform"
          onClick={() => dispatch({ type:"TOGGLE_ANCHOR", fid:facilityId, court:courtIndex, anchor:id })}
        />
      ))}
    </svg>
  );
}