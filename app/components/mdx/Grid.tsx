interface GridProps {
    children: React.ReactNode;
    cols?: number;
    gap?: 'small' | 'medium' | 'large';
  }
  
  export function Grid({ children, cols = 2, gap = 'medium' }: GridProps) {
    const gapStyles = {
      small: 'gap-4',
      medium: 'gap-6',
      large: 'gap-8'
    };
  
    return (
      <div className={`grid grid-cols-1 md:grid-cols-${cols} ${gapStyles[gap]}`}>
        {children}
      </div>
    );
  }