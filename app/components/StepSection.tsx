import StepCard from "./StepCard";

export default function StepSection() {
  return (
    <div>
      {/* How It Works - Bold stepped layout */}
      <section id='how-it-works' className='py-32 relative overflow-hidden'>
        <div className='absolute inset-0 bg-foreground/2' />

        <div className='max-w-350 mx-auto px-6 lg:px-8 relative'>
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

          {/* Steps - Cards */}
          <div className='grid md:grid-cols-3 gap-8 items-stretch stagger-fade'>
            <StepCard
              step={1}
              icon='upload_file'
              title='논문 업로드'
              description='PDF, URL 또는 제목만으로도 OK. AI가 논문을 자동으로 분석합니다.'
              color='primary'
            />

            <StepCard
              step={2}
              icon='tune'
              title='맞춤 설정'
              description='학습 목표, 수준, 시간을 설정하면 AI가 최적의 경로를 계산합니다.'
              color='accent'
            />

            <StepCard
              step={3}
              icon='route'
              title='학습 시작'
              description='시각화된 커리큘럼과 함께 체계적인 학습을 시작하세요.'
              color='primary'
            />
          </div>
        </div>
      </section>
    </div>
  );
}
