type ContainerVariant = 'narrow' | 'wide' | 'full';

interface ContainerProps {
  children: React.ReactNode;
  variant?: ContainerVariant;
  className?: string;
}

/**
 * Container - Responsive container component with multiple variants
 *
 * Variants:
 * - narrow: Max 640px width, ideal for forms and focused content
 * - wide: Max 1024px width, ideal for dashboards and data display (default)
 * - full: 100% width with padding, ideal for full-width layouts
 */
export function Container({
  children,
  variant = 'wide',
  className = ''
}: ContainerProps) {
  const variantClasses = {
    narrow: 'max-w-2xl',
    wide: 'max-w-4xl',
    full: 'w-full'
  };

  return (
    <div className={`w-full ${variantClasses[variant]} mx-auto ${className}`}>
      {children}
    </div>
  );
}
