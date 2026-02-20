import { DistrictData, districts } from "./district-data";
import { StatCard } from "./stat-card";
import { MapPin, ChevronRight, Sparkles } from "lucide-react";

interface DistrictSidebarProps {
  selectedDistrict: DistrictData;
  isSelected: boolean;
  onSelectDistrict: (id: string | null) => void;
  onCTAClick?: () => void;
}

export function DistrictSidebar({ selectedDistrict, isSelected, onSelectDistrict, onCTAClick }: DistrictSidebarProps) {
  const isOslo = selectedDistrict.id === "oslo";

  const preposisjon = (name: string) => {
    const paaDistricts = ["St. Hanshaugen", "Frogner", "Ullern", "Stovner", "Nordstrand", "Sentrum"];
    return paaDistricts.includes(name) ? "på" : "i";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="text-xs uppercase tracking-widest text-slate-500">
            {isOslo ? "Hele Oslo" : "Bydel"}
          </span>
        </div>
        <h2 className="text-2xl text-white mb-0.5">
          <span className="text-emerald-400">{selectedDistrict.name}</span>
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
          {selectedDistrict.description}
        </p>
      </div>

      {/* Stats */}
      <div className="px-5 py-3 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            label="Prisendring"
            value={selectedDistrict.prisendring}
            detail={selectedDistrict.prisendringDetail}
            type="prisendring"
            isHighlighted={!isOslo}
          />
          <StatCard
            label="Salgstid"
            value={selectedDistrict.salgstid}
            detail={selectedDistrict.salgstidDetail}
            type="salgstid"
            isHighlighted={!isOslo}
          />
          <StatCard
            label="Medianpris"
            value={selectedDistrict.medianpris}
            detail={selectedDistrict.medianprisDetail}
            type="medianpris"
            isHighlighted={!isOslo}
          />
          <StatCard
            label="Per M2"
            value={selectedDistrict.perM2}
            detail={selectedDistrict.perM2Detail}
            type="perm2"
            isHighlighted={!isOslo}
          />
        </div>
      </div>

      {/* CTA Button */}
      {isSelected && !isOslo && (
        <div className="px-5 pb-3">
          <button
            onClick={onCTAClick}
            className="w-full h-[45px] px-4 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-400 rounded-full transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Hva er boligen din {preposisjon(selectedDistrict.name)} {selectedDistrict.name} verdt?
          </button>
        </div>
      )}

      {/* District list */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 pb-3">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
          Alle bydeler
        </p>
        <div className="space-y-0.5">
          {districts.map((d) => (
            <button
              key={d.id}
              onClick={() => onSelectDistrict(d.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-sm transition-all duration-150 ${
                selectedDistrict.id === d.id
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    selectedDistrict.id === d.id
                      ? "bg-blue-400"
                      : "bg-slate-600"
                  }`}
                />
                {d.name}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs ${
                    d.prisendring.startsWith("+")
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {d.prisendring}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}