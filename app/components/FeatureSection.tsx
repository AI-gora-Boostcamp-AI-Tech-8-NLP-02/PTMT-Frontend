import FeatureCard from "./FeatureCard";

export default function FeatureSection() {
  return (
    <div>
      {/* Features - Bento Grid Style */}
      <section className='py-32 mesh-gradient relative'>
        <div className='max-w-350 mx-auto px-6 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto mb-20'>
            <h2 className='text-4xl md:text-6xl font-black tracking-tight mb-6'>
              왜 <span className='text-gradient-bold'>페튜와 매튜</span>
              인가요?
            </h2>
          </div>

          {/* Bento Grid */}
          <div className='grid grid-cols-3 gap-6'>
            <FeatureCard
              icon='psychology'
              title='AI 맞춤형 학습 경로'
              description='논문의 핵심 개념을 추출하고, 당신의 배경지식을 고려하여 가장 효율적인 학습 순서를 자동으로 설계합니다.'
              gradientClass='bg-linear-to-br from-primary to-primary/60'
              tags={["개인화", "자동화"]}
            />

            <FeatureCard
              icon='bolt'
              title='스마트 요약'
              description='어려운 논문도 핵심만 쏙! AI가 이해하기 쉬운 말로 요약합니다.'
              gradientClass='bg-gradient-to-br from-accent to-accent/60'
            />

            <FeatureCard
              icon='hub'
              title='지식 그래프'
              description='개념들 사이의 연결고리를 시각화하여 큰 그림을 파악하세요.'
              gradientClass='bg-gradient-to-br from-primary to-accent'
            />
          </div>
        </div>
      </section>
    </div>
  );
}
