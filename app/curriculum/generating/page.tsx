"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/layout";
import { useCurriculum } from "@/lib/curriculum-context";

// 6.3 Hoist Static JSX - 정적 데이터를 컴포넌트 외부로
const LOADING_STEPS = [
  { label: "논문 분석 중", icon: "description" },
  { label: "핵심 개념 추출", icon: "hub" },
  { label: "학습 순서 최적화", icon: "route" },
  { label: "자료 탐색", icon: "search" },
  { label: "커리큘럼 생성", icon: "auto_awesome" },
] as const;

/**
 * 커리큘럼 생성 로딩 페이지
 *
 * 적용된 Vercel Best Practices:
 * - 6.3 Hoist Static JSX - LOADING_STEPS 상수화
 * - 5.9 Use Functional setState - setProgress에 함수형 업데이트
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
        <div className='relative w-40 h-40 mb-10'>
          {/* Outer ring */}
          <svg className='w-full h-full -rotate-90' viewBox='0 0 160 160'>
            <circle
              cx='80'
              cy='80'
              r='70'
              fill='none'
              stroke='currentColor'
              strokeWidth='4'
              className='text-muted'
            />
            <circle
              cx='80'
              cy='80'
              r='70'
              fill='none'
              stroke='url(#progressGradient)'
              strokeWidth='6'
              strokeLinecap='round'
              strokeDasharray={`${progress * 4.4} 440`}
              className='transition-all duration-300'
            />
            <defs>
              <linearGradient
                id='progressGradient'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='100%'
              >
                <stop offset='0%' stopColor='var(--primary)' />
                <stop offset='50%' stopColor='var(--accent)' />
                <stop offset='100%' stopColor='var(--secondary)' />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <span className='material-symbols-outlined text-4xl text-primary mb-1 animate-bounce'>
              {LOADING_STEPS[currentStepIndex]?.icon || "hourglass_empty"}
            </span>
            <span className='text-2xl font-bold text-foreground'>
              {progress}%
            </span>
          </div>
        </div>

        {/* Status text */}
        <h2 className='text-xl font-bold text-foreground mb-2'>
          커리큘럼 생성 중
        </h2>
        <p className='text-sm text-muted-foreground mb-8'>
          {LOADING_STEPS[currentStepIndex]?.label || "잠시만 기다려주세요..."}
        </p>

        {/* Step indicators */}
        <div className='flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-sm border border-white/40'>
          {LOADING_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`
                w-3 h-3 rounded-full transition-all duration-500
                ${idx < currentStepIndex ? "bg-primary scale-100" : ""}
                ${idx === currentStepIndex ? "bg-accent scale-125 animate-pulse" : ""}
                ${idx > currentStepIndex ? "bg-muted scale-100" : ""}
              `}
            />
          ))}
        </div>

        {/* Paper info */}
        {state.paper && (
          <div className='mt-10 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 w-full'>
            <p className='text-xs text-muted-foreground mb-1'>분석 중인 논문</p>
            <p className='text-sm font-semibold text-foreground truncate'>
              {state.paper.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
