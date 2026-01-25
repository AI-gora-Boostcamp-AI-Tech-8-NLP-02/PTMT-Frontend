import { Footer, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <main className='flex-grow'>
        {/* Hero Section - Asymmetric, Bold Layout */}
        <section className='relative min-h-[90vh] overflow-hidden mesh-gradient'>
          {/* Decorative Elements */}
          <div className='absolute top-20 left-[5%] w-64 h-64 rounded-full bg-primary/20 blur-[80px] float' />
          <div
            className='absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-accent/15 blur-[100px] float'
            style={{ animationDelay: "-2s" }}
          />

          {/* Diagonal Pattern Overlay */}
          <div className='absolute inset-0 pattern-diagonal opacity-50' />

          <div className='relative max-w-[1400px] mx-auto px-6 lg:px-8 pt-10 pb-32'>
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
                <h1 className='text-5xl md:text-7xl lg:text-8xl font-black leading-[1.0] tracking-tighter mb-8'>
                  <span className='block mb-1'>논문이</span>
                  <span className='block text-gradient-bold mb-1'>쉬워지는</span>
                  <span className='block'>순간</span>
                </h1>

                {/* Subtext with accent */}
                <p className='text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed mb-12'>
                  AI가 당신만의{" "}
                  <span className='text-accent font-semibold'>
                    맞춤형 학습 경로
                  </span>
                  를 설계해 드립니다. 복잡한 논문, 이제 쉽게.
                </p>

                {/* CTA Buttons - 3D Effect */}
                <div className='flex flex-wrap gap-5'>
                  <Link href='/curriculum/upload-paper'>
                    <Button
                      size='lg'
                      className='h-16 px-10 rounded-2xl text-lg font-bold bg-primary text-primary-foreground btn-3d'
                    >
                      <span className='material-symbols-outlined text-2xl icon-filled'>
                        rocket_launch
                      </span>
                      지금 시작하기
                    </Button>
                  </Link>
                  <Link href='#how-it-works'>
                    <Button
                      variant='outline'
                      size='lg'
                      className='h-16 px-10 rounded-2xl text-lg font-bold border-2 border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-bounce'
                    >
                      어떻게 작동하나요?
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Side - Overlapping Cards */}
              <div className='lg:col-span-5 lg:col-start-8 relative h-[500px] hidden lg:block'>
                {/* Main Preview Card - Tilted */}
                <div className='absolute top-10 left-0 w-[380px] glass-brutal rounded-3xl p-6 shadow-dramatic transform -rotate-3 hover:rotate-0 transition-bounce'>
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
                    <div className='h-3 bg-gradient-to-r from-primary to-primary/40 rounded-full w-full' />
                    <div className='h-3 bg-gradient-to-r from-accent to-accent/40 rounded-full w-4/5' />
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
                    <span className='text-sm font-semibold'>
                      논문 분석 완료!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Bold stepped layout */}
        <section id='how-it-works' className='py-32 relative overflow-hidden'>
          <div className='absolute inset-0 bg-foreground/[0.02]' />

          <div className='max-w-[1400px] mx-auto px-6 lg:px-8 relative'>
            {/* Section Header - Off-center */}
            <div className='max-w-2xl mb-20'>
              <span className='text-accent font-bold tracking-widest text-sm uppercase mb-4 block'>
                Process
              </span>
              <h2 className='text-4xl md:text-6xl font-black tracking-tight mb-6'>
                세 단계로
                <br />
                <span className='text-gradient-bold'>완벽한 커리큘럼</span>
              </h2>
            </div>

            {/* Steps - Staggered Cards */}
            <div className='grid md:grid-cols-3 gap-8 stagger-fade'>
              {/* Step 1 */}
              <div className='group relative'>
                <div className='absolute -top-6 -left-2 text-[120px] font-black text-primary/10 leading-none select-none'>
                  1
                </div>
                <div className='relative glass-brutal rounded-3xl p-8 h-full transform group-hover:-translate-y-2 transition-bounce'>
                  <div className='w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-bounce'>
                    <span className='material-symbols-outlined text-primary text-3xl'>
                      upload_file
                    </span>
                  </div>
                  <h3 className='text-2xl font-bold mb-3'>논문 업로드</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    PDF, URL 또는 제목만으로도 OK. AI가 논문을 자동으로
                    분석합니다.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className='group relative md:mt-12'>
                <div className='absolute -top-6 -left-2 text-[120px] font-black text-accent/10 leading-none select-none'>
                  2
                </div>
                <div className='relative glass-brutal rounded-3xl p-8 h-full transform group-hover:-translate-y-2 transition-bounce'>
                  <div className='w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-bounce'>
                    <span className='material-symbols-outlined text-accent text-3xl'>
                      tune
                    </span>
                  </div>
                  <h3 className='text-2xl font-bold mb-3'>맞춤 설정</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    학습 목표, 수준, 시간을 설정하면 AI가 최적의 경로를
                    계산합니다.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className='group relative md:mt-24'>
                <div className='absolute -top-6 -left-2 text-[120px] font-black text-primary/10 leading-none select-none'>
                  3
                </div>
                <div className='relative glass-brutal rounded-3xl p-8 h-full transform group-hover:-translate-y-2 transition-bounce'>
                  <div className='w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-bounce'>
                    <span className='material-symbols-outlined text-primary text-3xl'>
                      route
                    </span>
                  </div>
                  <h3 className='text-2xl font-bold mb-3'>학습 시작</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    시각화된 커리큘럼과 함께 체계적인 학습을 시작하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Bento Grid Style */}
        <section className='py-32 mesh-gradient relative'>
          <div className='max-w-[1400px] mx-auto px-6 lg:px-8'>
            <div className='text-center max-w-3xl mx-auto mb-20'>
              <h2 className='text-4xl md:text-6xl font-black tracking-tight mb-6'>
                왜 <span className='text-gradient-bold'>페튜와 매튜</span>
                인가요?
              </h2>
              <p className='text-xl text-muted-foreground'>
                연구를 가속화하는 세 가지 핵심 기능
              </p>
            </div>

            {/* Bento Grid */}
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* Large Feature Card */}
              <div className='lg:col-span-2 glass-brutal rounded-3xl p-10 group hover:shadow-dramatic transition-all duration-500'>
                <div className='flex flex-col h-full'>
                  <div className='w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-8 shadow-glow-primary group-hover:scale-110 transition-bounce'>
                    <span className='material-symbols-outlined text-primary-foreground text-4xl'>
                      psychology
                    </span>
                  </div>
                  <h3 className='text-3xl font-bold mb-4'>
                    AI 맞춤형 학습 경로
                  </h3>
                  <p className='text-lg text-muted-foreground leading-relaxed flex-grow'>
                    논문의 핵심 개념을 추출하고, 당신의 배경지식을 고려하여 가장
                    효율적인 학습 순서를 자동으로 설계합니다.
                  </p>
                  <div className='mt-8 flex gap-3'>
                    <span className='px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold'>
                      개인화
                    </span>
                    <span className='px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold'>
                      자동화
                    </span>
                  </div>
                </div>
              </div>

              {/* Smaller Feature Cards */}
              <div className='glass-brutal rounded-3xl p-8 group hover:shadow-dramatic transition-all duration-500'>
                <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-6 shadow-glow-accent group-hover:scale-110 transition-bounce'>
                  <span className='material-symbols-outlined text-white text-3xl'>
                    bolt
                  </span>
                </div>
                <h3 className='text-2xl font-bold mb-3'>스마트 요약</h3>
                <p className='text-muted-foreground leading-relaxed'>
                  어려운 논문도 핵심만 쏙! AI가 이해하기 쉬운 말로 요약합니다.
                </p>
              </div>

              <div className='glass-brutal rounded-3xl p-8 group hover:shadow-dramatic transition-all duration-500'>
                <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-bounce'>
                  <span className='material-symbols-outlined text-white text-3xl'>
                    hub
                  </span>
                </div>
                <h3 className='text-2xl font-bold mb-3'>지식 그래프</h3>
                <p className='text-muted-foreground leading-relaxed'>
                  개념들 사이의 연결고리를 시각화하여 큰 그림을 파악하세요.
                </p>
              </div>

              <div className='glass-brutal rounded-3xl p-8 group hover:shadow-dramatic transition-all duration-500'>
                <div className='w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-bounce'>
                  <span className='material-symbols-outlined text-foreground text-3xl'>
                    schedule
                  </span>
                </div>
                <h3 className='text-2xl font-bold mb-3'>시간 최적화</h3>
                <p className='text-muted-foreground leading-relaxed'>
                  한정된 시간 내에 최대의 학습 효과를 낼 수 있도록 계획합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA - Dramatic */}
        <section className='py-32 relative overflow-hidden bg-foreground text-background'>
          <div className='absolute inset-0 opacity-20'>
            <div className='absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary blur-[150px]' />
            <div className='absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent blur-[150px]' />
          </div>

          <div className='max-w-[1400px] mx-auto px-6 lg:px-8 text-center relative'>
            <h2 className='text-4xl md:text-7xl font-black tracking-tight mb-8'>
              연구의 새로운 시작
            </h2>
            <p className='text-xl md:text-2xl text-background/70 max-w-2xl mx-auto mb-12'>
              지금 바로 첫 번째 커리큘럼을 생성하고,
              <br />
              스마트한 학습을 경험하세요.
            </p>
            <Link href='/curriculum/upload-paper'>
              <Button
                size='lg'
                className='h-20 px-14 rounded-2xl text-xl font-bold bg-primary text-primary-foreground btn-3d'
              >
                <span className='material-symbols-outlined text-3xl icon-filled'>
                  arrow_forward
                </span>
                무료로 시작하기
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
