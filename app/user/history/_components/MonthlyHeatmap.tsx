"use client";

import { memo, useMemo } from "react";

interface MonthlyHeatmapProps {
  activityByDate: Record<string, number>;
  isLoading?: boolean;
}

const WEEK_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
const WEEKS = 26;
const TARGET_CELL = 10;
const CELL_GAP = 3;
const LABEL_WIDTH = 28;
const LABEL_GAP = 10;

function toKey(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function levelFor(count: number, max: number) {
  if (count <= 0) return 0;
  if (max <= 1) return 2;
  if (count <= Math.ceil(max * 0.25)) return 1;
  if (count <= Math.ceil(max * 0.6)) return 2;
  if (count <= Math.ceil(max * 0.85)) return 3;
  return 4;
}

const LEVEL_CLASS = [
  "bg-slate-100",
  "bg-emerald-100",
  "bg-emerald-200",
  "bg-emerald-300",
  "bg-emerald-400",
];

const MonthlyHeatmap = memo(function MonthlyHeatmap({
  activityByDate,
  isLoading = false,
}: MonthlyHeatmapProps) {
  const now = new Date();
  const totalDays = WEEKS * 7;
  const startDate = useMemo(() => {
    const date = new Date(now);
    date.setDate(now.getDate() - totalDays + 1);
    return date;
  }, [now, totalDays]);

  const counts = useMemo(() => {
    const values: number[] = [];
    for (let i = 0; i < totalDays; i += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const key = toKey(date.getFullYear(), date.getMonth(), date.getDate());
      values.push(activityByDate[key] || 0);
    }
    return values;
  }, [activityByDate, startDate, totalDays]);

  const maxCount = useMemo(
    () => Math.max(0, ...counts),
    [counts]
  );

  const monthLabels = useMemo(() => {
    const labels: string[] = [];
    let prevMonth = -1;
    for (let week = 0; week < WEEKS; week += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7);
      const month = date.getMonth();
      if (month !== prevMonth) {
        labels.push(MONTH_LABELS[month]);
        prevMonth = month;
      } else {
        labels.push("");
      }
    }
    return labels;
  }, [startDate]);

  const cells = useMemo(() => {
    const grid: Array<Array<{ date: Date | null; count: number }>> = Array.from(
      { length: WEEKS },
      () => Array.from({ length: 7 }, () => ({ date: null, count: 0 }))
    );

    for (let i = 0; i < totalDays; i += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const weekIndex = Math.floor(i / 7);
      if (weekIndex >= WEEKS) break;
      const dayIndex = date.getDay();
      const key = toKey(date.getFullYear(), date.getMonth(), date.getDate());
      grid[weekIndex][dayIndex] = {
        date,
        count: activityByDate[key] || 0,
      };
    }

    const result: Array<{ date: Date | null; count: number }> = [];
    for (let week = 0; week < WEEKS; week += 1) {
      for (let day = 0; day < 7; day += 1) {
        result.push(grid[week][day]);
      }
    }
    return result;
  }, [activityByDate, startDate, totalDays]);

  const gridWidth = useMemo(
    () => WEEKS * TARGET_CELL + (WEEKS - 1) * CELL_GAP,
    []
  );
  const layoutWidth = useMemo(
    () => LABEL_WIDTH + LABEL_GAP + gridWidth,
    [gridWidth]
  );

  return (
    <div className='rounded-xl border border-slate-200 bg-white/80 p-4 w-full'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <p className='text-sm font-medium text-slate-700'>최근 활동</p>
        </div>
        <div className='hidden items-center gap-1 text-[10px] text-slate-400 sm:flex'>
          <span>Less</span>
          <span className='size-3 rounded-[3px] bg-slate-100' />
          <span className='size-3 rounded-[3px] bg-emerald-100' />
          <span className='size-3 rounded-[3px] bg-emerald-200' />
          <span className='size-3 rounded-[3px] bg-emerald-300' />
          <span className='size-3 rounded-[3px] bg-emerald-400' />
          <span>More</span>
        </div>
      </div>

      <div className='mt-3'>
        <div className='mx-auto' style={{ width: `${layoutWidth}px` }}>
          <div
            className='grid'
            style={{
              gridTemplateColumns: `${LABEL_WIDTH}px ${gridWidth}px`,
              columnGap: `${LABEL_GAP}px`,
            }}
          >
            <div />
            <div
              className='grid text-[9px] text-slate-400'
              style={{
                gridTemplateColumns: `repeat(${WEEKS}, ${TARGET_CELL}px)`,
                columnGap: `${CELL_GAP}px`,
              }}
            >
              {monthLabels.map((label, index) => (
                <span key={`${label}-${index}`} className='leading-none'>
                  {label}
                </span>
              ))}
            </div>

            <div
              className='grid text-[9px] text-slate-400'
              style={{
                rowGap: `${CELL_GAP}px`,
                gridTemplateRows: `repeat(7, ${TARGET_CELL}px)`,
              }}
            >
              {WEEK_LABELS.map(label => (
                <span key={label} className='flex items-center leading-none'>
                  {label}
                </span>
              ))}
            </div>

        <div
          className='grid'
          style={{
            gridTemplateColumns: `repeat(${WEEKS}, ${TARGET_CELL}px)`,
            gridTemplateRows: `repeat(7, ${TARGET_CELL}px)`,
            columnGap: `${CELL_GAP}px`,
            rowGap: `${CELL_GAP}px`,
            gridAutoFlow: "column",
          }}
        >
          {isLoading
            ? Array.from({ length: totalDays }).map((_, index) => (
                <div
                  key={index}
                  className='rounded-[3px] bg-slate-100 animate-pulse'
                />
              ))
            : cells.map((cell, index) => {
                if (!cell.date) {
                  return (
                    <div key={index} className='rounded-[3px] bg-transparent' />
                  );
                }
                const level = levelFor(cell.count, maxCount);
                const label = `${cell.date.getFullYear()}.${String(
                  cell.date.getMonth() + 1
                ).padStart(2, "0")}.${String(cell.date.getDate()).padStart(
                  2,
                  "0"
                )}`;
                    return (
                      <div
                        key={index}
                        title={`${label} · ${cell.count}회`}
                        className={`rounded-[3px] ${LEVEL_CLASS[level]}`}
                      />
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MonthlyHeatmap;
