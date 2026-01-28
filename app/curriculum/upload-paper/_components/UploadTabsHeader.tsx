import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UploadTabsHeader() {
  return (
    <div className='px-8 pt-6'>
      <TabsList className='bg-slate-100 p-2 rounded-2xl w-full grid grid-cols-3'>
        <TabsTrigger
          value='pdf'
          className='flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm'
        >
          <span className='material-symbols-outlined text-lg'>description</span>
          PDF
        </TabsTrigger>

        <TabsTrigger
          value='link'
          className='flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm'
        >
          <span className='material-symbols-outlined text-lg'>link</span>
          링크
        </TabsTrigger>

        <TabsTrigger
          value='title'
          className='flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm'
        >
          <span className='material-symbols-outlined text-lg'>search</span>
          제목
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
