import { CurriculumStatus } from "../lib/types";

export const STATUS_CONFIG: Record<
  CurriculumStatus,
  { label: string; icon: string; color: string }
> = {
  draft: {
    label: "초안",
    icon: "draft",
    color: "bg-slate-100 text-slate-600",
  },
  options_saved: {
    label: "설정 완료",
    icon: "settings",
    color: "bg-blue-100 text-blue-700",
  },
  generating: {
    label: "생성 중",
    icon: "pending",
    color: "bg-amber-100 text-amber-700",
  },
  ready: {
    label: "완료",
    icon: "check_circle",
    color: "bg-green-100 text-green-700",
  },
  failed: { label: "실패", icon: "error", color: "bg-red-100 text-red-600" },
} as const;
