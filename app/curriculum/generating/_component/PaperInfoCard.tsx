interface PaperInfoCardProps {
  title: string;
}

export default function PaperInfoCard({ title }: PaperInfoCardProps) {
  return (
    <div className='mt-10 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 w-full'>
      <p className='text-xs text-muted-foreground mb-1'>분석 중인 논문</p>
      <p className='text-sm font-semibold text-foreground truncate'>{title}</p>
    </div>
  );
}
