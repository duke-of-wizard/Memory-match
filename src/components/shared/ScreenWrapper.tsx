interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}

export function ScreenWrapper({ children, className = '', wide = false }: ScreenWrapperProps) {
  const maxW = wide ? 'max-w-5xl' : 'max-w-[780px]';

  return (
    <div className="w-full min-h-screen flex items-start justify-center py-6 md:py-10 px-4">
      <div className={`w-full bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border ${maxW} px-10 py-12 md:px-14 md:py-14 ${className}`}>
        {children}
      </div>
    </div>
  );
}
