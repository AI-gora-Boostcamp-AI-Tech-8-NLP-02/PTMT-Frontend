import { dummyCurriculumGraph } from "./dummy-curriculum";
import {
  AuthResponse,
  Curriculum,
  CurriculumGraph,
  CurriculumListItem,
  CurriculumOptions,
  GenerationStatus,
  Keyword,
  LoginRequest,
  PaperUploadResponse,
  SignupRequest,
  User,
} from "./types";

// ============================================
// Configuration
// ============================================

// API Base URL - 백엔드 연결 시 이 값만 변경
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Mock 모드 설정 - 백엔드 연결 시 false로 변경
const USE_MOCK = false;

// ============================================
// Token Management
// ============================================

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  // 실제 환경에서는 secure storage 사용 권장
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

// ============================================
// HTTP Client (실제 API 호출용)
// ============================================

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

async function httpRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (requireAuth) {
    const token = getAccessToken();
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  const body = text.trim();
  let json: ApiResponse<T>;
  if (body) {
    try {
      json = JSON.parse(body) as ApiResponse<T>;
    } catch {
      json = {
        success: false,
        error: { code: "PARSE_ERROR", message: "응답을 파싱할 수 없습니다." },
      };
    }
  } else {
    json = { success: response.ok };
  }

  if (!response.ok || !json.success) {
    const errorMessage =
      json.error?.message || `HTTP Error: ${response.status}`;
    throw new Error(errorMessage);
  }

  return json.data as T;
}

// ============================================
// Mock Data
// ============================================

const mockUser: User = {
  id: "user-1",
  email: "demo@example.com",
  name: "홍길동",
  role: "user",
  avatar_url: null,
  created_at: new Date().toISOString(),
  stats: {
    total_curriculums: 5,
    completed_curriculums: 3,
    total_study_hours: 24.5,
  },
};

// 논문에서 추출된 키워드 (mock) - 1차 추출 시 name만
const mockExtractedKeywords = [
  { name: "Transformer" },
  { name: "Attention" },
  { name: "Self-Attention" },
  { name: "Multi-Head Attention" },
  { name: "Positional Encoding" },
  { name: "Encoder-Decoder" },
  { name: "Feed-Forward Network" },
  { name: "Layer Normalization" },
];

// Mock 커리큘럼 데이터 (세션 중 추가될 수 있음)
let mockCurriculums: CurriculumListItem[] = [
  {
    id: "curr-1",
    title: "NLP 트랜스포머 입문",
    paper_title: "Attention Is All You Need",
    status: "ready",
    created_at: "2024-01-20T10:30:00Z",
    updated_at: "2024-01-20T12:00:00Z",
    node_count: 16,
    estimated_hours: 24,
  },
  {
    id: "curr-2",
    title: "딥러닝 기초 학습",
    paper_title: "Deep Learning",
    status: "ready",
    created_at: "2024-01-18T09:00:00Z",
    updated_at: "2024-01-18T14:00:00Z",
    node_count: 12,
    estimated_hours: 18,
  },
  {
    id: "curr-3",
    title: "CNN 이미지 분류",
    paper_title: "ImageNet Classification with Deep CNNs",
    status: "ready",
    created_at: "2024-01-15T11:00:00Z",
    updated_at: "2024-01-15T16:00:00Z",
    node_count: 10,
    estimated_hours: 15,
  },
  {
    id: "curr-4",
    title: "GAN 생성 모델 연구",
    paper_title: "Generative Adversarial Networks",
    status: "generating",
    created_at: "2024-01-22T14:00:00Z",
    updated_at: "2024-01-22T14:05:00Z",
    node_count: 0,
    estimated_hours: 0,
  },
  {
    id: "curr-5",
    title: "BERT 자연어 처리",
    paper_title: "BERT: Pre-training of Deep Bidirectional Transformers",
    status: "options_saved",
    created_at: "2024-01-21T16:00:00Z",
    updated_at: "2024-01-21T16:30:00Z",
    node_count: 0,
    estimated_hours: 0,
  },
];

// 세션 중 생성된 커리큘럼을 목록에 추가하는 헬퍼
function addMockCurriculum(curriculum: CurriculumListItem) {
  // 이미 존재하면 업데이트
  const existingIndex = mockCurriculums.findIndex(c => c.id === curriculum.id);
  if (existingIndex >= 0) {
    mockCurriculums[existingIndex] = curriculum;
  } else {
    mockCurriculums.unshift(curriculum); // 최신순으로 앞에 추가
  }
}

function updateMockCurriculumStatus(
  id: string,
  status: CurriculumListItem["status"]
) {
  const curriculum = mockCurriculums.find(c => c.id === id);
  if (curriculum) {
    curriculum.status = status;
    curriculum.updated_at = new Date().toISOString();
  }
}

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function normalizeKeywords(keywords: unknown): Keyword[] {
  if (!Array.isArray(keywords)) return [];
  return keywords
    .map(keyword => {
      if (typeof keyword === "string") {
        const name = keyword.trim();
        return name ? { name } : null;
      }

      if (keyword && typeof keyword === "object") {
        const nameValue = (keyword as { name?: unknown }).name;
        if (typeof nameValue === "string" && nameValue.trim()) {
          const normalized: Keyword = { name: nameValue.trim() };
          const idValue = (keyword as { id?: unknown }).id;
          if (typeof idValue === "string") normalized.id = idValue;
          const importanceValue = (keyword as { importance?: unknown })
            .importance;
          if (typeof importanceValue === "number") {
            normalized.importance = importanceValue;
          }
          return normalized;
        }
      }

      return null;
    })
    .filter((keyword): keyword is Keyword => Boolean(keyword));
}

// ============================================
// Auth API
// ============================================

export const authApi = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay(500);
      const response: AuthResponse = {
        user: mockUser,
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_in: 3600,
      };
      setTokens(response.access_token, response.refresh_token);
      return response;
    }
    const response = await httpRequest<AuthResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false
    );
    setTokens(response.access_token, response.refresh_token);
    return response;
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay(500);
      const response: AuthResponse = {
        user: { ...mockUser, email: data.email, name: data.name },
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_in: 3600,
      };
      setTokens(response.access_token, response.refresh_token);
      return response;
    }
    const response = await httpRequest<AuthResponse>(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false
    );
    setTokens(response.access_token, response.refresh_token);
    return response;
  },

  async logout(): Promise<void> {
    if (USE_MOCK) {
      await delay(200);
      clearTokens();
      return;
    }
    await httpRequest("/auth/logout", { method: "POST" });
    clearTokens();
  },

  async refreshToken(): Promise<{ access_token: string; expires_in: number }> {
    const token =
      refreshToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("refresh_token")
        : null);
    if (!token) throw new Error("No refresh token");

    if (USE_MOCK) {
      await delay(200);
      const newToken = "mock-new-access-token";
      accessToken = newToken;
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", newToken);
      }
      return { access_token: newToken, expires_in: 3600 };
    }

    const response = await httpRequest<{
      access_token: string;
      expires_in: number;
    }>(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refresh_token: token }),
      },
      false
    );
    accessToken = response.access_token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", response.access_token);
    }
    return response;
  },
};

// ============================================
// User API
// ============================================

export const userApi = {
  async getProfile(): Promise<User> {
    if (USE_MOCK) {
      await delay(300);
      return mockUser;
    }
    return httpRequest<User>("/users/me");
  },

  async updateProfile(data: {
    name?: string;
    avatar_url?: string;
  }): Promise<User> {
    if (USE_MOCK) {
      await delay(300);
      return { ...mockUser, ...data };
    }
    return httpRequest<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// Paper API
// ============================================

export const paperApi = {
  async uploadPdf(file: File): Promise<PaperUploadResponse> {
    if (USE_MOCK) {
      await delay(1500);
      const paperId = `paper-${Date.now()}`;
      const curriculumId = `curr-${Date.now()}`;
      const paperTitle = file.name.replace(".pdf", "");

      // 새 커리큘럼을 목록에 추가 (draft 상태)
      addMockCurriculum({
        id: curriculumId,
        title: `${paperTitle} 학습 커리큘럼`,
        paper_title: paperTitle,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        node_count: 0,
        estimated_hours: 0,
      });

      return {
        paper_id: paperId,
        curriculum_id: curriculumId,
        title: paperTitle,
        authors: ["Unknown Author"],
        abstract: "AI가 논문을 분석하여 핵심 개념을 추출했습니다.",
        language: "english",
        keywords: mockExtractedKeywords,
        pdf_url: `https://storage.example.com/papers/${file.name}`,
      };
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/papers/pdf`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) throw new Error("PDF upload failed");
    const json = await response.json();
    const data = json.data as PaperUploadResponse | undefined;
    if (!data) throw new Error("PDF upload failed");
    return {
      ...data,
      keywords: normalizeKeywords((data as { keywords?: unknown }).keywords),
    };
  },

  async submitLink(url: string): Promise<PaperUploadResponse> {
    if (USE_MOCK) {
      await delay(1500);
      const paperId = `paper-${Date.now()}`;
      const curriculumId = `curr-${Date.now()}`;
      const paperTitle = "URL에서 분석한 논문";

      // 새 커리큘럼을 목록에 추가
      addMockCurriculum({
        id: curriculumId,
        title: `${paperTitle} 학습 커리큘럼`,
        paper_title: paperTitle,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        node_count: 0,
        estimated_hours: 0,
      });

      return {
        paper_id: paperId,
        curriculum_id: curriculumId,
        title: paperTitle,
        abstract: "AI가 논문을 분석 중입니다.",
        language: "english",
        keywords: mockExtractedKeywords,
        source_url: url,
      };
    }
    const response = await httpRequest<PaperUploadResponse>("/papers/link", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    return {
      ...response,
      keywords: normalizeKeywords((response as { keywords?: unknown }).keywords),
    };
  },

  async searchByTitle(title: string): Promise<PaperUploadResponse> {
    if (USE_MOCK) {
      await delay(1500);
      const paperId = `paper-${Date.now()}`;
      const curriculumId = `curr-${Date.now()}`;

      // 새 커리큘럼을 목록에 추가
      addMockCurriculum({
        id: curriculumId,
        title: `${title} 학습 커리큘럼`,
        paper_title: title,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        node_count: 0,
        estimated_hours: 0,
      });

      return {
        paper_id: paperId,
        curriculum_id: curriculumId,
        title: title,
        authors: ["Vaswani et al."],
        abstract: "AI가 논문을 분석하여 학습 경로를 생성합니다.",
        language: "english",
        keywords: mockExtractedKeywords,
      };
    }
    const response = await httpRequest<PaperUploadResponse>("/papers/search", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    return {
      ...response,
      keywords: normalizeKeywords((response as { keywords?: unknown }).keywords),
    };
  },
};

// ============================================
// Curriculum API
// ============================================

export const curriculumApi = {
  async getAll(options?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: CurriculumListItem[];
    pagination: { total: number; has_more: boolean };
  }> {
    if (USE_MOCK) {
      await delay(500);
      return {
        items: mockCurriculums,
        pagination: { total: mockCurriculums.length, has_more: false },
      };
    }
    const params = new URLSearchParams();
    if (options?.status) params.set("status", options.status);
    if (options?.page) params.set("page", String(options.page));
    if (options?.limit) params.set("limit", String(options.limit));

    return httpRequest<{
      items: CurriculumListItem[];
      pagination: { total: number; has_more: boolean };
    }>(`/curriculums?${params.toString()}`);
  },

  async getById(curriculumId: string): Promise<Curriculum> {
    if (USE_MOCK) {
      await delay(300);
      return {
        id: curriculumId,
        title: "NLP 트랜스포머 입문",
        status: "ready",
        purpose: "deep_research",
        level: "master",
        budgeted_time: { days: 14, daily_hours: 2 },
        preferred_resources: ["paper", "article"],
        paper: {
          id: "paper-1",
          title: "Attention Is All You Need",
          authors: ["Vaswani et al."],
          abstract: "트랜스포머 아키텍처를 제안한 논문...",
        },
        created_at: "2023-10-24T10:30:00Z",
        updated_at: "2023-10-24T12:00:00Z",
      };
    }
    return httpRequest<Curriculum>(`/curriculums/${curriculumId}`);
  },

  async setOptions(
    curriculumId: string,
    options: CurriculumOptions
  ): Promise<{ curriculum_id: string; status: string }> {
    if (USE_MOCK) {
      await delay(300);
      console.log("Mock: Set options for", curriculumId, options);
      // 상태 업데이트
      updateMockCurriculumStatus(curriculumId, "options_saved");
      return { curriculum_id: curriculumId, status: "options_saved" };
    }
    return httpRequest(`/curriculums/${curriculumId}/options`, {
      method: "POST",
      body: JSON.stringify(options),
    });
  },

  async startGeneration(
    curriculumId: string
  ): Promise<{ curriculum_id: string; status: string }> {
    if (USE_MOCK) {
      await delay(500);
      // 상태 업데이트
      updateMockCurriculumStatus(curriculumId, "generating");
      return {
        curriculum_id: curriculumId,
        status: "generating",
      };
    }
    return httpRequest(`/curriculums/${curriculumId}/generate`, {
      method: "POST",
    });
  },

  async checkStatus(curriculumId: string): Promise<GenerationStatus> {
    if (USE_MOCK) {
      await delay(300);
      // 랜덤하게 완료 시뮬레이션
      const progress = Math.min(100, Math.random() * 30 + 70);
      if (progress >= 95) {
        // 생성 완료 시뮬레이션
        const curriculum = mockCurriculums.find(c => c.id === curriculumId);
        if (curriculum && curriculum.status === "generating") {
          curriculum.status = "ready";
          curriculum.node_count = 16;
          curriculum.estimated_hours = 24;
          curriculum.updated_at = new Date().toISOString();
        }
        return {
          curriculum_id: curriculumId,
          status: "ready",
          progress_percent: 100,
          current_step: "완료!",
        };
      }
      return {
        curriculum_id: curriculumId,
        status: "generating",
        progress_percent: progress,
        current_step: "관계 그래프 구성 중...",
      };
    }
    return httpRequest<GenerationStatus>(`/curriculums/${curriculumId}/status`);
  },

  async getGraph(curriculumId: string): Promise<CurriculumGraph> {
    if (USE_MOCK) {
      await delay(500);
      return dummyCurriculumGraph;
    }
    return httpRequest<CurriculumGraph>(`/curriculums/${curriculumId}/graph`);
  },

  async delete(curriculumId: string): Promise<void> {
    if (USE_MOCK) {
      await delay(300);
      // Mock 목록에서 실제로 제거
      mockCurriculums = mockCurriculums.filter(c => c.id !== curriculumId);
      console.log("Mock: Deleted curriculum", curriculumId);
      return;
    }
    await httpRequest(`/curriculums/${curriculumId}`, {
      method: "DELETE",
    });
  },
};

export { API_BASE_URL };
