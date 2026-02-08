import { Logo } from "@/components/layout";

export default function LoginLeftPanel() {
  return (
    <div className='hidden lg:flex w-1/2 relative overflow-hidden bg-foreground'>
      {/* Gradient */}
      <div className='absolute inset-0'>
        <div className='absolute top-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-linear-to-br from-primary/40 to-transparent blur-[80px]' />
        <div className='absolute bottom-[15%] right-[10%] w-[50%] h-[50%] rounded-full bg-linear-to-tl from-accent/30 to-transparent blur-[100px]' />
        <div className='absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-linear-to-br from-primary/20 to-accent/20 blur-[60px]' />
      </div>

      <div className='absolute inset-0 pattern-diagonal opacity-10' />

      <div className='relative z-10 flex flex-col h-full justify-between p-12'>
        <Logo size='lg' inverted />

        <div className='max-w-2xl'>
          <h1 className='text-5xl font-black text-background mb-6'>
            나만의{" "}
            <span className='text-gradient-bold'>논문 학습 커리큘럼</span>을
            <br />
            만들어보세요
          </h1>
          <p className='text-background/60 text-xl'>
            AI가 논문을 분석하고, 당신만의 학습 경로를 설계합니다.
          </p>
        </div>

        <div className='flex gap-4'>
          <div className='w-16 h-2 rounded-full bg-primary' />
          <div className='w-8 h-2 rounded-full bg-accent' />
          <div className='w-4 h-2 rounded-full bg-background/30' />
        </div>
      </div>
    </div>
  );
}
