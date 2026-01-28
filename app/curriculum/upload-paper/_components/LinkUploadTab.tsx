import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { paperApi } from "@/lib/api";
import { useCurriculum } from "@/lib/curriculum-context";
import { TabsContent } from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface LinkUploadTabProps {
  setError: (error: string | null) => void;
}

export default function LinkUploadTab({ setError }: LinkUploadTabProps) {
  const router = useRouter();
  const { setPaper } = useCurriculum();

  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");

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
  }, [url, setPaper, router, setError]);

  return (
    <div
      className='relative flex flex-col items-center justify-center gap-4 rounded-3xl border-[3px] border-dashed
      border-slate-200 bg-slate-50 hover:border-primary/50 hover:bg-primary/5
      transition-all duration-300 px-8 py-16 cursor-pointer group'
    >
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
    </div>
  );
}
