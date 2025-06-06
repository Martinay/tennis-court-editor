import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useFacilities } from "../store/FacilityContext";
import CourtCarousel from "@/components/CourtCarousel";
import { generatePDFReport } from "../utils/pdfGenerator";

export default function Facility() {
  const { id }  = useParams();               // facility id from route
  const [facs, dispatch]  = useFacilities();
  const fac     = facs.find(f => f.id === id);
  const [isEditingView, setIsEditingView] = useState(false);
  const [tempView, setTempView] = useState("");

  if (!fac) return <p>Facility not found.</p>;

  const handleViewEdit = () => {
    setTempView(fac.view);
    setIsEditingView(true);
  };

  const handleViewSave = () => {
    dispatch({
      type: "UPDATE_FACILITY",
      payload: { ...fac, view: tempView }
    });
    setIsEditingView(false);
  };  const handleViewCancel = () => {
    setIsEditingView(false);
    setTempView("");
  };

  const handlePDFExport = () => {
    generatePDFReport(fac);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-teal-100 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-teal-600 hover:text-teal-700 transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center text-white transform group-hover:scale-105 transition-transform duration-200">
              <span className="text-lg">←</span>
            </div>
            <span className="font-semibold hidden sm:block">Zurück zu Anlagen</span>
          </Link>
            <div className="text-center flex-1 max-w-md mx-4">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              {fac.name}
            </h1>
          </div>
            <div className="flex items-center gap-3">
            <button
              onClick={handlePDFExport}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center gap-2"
              title="PDF-Bericht erstellen"
            >
              <span className="text-lg">📄</span>
              <span className="hidden sm:block">PDF-Bericht</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Court Area */}
      <main className="flex-1 min-h-0 bg-gradient-to-b from-emerald-800/5 to-teal-800/5">
        <CourtCarousel facilityId={fac.id} />
      </main>      {/* Footer with Blickrichtung */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-teal-100 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3 text-sm md:text-base">
            <span className="text-slate-600 font-medium">👓 Blickrichtung:</span>
            {isEditingView ? (
              <div className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-md border border-teal-200">
                <input 
                  type="text" 
                  value={tempView} 
                  onChange={e => setTempView(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all duration-200 min-w-32"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleViewSave();
                    if (e.key === 'Escape') handleViewCancel();
                  }}
                />
                <button 
                  onClick={handleViewSave}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                  title="Speichern (Enter)"
                >
                  ✓
                </button>
                <button 
                  onClick={handleViewCancel}
                  className="bg-slate-400 hover:bg-slate-500 text-white w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                  title="Abbrechen (Escape)"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                className="bg-gradient-to-r from-teal-100 to-emerald-100 hover:from-teal-200 hover:to-emerald-200 text-teal-700 font-semibold px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg border border-teal-200"
                onClick={handleViewEdit}
                title="Klicken zum Bearbeiten"
              >
                {fac.view} ✏️
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}