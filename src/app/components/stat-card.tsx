import { TrendingUp, Clock, BarChart3, Ruler } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  type: "prisendring" | "salgstid" | "medianpris" | "perm2";
  isHighlighted?: boolean;
}

const iconMap = {
  prisendring: TrendingUp,
  salgstid: Clock,
  medianpris: BarChart3,
  perm2: Ruler,
};

const colorMap = {
  prisendring: "text-emerald-400",
  salgstid: "text-white",
  medianpris: "text-yellow-400",
  perm2: "text-white",
};

export function StatCard({ label, value, detail, type, isHighlighted }: StatCardProps) {
  const Icon = iconMap[type];
  const valueColor = isHighlighted ? colorMap[type] : "text-white";

  return (
    <div
      className={`rounded-xl p-3 lg:p-4 transition-all duration-300 flex flex-col h-full ${
        isHighlighted
          ? "bg-[rgba(17,23,32,0.5)] lg:bg-[rgba(28,37,50,0.7)] border border-[rgba(48,58,72,0.3)] lg:border-[rgba(90,103,120,0.3)]"
          : "bg-[rgba(17,23,32,0.5)] border border-[rgba(48,58,72,0.3)]"
      }`}
    >
      <div className="flex items-start justify-between mb-0.5 lg:mb-1">
        <span className={`text-xl lg:text-2xl ${valueColor}`}>
          {value}
        </span>
        <Icon
          className={`w-3.5 h-3.5 lg:w-4 lg:h-4 mt-1 flex-shrink-0 ${
            isHighlighted ? "text-slate-400" : "text-slate-500"
          }`}
        />
      </div>
      <p className="text-[9px] lg:text-[10px] tracking-widest uppercase text-slate-500 mb-1 lg:mb-2">
        {label}
      </p>
      <p className="text-[11px] lg:text-xs text-slate-400 leading-snug lg:leading-relaxed mt-auto line-clamp-2 lg:line-clamp-3">{detail}</p>
    </div>
  );
}