import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreateBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    pin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdBook, setCreatedBook] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title.trim()) {
      setError('Please enter a title for your Slambook.');
      setLoading(false);
      return;
    }

    if (!formData.pin.trim() || formData.pin.length < 4) {
      setError('Please enter a PIN with at least 4 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/books', {
        title: formData.title.trim(),
        pin: formData.pin.trim(),
      });

      setCreatedBook(response.data);
    } catch (err) {
      console.error('Create book error:', err);
      
      // More detailed error handling
      let errorMessage = 'Something went wrong while creating your Slambook. Please try again.';
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response?.data?.error || errorMessage;
      } else if (err.request) {
        // Request made but no response (network error)
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        console.error('Network error - no response received:', err.request);
      } else {
        // Something else
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const shareLink = createdBook
    ? `${window.location.origin}/fill/${createdBook.slug}`
    : '';
  const viewLink = createdBook
    ? `${window.location.origin}/view/${createdBook.slug}`
    : '';

  if (createdBook) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-4">
        <div className="max-w-2xl w-full bg-[#fdfbf7] p-6 sm:p-8 rounded-xl shadow-2xl border-4 border-stone-700">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold font-handwriting text-stone-900 mb-2">
              Your Slambook is Ready! 🎉
            </h1>
            <p className="text-stone-600">
              Share the link below with your friends to collect memories.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-2 uppercase">
                Share this link with friends (to add entries)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2 bg-stone-100 border border-stone-300 rounded-lg px-4 py-3">
                <span className="truncate flex-1 text-stone-700 text-sm">
                  {shareLink}
                </span>
                {navigator.clipboard && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      alert('Link copied to clipboard!');
                    }}
                    className="text-xs font-semibold text-stone-800 bg-stone-200 hover:bg-stone-300 rounded-full px-4 py-2 transition whitespace-nowrap"
                  >
                    Copy Link
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-2 uppercase">
                Your private link (to view entries - requires PIN)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2 bg-stone-100 border border-stone-300 rounded-lg px-4 py-3">
                <span className="truncate flex-1 text-stone-700 text-sm">
                  {viewLink}
                </span>
                {navigator.clipboard && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(viewLink);
                      alert('Link copied to clipboard!');
                    }}
                    className="text-xs font-semibold text-stone-800 bg-stone-200 hover:bg-stone-300 rounded-full px-4 py-2 transition whitespace-nowrap"
                  >
                    Copy Link
                  </button>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs text-yellow-800 font-semibold mb-1">
                ⚠️ Important: Save your PIN!
              </p>
              <p className="text-xs text-yellow-700">
                You'll need your PIN ({formData.pin}) to view the entries. Make sure to save it
                somewhere safe.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/view/${createdBook.slug}`)}
              className="flex-1 bg-stone-900 text-white py-3 rounded-full font-semibold tracking-[0.25em] text-sm hover:bg-stone-800 transition"
            >
              View My Slambook
            </button>
            <button
              onClick={() => {
                setCreatedBook(null);
                setFormData({ title: '', pin: '' });
              }}
              className="flex-1 bg-stone-200 text-stone-800 py-3 rounded-full font-semibold tracking-[0.25em] text-sm hover:bg-stone-300 transition"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-4">
      <div className="max-w-md w-full bg-[#fdfbf7] p-6 sm:p-8 rounded-xl shadow-2xl border-4 border-stone-700">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold font-handwriting text-stone-900 mb-2">
            Create Your Slambook
          </h1>
          <p className="text-stone-600 text-sm">
            Give your memory book a name and set a secret PIN to protect it.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
              Slambook Title
            </label>
            <input
              type="text"
              required
              maxLength={100}
              className="w-full border-2 border-stone-300 rounded-lg px-4 py-3 bg-white focus:ring-2 ring-stone-400 outline-none text-stone-900"
              placeholder="e.g., My 2024 Memories"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
              Secret PIN
            </label>
            <input
              type="password"
              required
              minLength={4}
              maxLength={20}
              className="w-full border-2 border-stone-300 rounded-lg px-4 py-3 bg-white focus:ring-2 ring-stone-400 outline-none text-stone-900"
              placeholder="At least 4 characters"
              value={formData.pin}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, pin: e.target.value }))
              }
            />
            <p className="text-xs text-stone-500 mt-1">
              You'll need this PIN to view entries. Make sure to remember it!
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-3.5 rounded-full font-semibold tracking-[0.25em] text-sm hover:bg-stone-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Slambook'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full bg-stone-200 text-stone-800 py-3 rounded-full font-semibold tracking-[0.25em] text-sm hover:bg-stone-300 transition"
          >
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBook;

