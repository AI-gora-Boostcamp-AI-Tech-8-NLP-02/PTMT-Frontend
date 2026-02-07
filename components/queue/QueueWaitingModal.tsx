import { QueueStatus } from "@/lib/types";

interface QueueWaitingModalProps {
  open: boolean;
  status: QueueStatus | null;
  isLoading: boolean;
  error: string | null;
  title: string;
  subtitle: string;
  onClose?: () => void;
}

function getMyPosition(status: QueueStatus | null) {
  if (!status) return "확인 중";
  if (status.my_status === "processing") return "지금 처리 중";
  if (status.my_status === "waiting" && status.my_position) {
    return `${status.my_position}번`;
  }
  return "대기열 반영 중";
}

export default function QueueWaitingModal({
  open,
  status,
  isLoading,
  error,
  title,
  subtitle,
  onClose,
}: QueueWaitingModalProps) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-[1px]'>
      <div className='relative w-full max-w-md rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-[0_28px_80px_rgba(15,23,42,0.25)]'>
        {onClose && (
          <button
            type='button'
            aria-label='대기열 팝업 닫기'
            onClick={onClose}
            className='absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
          >
            <span className='material-symbols-outlined text-lg'>close</span>
          </button>
        )}

        <p className='text-center text-sm font-black tracking-wide text-slate-800'>
          대기열 안내
        </p>
        <h3 className='mt-3 text-center text-3xl font-black leading-tight text-slate-900'>
          {title}
        </h3>
        <p className='mt-2 text-center text-sm text-slate-500'>{subtitle}</p>

        <div className='mt-7 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3'>
          <div className='flex items-end justify-between gap-3'>
            <p className='text-sm font-semibold text-slate-600'>현재 대기 인원</p>
            <p className='text-2xl font-black text-amber-600'>
              {status ? `${status.waiting_jobs}명` : "-"}
            </p>
          </div>
        </div>

        <div className='mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3'>
          <div className='flex items-end justify-between gap-3'>
            <p className='text-sm font-semibold text-slate-600'>내 순번</p>
            <p className='text-2xl font-black text-slate-900'>
              {getMyPosition(status)}
            </p>
          </div>
        </div>

        <div className='mt-5 min-h-5 text-center text-xs text-slate-500'>
          {error
            ? error
            : isLoading
              ? "대기열 정보를 불러오는 중입니다."
              : "순서가 되면 자동으로 다음 단계로 진행됩니다."}
        </div>
      </div>
    </div>
  );
}
