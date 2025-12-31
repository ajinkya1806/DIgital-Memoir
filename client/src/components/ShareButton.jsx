import { useState } from 'react';

const ShareButton = ({ link, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition border border-white/20 ${className}`}
    >
      <span className="text-sm">{copied ? '✓ Copied!' : '🔗 Share Link'}</span>
    </button>
  );
};

export default ShareButton;

