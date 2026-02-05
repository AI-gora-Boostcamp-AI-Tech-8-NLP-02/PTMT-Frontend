"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AuthLoading } from "@/components/auth/AuthLoading";
import { Logo } from "@/components/layout";
import { useAuthGuard } from "@/hooks";
import { curriculumApi } from "@/lib/api";
import { useCurriculum } from "@/lib/curriculum-context";
import { LOADING_STEPS } from "../../../const/loadingStep";
import LoadingIndicator from "./_component/LoadingIndicator";
import LoadingSteps from "./_component/LoadingSteps";
import PaperInfoCard from "./_component/PaperInfoCard";

/*
 * 커리큘럼 생성 로딩 페이지
 */
export default function GeneratingPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard();
  const router = useRouter();
  const { state, completeGeneration } = useCurriculum();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const progressFloatRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const hasFailedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const fillIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!state.curriculumId) {
      router.push("/curriculum/upload-paper");
      return;
    }

    if (isReady || pollError) return;

    startTimeRef.current = Date.now();
    lastTickRef.current = Date.now();
    progressFloatRef.current = 0;

    const progressInterval = setInterval(() => {
      if (!startTimeRef.current || isReady || pollError) return;
      const now = Date.now();
      const elapsedSec = (now - startTimeRef.current) / 1000;
      const deltaSec = lastTickRef.current
        ? (now - lastTickRef.current) / 1000
        : 0;
      lastTickRef.current = now;

      if (elapsedSec >= 180) {
        setPollError("생성 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.");

        alert("생성 시간이 초과되었습니다.\n잠시 후 다시 시도해주세요.");

        router.push("/curriculum/upload-paper");

        return;
      }

      let ratePerSec = 0;
      if (elapsedSec <= 60) {
        ratePerSec = 1.5; // 0 -> 90 in 60s
      } else if (elapsedSec <= 160) {
        ratePerSec = 1 / 20; // 90 -> 95 in 100s
      } else {
        ratePerSec = 1 / 30; // 95 -> 99 in 120s
      }

      progressFloatRef.current = Math.min(
        99,
        progressFloatRef.current + ratePerSec * deltaSec
      );

      setProgress(prev => {
        const target = Math.floor(progressFloatRef.current);
        if (target <= prev) return prev;
        return Math.min(prev + 1, target);
      });
    }, 200);

    const stepInterval = setInterval(() => {
      if (isReady || pollError) return;
      setCurrentStepIndex(prev =>
        prev >= LOADING_STEPS.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    let isActive = true;
    const poll = async () => {
      if (pollError) return;
      try {
        if (!state.curriculumId) return;

        const response = await curriculumApi.checkStatus(state.curriculumId);
        if (!isActive) return;

        if (response.current_step) {
          setStatusText(response.current_step);
        }

        if (response.status === "ready") {
          setIsReady(true);
        } else if (response.status === "failed") {
          if (hasFailedRef.current) return;
          hasFailedRef.current = true;
          setPollError("커리큘럼 생성에 실패했습니다. 다시 시도해주세요.");
          alert("커리큘럼 생성에 실패했습니다.\n다시 시도해주세요.");
          router.push("/curriculum/upload-paper");
        }
      } catch (err) {
        if (!isActive) return;
        setPollError(
          err instanceof Error ? err.message : "생성 상태 확인에 실패했습니다."
        );
      }
    };

    poll();
    const pollInterval = setInterval(poll, 8000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      isActive = false;
      clearInterval(pollInterval);
    };
  }, [isAuthenticated, state.curriculumId, isReady, pollError, router]);

  useEffect(() => {
    if (!isReady || !state.curriculumId) return;

    if (fillIntervalRef.current) {
      clearInterval(fillIntervalRef.current);
    }

    fillIntervalRef.current = setInterval(() => {
      setProgress(prev => Math.min(100, prev + 5));
    }, 100);

    return () => {
      if (fillIntervalRef.current) {
        clearInterval(fillIntervalRef.current);
        fillIntervalRef.current = null;
      }
    };
  }, [isReady, state.curriculumId]);

  useEffect(() => {
    if (!isReady || !state.curriculumId) return;
    if (progress < 100) return;
    if (hasCompletedRef.current) return;

    hasCompletedRef.current = true;
    if (fillIntervalRef.current) {
      clearInterval(fillIntervalRef.current);
      fillIntervalRef.current = null;
    }
    completeGeneration();
    router.push(`/curriculum/${state.curriculumId}`);
  }, [progress, isReady, state.curriculumId, completeGeneration, router]);

  if (authLoading || !isAuthenticated) {
    return <AuthLoading />;
  }

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
          {pollError
            ? pollError
            : statusText ||
              LOADING_STEPS[currentStepIndex]?.label ||
              "잠시만 기다려주세요..."}
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
