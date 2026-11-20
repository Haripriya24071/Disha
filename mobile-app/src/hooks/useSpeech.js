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
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
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

  const speak = useCallback(
    (text) => {
      if (!text || !('speechSynthesis' in window)) {
        setVoiceUnavailable(true);
        return;
      }
      if (speaking) {
        stop();
        return;
      }

      const targetCode = BCP47_MAP[lang] || 'en-IN';
      const prefix = targetCode.split('-')[0];
      const available = voices.length ? voices : window.speechSynthesis.getVoices();
      const match =
        available.find((v) => v.lang.toLowerCase() === targetCode.toLowerCase()) ||
        available.find((v) => v.lang.toLowerCase().startsWith(prefix));

      if (!match && lang !== 'en') {
        setVoiceUnavailable(true);
        return;
      }

      setVoiceUnavailable(false);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetCode;
      if (match) utterance.voice = match;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [lang, voices, speaking, stop]
  );

  return { speak, stop, speaking, voiceUnavailable };
}
