import React, { useState } from "react";
import { useFacilities } from "../store/FacilityContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [facs, dispatch] = useFacilities();
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  // ---- form local state
  const [name, setName] = useState("");
  const [courts, setCourts] = useState(2);
  const [view, setView] = useState("Weg");
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());
  
  // ---- editing existing facility time period
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const createFacility = () => {
    if (!name.trim()) return;
    dispatch({
      type: "ADD_FACILITY",
      payload: {
        id: crypto.randomUUID(),
        name,
        numCourts: courts,
        view,
        zeitraum: {
          startDate,
          endDate
        },courts: Array.from({ length: courts }, () => ({
          lines: {
            baselineNear: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            baselineFar: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            sidelineDoubleNearLeft: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            sidelineDoubleNearRight: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            sidelineDoubleFarLeft: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            sidelineDoubleFarRight: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            sidelineSingleNearLeft: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            sidelineSingleNearRight: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            sidelineSingleFarLeft: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            sidelineSingleFarRight: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            serviceLineNear: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            serviceLineFar: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            serviceLineCenterNear: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
            serviceLineCenterFar: { anchorSet: false, dubelUpdated: false, lineRepaired: false, isNew: false },
          },
          anchors: { a1: false, a2: false, a3: false, a4: false },
        })),
      },    });
    setName("");    setStartDate(getTodayString());
    setEndDate(getTodayString());
  };

  const handleEditZeitraum = (facility: any) => {
    setEditingFacilityId(facility.id);
    setEditStartDate(facility.zeitraum?.startDate || getTodayString());
    setEditEndDate(facility.zeitraum?.endDate || getTodayString());
  };

  const handleSaveZeitraum = () => {
    if (!editingFacilityId) return;
    
    dispatch({
      type: "UPDATE_ZEITRAUM",
      fid: editingFacilityId,
      zeitraum: {
        startDate: editStartDate,
        endDate: editEndDate
      }
    });
    
    setEditingFacilityId(null);
    setEditStartDate("");
    setEditEndDate("");
  };

  const handleCancelEditZeitraum = () => {
    setEditingFacilityId(null);
    setEditStartDate("");
    setEditEndDate("");
  };
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent underline">
            🎾 Tennisanlagen Manager
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
          {/* Create Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">+</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">Neue Anlage anlegen</h2>
            </div>
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Anlagen-Name</label>
                <input
                  placeholder="z.B. TC Grün-Weiß"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Anzahl Plätze</label>
                <input 
                  type="number" 
                  min={1} 
                  max={20}
                  value={courts}
                  onChange={e => setCourts(+e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white/50 text-center font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Blickrichtung</label>
                <input 
                  type="text" 
                  value={view} 
                  onChange={e => setView(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white/50"
                  placeholder="z.B. Weg, Clubhaus, Nord..."
                />
              </div>
            </div>

            {/* Time Period Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                📅 Renovierungszeitraum
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Von (Startdatum)</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Bis (Enddatum)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white/50"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={createFacility}
              disabled={!name.trim()}
              className="w-full mt-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {name.trim() ? '🚀 Anlage erstellen' : '📝 Bitte Namen eingeben'}
            </button>
          </div>

          {/* Facilities List */}
          <div className="space-y-4">
            {facs.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200">
                <div className="text-6xl mb-4">🎾</div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Noch keine Anlagen vorhanden</h3>
                <p className="text-slate-500">Erstellen Sie Ihre erste Tennisanlage mit dem Formular oben.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {facs.length}
                  </span>                  Ihre Tennisanlagen
                </h2>
                {[...facs]
                  .sort((a, b) => {
                    // Sort by start date descending (newest first)
                    const dateA = new Date(a.zeitraum?.startDate || '1900-01-01');
                    const dateB = new Date(b.zeitraum?.startDate || '1900-01-01');
                    return dateB.getTime() - dateA.getTime();
                  })
                  .map(f => (
                  <div key={f.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.01]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{f.name}</h3>                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">
                            🎾 {f.numCourts} {f.numCourts === 1 ? 'Platz' : 'Plätze'}
                          </span>                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                            👓 {f.view}
                          </span>
                          {editingFacilityId === f.id ? (
                            <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-md border border-purple-200">
                              <input 
                                type="date" 
                                value={editStartDate} 
                                onChange={e => setEditStartDate(e.target.value)}
                                className="px-2 py-1 border border-slate-200 rounded text-xs focus:border-purple-400 focus:ring-1 focus:ring-purple-100 transition-all duration-200"
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleSaveZeitraum();
                                  if (e.key === 'Escape') handleCancelEditZeitraum();
                                }}
                              />
                              <span className="text-xs text-slate-400">-</span>
                              <input 
                                type="date" 
                                value={editEndDate} 
                                onChange={e => setEditEndDate(e.target.value)}
                                min={editStartDate}
                                className="px-2 py-1 border border-slate-200 rounded text-xs focus:border-purple-400 focus:ring-1 focus:ring-purple-100 transition-all duration-200"
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleSaveZeitraum();
                                  if (e.key === 'Escape') handleCancelEditZeitraum();
                                }}
                              />
                              <button 
                                onClick={handleSaveZeitraum}
                                className="bg-purple-500 hover:bg-purple-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center transition-all duration-200"
                                title="Speichern (Enter)"
                              >
                                ✓
                              </button>
                              <button 
                                onClick={handleCancelEditZeitraum}
                                className="bg-slate-400 hover:bg-slate-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center transition-all duration-200"
                                title="Abbrechen (Escape)"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditZeitraum(f)}
                              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-full font-medium transition-all duration-200 hover:scale-105"
                              title="Klicken zum Bearbeiten"
                            >
                              📅 {f.zeitraum ? new Date(f.zeitraum.startDate).toLocaleDateString('de-DE') : '—'} - {f.zeitraum ? new Date(f.zeitraum.endDate).toLocaleDateString('de-DE') : '—'} ✏️
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/facility/${f.id}`)}
                          className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                        >
                          📋 Öffnen
                        </button>                        <button
                          onClick={() => {
                            // Create enhanced export data with readable format
                            const exportData = {
                              ...f,
                              zeitraum: {
                                startDate: f.zeitraum.startDate,
                                endDate: f.zeitraum.endDate,
                                startDateFormatted: new Date(f.zeitraum.startDate).toLocaleDateString('de-DE'),
                                endDateFormatted: new Date(f.zeitraum.endDate).toLocaleDateString('de-DE')
                              },
                              courts: f.courts.map((court, index) => ({
                                courtNumber: index + 1,
                                lines: Object.entries(court.lines).map(([lineId, details]) => ({
                                  line: lineId,
                                  anchorSet: details.anchorSet,
                                  dubelUpdated: details.dubelUpdated,
                                  lineRepaired: details.lineRepaired,
                                  isNew: details.isNew
                                })).filter(line => 
                                  line.anchorSet || line.dubelUpdated || line.lineRepaired || line.isNew
                                ),
                                anchors: Object.entries(court.anchors)
                                  .filter(([, active]) => active)
                                  .map(([anchorId]) => anchorId)
                              }))
                            };
                            
                            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type:"application/json" });
                            const url = URL.createObjectURL(blob);
                            const a   = document.createElement("a");
                            a.href = url;
                            a.download = `${f.name.replace(/\s+/g,"_")}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="bg-white hover:bg-slate-50 border-2 border-teal-200 hover:border-teal-300 text-teal-700 font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                        >
                          💾 Export
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
