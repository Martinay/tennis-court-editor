import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useFacilities } from "../store/FacilityContext";
import TennisCourtSVG from "./TennisCourtSVG";

export default function CourtCarousel({ facilityId }: { facilityId: string }) {
  const [facs] = useFacilities();
  const fac    = facs.find(f => f.id === facilityId)!;
  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      {/* Court Counter/Info */}
      <div className="flex items-center justify-center mb-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-white/20">
          <span className="text-slate-600 text-sm font-medium">
            {fac.courts.length === 1 ? '1 Tennisplatz' : `${fac.courts.length} Tennisplätze`}
          </span>
        </div>
      </div>

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
                    <TennisCourtSVG facilityId={facilityId} courtIndex={idx} />
                  </div>
                </div>

                {/* Court Info/Instructions */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-600">
                    Klicken Sie auf Linien und Anker, um sie zu markieren
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Navigation Buttons */}
          {fac.courts.length > 1 && (
            <>
              <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center text-teal-600 hover:text-teal-700 hover:scale-110 transition-all duration-200 cursor-pointer">
                <span className="text-xl">←</span>
              </div>
              <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center text-teal-600 hover:text-teal-700 hover:scale-110 transition-all duration-200 cursor-pointer">
                <span className="text-xl">→</span>
              </div>
            </>
          )}
        </Swiper>
      </div>
    </div>
  );
}