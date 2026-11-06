import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, VolumeX, Square, Play, RotateCcw } from 'lucide-react';
import { subscribeSpeechStatus, stopSpeech, speakWeatherAlert } from '../services/voiceAlertService';

export const AudioBroadcastPlayerBar: React.FC = () => {
  const { languageCode } = useApp();
  const isBn = languageCode === 'bn';

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    const unsub = subscribeSpeechStatus((speaking, text) => {
      setIsSpeaking(speaking);
      if (text) setCurrentText(text);
    });
    return unsub;
  }, []);

  if (!isSpeaking) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-md border border-teal-500/40 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3 animate-slideUp">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Animated Soundwave bars */}
        <div className="flex items-center gap-0.5 h-6 shrink-0">
          <span className="w-1 bg-teal-400 rounded-full animate-soundwave1 h-3" />
          <span className="w-1 bg-teal-400 rounded-full animate-soundwave2 h-5" />
          <span className="w-1 bg-teal-400 rounded-full animate-soundwave3 h-2" />
          <span className="w-1 bg-teal-400 rounded-full animate-soundwave2 h-6" />
          <span className="w-1 bg-teal-400 rounded-full animate-soundwave1 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {isBn ? '🔊 অডিও বার্তা চলছে' : '🔊 Audio Playing'}
            </span>
          </div>
          <p className="text-xs text-slate-200 truncate mt-0.5 font-medium">
            {currentText || (isBn ? 'আবহাওয়া তথ্য পাঠ করা হচ্ছে...' : 'Reading weather bulletin...')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Stop Button */}
        <button
          onClick={() => stopSpeech()}
          className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-all cursor-pointer"
          title={isBn ? 'থামান' : 'Stop'}
        >
          <VolumeX className="w-4 h-4" />
          <span className="text-[11px]">{isBn ? 'থামান' : 'Stop'}</span>
        </button>
      </div>
    </div>
  );
};
