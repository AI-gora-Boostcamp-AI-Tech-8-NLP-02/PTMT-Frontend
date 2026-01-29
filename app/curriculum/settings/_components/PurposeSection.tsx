"use client";

import { CurriculumPurpose } from "@/lib/types";
import { memo } from "react";

// 6.3 Hoist Static JSX
const PURPOSES = [
  { id: "deep_research", label: "심층 연구", icon: "science" },
  { id: "simple_study", label: "개념 학습", icon: "school" },
  { id: "trend_check", label: "트렌드 파악", icon: "rate_review" },
  { id: "code_implementation", label: "구현 실습", icon: "code" },
  { id: "exam_preparation", label: "시험 준비", icon: "quiz" },
] as const;

interface PurposeSectionProps {
  value: CurriculumPurpose;
  onChange: (value: CurriculumPurpose) => void;
}

export const PurposeSection = memo(function PurposeSection({
  value,
  onChange,
}: PurposeSectionProps) {
  return (
    <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200'>
      <div className='flex items-center gap-3 mb-5'>
        <div className='size-10 rounded-2xl bg-red-50 flex items-center justify-center'>
          <span className='material-symbols-outlined text-accent text-xl'>
            target
          </span>
        </div>
        <h2 className='text-lg font-bold'>1. 학습 목적</h2>
      </div>
      <div className='flex flex-wrap gap-3'>
        {PURPOSES.map(p => (
          <label key={p.id} className='cursor-pointer'>
            <input
              type='radio'
              name='purpose'
              value={p.id}
              checked={value === p.id}
              onChange={e => onChange(e.target.value as CurriculumPurpose)}
              className='peer sr-only'
            />
            <div className='px-6 py-3 rounded-full border-2 border-transparent bg-slate-100 text-sm font-bold text-slate-600 transition-all peer-checked:bg-primary peer-checked:text-slate-900 peer-checked:shadow-sm hover:bg-slate-200 peer-checked:hover:bg-primary/90'>
              {p.label}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
});
