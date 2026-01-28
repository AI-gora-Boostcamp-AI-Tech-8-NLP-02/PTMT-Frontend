// SignupHero.tsx
import { Logo } from "@/components/layout";

export function SignUpLeftPanel() {
  return (
    <div className='hidden lg:flex w-1/2 relative overflow-hidden bg-foreground'>
      <div className='absolute inset-0'>
        <div className='absolute top-[5%] right-[20%] w-[50%] h-[50%] rounded-full bg-linear-to-bl from-accent/40 to-transparent blur-[80px]' />
        <div className='absolute bottom-[20%] left-[10%] w-[60%] h-[60%] rounded-full bg-linear-to-tr from-primary/30 to-transparent blur-[100px]' />
        <div className='absolute top-[50%] right-[40%] w-[25%] h-[25%] rounded-full bg-linear-to-br from-accent/20 to-primary/20 blur-[50px]' />
      </div>

      <div className='absolute inset-0 pattern-diagonal opacity-10' />

      <div className='relative z-10 flex flex-col h-full justify-between p-12'>
        <Logo size='lg' inverted />

        <div className='max-w-lg'>
          <h1 className='text-5xl font-black text-background leading-tight mb-6'>
            <span className='text-gradient-bold'>학습의</span> 시작점
          </h1>
          <p className='text-background/60 text-xl'>
            무료로 가입하고 AI 기반 학습의 힘을 경험하세요.
          </p>
        </div>

        <div className='flex gap-4 justify-end'>
          <div className='w-4 h-2 rounded-full bg-background/30' />
          <div className='w-8 h-2 rounded-full bg-accent' />
          <div className='w-16 h-2 rounded-full bg-primary' />
        </div>
      </div>
    </div>
  );
}

export default SignUpLeftPanel;
