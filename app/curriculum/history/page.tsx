"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Logo } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { curriculumApi } from "@/lib/api";
import { CurriculumListItem, CurriculumStatus } from "@/lib/types";

// 6.3 Hoist Static JSX - 정적 설정 데이터
const STATUS_CONFIG: Record<
  CurriculumStatus,
  { label: string; icon: string; color: string }
> = {
  draft: {
    label: "초안",
    icon: "draft",
    color: "bg-slate-100 text-slate-600",
  },
  options_saved: {
    label: "설정 완료",
    icon: "settings",
    color: "bg-blue-100 text-blue-700",
  },
  generating: {
    label: "생성 중",
    icon: "pending",
    color: "bg-amber-100 text-amber-700",
  },
  ready: {
    label: "완료",
    icon: "check_circle",
    color: "bg-green-100 text-green-700",
  },
  failed: { label: "실패", icon: "error", color: "bg-red-100 text-red-600" },
} as const;

/**
 * 커리큘럼 히스토리 페이지
 *
 * 적용된 Vercel Best Practices:
 * - 5.9 Use Functional setState - useCallback으로 안정적인 콜백
 * - 6.3 Hoist Static JSX - STATUS_CONFIG 상수화
 * - 5.1 Calculate Derived State During Rendering - useMemo로 통계 계산
 */
export default function CurriculumHistoryPage() {
  const router = useRouter();
  const [curriculums, setCurriculums] = useState<CurriculumListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await curriculumApi.getAll();
      setCurriculums(response.items);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // 5.1 Calculate Derived State During Rendering
  const stats = useMemo(
    () => ({
      total: curriculums.length,
      completed: curriculums.filter(c => c.status === "ready").length,
      totalHours: curriculums.reduce(
        (acc, c) => acc + (c.estimated_hours || 0),
        0
      ),
    }),
    [curriculums]
  );

  // 5.9 Use Functional setState - useCallback으로 안정적인 참조
  const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("이 커리큘럼을 삭제하시겠습니까?")) {
      await curriculumApi.delete(id);
      setCurriculums(prev => prev.filter(c => c.id !== id));
    }
  }, []);

  const handleItemClick = useCallback(
    (id: string) => {
      router.push(`/curriculum/${id}`);
    },
    [router]
  );

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b border-slate-200 bg-white sticky top-0 z-10'>
        <div className='max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between'>
          <Logo />
          <Link href='/curriculum/upload-paper'>
            <Button className='rounded-xl font-bold bg-primary text-primary-foreground gap-2'>
              <span className='material-symbols-outlined text-lg'>add</span>새
              커리큘럼
            </Button>
          </Link>
        </div>
      </header>

      <main className='max-w-[1100px] mx-auto p-6 md:p-10'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='text-2xl md:text-3xl font-black tracking-tight mb-1'>
            내 커리큘럼
          </h1>
          <p className='text-slate-500'>
            생성한 학습 경로를 확인하고 관리하세요.
          </p>
        </div>

        {/* Stats - 5.1 Derived State */}
        <div className='grid grid-cols-3 gap-4 mb-8'>
          <div className='bg-white rounded-2xl p-5 border border-slate-200'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='size-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                <span className='material-symbols-outlined text-primary'>
                  library_books
                </span>
              </div>
              <span className='text-2xl font-black'>{stats.total}</span>
            </div>
            <p className='text-sm text-slate-500'>전체 커리큘럼</p>
          </div>
          <div className='bg-white rounded-2xl p-5 border border-slate-200'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='size-10 rounded-xl bg-green-100 flex items-center justify-center'>
                <span className='material-symbols-outlined text-green-600'>
                  check_circle
                </span>
              </div>
              <span className='text-2xl font-black'>{stats.completed}</span>
            </div>
            <p className='text-sm text-slate-500'>완료됨</p>
          </div>
          <div className='bg-white rounded-2xl p-5 border border-slate-200'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='size-10 rounded-xl bg-amber-100 flex items-center justify-center'>
                <span className='material-symbols-outlined text-amber-600'>
                  schedule
                </span>
              </div>
              <span className='text-2xl font-black'>
                {stats.totalHours.toFixed(0)}
              </span>
            </div>
            <p className='text-sm text-slate-500'>총 학습 시간</p>
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className='flex items-center justify-center py-32'>
            <span className='material-symbols-outlined animate-spin text-5xl text-primary'>
              progress_activity
            </span>
          </div>
        ) : curriculums.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-3xl border border-slate-200'>
            <span className='material-symbols-outlined text-7xl text-slate-200'>
              folder_open
            </span>
            <p className='text-slate-500 text-lg'>
              아직 생성된 커리큘럼이 없습니다.
            </p>
            <Link href='/curriculum/upload-paper'>
              <Button className='rounded-xl'>첫 커리큘럼 만들기</Button>
            </Link>
          </div>
        ) : (
          <div className='space-y-3'>
            {curriculums.map(c => {
              const status = STATUS_CONFIG[c.status] || STATUS_CONFIG.draft;
              return (
                <div
                  key={c.id}
                  onClick={() => handleItemClick(c.id)}
                  className='group flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer'
                >
                  {/* Icon */}
                  <div className='size-12 shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-105 transition-transform'>
                    <span className='material-symbols-outlined text-xl text-primary'>
                      psychology
                    </span>
                  </div>

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-bold text-base truncate group-hover:text-primary transition-colors'>
                      {c.title}
                    </h3>
                    <p className='text-sm text-slate-500'>
                      {c.paper_title || "논문 정보 없음"}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className='hidden md:flex items-center gap-6 text-sm text-slate-500'>
                    <div className='flex items-center gap-1.5'>
                      <span className='material-symbols-outlined text-base'>
                        view_module
                      </span>
                      {c.node_count || 0}개 노드
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <span className='material-symbols-outlined text-base'>
                        schedule
                      </span>
                      {c.estimated_hours || 0}시간
                    </div>
                  </div>

                  {/* Date */}
                  <div className='hidden lg:block text-right text-sm'>
                    <p className='font-medium text-slate-700'>
                      {new Date(c.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>

                  {/* Status */}
                  <Badge className={`${status.color} gap-1 font-bold shrink-0`}>
                    <span
                      className={`material-symbols-outlined text-sm icon-filled ${c.status === "generating" ? "animate-pulse" : ""}`}
                    >
                      {status.icon}
                    </span>
                    {status.label}
                  </Badge>

                  {/* Delete */}
                  <button
                    onClick={e => handleDelete(c.id, e)}
                    className='size-9 shrink-0 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100'
                  >
                    <span className='material-symbols-outlined text-lg'>
                      delete
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
