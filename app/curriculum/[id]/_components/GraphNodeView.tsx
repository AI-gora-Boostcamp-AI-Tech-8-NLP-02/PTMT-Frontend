import type { CurriculumNode } from "@/lib/types";
import { Handle, Position } from "@xyflow/react";
import { memo } from "react";

type Props = {
  data: {
    curriculum: CurriculumNode;
  };
  selected?: boolean;
};

export function CurriculumNodeView({ data, selected }: Props) {
  const { keyword, description, importance } = data.curriculum;

  const importanceColor =
    importance >= 7
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-600";

  return (
    <div
      className={`
        relative w-35 min-h-15 rounded-lg border bg-white px-3 py-2
        shadow-sm transition-all
        ${
          selected
            ? "border-blue-500 ring-2 ring-blue-200 scale-[1.02]"
            : "border-slate-200 hover:shadow"
        }
      `}
    >
      {/* 왼쪽 handle */}
      <Handle
        type='target'
        position={Position.Left}
        className='absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-teal-500 rounded-full'
      />

      <div>
        {/* title */}
        <h3 className='text-[12px] font-semibold text-slate-800 leading-tight line-clamp-2'>
          {keyword}
        </h3>

        {/* description */}
        {description && (
          <p className='mt-1 text-[11px] text-slate-600 leading-snug line-clamp-2'>
            {description}
          </p>
        )}

        {/* footer */}
        <div className='mt-1.5 flex justify-between items-center'>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded ${importanceColor}`}
          >
            ★ {importance}
          </span>
          <span className='text-[9px] text-slate-400'>node</span>
        </div>
      </div>

      {/* 오른쪽 handle */}
      <Handle
        type='source'
        position={Position.Right}
        className='absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-teal-500 rounded-full'
      />
    </div>
  );
}

export default memo(CurriculumNodeView);
