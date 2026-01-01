import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import SignaturePad from '../components/SignaturePad';
import VoiceRecorder from '../components/VoiceRecorder';
import EntryCounter from '../components/EntryCounter';
import MoodSelector, { MOODS } from '../components/MoodSelector';
import EntryPreview from '../components/EntryPreview';
import { soundManager } from '../utils/sounds';

const INITIAL_FORM = {
  name: '',
  nickname: '',
  firstMemory: '',
  favouriteThing: '',
  oneWord: '',
  wish: '',
  favoriteHero: '',
  favoriteSong: '',
  favoriteSinger: '',
  favoriteMovie: '',
  favoriteFood: '',
  favoriteColor: '',
  dreamDestination: '',
  bestMemory: '',
  whatMakesMeLaugh: '',
  futurePrediction: '',
  message: '',
};

const FillSlam = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [doodleBlob, setDoodleBlob] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [doodlePreviewUrl, setDoodlePreviewUrl] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [mood, setMood] = useState('classic');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shareLink = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return slug ? `${window.location.origin}/fill/${slug}` : '';
  }, [slug]);

  // Redirect if slug is missing
  if (!slug) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-4">
        <div className="max-w-md w-full bg-[#fdfbf7] p-6 sm:p-8 rounded-xl shadow-2xl border-4 border-stone-700 text-center">
          <h1 className="text-2xl font-bold font-handwriting text-stone-900 mb-4">
            Invalid Slambook Link
          </h1>
          <p className="text-stone-600 mb-6">
            This link is not valid. Please check the URL or ask for the correct link.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-stone-900 text-white py-3 rounded-full font-semibold tracking-[0.25em] text-sm hover:bg-stone-800 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }


  const handleDoodleSave = (blob) => {
    setDoodleBlob(blob);
    if (blob) {
      setDoodlePreviewUrl(URL.createObjectURL(blob));
    }
  };

  const handleAudioStop = (blob) => {
    setAudioBlob(blob);
    if (blob) {
      setAudioPreviewUrl(URL.createObjectURL(blob));
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
    soundManager.playSeal();
  };

  const handleConfirmSubmit = async () => {
    setShowPreview(false);
    setError('');
    setLoading(true);
    soundManager.playSeal();

    const data = new FormData();
    // Basic info
    data.append('friendName', formData.name);
    data.append('nickname', formData.nickname || '');
    data.append('mood', mood);
    // Personal & Emotional
    data.append('firstMemory', formData.firstMemory || '');
    data.append('favouriteThing', formData.favouriteThing || '');
    data.append('oneWord', formData.oneWord || '');
    data.append('wish', formData.wish || '');
    data.append('bestMemory', formData.bestMemory || '');
    data.append('whatMakesMeLaugh', formData.whatMakesMeLaugh || '');
    // Favorites
    data.append('favoriteHero', formData.favoriteHero || '');
    data.append('favoriteSong', formData.favoriteSong || '');
    data.append('favoriteSinger', formData.favoriteSinger || '');
    data.append('favoriteMovie', formData.favoriteMovie || '');
    data.append('favoriteFood', formData.favoriteFood || '');
    data.append('favoriteColor', formData.favoriteColor || '');
    // Dreams & Future
    data.append('dreamDestination', formData.dreamDestination || '');
    data.append('futurePrediction', formData.futurePrediction || '');
    // Final message
    data.append('message', formData.message || '');
    // Media
    if (doodleBlob) data.append('doodle', doodleBlob, 'doodle.png');
    if (audioBlob) data.append('audio', audioBlob, 'voice.webm');

    try {
      if (!slug) {
        setError('Invalid Slambook link. Please check the URL.');
        setLoading(false);
        return;
      }

      await api.post(`/api/books/${slug}/entries`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Navigate to a success page or show a message
      alert('Your entry has been added successfully! Thank you for sharing your memory.');
      // Optionally navigate back or to the landing page
      navigate('/');
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.error ||
        'Something went wrong while sealing your memory. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-stone-900 py-4 sm:py-10 px-3 sm:px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-[#fdfbf7] p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl border-2 sm:border-4 border-stone-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 paper-texture" />

        <div className="relative z-10 space-y-4 mb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500 text-center">
            DIGITAL SLAM BOOK
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-handwriting text-center mb-2 font-bold text-stone-900">
            Fill My Slam
          </h1>
          <p className="text-sm text-stone-600 text-center max-w-xl mx-auto">
            Think of this as a page I&apos;ll flip back to years from now. Take a quiet minute,
            remember us, and pour a little bit of that into this page.
          </p>

          {slug && <EntryCounter slug={slug} />}

          <div className="flex flex-col items-center gap-2 mt-2">
            <span className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
              SHARE THIS LINK
            </span>
            <div className="flex flex-col sm:flex-row items-center gap-2 text-xs bg-stone-100 border border-stone-300 rounded-full px-4 py-2">
              <span className="truncate max-w-[220px] sm:max-w-xs text-stone-700">
                {shareLink}
              </span>
              {navigator.clipboard && (
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(shareLink)}
                  className="text-[11px] font-semibold text-stone-800 bg-stone-200 hover:bg-stone-300 rounded-full px-3 py-1 transition"
                >
                  Copy
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="relative z-10 mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handlePreview} className="relative z-10 space-y-6 text-left">
          <MoodSelector selectedMood={mood} onSelect={setMood} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                Your Name
              </label>
              <input
                required
                type="text"
                maxLength={80}
                className="w-full border-b-2 border-stone-300 bg-transparent px-1 py-2 focus:border-stone-800 outline-none text-stone-900"
                placeholder="What everyone calls you"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
              Nickname / Alias
              </label>
              <input
                type="text"
                className="w-full border-b-2 border-dashed border-stone-200 bg-transparent px-1 py-2 focus:border-stone-700 outline-none text-stone-900"
                placeholder="Pet name, inside joke, or your alter ego"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nickname: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Personal & Emotional Section */}
          <div className="border-t-2 border-stone-300 pt-6">
            <h3 className="text-sm font-bold text-stone-700 mb-4 uppercase tracking-wider">
              Personal & Emotional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                First Memory of Us
                </label>
                <textarea
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 h-20 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="A bus ride, a late call, a random joke…"
                  value={formData.firstMemory}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, firstMemory: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  Best memory together
                </label>
                <textarea
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 h-20 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="That one time we’ll never forget"
                  value={formData.bestMemory}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bestMemory: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  One thing I secretly love about us
                </label>
                <textarea
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 h-20 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Say it. I won’t judge."
                  value={formData.favouriteThing}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      favouriteThing: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  What makes me laugh about you
                </label>
                <textarea
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 h-20 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Habits, jokes, chaos — all of it"
                  value={formData.whatMakesMeLaugh}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      whatMakesMeLaugh: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  Describe yourself in one word
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Soft? Chaotic? Dramatic?"
                  value={formData.oneWord}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, oneWord: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  A wish I have for you
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Something I genuinely want for you"
                  value={formData.wish}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, wish: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Favorites Section */}
          <div className="border-t-2 border-stone-300 pt-6">
            <h3 className="text-sm font-bold text-stone-700 mb-4 uppercase tracking-wider">
              Your Favorites
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                Someone You Look Up To
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Real, fictional, or low-key iconic"
                  value={formData.favoriteHero}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, favoriteHero: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  Favorite Song
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Song name"
                  value={formData.favoriteSong}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, favoriteSong: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  Favorite Singer/Artist
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Artist name"
                  value={formData.favoriteSinger}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, favoriteSinger: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  Favorite Movie
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Movie name"
                  value={formData.favoriteMovie}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, favoriteMovie: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  Favorite Food
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Pizza, Sushi, etc."
                  value={formData.favoriteFood}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, favoriteFood: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  Favorite Color
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Blue, Red, etc."
                  value={formData.favoriteColor}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, favoriteColor: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Dreams & Future Section */}
          <div className="border-t-2 border-stone-300 pt-6">
            <h3 className="text-sm font-bold text-stone-700 mb-4 uppercase tracking-wider">
              Dreams & Future
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  Dream Destination
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Paris, Tokyo, Bali…"
                  value={formData.dreamDestination}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dreamDestination: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
                  Future Prediction
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-stone-200 rounded-md px-2 py-2 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
                  placeholder="Where will you be in 10 years?"
                  value={formData.futurePrediction}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      futurePrediction: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-1 uppercase">
              A small letter to future us
            </label>
            <textarea
              required
              className="w-full border-2 border-stone-200 rounded-md px-2 py-2 h-28 bg-white/80 focus:ring-2 ring-stone-200 outline-none text-sm text-stone-900"
              placeholder="Write as if we&apos;re reading this years from now…"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-50/80 p-4 rounded-lg border border-stone-200 shadow-sm">
              <p className="font-semibold text-stone-600 mb-2 text-center text-sm tracking-[0.15em] uppercase">
                Draw something tiny
              </p>
              <p className="text-[11px] text-stone-500 text-center mb-3">
                Your name, a doodle, a random squiggle that only we&apos;ll get.
              </p>
              <SignaturePad onSave={handleDoodleSave} />
            </div>

            <div className="bg-stone-50/80 p-4 rounded-lg border border-stone-200 shadow-sm flex flex-col justify-center">
              <p className="font-semibold text-stone-600 mb-2 text-center text-sm tracking-[0.15em] uppercase">
                Leave a voice note
              </p>
              <p className="text-[11px] text-stone-500 text-center mb-3">
                Say what you can&apos;t type. Laugh, confess, ramble.
              </p>
              <VoiceRecorder onStop={handleAudioStop} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-3.5 rounded-full font-semibold tracking-[0.25em] text-xs md:text-sm hover:bg-stone-800 transition disabled:opacity-60 disabled:cursor-not-allowed mt-4"
          >
            PREVIEW YOUR ENTRY
          </button>
        </form>

        {showPreview && (
          <EntryPreview
            entry={{
              friendName: formData.name,
              nickname: formData.nickname,
              firstMemory: formData.firstMemory,
              favouriteThing: formData.favouriteThing,
              oneWord: formData.oneWord,
              wish: formData.wish,
              bestMemory: formData.bestMemory,
              whatMakesMeLaugh: formData.whatMakesMeLaugh,
              favoriteHero: formData.favoriteHero,
              favoriteSong: formData.favoriteSong,
              favoriteSinger: formData.favoriteSinger,
              favoriteMovie: formData.favoriteMovie,
              favoriteFood: formData.favoriteFood,
              favoriteColor: formData.favoriteColor,
              dreamDestination: formData.dreamDestination,
              futurePrediction: formData.futurePrediction,
              message: formData.message,
              doodleUrl: doodlePreviewUrl,
              audioUrl: audioPreviewUrl,
            }}
            onConfirm={handleConfirmSubmit}
            onBack={() => setShowPreview(false)}
          />
        )}
      </div>
    </div>
  );
};

export default FillSlam;