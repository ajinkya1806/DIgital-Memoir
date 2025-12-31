const EntryPreview = ({ entry, onConfirm, onBack }) => {

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#fdfbf7] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-stone-700 relative">
        {/* Envelope seal effect */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
          <span className="text-white text-2xl">✉️</span>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center border-b-2 border-stone-300 pb-4">
            <h2 className="text-2xl font-handwriting text-stone-900 mb-2">
              Preview Your Entry
            </h2>
            <p className="text-sm text-stone-600">
              This is how your page will look in the book
            </p>
          </div>

          {/* Preview content */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <h3 className="text-xl font-handwriting text-stone-900 font-bold">
                {entry.friendName}
              </h3>
              <span className="text-xs text-stone-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-3">
              {/* Personal & Emotional */}
              {(entry.firstMemory ||
                entry.favouriteThing ||
                entry.oneWord ||
                entry.wish ||
                entry.bestMemory ||
                entry.whatMakesMeLaugh) && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-stone-600 mb-2 font-bold border-b border-stone-300 pb-1">
                    Personal & Emotional
                  </h3>
                  <div className="space-y-2">
                    {entry.firstMemory && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                          First memory of you
                        </p>
                        <p className="text-stone-700 leading-relaxed font-handwriting text-sm">
                          {entry.firstMemory}
                        </p>
                      </div>
                    )}
                    {entry.bestMemory && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                          Best memory together
                        </p>
                        <p className="text-stone-700 leading-relaxed font-handwriting text-sm">
                          {entry.bestMemory}
                        </p>
                      </div>
                    )}
                    {entry.favouriteThing && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                          One thing I secretly love about us
                        </p>
                        <p className="text-stone-700 leading-relaxed font-handwriting text-sm">
                          {entry.favouriteThing}
                        </p>
                      </div>
                    )}
                    {entry.whatMakesMeLaugh && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                          What makes me laugh about you
                        </p>
                        <p className="text-stone-700 leading-relaxed font-handwriting text-sm">
                          {entry.whatMakesMeLaugh}
                        </p>
                      </div>
                    )}
                    {entry.oneWord && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                          You in one word
                        </p>
                        <p className="text-stone-700 leading-relaxed font-handwriting text-sm font-bold">
                          {entry.oneWord}
                        </p>
                      </div>
                    )}
                    {entry.wish && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                          A wish I have for you
                        </p>
                        <p className="text-stone-700 leading-relaxed font-handwriting text-sm">
                          {entry.wish}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Favorites */}
              {(entry.favoriteHero ||
                entry.favoriteSong ||
                entry.favoriteSinger ||
                entry.favoriteMovie ||
                entry.favoriteFood ||
                entry.favoriteColor) && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-stone-600 mb-2 font-bold border-b border-stone-300 pb-1">
                    Your Favorites
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {entry.favoriteHero && (
                      <div className="bg-stone-50 rounded-md p-2 border border-stone-200">
                        <span className="text-xs font-semibold text-stone-600 uppercase">Hero:</span>
                        <span className="text-sm text-stone-700 ml-1 font-handwriting">
                          {entry.favoriteHero}
                        </span>
                      </div>
                    )}
                    {entry.favoriteSong && (
                      <div className="bg-stone-50 rounded-md p-2 border border-stone-200">
                        <span className="text-xs font-semibold text-stone-600 uppercase">Song:</span>
                        <span className="text-sm text-stone-700 ml-1 font-handwriting">
                          {entry.favoriteSong}
                        </span>
                      </div>
                    )}
                    {entry.favoriteSinger && (
                      <div className="bg-stone-50 rounded-md p-2 border border-stone-200">
                        <span className="text-xs font-semibold text-stone-600 uppercase">
                          Singer:
                        </span>
                        <span className="text-sm text-stone-700 ml-1 font-handwriting">
                          {entry.favoriteSinger}
                        </span>
                      </div>
                    )}
                    {entry.favoriteMovie && (
                      <div className="bg-stone-50 rounded-md p-2 border border-stone-200">
                        <span className="text-xs font-semibold text-stone-600 uppercase">Movie:</span>
                        <span className="text-sm text-stone-700 ml-1 font-handwriting">
                          {entry.favoriteMovie}
                        </span>
                      </div>
                    )}
                    {entry.favoriteFood && (
                      <div className="bg-stone-50 rounded-md p-2 border border-stone-200">
                        <span className="text-xs font-semibold text-stone-600 uppercase">Food:</span>
                        <span className="text-sm text-stone-700 ml-1 font-handwriting">
                          {entry.favoriteFood}
                        </span>
                      </div>
                    )}
                    {entry.favoriteColor && (
                      <div className="bg-stone-50 rounded-md p-2 border border-stone-200">
                        <span className="text-xs font-semibold text-stone-600 uppercase">Color:</span>
                        <span className="text-sm text-stone-700 ml-1 font-handwriting">
                          {entry.favoriteColor}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Dreams & Future */}
              {(entry.dreamDestination || entry.futurePrediction) && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-stone-600 mb-2 font-bold border-b border-stone-300 pb-1">
                    Dreams & Future
                  </h3>
                  <div className="space-y-2">
                    {entry.dreamDestination && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                          Dream destination
                        </p>
                        <p className="text-stone-700 leading-relaxed font-handwriting text-sm">
                          {entry.dreamDestination}
                        </p>
                      </div>
                    )}
                    {entry.futurePrediction && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-stone-500 mb-0.5 font-semibold">
                          Future prediction
                        </p>
                        <p className="text-stone-700 leading-relaxed font-handwriting text-sm">
                          {entry.futurePrediction}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Final Message */}
              {entry.message && (
                <div className="border-t-2 border-stone-300 pt-3">
                  <p className="text-xs uppercase tracking-wider text-stone-500 mb-1 font-semibold">
                    A note from my heart
                  </p>
                  <p className="text-stone-700 italic leading-relaxed font-handwriting text-sm">
                    {entry.message}
                  </p>
                </div>
              )}
            </div>

            {/* Media Preview */}
            {(entry.doodleUrl || entry.audioUrl) && (
              <div className="pt-4 border-t border-stone-200 space-y-3">
                {entry.doodleUrl && (
                  <div className="flex justify-center">
                    <img
                      src={entry.doodleUrl}
                      alt="doodle preview"
                      className="h-24 border-2 border-stone-300 p-2 bg-white shadow-sm transform -rotate-2"
                      onError={(e) => {
                        console.error('Preview: Error loading doodle:', entry.doodleUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {entry.audioUrl && (
                  <div className="bg-stone-50 rounded-lg p-2">
                    <audio
                      controls
                      src={entry.audioUrl}
                      className="w-full h-8"
                      onError={(e) => {
                        console.error('Preview: Error loading audio:', entry.audioUrl);
                      }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-stone-300">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-4 py-2 border-2 border-stone-300 text-stone-700 rounded-full font-semibold hover:bg-stone-100 transition"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-800 transition shadow-lg"
            >
              Seal & Submit ✉️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryPreview;

