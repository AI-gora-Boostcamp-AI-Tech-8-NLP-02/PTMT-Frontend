interface LoadingStepsProps {
  currentStepIndex: number;
  total: number;
}

export default function LoadingSteps({
  currentStepIndex,
  total,
}: LoadingStepsProps) {
  return (
    <div className='flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-sm border border-white/40'>
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={`
            w-3 h-3 rounded-full transition-all duration-500
            ${idx < currentStepIndex ? "bg-primary" : ""}
            ${idx === currentStepIndex ? "bg-accent scale-125 animate-pulse" : ""}
            ${idx > currentStepIndex ? "bg-muted" : ""}
          `}
        />
      ))}
    </div>
  );
}
