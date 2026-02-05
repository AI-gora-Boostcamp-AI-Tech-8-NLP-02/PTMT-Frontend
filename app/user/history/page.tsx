"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { AuthLoading } from "@/components/auth/AuthLoading";
import { Button } from "@/components/ui/button";
import { curriculumApi } from "@/lib/api";
import { CurriculumListItem } from "@/lib/types";
import { useAuthGuard } from "@/hooks";
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
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard();
  const router = useRouter();
  const PAGE_SIZE = 10;
  const [curriculums, setCurriculums] = useState<CurriculumListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    hasMore: false,
  });
  const [statsData, setStatsData] = useState({
    total: 0,
    completed: 0,
  });
  const [activityByDate, setActivityByDate] = useState<Record<string, number>>(
    {}
  );
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const toLocalDateKey = useCallback((value?: string) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      setIsLoading(true);
      try {
        const response = await curriculumApi.getAll({
          page,
          limit: PAGE_SIZE,
        });
        setCurriculums(response.items);
        setPagination({
          total: response.pagination.total,
          hasMore: response.pagination.has_more,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, page]);

  useEffect(() => {
    if (pagination.total === 0) return;
    const totalPages = Math.max(1, Math.ceil(pagination.total / PAGE_SIZE));
    if (page > totalPages) setPage(totalPages);
  }, [pagination.total, page]);

  // 5.9 Use Functional setState - useCallback으로 안정적인 참조
  const handleDelete = useCallback(
    async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (confirm("이 커리큘럼을 삭제하시겠습니까?")) {
        const target = curriculums.find(c => c.id === id);
        await curriculumApi.delete(id);
        setCurriculums(prev => {
          const next = prev.filter(c => c.id !== id);
          if (next.length === 0 && page > 1) {
            setPage(prevPage => prevPage - 1);
          }
          return next;
        });
        setPagination(prev => ({
          ...prev,
          total: Math.max(prev.total - 1, 0),
        }));
        setStatsData(prev => ({
          total: Math.max(prev.total - 1, 0),
          completed:
            target?.status === "ready"
              ? Math.max(prev.completed - 1, 0)
              : prev.completed,
        }));
        if (target?.updated_at) {
          const key = toLocalDateKey(target.updated_at);
          if (key) {
            setActivityByDate(prev => {
              const next = { ...prev };
              const nextValue = (next[key] || 1) - 1;
              if (nextValue <= 0) {
                delete next[key];
              } else {
                next[key] = nextValue;
              }
              return next;
            });
          }
        }
      }
    },
    [page, curriculums]
  );

  const handleItemClick = useCallback(
    (id: string) => {
      router.push(`/curriculum/${id}`);
    },
    [router]
  );

  const totalPages = Math.max(1, Math.ceil(pagination.total / PAGE_SIZE));
  const showPagination = pagination.total > PAGE_SIZE;

  useEffect(() => {
    if (!isAuthenticated) return;
    let isCancelled = false;

    const fetchStats = async () => {
      setIsStatsLoading(true);
      try {
        let currentPage = 1;
        let hasMore = true;
        let totalFromApi = 0;
        let totalCount = 0;
        let completed = 0;
        const activityMap: Record<string, number> = {};
        const STATS_PAGE_SIZE = 100;

        while (hasMore) {
          const response = await curriculumApi.getAll({
            page: currentPage,
            limit: STATS_PAGE_SIZE,
          });
          if (currentPage === 1) {
            totalFromApi = response.pagination.total;
          }
          totalCount += response.items.length;
          completed += response.items.filter(c => c.status === "ready").length;
          response.items.forEach(item => {
            const key = toLocalDateKey(item.updated_at);
            if (!key) return;
            activityMap[key] = (activityMap[key] || 0) + 1;
          });
          hasMore = response.pagination.has_more;
          currentPage += 1;
        }

        if (!isCancelled) {
          setStatsData({
            total: totalFromApi || totalCount,
            completed,
          });
          setActivityByDate(activityMap);
        }
      } finally {
        if (!isCancelled) setIsStatsLoading(false);
      }
    };

    fetchStats();
    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, toLocalDateKey]);

  if (authLoading || !isAuthenticated) {
    return <AuthLoading />;
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <HistoryHeader />

      <main className='max-w-275 mx-auto p-6 md:p-10'>
        {/* Page Header */}
        <HistoryStats
          {...statsData}
          isLoading={isStatsLoading}
          activityByDate={activityByDate}
        />

        {isLoading ? (
          <LoadingState />
        ) : curriculums.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <CurriculumList
              items={curriculums}
              onClick={handleItemClick}
              onDelete={handleDelete}
            />
            {showPagination && (
              <div className='mt-6 flex items-center justify-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  이전
                </Button>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  const isActive = pageNum === page;
                  return (
                    <Button
                      key={pageNum}
                      variant={isActive ? "default" : "outline"}
                      size='sm'
                      onClick={() => setPage(pageNum)}
                      disabled={isLoading}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant='outline'
                  size='sm'
                  disabled={!pagination.hasMore || isLoading}
                  onClick={() => setPage(p => p + 1)}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
