export default function AiNotice() {
  return (
    <div>
      <div className='flex items-center gap-4 p-5 bg-linear-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl mt-8'>
        <div className='size-12 shrink-0 flex items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent shadow-lg'>
          <span className='material-symbols-outlined text-white text-xl'>
            auto_awesome
          </span>
        </div>
        <div>
          <span className='text-sm font-bold block'>AI 자동 분석</span>
          <span className='text-xs text-slate-500'>
            업로드 시 제목, 초록, 핵심 개념을 자동 추출합니다.
          </span>
        </div>
      </div>
    </div>
  );
}
