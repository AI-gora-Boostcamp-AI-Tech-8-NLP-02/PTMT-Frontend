"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CurriculumOptions, Keyword } from "./types";

// ============================================
// Types (lib/types.ts의 타입 재사용)
// ============================================

export interface PaperInfo {
  paperId: string;
  title: string;
  abstract: string;
  keywords: Keyword[]; // 추출된 키워드 리스트 (설정 페이지에서 사용)
}

export interface CurriculumFlowState {
  // Paper upload step
  paper: PaperInfo | null;
  curriculumId: string | null;

  // Settings step
  options: CurriculumOptions | null;

  // Generation step
  generationStatus: "idle" | "generating" | "completed" | "failed";
  progressPercent: number;
  currentStep: string;
}

// ============================================
// Context
// ============================================

interface CurriculumContextType {
  state: CurriculumFlowState;

  // Actions
  setPaper: (paper: PaperInfo, curriculumId: string) => void;
  setOptions: (options: CurriculumOptions) => void;
  startGeneration: () => void;
  updateProgress: (percent: number, step: string) => void;
  completeGeneration: () => void;
  failGeneration: () => void;
  reset: () => void;
}

// 6.3 Hoist Static JSX - 초기 상태를 컴포넌트 외부로
const initialState: CurriculumFlowState = {
  paper: null,
  curriculumId: null,
  options: null,
  generationStatus: "idle",
  progressPercent: 0,
  currentStep: "",
};

const CurriculumContext = createContext<CurriculumContextType | null>(null);

// ============================================
// Provider
// ============================================

/**
 * Curriculum Provider
 *
 * 적용된 Vercel Best Practices:
 * - 5.9 Use Functional setState - useCallback으로 안정적인 콜백 + 함수형 setState
 * - 5.2 Memoize Context Value - useMemo로 context value 메모이제이션
 * - 6.3 Hoist Static JSX - initialState 상수화
 */
export function CurriculumProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CurriculumFlowState>(initialState);

  // 5.9 Use Functional setState - useCallback으로 안정적인 참조
  const setPaper = useCallback((paper: PaperInfo, curriculumId: string) => {
    setState(prev => ({
      ...prev,
      paper,
      curriculumId,
    }));
  }, []);

  const setOptions = useCallback((options: CurriculumOptions) => {
    setState(prev => ({
      ...prev,
      options,
    }));
  }, []);

  const startGeneration = useCallback(() => {
    setState(prev => ({
      ...prev,
      generationStatus: "generating",
      progressPercent: 0,
      currentStep: "커리큘럼 생성 준비 중...",
    }));
  }, []);

  const updateProgress = useCallback((percent: number, step: string) => {
    setState(prev => ({
      ...prev,
      progressPercent: percent,
      currentStep: step,
    }));
  }, []);

  const completeGeneration = useCallback(() => {
    setState(prev => ({
      ...prev,
      generationStatus: "completed",
      progressPercent: 100,
      currentStep: "완료!",
    }));
  }, []);

  const failGeneration = useCallback(() => {
    setState(prev => ({
      ...prev,
      generationStatus: "failed",
      currentStep: "오류가 발생했습니다.",
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // 5.2 Memoize Context Value
  const value = useMemo(
    () => ({
      state,
      setPaper,
      setOptions,
      startGeneration,
      updateProgress,
      completeGeneration,
      failGeneration,
      reset,
    }),
    [
      state,
      setPaper,
      setOptions,
      startGeneration,
      updateProgress,
      completeGeneration,
      failGeneration,
      reset,
    ]
  );

  return (
    <CurriculumContext.Provider value={value}>
      {children}
    </CurriculumContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useCurriculum() {
  const context = useContext(CurriculumContext);
  if (!context) {
    throw new Error("useCurriculum must be used within CurriculumProvider");
  }
  return context;
}
