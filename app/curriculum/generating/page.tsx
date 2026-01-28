"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/layout";
import { useCurriculum } from "@/lib/curriculum-context";
import { LOADING_STEPS } from "../../const/loadingStep";
import LoadingIndicator from "./_component/LoadingIndicator";
import LoadingSteps from "./_component/LoadingSteps";
import PaperInfoCard from "./_component/PaperInfoCard";

/*
 * 커리큘럼 생성 로딩 페이지
 */
export default function GeneratingPage() {
  const router = useRouter();
  const { state, completeGeneration } = useCurriculum();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 커리큘럼 ID가 없으면 업로드 페이지로
    if (!state.curriculumId) {
      router.push("/curriculum/upload-paper");
      return;
    }

    // Mock: 진행률 애니메이션 (5.9 Use Functional setState)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    // Mock: 5초 후 완료
    const completeTimeout = setTimeout(() => {
      completeGeneration();
      router.push(`/curriculum/${state.curriculumId}`);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(completeTimeout);
    };
  }, [state.curriculumId, router, completeGeneration]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-secondary/20 via-background to-primary/10 relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse' />
        <div
          className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse'
          style={{ animationDelay: "1s" }}
        />
        <div
          className='absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse'
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className='relative z-10 flex flex-col items-center max-w-md mx-auto px-6 text-center'>
        {/* Logo */}
        <div className='mb-12'>
          <Logo size='lg' />
        </div>

        {/* Main loading indicator */}
        <LoadingIndicator progress={progress} stepIndex={currentStepIndex} />

        {/* Status text */}
        <h2 className='text-xl font-bold text-foreground mb-2'>
          커리큘럼 생성 중
        </h2>
        <p className='text-sm text-muted-foreground mb-8'>
          {LOADING_STEPS[currentStepIndex]?.label || "잠시만 기다려주세요..."}
        </p>

        {/* Step indicators */}
        <LoadingSteps
          currentStepIndex={currentStepIndex}
          total={LOADING_STEPS.length}
        />

        {/* Paper info */}
        {state.paper && (
          <PaperInfoCard title={state.paper.title} key={state.paper.paperId} />
        )}
      </div>
    </div>
  );
}
