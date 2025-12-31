const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`${sizeClasses[size]} border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-stone-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

