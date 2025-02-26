interface ExampleBlockProps {
    children: React.ReactNode;
  }
  
  export function ExampleBlock({ children }: ExampleBlockProps) {
    return (
      <div className="my-6 space-y-4">
        {children}
      </div>
    );
  }