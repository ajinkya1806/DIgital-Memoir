import { useEffect } from 'react';

const SuccessToast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <span className="text-xl">✓</span>
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default SuccessToast;

