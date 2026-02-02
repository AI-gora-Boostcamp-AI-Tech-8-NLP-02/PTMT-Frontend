import type { CurriculumNode } from "@/lib/types";
import { Handle, Position } from "@xyflow/react";
import { memo } from "react";
import { RESOURCE_TYPE_ICONS } from "../../../../const/resourceType";

type Props = {
  data: {
    curriculum: CurriculumNode;
  };
  selected?: boolean;
};

export function CurriculumNodeView({ data, selected }: Props) {
  const { keyword, resources, is_keyword_necessary } = data.curriculum;

  return (
    <div className='relative'>
      {/* 바깥쪽 점선 */}
      {selected && (
        <div className='absolute -inset-3 rounded-4xl border-4 border-dashed border-blue-700 animate-dash pointer-events-none z-0 scale-105' />
      )}
      <div
        className={`
        relative min-w-65 rounded-4xl border bg-white px-5 py-20
        shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center
        ${
          selected
            ? "border-blue-700 border-6 shadow-lg scale-105 z-10"
            : is_keyword_necessary
              ? "border-accent border-5"
              : "border-slate-100 hover:border-slate-300 hover:shadow-lg"
        }
      `}
      >
        {/* 왼쪽 handle */}
        <Handle
          type='target'
          position={Position.Left}
          className='absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-teal-500 rounded-full opacity-0'
        />

        <div>
          {/* title */}
          <h3 className='text-3xl font-bold text-slate-800 leading-snug mb-3 line-clamp-2'>
            {keyword}
          </h3>

          <div className='flex items-center justify-center w-full gap-3 mt-1'>
            {resources.map((res, idx) => (
              <span
                key={idx}
                className={`material-symbols-outlined text-4xl transition-colors ${
                  res.is_necessary ? "text-accent" : "text-slate-400"
                }`}
                style={{ fontSize: "56px" }}
              >
                {RESOURCE_TYPE_ICONS[res.type] || "psychology"}
              </span>
            ))}
          </div>
        </div>

        {/* 오른쪽 handle */}
        <Handle
          type='source'
          position={Position.Right}
          className='absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-teal-500 rounded-full opacity-0'
        />
      </div>
    </div>
  );
}

export default memo(CurriculumNodeView);
