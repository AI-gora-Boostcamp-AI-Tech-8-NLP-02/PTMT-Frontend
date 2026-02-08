import QueueWaitingModal from "@/components/queue/QueueWaitingModal";
import { useQueueStatus } from "@/hooks";
import { paperApi } from "@/lib/api";
import { useCurriculum } from "@/lib/curriculum-context";
import { TabsContent } from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

interface PdfUploadTabProps {
  setError: (error: string | null) => void;
}

export default function PdfUploadTab({ setError }: PdfUploadTabProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isQueueModalClosed, setIsQueueModalClosed] = useState(false);
  const [queueTaskId, setQueueTaskId] = useState<string | null>(null);
  const { status, isLoading: queueLoading, error: queueError } = useQueueStatus(
    3000,
    isLoading,
    queueTaskId,
    "keyword_extraction"
  );

  const { setPaper } = useCurriculum();

  const handleFileSelect = useCallback(
    async (file: File) => {
      const taskId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setQueueTaskId(taskId);
      setIsQueueModalClosed(false);
      setIsLoading(true);
      setError(null);

      try {
        const response = await paperApi.uploadPdf(file, taskId);
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
        setIsQueueModalClosed(false);
        setQueueTaskId(null);
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

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

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
          onClick={handleDivClick}
          className='relative flex flex-col items-center justify-center gap-4'
        >
          <input
            ref={fileInputRef}
            type='file'
            accept='.pdf'
            onChange={handleFileInputChange}
            className='hidden'
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
              {isLoading ? "키 배정 대기 및 분석 중..." : "PDF를 여기에 드롭"}
            </p>
            <p className='text-sm text-slate-500'>
              {isLoading
                ? "요청량이 많으면 대기열 순서대로 처리됩니다"
                : "또는 클릭하여 파일 선택"}
            </p>
          </div>
          <span className='text-xs font-medium text-slate-400 px-3 py-1.5 bg-white rounded-full'>
            PDF 전용 • 최대 25MB
          </span>
        </div>
      </TabsContent>
      <QueueWaitingModal
        open={isLoading && !isQueueModalClosed}
        status={status}
        isLoading={queueLoading}
        error={queueError}
        title='접수 대기 중입니다.'
        subtitle='순서가 되면 PDF 분석을 시작합니다.'
        onClose={() => setIsQueueModalClosed(true)}
      />
    </div>
  );
}
