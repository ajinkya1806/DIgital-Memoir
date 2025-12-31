import { useState, useRef, useEffect } from 'react';

const VoiceRecorder = ({ onStop }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (recording) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [recording]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunksRef.current = [];
        onStop(audioBlob);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setDuration(0);
    } catch (err) {
      console.error('Recording error:', err);
      setError('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setDuration(0);
      if (onStop) {
        onStop(null);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {error && (
        <p className="text-xs text-red-600 mb-2 text-center">{error}</p>
      )}

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
            recording
              ? 'bg-red-500 animate-pulse hover:bg-red-600'
              : 'bg-stone-800 hover:bg-stone-700'
          }`}
        >
          <span className="text-2xl">
            {recording ? '⏹' : audioUrl ? '🔄' : '🎤'}
          </span>
        </button>

        {recording && (
          <div className="text-xs text-stone-600 font-mono">
            {formatDuration(duration)}
          </div>
        )}
      </div>

      {audioUrl && (
        <div className="mt-4 w-full space-y-2">
          <audio controls src={audioUrl} className="w-full h-8" preload="metadata" />
          <button
            type="button"
            onClick={resetRecording}
            className="text-xs text-red-600 hover:text-red-700 hover:underline"
          >
            Record again
          </button>
        </div>
      )}

      {!recording && !audioUrl && (
        <p className="text-[10px] text-stone-400 mt-2 text-center">
          Click to record
        </p>
      )}
    </div>
  );
};

export default VoiceRecorder;