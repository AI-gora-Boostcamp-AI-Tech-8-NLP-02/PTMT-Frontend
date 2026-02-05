"use client";

import { UserLevel } from "@/lib/types";
import { memo } from "react";
import { InfoTooltip } from "./InfoTooltip";

// 6.3 Hoist Static JSX
const LEVELS = [
  { id: "non_major", label: "입문자", desc: "처음 시작하는 단계" },
  { id: "bachelor", label: "중급자", desc: "기초 지식을 보유" },
  { id: "master", label: "전문가", desc: "심화 학습 가능" },
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
    <div className='bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='size-10 rounded-2xl bg-red-50 flex items-center justify-center'>
          <span className='material-symbols-outlined text-accent text-xl'>
            school
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold'>1. 학습 수준</h2>
          <InfoTooltip
            content={
              <span>
                목표 논문 도메인에 대한 배경지식 수준을 의미하며, 선택한 수준에 따라
                기초 개념부터 논문에 직접 등장하는 세부 개념까지{" "}
                <strong className='font-semibold text-slate-800'>
                  다루는 키워드의 수준과 그래프 깊이가 달라집니다
                </strong>
                .
              </span>
            }
          />
        </div>
      </div>
      <div className='grid gap-3 sm:grid-cols-3'>
        {LEVELS.map(l => (
          <label key={l.id} className='cursor-pointer relative w-full'>
            <input
              type='radio'
              name='level'
              value={l.id}
              checked={value === l.id}
              onChange={e => onChange(e.target.value as UserLevel)}
              className='peer sr-only'
            />
            <div className='w-full px-4 py-3 rounded-2xl border-2 border-transparent bg-slate-100 text-center peer-checked:border-primary peer-checked:bg-primary/10 transition-all hover:bg-slate-200 peer-checked:hover:bg-primary/10'>
              <span className='font-bold block mb-0.5'>{l.label}</span>
              <span className='text-[11px] text-slate-500'>{l.desc}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
});
