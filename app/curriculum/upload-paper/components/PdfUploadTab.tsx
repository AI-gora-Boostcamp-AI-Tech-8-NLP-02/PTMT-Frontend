import { paperApi } from "@/lib/api";
import { useCurriculum } from "@/lib/curriculum-context";
import { TabsContent } from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface PdfUploadTabProps {
  setError: (error: string | null) => void;
}

export default function PdfUploadTab({ setError }: PdfUploadTabProps) {
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setPaper } = useCurriculum();

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
    [setPaper, router, setError]
  );

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

  return (
    <div
      className='relative flex flex-col items-center justify-center gap-4 rounded-3xl border-[3px] border-dashed
      border-slate-200 bg-slate-50 hover:border-primary/50 hover:bg-primary/5
      transition-all duration-300 px-8 py-16 cursor-pointer group'
    >
      <TabsContent value='pdf' className='mt-0'>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className='relative flex flex-col items-center justify-center gap-4'
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
              {isLoading ? "잠시만 기다려주세요" : "또는 클릭하여 파일 선택"}
            </p>
          </div>
          <span className='text-xs font-medium text-slate-400 px-3 py-1.5 bg-white rounded-full'>
            PDF 전용 • 최대 25MB
          </span>
        </div>
      </TabsContent>
    </div>
  );
}
