import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-3xl border border-slate-200'>
      <span className='material-symbols-outlined text-7xl text-slate-200'>
        folder_open
      </span>
      <p className='text-slate-500 text-lg'>아직 생성된 커리큘럼이 없습니다.</p>
      <Link href='/curriculum/upload-paper'>
        <Button className='rounded-xl'>첫 커리큘럼 만들기</Button>
      </Link>
    </div>
  );
}
