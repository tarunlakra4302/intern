const ChartCard = ({
  title,
  subtitle,
  children,
  actions,
  loading = false,
  error,
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`card bg-base-100 shadow ${className}`}>
        <div className="card-body">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="h-6 bg-base-300 rounded animate-pulse w-32 mb-2" />
              <div className="h-4 bg-base-300 rounded animate-pulse w-24" />
            </div>
          </div>
          <div className="h-64 bg-base-300 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`card bg-base-100 shadow ${className}`}>
        <div className="card-body">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="card-title text-base-content">{title}</h3>
              {subtitle && <p className="text-base-content/60 text-sm">{subtitle}</p>}
            </div>
            {actions && <div className="card-actions">{actions}</div>}
          </div>
          <div className="flex items-center justify-center h-64 text-error">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Chart Error</div>
              <div className="text-sm opacity-70">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card bg-base-100 shadow hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="card-title text-base-content">{title}</h3>
            {subtitle && <p className="text-base-content/60 text-sm">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>

        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChartCard;