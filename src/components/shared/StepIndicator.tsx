interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;

        return (
          <div key={step} className="flex items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-sm shadow-primary/30' : isDone ? 'bg-primary/15 text-primary' : 'bg-surface-alt text-text-muted border border-border'}`}>
                {isDone ? '\u2713' : step}
              </div>
              <span className={`text-xs font-medium transition-colors duration-200 ${isActive ? 'text-primary font-semibold' : isDone ? 'text-text-secondary' : 'text-text-muted'}`}>
                {labels[i]}
              </span>
            </div>
            {step < totalSteps && (
              <div className={`w-10 h-px mx-0.5 transition-colors duration-300 ${isDone ? 'bg-primary/30' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
