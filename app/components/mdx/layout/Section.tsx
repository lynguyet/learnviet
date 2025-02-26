interface SectionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    variant?: 'default' | 'highlighted' | 'bordered';
    className?: string;
  }
  
  export function Section({ 
    title, 
    subtitle, 
    children, 
    variant = 'default',
    className = ''
  }: SectionProps) {
    // Variant styles mapping
    const variantStyles = {
      default: 'bg-white',
      highlighted: 'bg-blue-50 border border-blue-100',
      bordered: 'border border-gray-200'
    };
  
    return (
      <section className={`
        my-8 rounded-lg overflow-hidden
        ${variantStyles[variant]}
        ${className}
      `}>
        {/* Section Header */}
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-sm">
              {subtitle}
            </p>
          )}
        </div>
  
        {/* Section Content */}
        <div className="px-6 pb-6">
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </section>
    );
  }