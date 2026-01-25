import { AuthProvider } from "@/lib/auth-context";
import { CurriculumProvider } from "@/lib/curriculum-context";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "페튜와 매튜 - 맞춤형 논문 학습 경로",
  description:
    "AI가 연구 관심사를 분석하여 최적화된 학습 커리큘럼을 생성해드립니다.",
  keywords: [
    "논문",
    "커리큘럼",
    "AI",
    "학습",
    "연구",
    "Paper Tutor",
    "Map Tutor",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='antialiased min-h-screen'>
        <AuthProvider>
          <CurriculumProvider>{children}</CurriculumProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
