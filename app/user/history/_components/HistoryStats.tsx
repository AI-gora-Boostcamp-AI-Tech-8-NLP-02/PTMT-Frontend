interface HistoryStatsProps {
  total: number;
  completed: number;
  totalHours: number;
}

export default function HistoryStats({
  total,
  completed,
  totalHours,
}: HistoryStatsProps) {
  return (
    <div className='grid grid-cols-3 gap-4 mb-8'>
      <StatCard
        icon='library_books'
        label='전체 커리큘럼'
        value={total}
        bg='bg-primary/10'
        color='text-primary'
      />
      <StatCard
        icon='check_circle'
        label='완료됨'
        value={completed}
        bg='bg-green-100'
        color='text-green-600'
      />
      <StatCard
        icon='schedule'
        label='총 학습 시간'
        value={totalHours.toFixed(0)}
        bg='bg-amber-100'
        color='text-amber-600'
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  bg: string;
  color: string;
}) {
  return (
    <div className='bg-white rounded-2xl p-5 border border-slate-200'>
      <div className='flex items-center gap-3 mb-2'>
        <div
          className={`size-10 rounded-xl ${bg} flex items-center justify-center`}
        >
          <span className={`material-symbols-outlined ${color}`}>{icon}</span>
        </div>
        <span className='text-2xl font-black'>{value}</span>
      </div>
      <p className='text-sm text-slate-500'>{label}</p>
    </div>
  );
}
