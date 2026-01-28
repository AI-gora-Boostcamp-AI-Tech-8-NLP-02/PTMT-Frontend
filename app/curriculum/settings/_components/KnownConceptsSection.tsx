"use client";

import { Keyword } from "@/lib/types";
import { memo, useCallback } from "react";

// 6.3 Hoist Static JSX
const emptyState = (
  <div className='p-4 bg-slate-50 rounded-xl text-center text-slate-400 text-sm'>
    논문에서 추출된 개념이 없습니다.
  </div>
);

interface KnownConceptsSectionProps {
  keywords: Keyword[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const KnownConceptsSection = memo(function KnownConceptsSection({
  keywords,
  selected,
  onChange,
}: KnownConceptsSectionProps) {
  // 5.9 Use Functional setState - useCallback으로 안정적인 참조
  const toggleConcept = useCallback(
    (keyId: string) => {
      onChange(
        selected.includes(keyId)
          ? selected.filter(x => x !== keyId)
          : [...selected, keyId]
      );
    },
    [selected, onChange]
  );

  return (
    <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200'>
      <div className='flex items-center gap-3 mb-2'>
        <div className='size-10 rounded-2xl bg-red-50 flex items-center justify-center'>
          <span className='material-symbols-outlined text-accent text-xl'>
            psychology
          </span>
        </div>
        <div>
          <h2 className='text-lg font-bold'>3. 이미 알고 있는 개념</h2>
        </div>
      </div>
      <p className='text-sm text-slate-500 mb-4 ml-13'>
        선택한 개념은 커리큘럼에서 간략히 다루거나 건너뜁니다.
      </p>

      {keywords.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
          {keywords.map(kw => {
            const keyId = kw.id || kw.name;
            const isChecked = selected.includes(keyId);
            return (
              <button
                key={keyId}
                type='button'
                onClick={() => toggleConcept(keyId)}
                className={`px-5 py-2 rounded-full border-2 font-bold text-sm transition-all hover:bg-slate-200 flex items-center gap-1.5 ${
                  isChecked
                    ? "border-primary bg-primary/10 text-slate-800"
                    : "border-transparent bg-slate-100 text-slate-500"
                }`}
              >
                <span>{kw.name}</span>
              </button>
            );
          })}
        </div>
      ) : (
        emptyState
      )}
    </div>
  );
});
