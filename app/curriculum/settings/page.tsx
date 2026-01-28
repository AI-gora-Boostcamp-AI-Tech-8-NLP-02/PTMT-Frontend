"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { curriculumApi } from "@/lib/api";
import { useCurriculum } from "@/lib/curriculum-context";
import { CurriculumPurpose, ResourceType, UserLevel } from "@/lib/types";
import { KnownConceptsSection } from "./components/KnownConceptsSection";
import { LevelSection } from "./components/LevelSection";
import { PurposeSection } from "./components/PurposeSection";
import { ResourcesSection } from "./components/ResourcesSection";
import { TimeSection } from "./components/TimeSection";

/**
 * 커리큘럼 설정 페이지
 *
 * 적용된 Vercel Best Practices:
 * - 5.5 Extract to Memoized Components - 각 섹션을 별도 컴포넌트로 분리
 * - 5.9 Use Functional setState - useCallback으로 안정적인 콜백
 * - 6.3 Hoist Static JSX - 정적 데이터를 각 컴포넌트에서 상수로 분리
 */
export default function CurriculumSettingsPage() {
  const router = useRouter();
  const { state, setOptions, startGeneration } = useCurriculum();

  // State
  const [purpose, setPurpose] = useState<CurriculumPurpose>("simple_study");
  const [level, setLevel] = useState<UserLevel>("bachelor");
  const [knownConcepts, setKnownConcepts] = useState<string[]>([]);
  const [studyDays, setStudyDays] = useState(14);
  const [dailyHours, setDailyHours] = useState(2);
  const [preferredResources, setPreferredResources] = useState<ResourceType[]>([
    "paper",
    "article",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 7.8 Early Return - paper 없으면 리다이렉트
  useEffect(() => {
    if (!state.paper) {
      router.push("/curriculum/upload-paper");
    }
  }, [state.paper, router]);

  // 5.9 Use Functional setState - useCallback으로 안정적인 참조
  const handlePurposeChange = useCallback((value: CurriculumPurpose) => {
    setPurpose(value);
  }, []);

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
    if (!state.curriculumId) return;
    setIsSubmitting(true);

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

  // 7.8 Early Return
  if (!state.paper) return null;

  const extractedKeywords = state.paper.keywords || [];

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1 py-10 px-6'>
        <div className='max-w-225 mx-auto'>
          {/* Header */}
          <div className='mb-10'>
            <h1 className='text-3xl md:text-4xl font-black tracking-tight mb-2'>
              커리큘럼 <span className='text-accent'>설정</span>
            </h1>
            <p className='text-slate-500'>
              &quot;{state.paper.title}&quot; 논문에 맞는 커리큘럼을 설계합니다.
            </p>
          </div>

          <div className='space-y-6'>
            {/* 1. Purpose */}
            <PurposeSection value={purpose} onChange={handlePurposeChange} />

            {/* 2. Level */}
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
              <p className='text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1'>
                <span className='material-symbols-outlined text-[14px]'>
                  info
                </span>
                복잡도에 따라 AI 생성에 최대 30초가 소요될 수 있어요.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
