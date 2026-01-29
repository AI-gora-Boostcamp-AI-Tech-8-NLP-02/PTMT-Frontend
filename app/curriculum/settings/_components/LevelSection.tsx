"use client";

import { UserLevel } from "@/lib/types";
import { memo } from "react";

// 6.3 Hoist Static JSX
const LEVELS = [
  { id: "non_major", label: "입문자", desc: "비전공자/처음 시작" },
  { id: "bachelor", label: "학부생", desc: "기초 지식 보유" },
  { id: "master", label: "대학원생", desc: "심화 학습 가능" },
  { id: "researcher", label: "연구원", desc: "전문 연구 경험" },
  { id: "industry", label: "현업", desc: "실무 적용 목적" },
] as const;

interface LevelSectionProps {
  value: UserLevel;
  onChange: (value: UserLevel) => void;
}

export const LevelSection = memo(function LevelSection({
  value,
  onChange,
}: LevelSectionProps) {
  return (
    <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200'>
      <div className='flex items-center gap-3 mb-5'>
        <div className='size-10 rounded-2xl bg-red-50 flex items-center justify-center'>
          <span className='material-symbols-outlined text-accent text-xl'>
            school
          </span>
        </div>
        <h2 className='text-lg font-bold'>2. 학습 수준</h2>
      </div>
      <div className='flex flex-wrap gap-3'>
        {LEVELS.map(l => (
          <label key={l.id} className='cursor-pointer relative'>
            <input
              type='radio'
              name='level'
              value={l.id}
              checked={value === l.id}
              onChange={e => onChange(e.target.value as UserLevel)}
              className='peer sr-only'
            />
            <div className='px-5 py-3 rounded-2xl border-2 border-transparent bg-slate-100 text-center peer-checked:border-primary peer-checked:bg-primary/10 transition-all hover:bg-slate-200 peer-checked:hover:bg-primary/10'>
              <span className='font-bold block mb-0.5'>{l.label}</span>
              <span className='text-xs text-slate-500'>{l.desc}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
});
