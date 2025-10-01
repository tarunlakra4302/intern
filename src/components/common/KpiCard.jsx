import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KpiCard = ({
  title,
  value,
  previousValue,
  trend,
  trendValue,
  trendLabel,
  icon: Icon,
  color = "primary",
  prefix = "",
  suffix = "",
  loading = false,
  className = ""
}) => {
  // Auto-calculate trend if previousValue provided but trend/trendValue not
  let calculatedTrend = trend;
  let calculatedTrendValue = trendValue;

  if (previousValue && !trend && !trendValue) {
    const change = ((value - previousValue) / previousValue) * 100;
    calculatedTrendValue = Math.abs(change).toFixed(1);
    calculatedTrend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  }

  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info'
  };

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-base-content/60'
  };

  const TrendIcon = trendIcons[calculatedTrend];

  if (loading) {
    return (
      <div className={`stats shadow bg-base-100 ${className}`}>
        <div className="stat">
          <div className="stat-figure text-base-content/30">
            <div className="w-8 h-8 bg-base-300 rounded animate-pulse" />
          </div>
          <div className="stat-title">
            <div className="h-4 bg-base-300 rounded animate-pulse w-24" />
          </div>
          <div className="stat-value">
            <div className="h-8 bg-base-300 rounded animate-pulse w-32" />
          </div>
          <div className="stat-desc">
            <div className="h-3 bg-base-300 rounded animate-pulse w-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`stats shadow bg-base-100 hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="stat">
        {Icon && (
          <div className={`stat-figure ${colors[color]}`}>
            <Icon className="w-8 h-8" />
          </div>
        )}

        <div className="stat-title text-base-content/70">{title}</div>

        <div className={`stat-value ${colors[color]} text-2xl lg:text-3xl`}>
          {prefix}
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix}
        </div>

        {(calculatedTrend || trendLabel) && (
          <div className="stat-desc flex items-center gap-1 mt-1">
            {TrendIcon && calculatedTrendValue && (
              <>
                <TrendIcon className={`w-4 h-4 ${trendColors[calculatedTrend]}`} />
                <span className={trendColors[calculatedTrend]}>
                  {calculatedTrendValue}%
                </span>
              </>
            )}
            {trendLabel && (
              <span className="text-base-content/60 ml-1">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;