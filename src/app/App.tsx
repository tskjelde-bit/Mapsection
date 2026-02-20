import { useState, useMemo, useRef, useEffect } from "react";
import { OsloMap } from "./components/oslo-map";
import { DistrictSidebar } from "./components/district-sidebar";
import { StatCard } from "./components/stat-card";
import { districts, osloAverage, DistrictData } from "./components/district-data";
import { ValuationModal } from "./components/valuation-modal";
import { ChevronDown, Sparkles } from "lucide-react";

export default function App() {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [mapHeight, setMapHeight] = useState<number | null>(null);
  const [showValuation, setShowValuation] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const observer = new ResizeObserver(() => {
      if (mapRef.current) {
        setMapHeight(mapRef.current.getBoundingClientRect().height);
      }
    });
    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  const selectedDistrict: DistrictData = useMemo(() => {
    if (!selectedDistrictId) return osloAverage;
    return districts.find((d) => d.id === selectedDistrictId) || osloAverage;
  }, [selectedDistrictId]);

  const displayDistrict: DistrictData = useMemo(() => {
    if (hoveredDistrictId && !selectedDistrictId) {
      return districts.find((d) => d.id === hoveredDistrictId) || osloAverage;
    }
    return selectedDistrict;
  }, [hoveredDistrictId, selectedDistrictId, selectedDistrict]);

  const isOslo = displayDistrict.id === "oslo";

  const preposisjon = (name: string) => {
    const paaDistricts = ["St. Hanshaugen", "Frogner", "Ullern", "Stovner", "Nordstrand", "Sentrum"];
    return paaDistricts.includes(name) ? "på" : "i";
  };

  const compactStats = [
    { label: "Prisendring", value: displayDistrict.prisendring, color: "text-white" },
    { label: "Salgstid", value: displayDistrict.salgstid, color: "text-white" },
    { label: "Medianpris", value: displayDistrict.medianpris, color: "text-white" },
    { label: "Per M2", value: displayDistrict.perM2, color: "text-white" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden h-[100dvh] flex flex-col overflow-hidden">
        {/* Mobile title */}
        <div className="px-4 pt-4 pb-3 flex-shrink-0">
          <h1 className="text-2xl text-white">
            Boligmarkedet {preposisjon(displayDistrict.name)}{" "}
            <span className="text-emerald-400">{displayDistrict.name}</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm truncate">
            {displayDistrict.description}
          </p>
        </div>

        {/* Mobile map + stats area — fills remaining height */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Map container — grows when no selection, shrinks when selected */}
          <div
            className="relative bg-[rgba(17,23,32,0.6)] overflow-hidden transition-all duration-500 ease-in-out"
            style={{ flex: selectedDistrictId ? "1 1 auto" : "1 1 auto" }}
          >
            <div className="relative w-full h-full min-h-0">
              <OsloMap
                selectedDistrict={selectedDistrictId}
                hoveredDistrict={hoveredDistrictId}
                onSelectDistrict={setSelectedDistrictId}
                onHoverDistrict={setHoveredDistrictId}
              />
            </div>

            {/* Compact stats overlay — on map, only when no district selected */}
            {!selectedDistrictId && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(5,5,5,0.85)] via-[rgba(5,5,5,0.5)] to-transparent pt-10 pb-4 px-4">
                <div className="flex items-start justify-between">
                  {compactStats.map((stat) => (
                    <div key={stat.label} className="text-center flex-1">
                      <p className={`text-[13px] sm:text-[15px] text-white tabular-nums`}>{stat.value}</p>
                      <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chevron toggle — deselect district */}
            {selectedDistrictId && (
              <button
                onClick={() => setSelectedDistrictId(null)}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-90 transition-transform">
                  <ChevronDown className="w-4 h-4 text-white" />
                </div>
              </button>
            )}
          </div>

          {/* Stats panel — slides up when district selected */}
          <div
            className="overflow-y-auto transition-all duration-500 ease-in-out bg-[#0a0f15]"
            style={{
              flex: selectedDistrictId ? "0 0 auto" : "0 0 0%",
              opacity: selectedDistrictId ? 1 : 0,
              maxHeight: selectedDistrictId ? "55%" : "0%",
            }}
          >
            {selectedDistrictId && (
              <div className="px-4 pt-3 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  <StatCard
                    label="Prisendring"
                    value={displayDistrict.prisendring}
                    detail={displayDistrict.prisendringDetail}
                    type="prisendring"
                    isHighlighted={!isOslo}
                  />
                  <StatCard
                    label="Salgstid"
                    value={displayDistrict.salgstid}
                    detail={displayDistrict.salgstidDetail}
                    type="salgstid"
                    isHighlighted={!isOslo}
                  />
                  <StatCard
                    label="Medianpris"
                    value={displayDistrict.medianpris}
                    detail={displayDistrict.medianprisDetail}
                    type="medianpris"
                    isHighlighted={!isOslo}
                  />
                  <StatCard
                    label="Per M2"
                    value={displayDistrict.perM2}
                    detail={displayDistrict.perM2Detail}
                    type="perm2"
                    isHighlighted={!isOslo}
                  />
                </div>

                {/* Mobile CTA — inside stats panel, tight below cards */}
                {!isOslo && (
                  <button
                    onClick={() => setShowValuation(true)}
                    className="w-full h-[45px] px-4 mt-3 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-400 rounded-full transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Hva er boligen din {preposisjon(displayDistrict.name)} {displayDistrict.name} verdt?
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block">
        <div className="relative max-w-[1500px] mx-auto px-8 py-8">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl text-white">
              Hvordan er boligmarkedet
              {" "}{preposisjon(displayDistrict.name)}{" "}
              <span className="text-emerald-400">{displayDistrict.name}</span>?
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              {displayDistrict.description}
            </p>
          </div>

          {/* Main layout: map + sidebar */}
          <div className="flex flex-row gap-5">
            {/* Map area */}
            <div className="w-[55%] xl:w-[50%]">
              <div ref={mapRef} className="rounded-2xl border border-[rgba(48,58,72,0.3)] bg-[rgba(17,23,32,0.6)] relative overflow-hidden" style={{ height: "70vh" }}>
                <OsloMap
                  selectedDistrict={selectedDistrictId}
                  hoveredDistrict={hoveredDistrictId}
                  onSelectDistrict={setSelectedDistrictId}
                  onHoverDistrict={setHoveredDistrictId}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-[45%] xl:w-[50%]">
              <div
                className="rounded-2xl border border-[rgba(48,58,72,0.3)] bg-[rgba(17,23,32,0.6)] overflow-hidden"
                style={mapHeight ? { height: mapHeight } : undefined}
              >
                <DistrictSidebar
                  selectedDistrict={displayDistrict}
                  isSelected={selectedDistrictId !== null}
                  onSelectDistrict={(id) => setSelectedDistrictId(id)}
                  onCTAClick={() => setShowValuation(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showValuation && <ValuationModal isOpen={showValuation} onClose={() => setShowValuation(false)} district={displayDistrict} />}
    </div>
  );
}