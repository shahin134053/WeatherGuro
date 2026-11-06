/**
 * Comprehensive Universal Audio & Voice Alert Broadcast Service
 * Designed for 100% reliable operation on Android, iOS, Mobile WebViews, and Desktops.
 * 
 * Features:
 * 1. Dual Audio Engine:
 *    - Primary Engine: High-fidelity Natural Voice Audio Stream (Pure Bengali, English, Arabic, etc.)
 *    - Secondary Engine: Native Web Speech API fallback (works offline)
 * 2. Instant User-Gesture Playback: Audio starts synchronously within the touch event frame.
 * 3. Clean Auditory Delivery: Real voice speech starts immediately without annoying chime beeps.
 * 4. Global State Synchronization: All audio buttons across screens (Header, Dashboard, Alerts, Agri, etc.) stay in sync.
 * 5. Sentence Chunking: Smooth sequential playback of long meteorological bulletins.
 */

export type SpeechStatusListener = (isSpeaking: boolean, currentText?: string, activeId?: string | null) => void;

const listeners: Set<SpeechStatusListener> = new Set();
let currentlySpeaking = false;
let currentTextPlaying = '';
let currentActiveAudioId: string | null = null;

let sharedAudio: HTMLAudioElement | null = null;
let currentChunks: string[] = [];
let currentChunkIndex = 0;
let currentLangCode = 'bn';
let currentOnEndCallback: (() => void) | null = null;

let activeUtterances: SpeechSynthesisUtterance[] = [];
let pingInterval: number | null = null;

// Expose utterances on window to prevent Chrome garbage collector bug
if (typeof window !== 'undefined') {
  (window as any).__weatherUtterances = activeUtterances;
}

/**
 * Register a listener for speech status changes
 */
export function subscribeSpeechStatus(listener: SpeechStatusListener): () => void {
  listeners.add(listener);
  try {
    listener(currentlySpeaking, currentTextPlaying, currentActiveAudioId);
  } catch (e) {
    console.warn('Initial listener notify failed:', e);
  }
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Notify all subscribers of current speech status
 */
function notifyListeners(speaking: boolean, text: string = '', activeId: string | null = null): void {
  currentlySpeaking = speaking;
  currentTextPlaying = text;
  currentActiveAudioId = activeId;
  listeners.forEach((fn) => {
    try {
      fn(speaking, text, activeId);
    } catch (e) {
      console.warn('Listener notification error:', e);
    }
  });
}

/**
 * Check if audio is currently speaking
 */
export function isSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return currentlySpeaking || window.speechSynthesis.speaking;
  }
  return currentlySpeaking;
}

/**
 * Get the currently playing audio ID
 */
export function getActiveAudioId(): string | null {
  return currentActiveAudioId;
}

/**
 * Soft subtle audio click for tactile confirmation (muted, unobtrusive)
 */
export function playChimeTone(_type: 'start' | 'alert' | 'end' = 'start'): void {
  // Kept silent so voice speech is heard immediately without "tung tung" beeps
}

let sandboxFrame: HTMLIFrameElement | null = null;

function playAudioInNoRefererFrame(
  audioUrl: string,
  onEnded: () => void,
  onError: () => void
): void {
  if (typeof document === 'undefined') {
    onError();
    return;
  }

  try {
    if (!sandboxFrame) {
      sandboxFrame = document.createElement('iframe');
      sandboxFrame.id = 'tts-no-referer-frame';
      sandboxFrame.style.display = 'none';
      document.body.appendChild(sandboxFrame);
    }

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'TTS_FRAME_ENDED') {
        window.removeEventListener('message', handler);
        onEnded();
      } else if (event.data?.type === 'TTS_FRAME_ERROR') {
        window.removeEventListener('message', handler);
        onError();
      }
    };

    window.addEventListener('message', handler);

    const doc = sandboxFrame.contentDocument || sandboxFrame.contentWindow?.document;
    if (!doc) {
      onError();
      return;
    }

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta name="referrer" content="no-referrer" />
</head>
<body>
  <audio id="player" src="${audioUrl.replace(/"/g, '&quot;')}" autoplay referrerpolicy="no-referrer"></audio>
  <script>
    const p = document.getElementById('player');
    p.onended = () => window.parent.postMessage({ type: 'TTS_FRAME_ENDED' }, '*');
    p.onerror = () => window.parent.postMessage({ type: 'TTS_FRAME_ERROR' }, '*');
    p.play().catch(() => window.parent.postMessage({ type: 'TTS_FRAME_ERROR' }, '*'));
  </script>
</body>
</html>`);
    doc.close();
  } catch {
    onError();
  }
}

/**
 * Stop any ongoing audio playback and speech synthesis
 */
export function stopSpeech(): void {
  // 1. Clear sandbox frame audio
  if (sandboxFrame) {
    try {
      const doc = sandboxFrame.contentDocument || sandboxFrame.contentWindow?.document;
      if (doc) {
        const p = doc.getElementById('player') as HTMLAudioElement;
        if (p) {
          p.pause();
          p.src = '';
        }
      }
    } catch {}
  }

  // 2. Stop HTML5 audio playback
  if (sharedAudio) {
    try {
      sharedAudio.pause();
      sharedAudio.onended = null;
      sharedAudio.onerror = null;
      sharedAudio.src = '';
    } catch (e) {}
  }

  // 3. Clear intervals
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }

  // 4. Clear SpeechSynthesis
  activeUtterances = [];
  if (typeof window !== 'undefined') {
    (window as any).__weatherUtterances = [];
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  currentChunks = [];
  currentChunkIndex = 0;

  const callback = currentOnEndCallback;
  currentOnEndCallback = null;

  notifyListeners(false, '', null);

  if (callback) {
    try {
      callback();
    } catch (e) {}
  }
}

/**
 * Split text into natural, digestible chunks (under 120 chars) for smooth TTS streaming
 */
function splitTextIntoSentences(text: string, maxLength: number = 100): string[] {
  if (!text) return [];

  // Split on punctuation marks: Bengali dāri (।), periods, exclamation, questions, newlines
  const rawParts = text.split(/([।!?\n]+)/);
  const segments: string[] = [];
  let buffer = '';

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];
    if (!part) continue;
    if ((buffer + part).length <= maxLength) {
      buffer += part;
    } else {
      if (buffer.trim()) segments.push(buffer.trim());
      buffer = part;
    }
  }
  if (buffer.trim()) segments.push(buffer.trim());

  // Further split any remaining chunks that exceed maxLength
  const finalChunks: string[] = [];
  for (const seg of segments) {
    if (seg.length <= maxLength) {
      finalChunks.push(seg);
    } else {
      const words = seg.split(/([,; ]+)/);
      let subBuffer = '';
      for (const w of words) {
        if ((subBuffer + w).length <= maxLength) {
          subBuffer += w;
        } else {
          if (subBuffer.trim()) finalChunks.push(subBuffer.trim());
          subBuffer = w;
        }
      }
      if (subBuffer.trim()) finalChunks.push(subBuffer.trim());
    }
  }

  return finalChunks.length > 0 ? finalChunks : [text];
}

/**
 * Check if running inside installed native app (Capacitor Android/iOS)
 */
function isRunningInsideNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  if ((window as any).Capacitor?.isNativePlatform?.()) return true;
  if (window.location.protocol.startsWith('capacitor') || window.location.protocol.startsWith('file')) return true;
  if (window.location.hostname === 'localhost' && (!window.location.port || window.location.port === '80' || window.location.port === '443')) {
    return true;
  }
  return false;
}

function normalizeTtsLang(langCode: string): string {
  const cleanLang = (langCode || 'bn').toLowerCase().trim();
  return cleanLang.startsWith('bn')
    ? 'bn'
    : cleanLang.startsWith('ar')
    ? 'ar'
    : cleanLang.startsWith('es')
    ? 'es'
    : cleanLang.startsWith('de')
    ? 'de'
    : cleanLang.startsWith('fr')
    ? 'fr'
    : 'en';
}

function getDirectGoogleTtsUrl(chunk: string, langCode: string): string {
  const ttsLang = normalizeTtsLang(langCode);
  return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${ttsLang}&q=${encodeURIComponent(chunk)}`;
}

/**
 * Generate audio URL for natural high-quality speech
 */
function getTtsAudioUrl(chunk: string, langCode: string): string {
  const ttsLang = normalizeTtsLang(langCode);

  if (typeof window !== 'undefined') {
    const host = window.location.hostname || '';
    const isStaticHost = host.includes('github.io');
    if (!isRunningInsideNativeApp() && !isStaticHost) {
      return `/api/tts?tl=${ttsLang}&q=${encodeURIComponent(chunk)}`;
    }
    // For Native APK and GitHub Pages, stream via the dedicated production Node proxy
    return `https://bangla.pixelretouchpro.com/api/tts?tl=${ttsLang}&q=${encodeURIComponent(chunk)}`;
  }

  return getDirectGoogleTtsUrl(chunk, langCode);
}

let cachedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices() || [];
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  };
}

/**
 * Fallback to browser Web Speech API when audio streaming is offline or blocked
 */
function fallbackToWebSpeech(message: string, langCode: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    stopSpeech();
    if (onEnd) onEnd();
    return;
  }

  const synth = window.speechSynthesis;
  try {
    if (synth.paused) synth.resume();
  } catch (e) {}

  const cleanLang = (langCode || 'bn').toLowerCase().trim();
  const isBengali = cleanLang.startsWith('bn');
  const targetLang = isBengali
    ? 'bn-BD'
    : cleanLang.startsWith('ar')
    ? 'ar-SA'
    : cleanLang.startsWith('es')
    ? 'es-ES'
    : cleanLang.startsWith('de')
    ? 'de-DE'
    : cleanLang.startsWith('fr')
    ? 'fr-FR'
    : 'en-US';

  const rawVoices = synth.getVoices() || [];
  const voices = rawVoices.length > 0 ? rawVoices : cachedVoices;
  let selectedVoice: SpeechSynthesisVoice | null = null;

  if (voices.length > 0) {
    if (isBengali) {
      selectedVoice =
        voices.find((v) => {
          const l = (v.lang || '').toLowerCase();
          const n = (v.name || '').toLowerCase();
          return l.includes('bn') || n.includes('bangla') || n.includes('bengali') || n.includes('বাংলা');
        }) || null;
    } else {
      selectedVoice =
        voices.find((v) => (v.lang || '').toLowerCase().startsWith(cleanLang)) ||
        voices.find((v) => (v.lang || '').toLowerCase().startsWith('en')) ||
        null;
    }
  }

  const sentences = splitTextIntoSentences(message, 80);
  let index = 0;

  const speakNextUtterance = () => {
    if (index >= sentences.length) {
      stopSpeech();
      if (onEnd) onEnd();
      return;
    }

    const chunkText = sentences[index];
    index++;

    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.lang = targetLang;
    utterance.rate = isBengali ? 0.95 : 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      setTimeout(speakNextUtterance, 60);
    };

    utterance.onerror = () => {
      speakNextUtterance();
    };

    activeUtterances.push(utterance);
    if (typeof window !== 'undefined') {
      (window as any).__weatherUtterances.push(utterance);
    }

    try {
      synth.speak(utterance);
    } catch (err) {
      speakNextUtterance();
    }
  };

  speakNextUtterance();
}

/**
 * Speaks weather alert, forecast, or bulletin aloud.
 * 
 * @param message The text to speak
 * @param langCode Language code ('bn', 'en', etc.)
 * @param onEnd Callback when playback completes or is stopped
 * @param audioId Optional identifier for the calling button/screen
 */
export function speakWeatherAlert(
  message: string,
  langCode: string = 'bn',
  onEnd?: () => void,
  audioId: string | null = null
): void {
  // If the same audio is currently playing, treat call as toggle to STOP
  if (currentlySpeaking && audioId && currentActiveAudioId === audioId) {
    stopSpeech();
    return;
  }

  // Stop any active playback first
  currentOnEndCallback = null;
  stopSpeech();

  if (!message || !message.trim()) {
    if (onEnd) onEnd();
    return;
  }

  const cleanText = message.trim();
  currentLangCode = langCode;
  currentOnEndCallback = onEnd || null;
  currentActiveAudioId = audioId || 'default_audio';

  // Notify UI of active audio status immediately
  notifyListeners(true, cleanText, currentActiveAudioId);

  // Initialize or reuse HTML5 Audio element synchronously within touch/click handler
  if (typeof window !== 'undefined') {
    if (!sharedAudio) {
      sharedAudio = new Audio();
      sharedAudio.setAttribute('referrerpolicy', 'no-referrer');
    }

    currentChunks = splitTextIntoSentences(cleanText, 100);
    currentChunkIndex = 0;

    const playNextAudioChunk = () => {
      if (!currentlySpeaking) return;

      if (currentChunkIndex >= currentChunks.length) {
        // Complete playback smoothly
        stopSpeech();
        return;
      }

      const chunk = currentChunks[currentChunkIndex];
      const audioUrl = getTtsAudioUrl(chunk, currentLangCode);

      if (!sharedAudio) {
        sharedAudio = new Audio();
        sharedAudio.setAttribute('referrerpolicy', 'no-referrer');
      }

      sharedAudio.src = audioUrl;
      sharedAudio.playbackRate = currentLangCode.startsWith('bn') ? 1.0 : 1.02;

      sharedAudio.onended = () => {
        currentChunkIndex++;
        // Small 60ms pause between sentences for natural cadence
        setTimeout(() => {
          if (currentlySpeaking) {
            playNextAudioChunk();
          }
        }, 60);
      };

      const handleChunkError = () => {
        playAudioInNoRefererFrame(
          getDirectGoogleTtsUrl(chunk, currentLangCode),
          () => {
            currentChunkIndex++;
            setTimeout(() => {
              if (currentlySpeaking) {
                playNextAudioChunk();
              }
            }, 60);
          },
          () => {
            console.warn('Referer-suppressed audio failed, falling back to Web Speech:', cleanText);
            fallbackToWebSpeech(cleanText, currentLangCode, onEnd);
          }
        );
      };

      sharedAudio.onerror = handleChunkError;

      const playPromise = sharedAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Direct audio play rejected, switching to referer-suppressed frame:', err);
          handleChunkError();
        });
      }
    };

    // Start playing first chunk immediately inside caller's user interaction stack
    playNextAudioChunk();
  } else {
    if (onEnd) onEnd();
  }
}
