"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { curriculumApi } from "@/lib/api";
import { CurriculumListItem } from "@/lib/types";
import CurriculumList from "./_components/CurriculumList";
import EmptyState from "./_components/EmptyState";
import HistoryHeader from "./_components/HistoryHeader";
import HistoryStats from "./_components/HistoryStats";
import LoadingState from "./_components/LoadingState";

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
      <HistoryHeader />

      <main className='max-w-275 mx-auto p-6 md:p-10'>
        {/* Page Header */}
        <HistoryStats {...stats} />

        {isLoading ? (
          <LoadingState />
        ) : curriculums.length === 0 ? (
          <EmptyState />
        ) : (
          <CurriculumList
            items={curriculums}
            onClick={handleItemClick}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
