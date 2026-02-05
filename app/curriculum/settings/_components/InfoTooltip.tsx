"use client";

import { memo, type ReactNode } from "react";

interface InfoTooltipProps {
  content: ReactNode;
}

export const InfoTooltip = memo(function InfoTooltip({
  content,
}: InfoTooltipProps) {
  return (
    <span className='relative inline-flex items-center group'>
      <span
        className='flex size-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-bold text-slate-500 bg-white/90 backdrop-blur-sm transition-colors group-hover:text-slate-700 group-hover:border-slate-400'
        aria-label='help'
        role='img'
      >
        ?
      </span>
      <span className='pointer-events-none absolute left-full top-1/2 z-20 ml-2 w-80 -translate-y-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-600 shadow-lg opacity-0 transition-all duration-200 group-hover:opacity-100'>
        {content}
      </span>
    </span>
  );
});
