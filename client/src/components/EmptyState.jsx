import { Link } from 'react-router-dom';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 text-center">
      <div className="text-6xl mb-4">📖</div>
      <h2 className="text-2xl font-handwriting text-white font-bold">
        The book is empty!
      </h2>
      <p className="text-stone-300 max-w-md">
        No one has signed your slam book yet. Be the first to leave a memory, or
        share the link with friends to start collecting beautiful moments.
      </p>
      <Link
        to="/fill"
        className="mt-4 px-8 py-3 bg-white text-stone-900 rounded-full font-semibold hover:bg-stone-100 transition shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Sign the Book
      </Link>
    </div>
  );
};

export default EmptyState;

