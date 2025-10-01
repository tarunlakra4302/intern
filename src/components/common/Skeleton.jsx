const Skeleton = ({
  width = "100%",
  height = "1rem",
  className = "",
  variant = "rectangular"
}) => {
  const variants = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded",
    avatar: "rounded-full w-10 h-10"
  };

  const style = variant === "avatar" ? {} : { width, height };

  return (
    <div
      className={`animate-pulse bg-base-300 ${variants[variant]} ${className}`}
      style={style}
    />
  );
};

const SkeletonText = ({ lines = 3, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          height="0.75rem"
          width={index === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
};

const SkeletonCard = ({ className = "" }) => {
  return (
    <div className={`p-4 border border-base-300 rounded-lg ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton variant="circular" width="3rem" height="3rem" />
          <div className="flex-1">
            <Skeleton height="1rem" width="70%" className="mb-2" />
            <Skeleton height="0.75rem" width="40%" />
          </div>
        </div>
        <SkeletonText lines={2} />
      </div>
    </div>
  );
};

const SkeletonTable = ({ rows = 5, columns = 4, className = "" }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table w-full">
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, index) => (
              <th key={index} className="bg-base-100">
                <Skeleton height="1rem" width="80%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <td key={colIndex} className="py-3">
                  <Skeleton
                    height="0.75rem"
                    width={colIndex === 0 ? "90%" : Math.random() > 0.5 ? "70%" : "50%"}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Skeleton.Text = SkeletonText;
Skeleton.Card = SkeletonCard;
Skeleton.Table = SkeletonTable;

export default Skeleton;