import { useFacilities, LineId, LineDetails } from "../store/FacilityContext";

interface Props {
  facilityId: string;
  courtIndex: number;
  onLineClick: (lineId: LineId, courtIndex: number, event: React.MouseEvent) => void;
}

export default function TennisCourtSVG({ facilityId, courtIndex, onLineClick }: Props) {
  const [facs] = useFacilities();
  const court = facs
    .find(f => f.id === facilityId)!
    .courts[courtIndex];

  // Check if line has any activity
  const hasActivity = (details: LineDetails) => {
    return details.anchorSet || details.dubelUpdated || details.lineRepaired || details.isNew;
  };

  // Get line color based on activity
  const getLineColor = (details: LineDetails) => {
    if (details.isNew) return "#22c55e"; // Green for new
    if (hasActivity(details)) return "#f59e0b"; // Amber for activity
    return "#ffffff"; // White for default
  };  const handleLineClick = (lineId: LineId, event: React.MouseEvent) => {
    onLineClick(lineId, courtIndex, event);
  };

  // Touch-friendly hitbox component for lines
  const TouchHitbox = ({ 
    x1, y1, x2, y2, 
    strokeWidth = 20, 
    lineId, 
    className = "" 
  }: { 
    x1: number; y1: number; x2: number; y2: number; 
    strokeWidth?: number; 
    lineId: LineId; 
    className?: string; 
  }) => (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="transparent"
      strokeWidth={strokeWidth}
      className={`cursor-pointer ${className}`}
      onClick={(e) => handleLineClick(lineId, e)}
      style={{ pointerEvents: 'stroke' }}
    />
  );

  return (
    <>
      <svg 
        viewBox="0 0 400 780" 
        className="w-full h-full max-w-full max-h-full select-none drop-shadow-lg touch-manipulation" 
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
        <rect x="95" y="50" width="210" height="680" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.9" />        {/* Baselines - Visual lines */}
        {(["baselineNear","baselineFar"] as LineId[]).map((id, i) => (
          <line key={`visual-${id}`}
            x1="50" x2="350"
            y1={i ? 50 : 730} y2={i ? 50 : 730}
            stroke={getLineColor(court.lines[id])} 
            strokeWidth="4"
            style={{ pointerEvents: 'none' }}
          />
        ))}
        
        {/* Baselines - Touch hitboxes */}
        <TouchHitbox x1={50} y1={730} x2={350} y2={730} lineId="baselineNear" />
        <TouchHitbox x1={50} y1={50} x2={350} y2={50} lineId="baselineFar" />        {/* Sidelines (doubles) - Visual lines */}
        {/* Left sideline - near segment (bottom half) */}
        <line
          y1="390" y2="730"
          x1="50" x2="50"
          stroke={getLineColor(court.lines.sidelineDoubleNearLeft)} 
          strokeWidth="4"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Left sideline - far segment (top half) */}
        <line
          y1="50" y2="390"
          x1="50" x2="50"
          stroke={getLineColor(court.lines.sidelineDoubleFarLeft)} 
          strokeWidth="4"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Right sideline - near segment (bottom half) */}
        <line
          y1="390" y2="730"
          x1="350" x2="350"
          stroke={getLineColor(court.lines.sidelineDoubleNearRight)} 
          strokeWidth="4"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Right sideline - far segment (top half) */}
        <line
          y1="50" y2="390"
          x1="350" x2="350"
          stroke={getLineColor(court.lines.sidelineDoubleFarRight)} 
          strokeWidth="4"
          style={{ pointerEvents: 'none' }}
        />

        {/* Sidelines (doubles) - Touch hitboxes */}
        <TouchHitbox x1={50} y1={390} x2={50} y2={730} lineId="sidelineDoubleNearLeft" />
        <TouchHitbox x1={50} y1={50} x2={50} y2={390} lineId="sidelineDoubleFarLeft" />
        <TouchHitbox x1={350} y1={390} x2={350} y2={730} lineId="sidelineDoubleNearRight" />
        <TouchHitbox x1={350} y1={50} x2={350} y2={390} lineId="sidelineDoubleFarRight" />

        {/* Visual indicators for line splits (small circles at the center line) */}
        <circle cx="50" cy="390" r="3" fill="#374151" opacity="0.6" />
        <circle cx="350" cy="390" r="3" fill="#374151" opacity="0.6" />        {/* Singles sidelines - Visual lines */}
        {/* Left singles sideline - near segment */}
        <line 
          y1="390" y2="730" x1="95" x2="95" 
          stroke={getLineColor(court.lines.sidelineSingleNearLeft)} 
          strokeWidth="3" 
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Left singles sideline - far segment */}
        <line 
          y1="50" y2="390" x1="95" x2="95" 
          stroke={getLineColor(court.lines.sidelineSingleFarLeft)} 
          strokeWidth="3" 
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Right singles sideline - near segment */}
        <line 
          y1="390" y2="730" x1="305" x2="305" 
          stroke={getLineColor(court.lines.sidelineSingleNearRight)} 
          strokeWidth="3" 
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Right singles sideline - far segment */}
        <line 
          y1="50" y2="390" x1="305" x2="305" 
          stroke={getLineColor(court.lines.sidelineSingleFarRight)} 
          strokeWidth="3" 
          style={{ pointerEvents: 'none' }}
        />

        {/* Singles sidelines - Touch hitboxes */}
        <TouchHitbox x1={95} y1={390} x2={95} y2={730} lineId="sidelineSingleNearLeft" />
        <TouchHitbox x1={95} y1={50} x2={95} y2={390} lineId="sidelineSingleFarLeft" />
        <TouchHitbox x1={305} y1={390} x2={305} y2={730} lineId="sidelineSingleNearRight" />
        <TouchHitbox x1={305} y1={50} x2={305} y2={390} lineId="sidelineSingleFarRight" />

        {/* Visual indicators for singles line splits */}
        <circle cx="95" cy="390" r="2" fill="#374151" opacity="0.4" />
        <circle cx="305" cy="390" r="2" fill="#374151" opacity="0.4" />

        {/* Service boxes - non-clickable background lines */}
        <line x1="95" y1="220" x2="305" y2="220" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
        <line x1="95" y1="560" x2="305" y2="560" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
          {/* Service lines (horizontal) - Visual lines */}
        {/* Near service line (bottom) */}
        <line
          x1="95" y1="560" x2="305" y2="560"
          stroke={getLineColor(court.lines.serviceLineNear)} 
          strokeWidth="3"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Far service line (top) */}
        <line
          x1="95" y1="220" x2="305" y2="220"
          stroke={getLineColor(court.lines.serviceLineFar)} 
          strokeWidth="3"
          style={{ pointerEvents: 'none' }}
        />

        {/* Service line center (vertical) - Visual lines */}
        {/* Near center line (bottom) */}
        <line 
          x1="200" y1="390" x2="200" y2="560" 
          stroke={getLineColor(court.lines.serviceLineCenterNear)} 
          strokeWidth="3"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Far center line (top) */}
        <line 
          x1="200" y1="220" x2="200" y2="390" 
          stroke={getLineColor(court.lines.serviceLineCenterFar)} 
          strokeWidth="3"
          style={{ pointerEvents: 'none' }}
        />

        {/* Service lines - Touch hitboxes */}
        <TouchHitbox x1={95} y1={560} x2={305} y2={560} lineId="serviceLineNear" />
        <TouchHitbox x1={95} y1={220} x2={305} y2={220} lineId="serviceLineFar" />
        <TouchHitbox x1={200} y1={390} x2={200} y2={560} lineId="serviceLineCenterNear" />
        <TouchHitbox x1={200} y1={220} x2={200} y2={390} lineId="serviceLineCenterFar" />

        {/* Net - render behind other lines, not clickable */}
        <line x1="50" y1="390" x2="350" y2="390" stroke="#374151" strokeWidth="8" opacity="0.9" />
        <rect x="195" y="385" width="10" height="10" fill="#6b7280" rx="2" />{/* Net posts - not clickable */}
        <circle cx="50" cy="390" r="6" fill="#4b5563" stroke="#374151" strokeWidth="2" />
        <circle cx="350" cy="390" r="6" fill="#4b5563" stroke="#374151" strokeWidth="2" />

        {/* Anchors are now hidden - remove this section completely */}
      </svg>
    </>
  );
}