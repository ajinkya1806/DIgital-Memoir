const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-red-50 border border-red-200 rounded-lg">
      <div className="text-red-600 text-lg">⚠️</div>
      <p className="text-red-700 text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition text-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

