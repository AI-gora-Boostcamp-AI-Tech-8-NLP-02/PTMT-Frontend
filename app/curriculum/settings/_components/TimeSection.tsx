"use client";

import { memo } from "react";
import { Input } from "@/components/ui/input";
import { InfoTooltip } from "./InfoTooltip";

interface TimeSectionProps {
  studyDays: number;
  dailyHours: number;
  onStudyDaysChange: (days: number) => void;
  onDailyHoursChange: (hours: number) => void;
}

export const TimeSection = memo(function TimeSection({
  studyDays,
  dailyHours,
  onStudyDaysChange,
  onDailyHoursChange,
}: TimeSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-5">
        <div className="size-10 rounded-2xl bg-red-50 flex items-center justify-center">
          <span className="material-symbols-outlined text-accent text-xl">
            schedule
          </span>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">3. 목표 투자 시간</h2>
          <InfoTooltip
            content={
              <span className="space-y-1">
                <span className="block">학습에 투자할 수 있는 총 시간입니다.</span>
                <span className="block">
                  <strong className="font-semibold text-slate-800">
                    시간이 길수록 필수 노드가 많아지고, 짧을수록 핵심만 남습니다
                  </strong>
                  .
                </span>
              </span>
            }
          />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold mb-2 text-slate-500 ml-1">
            학습 기간 (일)
          </label>
          <div className="relative">
            <Input
              type="number"
              value={studyDays}
              onChange={e => onStudyDaysChange(Number(e.target.value))}
              min={1}
              max={365}
              className="h-12 rounded-2xl border-2 border-slate-200 pr-12 bg-slate-50 focus:border-primary"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
              일
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 text-slate-500 ml-1">
            일일 학습 시간
          </label>
          <div className="relative">
            <Input
              type="number"
              value={dailyHours}
              onChange={e => onDailyHoursChange(Number(e.target.value))}
              min={0.5}
              max={12}
              step={0.5}
              className="h-12 rounded-2xl border-2 border-slate-200 pr-12 bg-slate-50 focus:border-primary"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
              시간
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
