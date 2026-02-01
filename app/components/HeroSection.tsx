"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <div>
      {/* Hero Section - Asymmetric, Bold Layout */}
      <section className='relative min-h-[90vh] overflow-hidden bg-linear-to-br from-primary/10 via-amber-500/5 to-background'>
        {/* Decorative Elements */}
        <div className='absolute top-20 left-[5%] w-64 h-64 rounded-full bg-primary/20 blur-[80px] float' />
        <div
          className='absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-accent/15 blur-[100px] float'
          style={{ animationDelay: "-2s" }}
        />

        {/* Diagonal Pattern Overlay */}
        <div className='absolute inset-0 opacity-50' />

        <div className='relative max-w-350 mx-auto px-6 lg:px-8 pt-10 pb-32'>
          {/* Asymmetric Grid Layout */}
          <div className='grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[70vh]'>
            {/* Left Content - Offset for asymmetry */}
            <div className='lg:col-span-7 lg:col-start-1 stagger-fade'>
              {/* Floating Badge */}
              <div
                className='inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-brutal mb-8 float'
                style={{ animationDelay: "-1s" }}
              >
                <div className='w-2 h-2 rounded-full bg-accent animate-pulse' />
                <span className='text-sm font-semibold tracking-wide'>
                  AI 기반 연구 어시스턴트
                </span>
              </div>

              {/* Hero Title - Oversized, dramatic */}
              <h1 className='text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-[-0.02em] break-keep mb-12'>
                나에게 딱 맞춘 <br className='hidden md:block' />
                <span className='text-transparent bg-clip-text bg-linear-to-r from-primary to-amber-600 relative inline-block'>
                  논문 학습 경로
                  <svg
                    className='absolute w-full h-3 -bottom-1 left-0 text-primary/30 -z-10'
                    preserveAspectRatio='none'
                    viewBox='0 0 100 10'
                  >
                    <path
                      d='M0 5 Q 50 10 100 5'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='8'
                    ></path>
                  </svg>
                </span>
                를 만들어볼까요?
              </h1>

              {/* CTA Buttons - 3D Effect */}
              <div className='flex flex-wrap gap-5'>
                <Button
                  size='lg'
                  className='group flex items-center justify-center gap-2 rounded-lg h-14 px-8 bg-primary text-[#181611] text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200 min-w-50'
                  onClick={() => router.push("/auth/login")}
                >
                  <span className='material-symbols-outlined text-2xl icon-filled'>
                    rocket_launch
                  </span>
                  지금 시작하기
                </Button>
              </div>
            </div>

            {/* Right Side - Overlapping Cards */}
            <div className='lg:col-span-5 lg:col-start-8 relative h-125 hidden lg:block'>
              {/* Main Preview Card - Tilted */}
              <div className='absolute top-10 left-0 w-95 glass-brutal rounded-3xl p-6 shadow-dramatic transform -rotate-3 hover:rotate-0 transition-bounce'>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center'>
                    <span className='material-symbols-outlined text-primary text-3xl'>
                      hub
                    </span>
                  </div>
                  <div>
                    <p className='font-bold text-lg'>학습 그래프</p>
                    <p className='text-sm text-muted-foreground'>
                      실시간 생성 중...
                    </p>
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='h-3 bg-linear-to-r from-primary to-primary/40 rounded-full w-full' />
                  <div className='h-3 bg-linear-to-r from-accent to-accent/40 rounded-full w-4/5' />
                  <div className='h-3 bg-secondary rounded-full w-3/5' />
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className='absolute bottom-20 right-0 glass-brutal rounded-2xl p-5 shadow-glow-accent transform rotate-6 hover:rotate-0 transition-bounce float'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center'>
                    <span className='material-symbols-outlined text-accent text-2xl icon-filled'>
                      trending_up
                    </span>
                  </div>
                  <div>
                    <p className='text-3xl font-black'>87%</p>
                    <p className='text-xs text-muted-foreground font-medium'>
                      학습 효율 향상
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini Notification */}
              <div
                className='absolute top-[60%] left-[20%] glass-brutal rounded-xl px-4 py-3 shadow-glow-primary transform -rotate-2 float'
                style={{ animationDelay: "-3s" }}
              >
                <div className='flex items-center gap-2'>
                  <span className='material-symbols-outlined text-primary icon-filled'>
                    check_circle
                  </span>
                  <span className='text-sm font-semibold'>논문 분석 완료!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
