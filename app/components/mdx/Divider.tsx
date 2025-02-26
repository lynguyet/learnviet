interface DividerProps {
    className?: string;
  }
  
  export function Divider({ className = '' }: DividerProps) {
    return (
      <hr className={`my-8 border-t border-gray-200 ${className}`} />
    );
  }