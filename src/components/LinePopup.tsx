import React from 'react';
import { LineDetails, LineId } from '../store/FacilityContext';

interface LinePopupProps {
  isOpen: boolean;
  onClose: () => void;
  lineId: LineId;
  lineDetails: LineDetails;
  onUpdate: (updates: Partial<LineDetails>) => void;
  position: { x: number; y: number };
}

const lineLabels: Record<LineId, string> = {
  baselineNear: 'Grundlinie (nah)',
  baselineFar: 'Grundlinie (fern)',
  sidelineDoubleNearLeft: 'Doppel-Seitenlinie (nah links)',
  sidelineDoubleNearRight: 'Doppel-Seitenlinie (nah rechts)',
  sidelineDoubleFarLeft: 'Doppel-Seitenlinie (fern links)',
  sidelineDoubleFarRight: 'Doppel-Seitenlinie (fern rechts)',
  sidelineSingleNearLeft: 'Einzel-Seitenlinie (nah links)',
  sidelineSingleNearRight: 'Einzel-Seitenlinie (nah rechts)',
  sidelineSingleFarLeft: 'Einzel-Seitenlinie (fern links)',
  sidelineSingleFarRight: 'Einzel-Seitenlinie (fern rechts)',
  serviceLineNear: 'Aufschlaglinie (nah)',
  serviceLineFar: 'Aufschlaglinie (fern)',
  serviceLineCenterNear: 'Mittellinie (nah)',
  serviceLineCenterFar: 'Mittellinie (fern)'
};

export default function LinePopup({ 
  isOpen, 
  onClose, 
  lineId, 
  lineDetails, 
  onUpdate, 
  position 
}: LinePopupProps) {
  if (!isOpen) return null;
  const handleCheckboxChange = (field: keyof LineDetails) => {
    const updates: Partial<LineDetails> = { [field]: !lineDetails[field] };
    
    // If marking as new line, automatically enable anchor and dübel, and disable line repaired
    if (field === 'isNew' && !lineDetails.isNew) {
      updates.anchorSet = true;
      updates.dubelUpdated = true;
      updates.lineRepaired = false;
    }
    
    // If marking line as repaired, disable new line
    if (field === 'lineRepaired' && !lineDetails.lineRepaired) {
      updates.isNew = false;
    }
    
    onUpdate(updates);
  };// Calculate popup position to center it on the provided position
  // On mobile, center the popup on screen for better usability
  const isMobile = window.innerWidth <= 768;
  const popupStyle: React.CSSProperties = isMobile ? {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10000,
    maxWidth: '90vw',
    maxHeight: '90vh',
  } : {
    position: 'fixed',
    left: Math.max(10, Math.min(position.x - 160, window.innerWidth - 330)), // Center horizontally (320px width / 2 = 160)
    top: Math.max(10, Math.min(position.y - 150, window.innerHeight - 310)), // Center vertically (approximate height / 2 = 150)
    zIndex: 10000,
  };

  return (
    <>      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" 
        onClick={onClose}
      />
        {/* Popup */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl border border-white/20 p-6 z-[10000] ${isMobile ? 'w-[90vw] max-w-sm' : 'w-80'}`}
        style={popupStyle}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 pr-2">
            {lineLabels[lineId]}
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors touch-target flex-shrink-0"
          >
            ✕
          </button>
        </div>        <div className="space-y-4">

          {/* New Line */}
          <label className={`flex items-center gap-3 p-4 rounded-xl border transition-colors touch-target ${
            lineDetails.lineRepaired 
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60' 
              : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 cursor-pointer hover:from-emerald-100 hover:to-teal-100'
          }`}>
            <input
              type="checkbox"
              checked={lineDetails.isNew}
              onChange={() => handleCheckboxChange('isNew')}
              disabled={lineDetails.lineRepaired}
              className="w-6 h-6 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div>
              <span className={`font-semibold ${lineDetails.lineRepaired ? 'text-gray-500' : 'text-emerald-700'}`}>
                Neue Linie / Linie ersetzt
              </span>
              <p className={`text-sm ${lineDetails.lineRepaired ? 'text-gray-400' : 'text-emerald-600'}`}>
                Anker und Dübel automatisch aktiviert
              </p>
            </div>
          </label>

          {/* Line Repaired - moved to second position */}
          <label className={`flex items-center gap-3 p-4 rounded-xl border transition-colors touch-target ${
            lineDetails.isNew 
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60' 
              : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 cursor-pointer hover:from-emerald-100 hover:to-teal-100'
          }`}>
            <input
              type="checkbox"
              checked={lineDetails.lineRepaired}
              onChange={() => handleCheckboxChange('lineRepaired')}
              disabled={lineDetails.isNew}
              className="w-6 h-6 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className={`font-semibold ${lineDetails.isNew ? 'text-gray-500' : 'text-emerald-700'}`}>
              Linie repariert
            </span>
          </label>

          {/* Anchor Set */}
          <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors touch-target">
            <input
              type="checkbox"
              checked={lineDetails.anchorSet}
              onChange={() => handleCheckboxChange('anchorSet')}
              className="w-6 h-6 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 flex-shrink-0"
            />
            <span className="font-semibold text-slate-700">Anker gesetzt</span>
          </label>

          {/* Dübel Updated */}
          <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors touch-target">
            <input
              type="checkbox"
              checked={lineDetails.dubelUpdated}
              onChange={() => handleCheckboxChange('dubelUpdated')}
              className="w-6 h-6 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 flex-shrink-0"
            />
            <span className="font-semibold text-slate-700">Dübel erneuert</span>
          </label>
        </div><div className="mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 touch-target"
          >
            Fertig
          </button>
        </div>
      </div>
    </>
  );
}
