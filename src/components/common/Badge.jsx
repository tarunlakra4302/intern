const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = ""
}) => {
  const variants = {
    default: 'badge-neutral',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    ghost: 'badge-ghost',
    outline: 'badge-outline'
  };

  const sizes = {
    xs: 'badge-xs',
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg'
  };

  // Status-based variants for common use cases
  const statusVariants = {
    active: 'badge-success',
    inactive: 'badge-error',
    pending: 'badge-warning',
    completed: 'badge-success',
    cancelled: 'badge-error',
    in_progress: 'badge-info',
    scheduled: 'badge-accent',
    on_hold: 'badge-warning',
    maintenance: 'badge-warning',
    on_leave: 'badge-neutral',
    draft: 'badge-ghost',
    sent: 'badge-info',
    paid: 'badge-success',
    overdue: 'badge-error',
    approved: 'badge-success',
    rejected: 'badge-error',
    in_transit: 'badge-info'
  };

  const badgeVariant = statusVariants[variant] || variants[variant] || variants.default;

  return (
    <span className={`badge ${badgeVariant} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;