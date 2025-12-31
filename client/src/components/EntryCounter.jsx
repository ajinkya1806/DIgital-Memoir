import { useEffect, useState } from 'react';
import api from '../utils/api';

const EntryCounter = ({ slug }) => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchCount = async () => {
      try {
        const res = await api.get(`/api/books/${slug}/count`);
        setCount(res.data.count);
      } catch (err) {
        console.error('Failed to fetch count:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, [slug]);

  if (loading) return null;

  const getMessage = () => {
    if (count === 0) {
      return "You're the first to sign! 🌟";
    }
    if (count === 1) {
      return "You're the second person to sign! ✨";
    }
    const ordinal = count + 1;
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = ordinal % 100;
    const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    return `You're the ${ordinal}${suffix} person to sign! 💫`;
  };

  return (
    <div className="text-center mb-4 animate-fade-in">
      <p className="text-sm font-handwriting text-stone-600">
        {getMessage()}
      </p>
    </div>
  );
};

export default EntryCounter;

