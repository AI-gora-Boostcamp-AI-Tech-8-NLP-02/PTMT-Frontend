import { QueueStatus } from "@/lib/types";

interface QueueStatusCardProps {
  status: QueueStatus | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  className?: string;
  variant?: "full" | "waiting";
}

function formatPosition(status: QueueStatus | null) {
  if (!status) return "확인 중";
  if (status.my_status === "processing") return "현재 처리 중";
  if (status.my_status === "waiting" && status.my_position) {
    return `${status.my_position}번`;
  }
  return "대기열 반영 중";
}

export default function QueueStatusCard({
  status,
  isLoading,
  error,
  lastUpdated,
  className,
}: QueueStatusCardProps) {
  return (
    <section
      className={[
        "rounded-3xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-5 shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='text-sm font-black text-slate-800'>대기열 현황</p>
        <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 border border-slate-200'>
          {isLoading
            ? "동기화 중"
            : lastUpdated
              ? `${lastUpdated.toLocaleTimeString()} 갱신`
              : "미갱신"}
        </span>
      </div>

      {error && (
        <div className='mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600'>
          {error}
        </div>
      )}

      {!error && (
        <div className='mt-4 grid grid-cols-2 gap-3'>
          <div className='rounded-2xl bg-white border border-slate-200 px-3 py-2'>
            <p className='text-[11px] text-slate-500'>현재 대기 인원</p>
            <p className='text-xl font-black text-slate-800'>
              {status ? `${status.waiting_jobs}명` : "-"}
            </p>
          </div>
          <div className='rounded-2xl bg-white border border-slate-200 px-3 py-2'>
            <p className='text-[11px] text-slate-500'>내 순번</p>
            <p className='text-xl font-black text-amber-600'>
              {formatPosition(status)}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
