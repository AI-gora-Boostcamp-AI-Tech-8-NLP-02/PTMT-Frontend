"use client";

import { memo } from "react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

/**
 * 그래프 줌 컨트롤 버튼
 */
export const ZoomControls = memo(function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 p-1.5">
      <button
        onClick={onZoomIn}
        className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
        aria-label="Zoom in"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
      <div className="w-full h-px bg-slate-100 my-0.5" />
      <button
        onClick={onZoomOut}
        className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
        aria-label="Zoom out"
      >
        <span className="material-symbols-outlined">remove</span>
      </button>
      <div className="w-full h-px bg-slate-100 my-0.5" />
      <button
        onClick={onReset}
        className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
        aria-label="Reset view"
      >
        <span className="material-symbols-outlined text-xl">crop_free</span>
      </button>
    </div>
  );
});
