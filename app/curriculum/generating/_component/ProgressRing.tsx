interface ProgressRingProps {
  progress: number; // 0 ~ 100
  strokeWidth?: number;
}

export function ProgressRing({ progress, strokeWidth = 6 }: ProgressRingProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dash = (progress / 100) * circumference;

  return (
    <svg className='w-full h-full -rotate-90' viewBox='0 0 160 160'>
      {/* Background */}
      <circle
        cx='80'
        cy='80'
        r={radius}
        fill='none'
        stroke='currentColor'
        strokeWidth='4'
        className='text-muted'
      />

      {/* Progress */}
      <circle
        cx='80'
        cy='80'
        r={radius}
        fill='none'
        stroke='url(#progressGradient)'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeDasharray={`${dash} ${circumference}`}
        className='transition-all duration-300'
      />

      <defs>
        <linearGradient
          id='progressGradient'
          x1='0%'
          y1='0%'
          x2='100%'
          y2='100%'
        >
          <stop offset='0%' stopColor='var(--primary)' />
          <stop offset='50%' stopColor='var(--accent)' />
          <stop offset='100%' stopColor='var(--secondary)' />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default ProgressRing;
