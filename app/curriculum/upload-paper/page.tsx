"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { paperApi } from "@/lib/api";
import { useCurriculum } from "@/lib/curriculum-context";

/**
 * 논문 업로드 페이지
 *
 * 적용된 Vercel Best Practices:
 * - 5.9 Use Functional setState - useCallback으로 안정적인 콜백
 * - 7.8 Early Return - 조건부 early return
 */
export default function UploadPaperPage() {
  const router = useRouter();
  const { setPaper } = useCurriculum();
  const [activeTab, setActiveTab] = useState("pdf");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 5.9 Use Functional setState - useCallback으로 안정적인 참조
  const handleFileSelect = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await paperApi.uploadPdf(file);
        setPaper(
          {
            paperId: response.paper_id,
            title: response.title,
            abstract: response.abstract,
            keywords: response.keywords,
          },
          response.curriculum_id
        );
        router.push("/curriculum/settings");
      } catch {
        setError("PDF 업로드에 실패했습니다.");
        setIsLoading(false);
      }
    },
    [setPaper, router]
  );

  const handleLinkSubmit = useCallback(async () => {
    if (!url.trim()) return; // 7.8 Early Return
    setIsLoading(true);
    setError(null);

    try {
      const response = await paperApi.submitLink(url);
      setPaper(
        {
          paperId: response.paper_id,
          title: response.title,
          abstract: response.abstract,
          keywords: response.keywords,
        },
        response.curriculum_id
      );
      router.push("/curriculum/settings");
    } catch {
      setError("링크 분석에 실패했습니다.");
      setIsLoading(false);
    }
  }, [url, setPaper, router]);

  const handleTitleSubmit = useCallback(async () => {
    if (!title.trim()) return; // 7.8 Early Return
    setIsLoading(true);
    setError(null);

    try {
      const response = await paperApi.searchByTitle(title);
      setPaper(
        {
          paperId: response.paper_id,
          title: response.title,
          abstract: response.abstract,
          keywords: response.keywords,
        },
        response.curriculum_id
      );
      router.push("/curriculum/settings");
    } catch {
      setError("논문 검색에 실패했습니다.");
      setIsLoading(false);
    }
  }, [title, setPaper, router]);

  // Drag handlers with useCallback
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.type === "application/pdf") handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />

      <main className='flex-1 flex items-center justify-center p-6 relative overflow-hidden'>
        {/* Background decorations - warm tones only */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-20 left-[10%] w-60 h-60 rounded-full bg-primary/15 blur-[80px]' />
          <div className='absolute bottom-20 right-[15%] w-80 h-80 rounded-full bg-accent/10 blur-[100px]' />
        </div>

        <div className='w-full max-w-[700px] relative z-10'>
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

            {/* Tabs - Fixed equal sizing */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='flex-1'
            >
              <div className='px-8 pt-6'>
                <TabsList className='bg-slate-100 p-1 rounded-2xl w-full grid grid-cols-3'>
                  <TabsTrigger
                    value='pdf'
                    className='flex items-center justify-center gap-2 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm transition-all'
                  >
                    <span className='material-symbols-outlined text-lg'>
                      description
                    </span>
                    PDF
                  </TabsTrigger>
                  <TabsTrigger
                    value='link'
                    className='flex items-center justify-center gap-2 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm transition-all'
                  >
                    <span className='material-symbols-outlined text-lg'>
                      link
                    </span>
                    링크
                  </TabsTrigger>
                  <TabsTrigger
                    value='title'
                    className='flex items-center justify-center gap-2 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm transition-all'
                  >
                    <span className='material-symbols-outlined text-lg'>
                      search
                    </span>
                    제목
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className='p-8'>
                <TabsContent value='pdf' className='mt-0'>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                      relative flex flex-col items-center justify-center gap-4 
                      rounded-3xl border-[3px] border-dashed 
                      ${
                        isDragging
                          ? "border-primary bg-primary/10 scale-[1.02]"
                          : "border-slate-200 bg-slate-50 hover:border-primary/50 hover:bg-primary/5"
                      }
                      transition-all duration-300 px-8 py-16 cursor-pointer group
                    `}
                  >
                    <input
                      type='file'
                      accept='.pdf'
                      onChange={handleFileInputChange}
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                      disabled={isLoading}
                    />
                    <div
                      className={`size-20 rounded-3xl flex items-center justify-center ${isDragging ? "bg-primary text-white" : "bg-white shadow-lg"} group-hover:scale-110 transition-all duration-300`}
                    >
                      {isLoading ? (
                        <span className='material-symbols-outlined text-4xl text-primary animate-spin'>
                          progress_activity
                        </span>
                      ) : (
                        <span className='material-symbols-outlined text-4xl text-primary'>
                          cloud_upload
                        </span>
                      )}
                    </div>
                    <div className='text-center'>
                      <p className='text-lg font-bold mb-1'>
                        {isLoading ? "분석 중..." : "PDF를 여기에 드롭"}
                      </p>
                      <p className='text-sm text-slate-500'>
                        {isLoading
                          ? "잠시만 기다려주세요"
                          : "또는 클릭하여 파일 선택"}
                      </p>
                    </div>
                    <span className='text-xs font-medium text-slate-400 px-3 py-1.5 bg-white rounded-full'>
                      PDF 전용 • 최대 25MB
                    </span>
                  </div>
                </TabsContent>

                <TabsContent value='link' className='mt-0'>
                  <div className='flex flex-col gap-6'>
                    <div className='relative'>
                      <span className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'>
                        <span className='material-symbols-outlined'>link</span>
                      </span>
                      <Input
                        type='url'
                        placeholder='https://arxiv.org/abs/...'
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        className='h-14 pl-12 pr-4 text-base rounded-2xl border-2 border-slate-200 focus:border-primary bg-white'
                      />
                    </div>
                    <p className='text-sm text-slate-500 -mt-2'>
                      arXiv, Google Scholar 등의 링크
                    </p>
                    <Button
                      onClick={handleLinkSubmit}
                      disabled={!url.trim() || isLoading}
                      className='h-14 rounded-2xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
                    >
                      {isLoading ? "분석 중..." : "논문 분석"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value='title' className='mt-0'>
                  <div className='flex flex-col gap-6'>
                    <div className='relative'>
                      <span className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'>
                        <span className='material-symbols-outlined'>
                          search
                        </span>
                      </span>
                      <Input
                        type='text'
                        placeholder='Attention Is All You Need'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className='h-14 pl-12 pr-4 text-base rounded-2xl border-2 border-slate-200 focus:border-primary bg-white'
                      />
                    </div>
                    <p className='text-sm text-slate-500 -mt-2'>
                      정확한 논문 제목을 입력하세요
                    </p>
                    <Button
                      onClick={handleTitleSubmit}
                      disabled={!title.trim() || isLoading}
                      className='h-14 rounded-2xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
                    >
                      {isLoading ? "검색 중..." : "논문 검색"}
                    </Button>
                  </div>
                </TabsContent>

                {/* AI Notice */}
                <div className='flex items-center gap-4 p-5 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl mt-8'>
                  <div className='size-12 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg'>
                    <span className='material-symbols-outlined text-white text-xl'>
                      auto_awesome
                    </span>
                  </div>
                  <div>
                    <span className='text-sm font-bold block'>
                      AI 자동 분석
                    </span>
                    <span className='text-xs text-slate-500'>
                      업로드 시 제목, 초록, 핵심 개념을 자동 추출합니다.
                    </span>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
