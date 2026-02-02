export const RESOURCE_TYPES = [
  { id: "paper", label: "원문 논문", icon: "description" },
  { id: "web_doc", label: "블로그/아티클", icon: "language" },
  { id: "video", label: "영상 강의", icon: "play_circle" },
] as const;

export const RESOURCE_TYPE_ICONS: Record<string, string> = {
  paper: "description",
  web_doc: "language",
  video: "play_circle",
};

export const RESOURCE_TYPE_LABELS: Record<string, string> = {
  paper: "Paper",
  web_doc: "Web Document",
  video: "Video",
};
