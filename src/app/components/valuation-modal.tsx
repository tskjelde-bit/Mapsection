import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, TrendingUp, ChevronDown, ArrowRight, Building2, Home, Warehouse, Building } from "lucide-react";
import { DistrictData, districts } from "./district-data";

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: DistrictData;
}

type BoligType = "lei" | "rek" | "tom" | "ene";
type Standard = "behov" | "standard" | "oppgradert";

const boligTypes: { id: BoligType; label: string; icon: typeof Building2 }[] = [
  { id: "lei", label: "LEI", icon: Building2 },
  { id: "rek", label: "REK", icon: Warehouse },
  { id: "tom", label: "TOM", icon: Building },
  { id: "ene", label: "ENE", icon: Home },
];

const standards: { id: Standard; label: string }[] = [
  { id: "behov", label: "BEHOV" },
  { id: "standard", label: "STANDARD" },
  { id: "oppgradert", label: "OPPGRADERT" },
];

// Mock estimation logic
function calculateEstimate(district: DistrictData, areal: number, boligtype: BoligType, standard: Standard) {
  const basePricePerM2 = parseInt(district.perM2.replace(/\s/g, ""));

  const typeMultiplier: Record<BoligType, number> = {
    lei: 0.92,
    rek: 1.0,
    tom: 1.08,
    ene: 1.15,
  };

  const standardMultiplier: Record<Standard, number> = {
    behov: 0.85,
    standard: 1.0,
    oppgradert: 1.2,
  };

  const estimate = Math.round(basePricePerM2 * areal * typeMultiplier[boligtype] * standardMultiplier[standard]);
  const adjustedPerM2 = Math.round(basePricePerM2 * typeMultiplier[boligtype] * standardMultiplier[standard]);

  return { estimate, perM2: adjustedPerM2 };
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function ValuationModal({ isOpen, onClose, district }: ValuationModalProps) {
  const [selectedDistrictId, setSelectedDistrictId] = useState(district.id);
  const [areal, setAreal] = useState<string>("");
  const [boligtype, setBoligtype] = useState<BoligType>("tom");
  const [standard, setStandard] = useState<Standard>("standard");
  const [showResult, setShowResult] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const currentDistrict = districts.find((d) => d.id === selectedDistrictId) || district;

  useEffect(() => {
    setSelectedDistrictId(district.id);
    setShowResult(false);
    setAreal("");
  }, [district, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleCalculate = () => {
    if (!areal || parseInt(areal) <= 0) return;
    setShowResult(true);
  };

  const result = showResult && areal
    ? calculateEstimate(currentDistrict, parseInt(areal), boligtype, standard)
    : null;

  const preposisjon = (name: string) => {
    const paaDistricts = ["St. Hanshaugen", "Frogner", "Ullern", "Stovner", "Nordstrand", "Sentrum"];
    return paaDistricts.includes(name) ? "på" : "i";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl border border-[rgba(48,58,72,0.4)] bg-[#0d1117] shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-2">
              <div>
                <h2 className="text-2xl text-white">Verdikalkulator</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Boligestimat {preposisjon(currentDistrict.name)}{" "}
                  <span className="text-emerald-400">{currentDistrict.name}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left: Form */}
              <div className="rounded-xl border border-[rgba(48,58,72,0.3)] bg-[rgba(17,23,32,0.6)] p-5 flex flex-col">
                {/* Bydel + Areal */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 block">
                      Bydel
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-blue-500/15 border border-blue-500/25 text-blue-400 text-sm"
                      >
                        <span>{currentDistrict.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                      </button>

                      {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 z-10 max-h-48 overflow-y-auto rounded-lg border border-[rgba(48,58,72,0.4)] bg-[#151b25] shadow-xl">
                          {districts.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => {
                                setSelectedDistrictId(d.id);
                                setShowDropdown(false);
                                setShowResult(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                selectedDistrictId === d.id
                                  ? "bg-blue-500/15 text-blue-400"
                                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                              }`}
                            >
                              {d.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 block">
                      Areal
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={areal}
                        onChange={(e) => {
                          setAreal(e.target.value);
                          setShowResult(false);
                        }}
                        placeholder="m²"
                        min={1}
                        className="w-full px-3 py-2.5 rounded-lg bg-[rgba(28,37,50,0.5)] border border-[rgba(48,58,72,0.4)] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">m²</span>
                    </div>
                  </div>
                </div>

                {/* Boligtype */}
                <div className="mb-5">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 block">
                    Boligtype
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {boligTypes.map((bt) => {
                      const Icon = bt.icon;
                      const isActive = boligtype === bt.id;
                      return (
                        <button
                          key={bt.id}
                          onClick={() => {
                            setBoligtype(bt.id);
                            setShowResult(false);
                          }}
                          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all text-sm ${
                            isActive
                              ? "bg-blue-500/15 border-blue-500/30 text-blue-400"
                              : "bg-[rgba(28,37,50,0.3)] border-[rgba(48,58,72,0.3)] text-slate-400 hover:border-slate-500/50 hover:text-slate-300"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[10px] tracking-wider">{bt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Standard */}
                <div className="mb-6 flex-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 block">
                    Standard
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {standards.map((s) => {
                      const isActive = standard === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setStandard(s.id);
                            setShowResult(false);
                          }}
                          className={`py-2.5 rounded-xl border text-sm transition-all ${
                            isActive
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "bg-[rgba(28,37,50,0.3)] border-[rgba(48,58,72,0.3)] text-slate-400 hover:border-slate-500/50 hover:text-slate-300"
                          }`}
                        >
                          <span className="text-[11px] tracking-wider">{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calculate button */}
                <button
                  onClick={handleCalculate}
                  disabled={!areal || parseInt(areal) <= 0}
                  className="w-full h-[45px] px-4 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 disabled:bg-slate-700/20 disabled:border-slate-600/30 disabled:text-slate-600 text-blue-400 rounded-full transition-colors text-sm flex items-center justify-center gap-2 mt-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  Beregn verdi
                </button>
              </div>

              {/* Right: Result */}
              <div className="rounded-xl border border-[rgba(48,58,72,0.3)] bg-[rgba(17,23,32,0.6)] p-5 flex flex-col">
                {result ? (
                  <motion.div
                    className="flex flex-col h-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Badge */}
                    <div className="flex justify-center mb-3">
                      <span className="px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                        Beregning klar
                      </span>
                    </div>

                    {/* Estimate */}
                    <div className="text-center mb-4">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                        Ditt verdiestimat
                      </p>
                      <p className="text-3xl sm:text-4xl text-white">
                        {formatNumber(result.estimate)}{" "}
                        <span className="text-lg text-slate-400">kr</span>
                      </p>
                    </div>

                    {/* Mini stats */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="rounded-xl border border-[rgba(48,58,72,0.3)] bg-[rgba(28,37,50,0.4)] p-3 text-center">
                        <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">
                          Pris/m²
                        </p>
                        <p className="text-lg text-white">
                          {formatNumber(result.perM2)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[rgba(48,58,72,0.3)] bg-[rgba(28,37,50,0.4)] p-3 text-center">
                        <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">
                          Trend
                        </p>
                        <div className="flex items-center justify-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <p className="text-lg text-emerald-400">
                            {currentDistrict.prisendring}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA section */}
                    <div className="mt-auto pt-4">
                      <h3 className="text-base text-white mb-1.5">
                        Trenger du en verdivurdering?
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                        Jeg hjelper deg med en kostnadsfri e-takst av boligen din
                      </p>
                      <ul className="space-y-2.5 mb-6">
                        {[
                          "UFORPLIKTENDE MØTE",
                          "MOTTA TIPS OG RÅD",
                          "SETT AV 30 – 60 MINUTTER",
                        ].map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2.5 text-[12px] tracking-wide text-slate-300"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <button className="w-full h-[45px] px-4 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 rounded-full transition-colors text-sm flex items-center justify-center gap-2">
                        Få verdivurdering
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-[rgba(28,37,50,0.5)] border border-[rgba(48,58,72,0.3)] flex items-center justify-center mb-4">
                      <Sparkles className="w-7 h-7 text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-500 max-w-[200px]">
                      Fyll inn boligdetaljer og trykk «Beregn verdi» for å se estimatet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}