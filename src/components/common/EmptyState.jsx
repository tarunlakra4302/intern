import { Package, Plus } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Package,
  title = "No data available",
  description,
  actionLabel,
  onAction,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4">
        <Icon className="w-16 h-16 text-base-content/30" />
      </div>

      <h3 className="text-lg font-semibold text-base-content mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-base-content/60 mb-6 max-w-md">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;