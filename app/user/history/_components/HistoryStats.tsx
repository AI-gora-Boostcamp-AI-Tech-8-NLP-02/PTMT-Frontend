import MonthlyHeatmap from "./MonthlyHeatmap";

interface HistoryStatsProps {
  total: number;
  completed: number;
  isLoading?: boolean;
  activityByDate: Record<string, number>;
}

export default function HistoryStats({
  total,
  completed,
  isLoading = false,
  activityByDate,
}: HistoryStatsProps) {
  const formatValue = (value: number) =>
    isLoading ? "—" : value.toLocaleString();

  return (
    <div className='grid gap-6 mb-8 md:grid-cols-[1.2fr_1.2fr_1.6fr] md:items-stretch'>
      <StatCard label='전체 커리큘럼' value={formatValue(total)} className='w-full' />
      <StatCard label='완료됨' value={formatValue(completed)} className='w-full' />
      <div className='w-full'>
        <MonthlyHeatmap
          activityByDate={activityByDate}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
    className={`rounded-xl border border-slate-200 bg-white/80 p-5 md:p-7 ${className}`}
    >
      <p className='text-xs font-semibold tracking-widest text-slate-400 uppercase'>
        {label}
      </p>
      <div className='mt-2 flex items-baseline gap-2'>
        <span className='text-3xl font-semibold text-slate-900'>{value}</span>
      </div>
    </div>
  );
}
