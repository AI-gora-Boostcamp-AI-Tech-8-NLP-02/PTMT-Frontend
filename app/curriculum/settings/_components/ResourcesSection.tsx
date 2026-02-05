"use client";

import { ResourceType } from "@/lib/types";
import { memo, useCallback } from "react";
import { RESOURCE_TYPES } from "../../../../const/resourceType";

interface ResourcesSectionProps {
  selected: ResourceType[];
  onChange: (selected: ResourceType[]) => void;
}

export const ResourcesSection = memo(function ResourcesSection({
  selected,
  onChange,
}: ResourcesSectionProps) {
  // 5.9 Use Functional setState
  const toggleResource = useCallback(
    (id: ResourceType) => {
      onChange(
        selected.includes(id)
          ? selected.filter(x => x !== id)
          : [...selected, id]
      );
    },
    [selected, onChange]
  );

  return (
    <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200'>
      <div className='flex items-center gap-3 mb-5'>
        <div className='size-10 rounded-2xl bg-red-50 flex items-center justify-center'>
          <span className='material-symbols-outlined text-accent text-xl'>
            library_books
          </span>
        </div>
        <h2 className='text-lg font-bold'>4. 선호 자료 형태</h2>
      </div>
      <div className='flex flex-col gap-3'>
        {RESOURCE_TYPES.map(r => (
          <label
            key={r.id}
            className='flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors group'
          >
            <div className='relative flex items-center justify-center size-6 ml-1'>
              <input
                type='checkbox'
                checked={selected.includes(r.id)}
                onChange={() => toggleResource(r.id)}
                className='peer appearance-none size-6 bg-white border-2 border-slate-200 rounded-full checked:bg-primary checked:border-primary transition-all'
              />
              <span className='material-symbols-outlined text-slate-900 text-[16px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none font-bold'>
                check
              </span>
            </div>
            <span className='flex-1 text-sm font-bold text-slate-600 group-hover:text-slate-900'>
              {r.label}
            </span>
            <span className='material-symbols-outlined text-slate-300 group-hover:text-primary text-[20px] mr-1 transition-colors'>
              {r.icon}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
});
