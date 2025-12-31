const MOODS = [
  { id: 'nostalgic', label: 'Nostalgic', emoji: '🌙', color: 'from-purple-100 to-pink-100', border: 'border-purple-300' },
  { id: 'funny', label: 'Funny', emoji: '😂', color: 'from-yellow-100 to-orange-100', border: 'border-yellow-300' },
  { id: 'heartfelt', label: 'Heartfelt', emoji: '💝', color: 'from-red-100 to-pink-100', border: 'border-red-300' },
  { id: 'adventurous', label: 'Adventurous', emoji: '🚀', color: 'from-blue-100 to-cyan-100', border: 'border-blue-300' },
  { id: 'classic', label: 'Classic', emoji: '📖', color: 'from-stone-100 to-stone-200', border: 'border-stone-300' },
];

const MoodSelector = ({ selectedMood, onSelect }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold tracking-[0.2em] text-stone-500 mb-2 uppercase">
        Choose the mood of your entry
      </label>
      <div className="grid grid-cols-5 gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            type="button"
            onClick={() => onSelect(mood.id)}
            className={`p-3 rounded-lg border-2 transition-all transform hover:scale-105 ${
              selectedMood === mood.id
                ? `${mood.border} bg-gradient-to-br ${mood.color} shadow-md scale-105`
                : 'border-stone-200 bg-stone-50 hover:border-stone-300'
            }`}
          >
            <div className="text-2xl mb-1">{mood.emoji}</div>
            <div className="text-[10px] text-stone-600 font-semibold">{mood.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { MOODS };
export default MoodSelector;

