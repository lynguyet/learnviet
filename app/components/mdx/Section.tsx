interface SectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Section({ children, title, className = '' }: SectionProps) {
  return (
    <section className={`my-8 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
      )}
      {children}
    </section>
  );
}