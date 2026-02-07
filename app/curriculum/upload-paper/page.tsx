"use client";

import { AuthLoading } from "@/components/auth/AuthLoading";
import { Header } from "@/components/layout";
import QueueStatusCard from "@/components/queue/QueueStatusCard";
import { useAuthGuard, useQueueStatus } from "@/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import UploadTabs from "./_components/UploadTabs";

/**
 * 논문 업로드 페이지
 */
export default function UploadPaperPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pdf");
  const [error, setError] = useState<string | null>(null);
  const { status, isLoading, error: queueError, lastUpdated } = useQueueStatus(
    3000,
    isAuthenticated
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (authLoading || !isAuthenticated) {
    return <AuthLoading />;
  }

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1 flex items-center justify-center p-6 relative overflow-hidden'>
        {/* Background decorations - warm tones only */}
        <div className='w-full max-w-175 relative z-10'>
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute top-20 left-[10%] w-60 h-60 rounded-full bg-primary/15 blur-[80px]' />
            <div className='absolute bottom-20 right-[15%] w-80 h-80 rounded-full bg-accent/10 blur-[100px]' />
          </div>
          <div className='bg-white rounded-[32px] overflow-hidden shadow-xl border border-slate-200'>
            {/* Header */}
            <div className='flex items-center justify-between px-8 py-6 border-b border-slate-100'>
              <div>
                <h1 className='text-2xl font-black text-slate-800'>
                  논문 추가
                </h1>
                <p className='text-sm text-slate-500 mt-1'>
                  AI가 자동으로 분석합니다
                </p>
              </div>
              <button
                onClick={handleBack}
                className='size-11 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-accent/20 hover:text-accent transition-all'
              >
                <span className='material-symbols-outlined'>close</span>
              </button>
            </div>

            {error && (
              <div className='mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3'>
                <span className='material-symbols-outlined text-red-500'>
                  error
                </span>
                <span className='text-sm text-red-600 font-medium'>
                  {error}
                </span>
              </div>
            )}
            <QueueStatusCard
              status={status}
              isLoading={isLoading}
              error={queueError}
              lastUpdated={lastUpdated}
              className='mx-8 mt-6'
            />
            <UploadTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              error={error}
              setError={setError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
