"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import {
  CurriculumOptions,
  CurriculumStatus,
  Keyword,
} from "./types";

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

export function CurriculumProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CurriculumFlowState>(initialState);

  const setPaper = (paper: PaperInfo, curriculumId: string) => {
    setState(prev => ({
      ...prev,
      paper,
      curriculumId,
    }));
  };

  const setOptions = (options: CurriculumOptions) => {
    setState(prev => ({
      ...prev,
      options,
    }));
  };

  const startGeneration = () => {
    setState(prev => ({
      ...prev,
      generationStatus: "generating",
      progressPercent: 0,
      currentStep: "커리큘럼 생성 준비 중...",
    }));
  };

  const updateProgress = (percent: number, step: string) => {
    setState(prev => ({
      ...prev,
      progressPercent: percent,
      currentStep: step,
    }));
  };

  const completeGeneration = () => {
    setState(prev => ({
      ...prev,
      generationStatus: "completed",
      progressPercent: 100,
      currentStep: "완료!",
    }));
  };

  const failGeneration = () => {
    setState(prev => ({
      ...prev,
      generationStatus: "failed",
      currentStep: "오류가 발생했습니다.",
    }));
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <CurriculumContext.Provider
      value={{
        state,
        setPaper,
        setOptions,
        startGeneration,
        updateProgress,
        completeGeneration,
        failGeneration,
        reset,
      }}
    >
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
