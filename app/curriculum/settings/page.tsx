"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { AuthLoading } from "@/components/auth/AuthLoading";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import QueueStatusCard from "@/components/queue/QueueStatusCard";
import { useAuthGuard, useQueueStatus } from "@/hooks";
import { curriculumApi } from "@/lib/api";
import { useCurriculum } from "@/lib/curriculum-context";
import { CurriculumPurpose, ResourceType, UserLevel } from "@/lib/types";
import { KnownConceptsSection } from "./_components/KnownConceptsSection";
import { LevelSection } from "./_components/LevelSection";
import { ResourcesSection } from "./_components/ResourcesSection";
import { TimeSection } from "./_components/TimeSection";

/**
 * 커리큘럼 설정 페이지
 */
export default function CurriculumSettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard();
  const router = useRouter();
  const { state, setOptions, startGeneration } = useCurriculum();
  const {
    status: queueStatus,
    isLoading: queueLoading,
    error: queueError,
    lastUpdated,
  } = useQueueStatus(3000, isAuthenticated);

  // State
  const purpose: CurriculumPurpose = "simple_study";
  const [level, setLevel] = useState<UserLevel>("bachelor");
  const [knownConcepts, setKnownConcepts] = useState<string[]>([]);
  const [studyDays, setStudyDays] = useState(14);
  const [dailyHours, setDailyHours] = useState(2);
  const [preferredResources, setPreferredResources] = useState<ResourceType[]>([
    "paper",
    "web_doc",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 7.8 Early Return - paper 없으면 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!state.paper || !state.curriculumId) {
      router.push("/curriculum/upload-paper");
    }
  }, [isAuthenticated, state.paper, state.curriculumId, router]);

  // 5.9 Use Functional setState - useCallback으로 안정적인 참조
  const handleLevelChange = useCallback((value: UserLevel) => {
    setLevel(value);
  }, []);

  const handleKnownConceptsChange = useCallback((selected: string[]) => {
    setKnownConcepts(selected);
  }, []);

  const handleStudyDaysChange = useCallback((days: number) => {
    setStudyDays(days);
  }, []);

  const handleDailyHoursChange = useCallback((hours: number) => {
    setDailyHours(hours);
  }, []);

  const handleResourcesChange = useCallback((selected: ResourceType[]) => {
    setPreferredResources(selected);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!state.curriculumId) {
      setSubmitError(
        "커리큘럼 정보를 찾을 수 없습니다. 다시 논문을 업로드해주세요."
      );
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const options = {
        purpose,
        level,
        known_concepts: knownConcepts,
        budgeted_time: {
          days: studyDays,
          daily_hours: dailyHours,
        },
        preferred_resources: preferredResources,
      };

      setOptions(options);
      await curriculumApi.setOptions(state.curriculumId, options);
      startGeneration();
      await curriculumApi.startGeneration(state.curriculumId);
      router.push("/curriculum/generating");
    } catch (err) {
      console.error("Failed to start generation:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "커리큘럼 생성 요청에 실패했습니다."
      );
      setIsSubmitting(false);
    }
  }, [
    state.curriculumId,
    purpose,
    level,
    knownConcepts,
    studyDays,
    dailyHours,
    preferredResources,
    setOptions,
    startGeneration,
    router,
  ]);

  if (authLoading || !isAuthenticated) {
    return <AuthLoading />;
  }

  // 7.8 Early Return
  if (!state.paper) return null;

  const extractedKeywords = state.paper.keywords || [];

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1 py-10 px-6'>
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <div className='mb-10'>
            <h1 className='text-3xl md:text-4xl font-black tracking-tight mb-2'>
              커리큘럼 <span className='text-accent'>설정</span>
            </h1>
            <p className='text-slate-500'>
              &quot;{state.paper.title}&quot; 논문에 맞는 커리큘럼을 설계합니다.
            </p>
          </div>

          {submitError && (
            <div className='mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
              {submitError}
            </div>
          )}

          <div className='space-y-6'>
            {/* 1. Level */}
            <LevelSection value={level} onChange={handleLevelChange} />

            {/* 3. Known Concepts */}
            <KnownConceptsSection
              keywords={extractedKeywords}
              selected={knownConcepts}
              onChange={handleKnownConceptsChange}
            />

            {/* 4 & 5. Time & Resources */}
            <div className='grid md:grid-cols-2 gap-6'>
              <TimeSection
                studyDays={studyDays}
                dailyHours={dailyHours}
                onStudyDaysChange={handleStudyDaysChange}
                onDailyHoursChange={handleDailyHoursChange}
              />
              <ResourcesSection
                selected={preferredResources}
                onChange={handleResourcesChange}
              />
            </div>

            {/* Submit */}
            <div className='pt-6 pb-12'>
              <QueueStatusCard
                status={queueStatus}
                isLoading={queueLoading}
                error={queueError}
                lastUpdated={lastUpdated}
                className='mb-4'
              />
              {isSubmitting && (
                <div className='mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700'>
                  키 배정 대기열 순서에 따라 생성이 시작됩니다. 잠시만 기다려주세요.
                </div>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='w-full h-14 rounded-full text-lg font-black bg-primary text-slate-900 hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50'
              >
                {isSubmitting ? (
                  <span className='flex items-center gap-2'>
                    <span className='material-symbols-outlined animate-spin'>
                      progress_activity
                    </span>
                    처리 중...
                  </span>
                ) : (
                  <span className='flex items-center gap-2'>
                    <span className='material-symbols-outlined text-xl icon-filled'>
                      auto_awesome
                    </span>
                    나만의 커리큘럼 생성하기
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
