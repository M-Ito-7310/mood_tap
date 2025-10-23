interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * BaseLayout - Main application layout with gradient background
 *
 * This component provides the foundational layout structure for all pages,
 * including the gradient background and proper content containment.
 */
export function BaseLayout({ children, className = '' }: BaseLayoutProps) {
  return (
    <div className={`min-h-screen w-full ${className}`}>
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
