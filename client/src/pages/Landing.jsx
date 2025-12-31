import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-400 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-handwriting text-yellow-100 mb-4">
            Digital Slam Book
          </h1>
          <p className="text-stone-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Create your own private memory book. Share it with friends to collect
            heartfelt messages, memories, and moments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/create')}
            className="w-full sm:w-auto px-8 py-4 bg-yellow-100 text-stone-900 rounded-full font-semibold text-lg hover:bg-yellow-200 transition shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Create a Slambook
          </button>
          <button
            onClick={() => {
              const link = prompt('Enter your Slambook link (e.g., /fill/your-slug):');
              if (link) {
                const slug = link.replace(/.*\/fill\//, '').replace(/.*\/view\//, '').trim();
                if (slug) {
                  navigate(`/view/${slug}`);
                } else {
                  alert('Invalid link format. Please enter a valid Slambook link.');
                }
              }
            }}
            className="w-full sm:w-auto px-8 py-4 bg-stone-700 text-yellow-100 rounded-full font-semibold text-lg hover:bg-stone-600 transition shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-stone-600"
          >
            Enter a Link
          </button>
        </div>

        <div className="mt-12 sm:mt-16 text-stone-400 text-sm">
          <p>Share your unique link with friends to collect memories</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;

