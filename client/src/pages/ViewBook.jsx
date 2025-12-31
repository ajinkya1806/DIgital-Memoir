import React, { useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import ShareButton from '../components/ShareButton';
import ReactionButton from '../components/ReactionButton';
import { MOODS } from '../components/MoodSelector';
import { soundManager } from '../utils/sounds';

// Page Component: MUST be forwardedRef for react-pageflip to work
const Page = React.forwardRef((props, ref) => {
  const { entry } = props;
  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Get mood styling
  const mood = entry.mood || 'classic';
  const moodConfig = MOODS.find((m) => m.id === mood) || MOODS[4]; // Default to classic

  // Check if this is an old entry (only has message field) - backward compatibility
  const isOldEntry = !entry.firstMemory && !entry.favouriteThing && entry.message;

  // Debug: Log entry data including media URLs
  React.useEffect(() => {
    if (entry.doodleUrl || entry.audioUrl) {
      console.log(`📄 Entry ${entry._id} (${entry.friendName}):`, {
        hasDoodle: !!entry.doodleUrl,
        hasAudio: !!entry.audioUrl,
        doodleUrl: entry.doodleUrl,
        audioUrl: entry.audioUrl,
        doodleUrlType: typeof entry.doodleUrl,
        audioUrlType: typeof entry.audioUrl,
      });
    }
  }, [entry._id, entry.doodleUrl, entry.audioUrl, entry.friendName]);

  return (
    <div
      className="page bg-[#fdfbf7] shadow-inner border-l border-stone-200 h-full w-full"
      ref={ref}
    >
      <div
        className={`h-full p-3 sm:p-4 md:p-6 relative border-2 sm:border-4 border-double ${moodConfig.border} m-1 sm:m-2 overflow-hidden bg-gradient-to-br ${moodConfig.color}`}
      >
        {/* Paper texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5 paper-texture" />

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-stone-300 pb-2 sm:pb-3 mb-3 sm:mb-4 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">{moodConfig.emoji}</span>
              <h2 className="text-xl sm:text-2xl font-bold font-handwriting text-stone-900">
                {entry.friendName}
              </h2>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <ReactionButton entryId={entry._id} />
              <span className="text-[10px] sm:text-xs text-stone-500 font-mono">
                {formattedDate}
              </span>
            </div>
          </div>
          
          {/* Message content - Structured display with all fields */}
          <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2">
            {/* Backward compatibility: Show parsed message for old entries */}
            {isOldEntry ? (
              <div className="space-y-3 sm:space-y-4">
                {entry.message.split('\n\n').map((section, idx) => {
                  const isLabeled = section.includes(':');
                  if (isLabeled) {
                    const [label, ...contentParts] = section.split(':');
                    const content = contentParts.join(':').trim();

                    if (label.trim() === 'Favorites') {
                      const favorites = content.split(' • ');
                      return (
                        <div key={idx} className="mb-3 sm:mb-4">
                          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-600 mb-2 font-bold border-b border-stone-300 pb-1">
                            {label.trim()}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {favorites.map((fav, favIdx) => {
                              const [key, value] = fav.split(':').map((s) => s.trim());
                              return (
                                <div
                                  key={favIdx}
                                  className="bg-white/60 rounded-md p-2 border border-stone-200"
                                >
                                  <span className="text-[10px] sm:text-xs font-semibold text-stone-600 uppercase">
                                    {key}:
                                  </span>
                                  <span className="text-xs sm:text-sm text-stone-700 ml-1 font-handwriting">
                                    {value}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={idx} className="mb-3 sm:mb-4">
                        <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 mb-1 font-semibold">
                          {label.trim()}
                        </p>
                        <p className="text-stone-700 leading-relaxed font-handwriting text-xs sm:text-sm">
                          {content}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p
                      key={idx}
                      className="text-stone-700 italic leading-relaxed font-handwriting text-xs sm:text-sm"
                    >
                      {section}
                    </p>
                  );
                })}
              </div>
            ) : (
              <>
                {/* Nickname display */}
                {entry.nickname && (
                  <div className="mb-3">
                    <p className="text-xs sm:text-sm text-stone-500 italic font-handwriting">
                      &quot;{entry.nickname}&quot;
                    </p>
                  </div>
                )}

                {/* Personal & Emotional Section */}
                {(entry.firstMemory ||
              entry.favouriteThing ||
              entry.oneWord ||
              entry.wish ||
              entry.bestMemory ||
              entry.whatMakesMeLaugh) && (
              <div className="mb-3 sm:mb-4">
                <h3 className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-600 mb-2 font-bold border-b border-stone-300 pb-1">
                  Personal & Emotional
                </h3>
                <div className="space-y-2">
                  {entry.firstMemory && (
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                        First memory of you
                      </p>
                      <p className="text-stone-700 leading-relaxed font-handwriting text-xs sm:text-sm">
                        {entry.firstMemory}
                      </p>
                    </div>
                  )}
                  {entry.bestMemory && (
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                        Best memory together
                      </p>
                      <p className="text-stone-700 leading-relaxed font-handwriting text-xs sm:text-sm">
                        {entry.bestMemory}
                      </p>
                    </div>
                  )}
                  {entry.favouriteThing && (
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                        One thing I secretly love about us
                      </p>
                      <p className="text-stone-700 leading-relaxed font-handwriting text-xs sm:text-sm">
                        {entry.favouriteThing}
                      </p>
                    </div>
                  )}
                  {entry.whatMakesMeLaugh && (
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                        What makes me laugh about you
                      </p>
                      <p className="text-stone-700 leading-relaxed font-handwriting text-xs sm:text-sm">
                        {entry.whatMakesMeLaugh}
                      </p>
                    </div>
                  )}
                  {entry.oneWord && (
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                        You in one word
                      </p>
                      <p className="text-stone-700 leading-relaxed font-handwriting text-xs sm:text-sm font-bold">
                        {entry.oneWord}
                      </p>
                    </div>
                  )}
                  {entry.wish && (
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                        A wish I have for you
                      </p>
                      <p className="text-stone-700 leading-relaxed font-handwriting text-xs sm:text-sm">
                        {entry.wish}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

                {/* Favorites Section */}
                {(entry.favoriteHero ||
              entry.favoriteSong ||
              entry.favoriteSinger ||
              entry.favoriteMovie ||
              entry.favoriteFood ||
              entry.favoriteColor) && (
              <div className="mb-3 sm:mb-4">
                <h3 className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-600 mb-2 font-bold border-b border-stone-300 pb-1">
                  Your Favorites
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {entry.favoriteHero && (
                    <div className="bg-white/60 rounded-md p-2 border border-stone-200">
                      <span className="text-[10px] sm:text-xs font-semibold text-stone-600 uppercase">
                        Hero:
                      </span>
                      <span className="text-xs sm:text-sm text-stone-700 ml-1 font-handwriting">
                        {entry.favoriteHero}
                      </span>
                    </div>
                  )}
                  {entry.favoriteSong && (
                    <div className="bg-white/60 rounded-md p-2 border border-stone-200">
                      <span className="text-[10px] sm:text-xs font-semibold text-stone-600 uppercase">
                        Song:
                      </span>
                      <span className="text-xs sm:text-sm text-stone-700 ml-1 font-handwriting">
                        {entry.favoriteSong}
                      </span>
                    </div>
                  )}
                  {entry.favoriteSinger && (
                    <div className="bg-white/60 rounded-md p-2 border border-stone-200">
                      <span className="text-[10px] sm:text-xs font-semibold text-stone-600 uppercase">
                        Singer:
                      </span>
                      <span className="text-xs sm:text-sm text-stone-700 ml-1 font-handwriting">
                        {entry.favoriteSinger}
                      </span>
                    </div>
                  )}
                  {entry.favoriteMovie && (
                    <div className="bg-white/60 rounded-md p-2 border border-stone-200">
                      <span className="text-[10px] sm:text-xs font-semibold text-stone-600 uppercase">
                        Movie:
                      </span>
                      <span className="text-xs sm:text-sm text-stone-700 ml-1 font-handwriting">
                        {entry.favoriteMovie}
                      </span>
                    </div>
                  )}
                  {entry.favoriteFood && (
                    <div className="bg-white/60 rounded-md p-2 border border-stone-200">
                      <span className="text-[10px] sm:text-xs font-semibold text-stone-600 uppercase">
                        Food:
                      </span>
                      <span className="text-xs sm:text-sm text-stone-700 ml-1 font-handwriting">
                        {entry.favoriteFood}
                      </span>
                    </div>
                  )}
                  {entry.favoriteColor && (
                    <div className="bg-white/60 rounded-md p-2 border border-stone-200">
                      <span className="text-[10px] sm:text-xs font-semibold text-stone-600 uppercase">
                        Color:
                      </span>
                      <span className="text-xs sm:text-sm text-stone-700 ml-1 font-handwriting">
                        {entry.favoriteColor}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

                {/* Dreams & Future Section */}
                {(entry.dreamDestination || entry.futurePrediction) && (
              <div className="mb-3 sm:mb-4">
                <h3 className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-600 mb-2 font-bold border-b border-stone-300 pb-1">
                  Dreams & Future
                </h3>
                <div className="space-y-2">
                  {entry.dreamDestination && (
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                        Dream destination
                      </p>
                      <p className="text-stone-700 leading-relaxed font-handwriting text-xs sm:text-sm">
                        {entry.dreamDestination}
                      </p>
                    </div>
                  )}
                  {entry.futurePrediction && (
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                        Future prediction
                      </p>
                      <p className="text-stone-700 leading-relaxed font-handwriting text-xs sm:text-sm">
                        {entry.futurePrediction}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

                {/* Final Message */}
                {entry.message && (
                  <div className="mb-3 sm:mb-4 border-t-2 border-stone-300 pt-3">
                    <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 mb-1 font-semibold">
                      A note from my heart
                    </p>
                    <p className="text-stone-700 italic leading-relaxed font-handwriting text-xs sm:text-sm">
                      {entry.message}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Media at bottom - Show for both old and new entries */}
          {(entry.doodleUrl || entry.audioUrl) && (
            <div className="mt-4 space-y-3 pt-4 border-t border-stone-200">
              {entry.doodleUrl && (
                <div className="flex justify-center">
                  <img
                    src={entry.doodleUrl}
                    alt="doodle"
                    className="h-24 sm:h-28 mx-auto transform -rotate-2 border-2 border-stone-300 p-2 bg-white shadow-md hover:rotate-0 transition-transform"
                    onLoad={() => {
                      console.log('✅ Doodle image loaded successfully:', entry.doodleUrl);
                    }}
                    onError={(e) => {
                      console.error('❌ Error loading doodle image:', entry.doodleUrl);
                      console.error('Entry ID:', entry._id);
                      console.error('Full entry:', entry);
                      // Show a placeholder instead of hiding
                      e.target.style.display = 'none';
                      const errorMsg = e.target.nextSibling;
                      if (!errorMsg || !errorMsg.classList.contains('doodle-error')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'doodle-error text-xs text-red-500 text-center p-2';
                        errorDiv.textContent = 'Doodle image could not be loaded';
                        e.target.parentNode.appendChild(errorDiv);
                      }
                    }}
                    style={{ maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}
              {entry.audioUrl && (
                <div className="bg-stone-50 rounded-lg p-2">
                  <audio
                    controls
                    src={entry.audioUrl}
                    className="w-full h-8"
                    preload="metadata"
                    onError={(e) => {
                      console.error('❌ Error loading audio:', entry.audioUrl);
                      console.error('Entry ID:', entry._id);
                    }}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          )}
          
          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (entry.doodleUrl || entry.audioUrl) && (
            <div className="mt-2 text-[8px] text-stone-400 text-center">
              Debug: Doodle: {entry.doodleUrl ? '✓' : '✗'} | Audio: {entry.audioUrl ? '✓' : '✗'}
            </div>
            )}
          </div>
       </div>
    </div>
  );
});

Page.displayName = 'Page';

const ViewBook = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/slam');
      setEntries(res.data);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Failed to load memories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const shareLink = `${window.location.origin}/fill`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-400 rounded-full blur-3xl" />
      </div>

      {/* Header buttons */}
      <div className="absolute top-2 sm:top-5 right-2 sm:right-5 flex flex-col sm:flex-row gap-2 sm:gap-3 z-50">
        <ShareButton link={shareLink} className="text-xs sm:text-sm" />
        <Link
          to="/fill"
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2 bg-white text-stone-900 rounded-full font-semibold hover:bg-stone-100 transition shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
        >
          <span>+</span>
          <span className="hidden sm:inline">Sign Book</span>
          <span className="sm:hidden">Sign</span>
      </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {loading ? (
          <LoadingSpinner size="lg" text="Loading your memories..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchEntries} />
        ) : entries.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative w-full flex justify-center">
            <HTMLFlipBook
              width={Math.min(
                window.innerWidth < 640 ? window.innerWidth - 20 : 400,
                window.innerWidth - 40
              )}
              height={Math.min(
                window.innerWidth < 640 ? window.innerHeight - 120 : 600,
                window.innerHeight - 100
              )}
              showCover={true}
              maxShadowOpacity={0.5}
              className="shadow-2xl"
              flippingTime={600}
              onFlip={(e) => {
                if (e.data === 2) {
                  // Page flip event
                  soundManager.playPageFlip();
                }
              }}
            >
          {/* Cover */}
              <div className="bg-gradient-to-br from-red-900 to-red-800 text-yellow-100 flex items-center justify-center border-r-4 border-red-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 border-2 border-yellow-200 rounded-full" />
                  <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-yellow-200 rounded-full" />
                </div>
                <div className="border-4 border-yellow-100 p-8 text-center relative z-10">
                  <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest font-handwriting">
                    Slam
                    <br />
                    Book
                  </h1>
                  <p className="mt-4 text-sm tracking-widest opacity-90">
                    {entries.length} {entries.length === 1 ? 'Memory' : 'Memories'}
                  </p>
             </div>
          </div>
          
          {/* Dynamic Pages */}
          {entries.map((entry) => (
            <Page key={entry._id} entry={entry} />
          ))}
          
           {/* Back Cover */}
              <div className="bg-gradient-to-br from-red-900 to-red-800 text-yellow-100 flex items-center justify-center border-l-4 border-red-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-32 h-32 border-2 border-yellow-200 rounded-full" />
                  <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-yellow-200 rounded-full" />
                </div>
                <div className="text-center relative z-10">
                  <h1 className="text-2xl font-handwriting mb-2">The End</h1>
                  <p className="text-sm opacity-80">Thank you for the memories</p>
                </div>
          </div>
        </HTMLFlipBook>
        </div>
      )}
      </div>
    </div>
  );
};

export default ViewBook;