// ============================================
// Enum Types (API/RDB와 동기화)
// ============================================

export type CurriculumStatus =
  | "draft"
  | "options_saved"
  | "generating"
  | "ready"
  | "failed";

export type CurriculumPurpose =
  | "deep_research"
  | "simple_study"
  | "trend_check"
  | "code_implementation"
  | "exam_preparation";

export type UserLevel =
  | "non_major"
  | "bachelor"
  | "master"
  | "researcher"
  | "industry";

export type ProgressStatus = "locked" | "in_progress" | "completed" | "skipped";

export type ResourceType = "paper" | "article" | "video" | "code";

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string | null;
  created_at: string;
  stats?: {
    total_curriculums: number;
    completed_curriculums: number;
    total_study_hours: number;
  };
}

// ============================================
// Auth Types
// ============================================

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

// ============================================
// Paper Types
// ============================================

export interface Keyword {
  name: string;
  // id와 importance는 그래프 생성 후에만 존재 (1차 추출 시에는 name만)
  id?: string;
  importance?: number;
}

export interface Paper {
  id: string;
  title: string;
  authors?: string[];
  abstract?: string;
  language?: string;
  source_url?: string | null;
  pdf_url?: string | null;
  keywords: Keyword[];
  created_at: string;
}

export interface PaperUploadResponse {
  paper_id: string;
  curriculum_id: string;
  title: string;
  authors?: string[];
  abstract: string;
  language: string;
  keywords: Keyword[];
  source_url?: string | null;
  pdf_url?: string | null;
}

// ============================================
// Curriculum Types
// ============================================

export interface BudgetedTime {
  days: number;
  daily_hours: number;
}

export interface CurriculumOptions {
  purpose: CurriculumPurpose;
  level: UserLevel;
  known_concepts: string[];
  budgeted_time: BudgetedTime;
  preferred_resources: ResourceType[];
}

export interface Resource {
  resource_id: string;
  name: string;
  url?: string;
  type: ResourceType;
  description: string;
  difficulty: number;
  importance: number;
  study_load_minutes: number;
  is_core: boolean;
}

export interface CurriculumNode {
  keyword_id: string;
  keyword: string;
  description: string;
  importance: number;
  layer?: number;
  resources: Resource[];
}

export interface CurriculumEdge {
  from_keyword_id: string;
  to_keyword_id: string;
  relationship?: string;
}

export interface CurriculumGraphMeta {
  curriculum_id: string;
  paper_id: string;
  paper_title: string;
  paper_authors?: string[];
  created_at: string;
  total_study_time_hours: number;
  total_nodes: number;
}

export interface CurriculumGraph {
  meta: CurriculumGraphMeta;
  nodes: CurriculumNode[];
  edges: CurriculumEdge[];
}

export interface CurriculumListItem {
  id: string;
  title: string;
  paper_title: string;
  status: CurriculumStatus;
  created_at: string;
  updated_at: string;
  node_count: number;
  estimated_hours: number;
}

export interface Curriculum {
  id: string;
  title: string;
  status: CurriculumStatus;
  purpose?: CurriculumPurpose;
  level?: UserLevel;
  budgeted_time?: BudgetedTime;
  preferred_resources?: ResourceType[];
  paper: {
    id: string;
    title: string;
    authors?: string[];
    abstract?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface GenerationStatus {
  curriculum_id: string;
  status: CurriculumStatus;
  progress_percent: number;
  current_step: string;
  estimated_remaining_seconds?: number;
}

// ============================================
// Progress Types
// ============================================

export interface NodeProgress {
  keyword_id: string;
  status: ProgressStatus;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface ProgressSummary {
  completed: number;
  in_progress: number;
  locked: number;
  skipped: number;
  total: number;
  percent: number;
}

export interface LearningProgress {
  curriculum_id: string;
  nodes: NodeProgress[];
  summary: ProgressSummary;
}

export interface ProgressUpdateResponse {
  keyword_id: string;
  status: ProgressStatus;
  updated_at: string;
  unlocked_nodes: string[];
}

// ============================================
// UI Helper Types
// ============================================

// 프론트엔드 UI용 라벨 매핑
export const PURPOSE_LABELS: Record<CurriculumPurpose, string> = {
  deep_research: "심층 연구",
  simple_study: "개념 학습",
  trend_check: "트렌드 파악",
  code_implementation: "구현 실습",
  exam_preparation: "시험 준비",
};

export const LEVEL_LABELS: Record<UserLevel, string> = {
  non_major: "입문자",
  bachelor: "학부생",
  master: "대학원생",
  researcher: "연구원",
  industry: "현업",
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  paper: "원문 논문",
  article: "블로그/아티클",
  video: "영상 강의",
  code: "코드/튜토리얼",
};

export const STATUS_LABELS: Record<CurriculumStatus, string> = {
  draft: "초안",
  options_saved: "설정 완료",
  generating: "생성 중",
  ready: "완료",
  failed: "실패",
};
