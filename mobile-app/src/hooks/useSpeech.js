import { useState, useEffect, useCallback } from 'react';
import { useT } from '../i18n/useT';

const BCP47_MAP = {
  en: 'en-IN',
  kn: 'kn-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
};

export function useSpeech() {
  const { lang } = useT();

  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voiceUnavailable, setVoiceUnavailable] = useState(false);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setVoiceUnavailable(true);
      return;
    }

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();

    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setVoiceUnavailable(false);
  }, [lang]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text) => {
    if (!text?.trim() || !('speechSynthesis' in window)) {
      setVoiceUnavailable(true);
      return;
    }

    if (speaking) {
      stop();
      return;
    }

    const targetCode = BCP47_MAP[lang];

    if (!targetCode) {
      setVoiceUnavailable(true);
      return;
    }

    // Refresh the available voices before selecting one.
    const available = window.speechSynthesis.getVoices();
    const currentVoices = available.length ? available : voices;

    const prefix = targetCode.split('-')[0].toLowerCase();

    const match =
      currentVoices.find(
        voice => voice.lang.toLowerCase() === targetCode.toLowerCase()
      ) ||
      currentVoices.find(
        voice => voice.lang.toLowerCase().startsWith(prefix)
      );

    // Never substitute an English voice for another Indian language.
    if (!match) {
      setVoiceUnavailable(true);
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetCode;
    utterance.voice = match;

    utterance.onstart = () => {
      setSpeaking(true);
      setVoiceUnavailable(false);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = (event) => {
      setSpeaking(false);
      setVoiceUnavailable(true);
      console.warn('Speech synthesis error:', event.error, targetCode);
    };

    setVoiceUnavailable(false);
    window.speechSynthesis.speak(utterance);

  }, [lang, speaking, stop, voices]);

  return { speak, stop, speaking, voiceUnavailable };
}
