// import { dummyCurriculumGraph } from "./dummy-curriculum-2";
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
  QueueStatus,
  SignupRequest,
  User,
} from "./types";

// ============================================
// Configuration
// ============================================

// API Base URL - 백엔드 연결 시 이 값만 변경
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ============================================
// Token Management
// ============================================

let accessToken: string | null = null;
let refreshPromise: Promise<void> | null = null;

export function setAccessToken(access: string | null) {
  accessToken = access && access.trim() ? access : null;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearTokens() {
  accessToken = null;
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

function buildApiError<T>(json: ApiResponse<T>, status: number) {
  const errorMessage = json.error?.message || `HTTP Error: ${status}`;
  const error = new Error(errorMessage) as Error & {
    status?: number;
    code?: string;
  };
  error.status = status;
  error.code = json.error?.code;
  return error;
}

async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const text = await response.text();
  const body = text.trim();

  if (!body) {
    return { success: response.ok };
  }

  try {
    return JSON.parse(body) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      error: { code: "PARSE_ERROR", message: "응답을 파싱할 수 없습니다." },
    };
  }
}

async function refreshAccessToken(): Promise<void> {
  if (refreshPromise) {
    await refreshPromise;
    return;
  }

  refreshPromise = (async () => {
    const response = await httpRequest<{
      access_token: string;
      expires_in: number;
    }>(
      "/auth/refresh",
      {
        method: "POST",
      },
      false,
      false
    );

    setAccessToken(response.access_token);
  })();

  try {
    await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function httpRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true,
  allowAuthRetry = true
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

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch (err) {
    const message =
      err instanceof TypeError
        ? "네트워크 연결이 끊겼습니다. 잠시 후 다시 시도해주세요."
        : "요청 처리 중 네트워크 오류가 발생했습니다.";
    const error = new Error(message) as Error & {
      status?: number;
      code?: string;
    };
    error.code = "NETWORK_ERROR";
    throw error;
  }

  const json = await parseApiResponse<T>(response);

  if (response.status === 401 && requireAuth && allowAuthRetry) {
    try {
      await refreshAccessToken();
      return httpRequest<T>(endpoint, options, requireAuth, false);
    } catch (refreshError) {
      clearTokens();
      throw refreshError;
    }
  }

  if (!response.ok || !json.success) {
    throw buildApiError(json, response.status);
  }

  return json.data as T;
}

async function authFetch(
  endpoint: string,
  options: RequestInit = {},
  allowAuthRetry = true
): Promise<Response> {
  const headers = new Headers(options.headers ?? {});
  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && allowAuthRetry) {
    try {
      await refreshAccessToken();
      return authFetch(endpoint, options, false);
    } catch (refreshError) {
      clearTokens();
      throw refreshError;
    }
  }

  return response;
}

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
    const response = await httpRequest<AuthResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false
    );
    setAccessToken(response.access_token);
    return response;
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await httpRequest<AuthResponse>(
      "/auth/signup",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false
    );
    setAccessToken(response.access_token);
    return response;
  },

  async logout(): Promise<void> {
    await httpRequest("/auth/logout", { method: "POST" });
    clearTokens();
  },

  async refreshToken(): Promise<{ access_token: string; expires_in: number }> {
    const response = await httpRequest<{
      access_token: string;
      expires_in: number;
    }>(
      "/auth/refresh",
      {
        method: "POST",
      },
      false,
      false
    );
    setAccessToken(response.access_token);
    return response;
  },
};

// ============================================
// User API
// ============================================

export const userApi = {
  async getProfile(): Promise<User> {
    return httpRequest<User>("/users/me");
  },

  async updateProfile(data: {
    name?: string;
    avatar_url?: string;
  }): Promise<User> {
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
  async uploadPdf(
    file: File,
    clientTaskId?: string
  ): Promise<PaperUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (clientTaskId) {
      formData.append("client_task_id", clientTaskId);
    }

    const response = await authFetch("/papers/pdf", {
      method: "POST",
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
    const response = await httpRequest<PaperUploadResponse>("/papers/link", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    return {
      ...response,
      keywords: normalizeKeywords(
        (response as { keywords?: unknown }).keywords
      ),
    };
  },

  async searchByTitle(title: string): Promise<PaperUploadResponse> {
    const response = await httpRequest<PaperUploadResponse>("/papers/search", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    return {
      ...response,
      keywords: normalizeKeywords(
        (response as { keywords?: unknown }).keywords
      ),
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
    return httpRequest<Curriculum>(`/curriculums/${curriculumId}`);
  },

  async setOptions(
    curriculumId: string,
    options: CurriculumOptions
  ): Promise<{ curriculum_id: string; status: string }> {
    return httpRequest(`/curriculums/${curriculumId}/options`, {
      method: "POST",
      body: JSON.stringify(options),
    });
  },

  async startGeneration(
    curriculumId: string
  ): Promise<{ curriculum_id: string; status: string }> {
    return httpRequest(`/curriculums/${curriculumId}/generate`, {
      method: "POST",
    });
  },

  async checkStatus(curriculumId: string): Promise<GenerationStatus> {
    return httpRequest<GenerationStatus>(`/curriculums/${curriculumId}/status`);
  },

  async getGraph(curriculumId: string): Promise<CurriculumGraph> {
    return httpRequest<CurriculumGraph>(`/curriculums/${curriculumId}/graph`);
  },

  async delete(curriculumId: string): Promise<void> {
    await httpRequest(`/curriculums/${curriculumId}`, {
      method: "DELETE",
    });
  },
};

export const queueApi = {
  async getStatus(options?: {
    task_id?: string;
    task_type?: "keyword_extraction" | "curriculum_generation";
  }): Promise<QueueStatus> {
    const params = new URLSearchParams();
    if (options?.task_id) params.set("task_id", options.task_id);
    if (options?.task_type) params.set("task_type", options.task_type);
    const query = params.toString();
    return httpRequest<QueueStatus>(
      `/curriculums/queue-status${query ? `?${query}` : ""}`
    );
  },
};

export { API_BASE_URL };
