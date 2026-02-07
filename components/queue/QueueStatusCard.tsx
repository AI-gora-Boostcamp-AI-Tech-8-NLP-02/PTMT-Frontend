import { QueueStatus } from "@/lib/types";

interface QueueStatusCardProps {
  status: QueueStatus | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  className?: string;
}

function formatSeconds(seconds: number) {
  if (seconds <= 0) return "즉시";
  if (seconds < 60) return `${seconds}초`;
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  if (remain === 0) return `${minutes}분`;
  return `${minutes}분 ${remain}초`;
}

function getSlotColor(status: QueueStatus["slots"][number]["status"]) {
  if (status === "ready") return "bg-emerald-400";
  if (status === "busy") return "bg-amber-400";
  return "bg-slate-300";
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
        <div>
          <p className='text-sm font-black text-slate-800'>AI 키 대기열</p>
          <p className='text-xs text-slate-500'>
            PDF 분석/커리큘럼 생성은 공유 키 풀에서 순차 처리됩니다.
          </p>
        </div>
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

      {!status && !error && (
        <div className='mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500'>
          대기열 정보를 불러오는 중입니다.
        </div>
      )}

      {status && (
        <>
          <div className='mt-4 grid grid-cols-2 gap-3 md:grid-cols-4'>
            <div className='rounded-2xl bg-white border border-slate-200 px-3 py-2'>
              <p className='text-[11px] text-slate-500'>대기 작업</p>
              <p className='text-xl font-black text-slate-800'>{status.waiting_jobs}</p>
            </div>
            <div className='rounded-2xl bg-white border border-slate-200 px-3 py-2'>
              <p className='text-[11px] text-slate-500'>가용 키</p>
              <p className='text-xl font-black text-emerald-600'>
                {status.available_keys}/{status.total_keys}
              </p>
            </div>
            <div className='rounded-2xl bg-white border border-slate-200 px-3 py-2'>
              <p className='text-[11px] text-slate-500'>예상 대기</p>
              <p className='text-xl font-black text-slate-800'>
                {formatSeconds(status.estimated_wait_seconds)}
              </p>
            </div>
            <div className='rounded-2xl bg-white border border-slate-200 px-3 py-2'>
              <p className='text-[11px] text-slate-500'>다음 가용</p>
              <p className='text-xl font-black text-slate-800'>
                {formatSeconds(status.next_available_in_seconds)}
              </p>
            </div>
          </div>

          <div className='mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3'>
            <div className='flex items-center justify-between'>
              <p className='text-xs font-semibold text-slate-600'>키 슬롯 상태</p>
              <p className='text-[11px] text-slate-400'>쿨타임 {status.cooldown_seconds}초</p>
            </div>
            <div className='mt-3 flex flex-wrap items-center gap-2'>
              {status.slots.map(slot => (
                <div
                  key={slot.slot_number}
                  className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5'
                >
                  <span
                    className={`size-2.5 rounded-full ${getSlotColor(slot.status)}`}
                  />
                  <span className='text-xs font-semibold text-slate-600'>
                    #{slot.slot_number}
                  </span>
                  {slot.status === "cooldown" && (
                    <span className='text-[11px] text-slate-400'>
                      {slot.cooldown_remaining_seconds}s
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
