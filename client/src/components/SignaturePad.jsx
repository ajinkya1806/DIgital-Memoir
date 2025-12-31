import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = ({ onSave }) => {
  const sigCanvas = useRef(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  const clear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsSaved(false);
      setHasDrawing(false);
    }
  };

  const save = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      return;
    }

    // Convert canvas to blob for file upload
    sigCanvas.current.getCanvas().toBlob(
      (blob) => {
        if (blob) {
          onSave(blob);
          setIsSaved(true);
        }
      },
      'image/png',
      0.95
    );
  };

  const handleBegin = () => {
    setHasDrawing(true);
    setIsSaved(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="border-2 border-stone-300 rounded-lg bg-white w-full overflow-hidden shadow-sm">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="#1e293b"
          backgroundColor="#ffffff"
          canvasProps={{
            className: 'w-full h-40 touch-action-none',
            onMouseDown: handleBegin,
            onTouchStart: handleBegin,
          }}
        />
      </div>
      <div className="flex gap-3 mt-3 w-full justify-center">
        <button
          type="button"
          onClick={clear}
          disabled={!hasDrawing && !isSaved}
          className="text-red-600 text-xs hover:text-red-700 hover:underline transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!hasDrawing}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed ${
            isSaved
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-stone-800 hover:bg-stone-900'
          }`}
        >
          {isSaved ? '✓ Saved' : 'Save Doodle'}
        </button>
      </div>
      {!hasDrawing && !isSaved && (
        <p className="text-[10px] text-stone-400 mt-1 text-center">
          Draw something above
        </p>
      )}
    </div>
  );
};

export default SignaturePad;