import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";
import { useFacilities, LineId, LineDetails } from "../store/FacilityContext";
import TennisCourtSVG from "./TennisCourtSVG";
import LinePopup from "./LinePopup";

export default function CourtCarousel({ facilityId }: { facilityId: string }) {
  const [facs, dispatch] = useFacilities();
  const fac = facs.find(f => f.id === facilityId)!;
  
  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    lineId: LineId | null;
    courtIndex: number | null;
    position: { x: number; y: number };
  }>({
    isOpen: false,
    lineId: null,
    courtIndex: null,
    position: { x: 0, y: 0 }
  });

  const handleLineClick = (lineId: LineId, courtIndex: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // Get the carousel container's bounding rect for centering
    const carouselElement = document.querySelector('.court-swiper');
    if (carouselElement) {
      const rect = carouselElement.getBoundingClientRect();
      setPopupState({
        isOpen: true,
        lineId,
        courtIndex,
        position: { 
          x: rect.left + rect.width / 2, 
          y: rect.top + rect.height / 2 
        }
      });
    }
  };

  const handlePopupUpdate = (updates: Partial<LineDetails>) => {
    if (!popupState.lineId || popupState.courtIndex === null) return;
    
    dispatch({
      type: "UPDATE_LINE_DETAILS",
      fid: facilityId,
      court: popupState.courtIndex,
      line: popupState.lineId,
      details: updates
    });
  };

  const closePopup = () => {
    setPopupState({ isOpen: false, lineId: null, courtIndex: null, position: { x: 0, y: 0 } });
  };
  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      {/* Swiper Container */}
      <div className="flex-1 min-h-0">
        <Swiper 
          modules={[Navigation, Pagination]}
          slidesPerView={1} 
          centeredSlides 
          loop={fac.courts.length > 1}
          spaceBetween={20} 
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="h-full w-full court-swiper"
        >
          {fac.courts.map((_, idx) => (
            <SwiperSlide key={idx} className="h-full">
              <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 md:p-6">
                {/* Court Title */}
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-md">
                    <h2 className="text-lg md:text-xl font-bold">🎾 Platz {idx + 1}</h2>
                  </div>
                </div>
                  {/* Court Display Area */}
                <div className="flex-1 flex items-center justify-center min-h-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-xl p-4 border border-emerald-100">
                  <div className="w-full h-full max-w-md">
                    <TennisCourtSVG facilityId={facilityId} courtIndex={idx} onLineClick={handleLineClick} />
                  </div>
                </div>                {/* Court Info/Instructions */}
                <div className="mt-4 text-center">
                  <p className="text-sm md:text-base text-slate-600">
                    {window.innerWidth <= 768 ? 'Tippen Sie auf Linien für Details' : 'Klicken Sie auf Linien, um Details zu bearbeiten'}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
            {/* Custom Navigation Buttons */}
          {fac.courts.length > 1 && (
            <>
              <div className="swiper-button-prev-custom absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center text-teal-600 hover:text-teal-700 hover:scale-110 transition-all duration-200 cursor-pointer touch-target">
                <span className="text-xl md:text-2xl">←</span>
              </div>
              <div className="swiper-button-next-custom absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center text-teal-600 hover:text-teal-700 hover:scale-110 transition-all duration-200 cursor-pointer touch-target">
                <span className="text-xl md:text-2xl">→</span>
              </div>
            </>
          )}
        </Swiper>
      </div>

      {/* Line Details Popup */}
      {popupState.isOpen && popupState.lineId && popupState.courtIndex !== null && (
        <LinePopup
          isOpen={popupState.isOpen}
          onClose={closePopup}
          lineId={popupState.lineId}
          lineDetails={fac.courts[popupState.courtIndex].lines[popupState.lineId]}
          onUpdate={handlePopupUpdate}
          position={popupState.position}
        />
      )}
    </div>
  );
}