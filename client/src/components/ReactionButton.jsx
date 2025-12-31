import { useState } from 'react';

const REACTIONS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😢', label: 'Touched' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '✨', label: 'Magic' },
];

const ReactionButton = ({ entryId }) => {
  const [selectedReactions, setSelectedReactions] = useState(() => {
    const stored = localStorage.getItem(`reactions_${entryId}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [showPicker, setShowPicker] = useState(false);

  const toggleReaction = (emoji) => {
    const newReactions = selectedReactions.includes(emoji)
      ? selectedReactions.filter((r) => r !== emoji)
      : [...selectedReactions, emoji];
    setSelectedReactions(newReactions);
    localStorage.setItem(`reactions_${entryId}`, JSON.stringify(newReactions));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-stone-100 hover:bg-stone-200 transition text-xs"
      >
        <span>💭</span>
        {selectedReactions.length > 0 && (
          <span className="text-xs">{selectedReactions.length}</span>
        )}
      </button>

      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-stone-200 p-2 z-50 flex gap-1">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.emoji}
                type="button"
                onClick={() => {
                  toggleReaction(reaction.emoji);
                  setShowPicker(false);
                }}
                className={`p-2 rounded hover:bg-stone-100 transition ${
                  selectedReactions.includes(reaction.emoji)
                    ? 'bg-stone-200 scale-110'
                    : ''
                }`}
                title={reaction.label}
              >
                <span className="text-lg">{reaction.emoji}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {selectedReactions.length > 0 && (
        <div className="absolute top-full left-0 mt-1 flex gap-1">
          {selectedReactions.map((emoji) => (
            <span key={emoji} className="text-sm">
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionButton;

