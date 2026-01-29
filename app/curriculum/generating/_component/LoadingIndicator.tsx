import { LOADING_STEPS } from "../../../../const/loadingStep";
import ProgressRing from "./ProgressRing";

interface LoadingIndicatorProps {
  progress: number;
  stepIndex: number;
}

export default function LoadingIndicator({
  progress,
  stepIndex,
}: LoadingIndicatorProps) {
  return (
    <div className='relative w-40 h-40 mb-10'>
      <ProgressRing progress={progress} />

      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <span className='material-symbols-outlined text-4xl text-primary mb-1 animate-bounce'>
          {LOADING_STEPS[stepIndex]?.icon || "hourglass_empty"}
        </span>
        <span className='text-2xl font-bold text-foreground'>{progress}%</span>
      </div>
    </div>
  );
}
