import { Logo } from "@/components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HistoryHeader() {
  return (
    <header className='border-b border-slate-200 bg-white sticky top-0 z-10'>
      <div className='max-w-275 mx-auto px-6 py-4 flex items-center justify-between'>
        <Logo />
        <Link href='/curriculum/upload-paper'>
          <Button className='rounded-xl font-bold bg-primary text-primary-foreground gap-2'>
            <span className='material-symbols-outlined text-lg'>add</span>새
            커리큘럼
          </Button>
        </Link>
      </div>
    </header>
  );
}
