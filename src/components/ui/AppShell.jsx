export function AppShell({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-base-100 ${className}`}>
      {children}
    </div>
  );
}