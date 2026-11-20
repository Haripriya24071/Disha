import React from 'react';
import { Volume2, Square } from 'lucide-react';
import { useT } from '../i18n/useT';
import { useSpeech } from '../hooks/useSpeech';
import BigButton from './BigButton';

export default function ListenButton({ text, variant = 'secondary' }) {
  const { t } = useT();
  const { speak, speaking, voiceUnavailable } = useSpeech();

  return (
    <div className="space-y-2">
      <BigButton
        icon={speaking ? Square : Volume2}
        variant={variant}
        onClick={() => speak(text)}
      >
        {speaking ? t('ui.stop') : t('ui.listen')}
      </BigButton>
      {voiceUnavailable && (
        <p className="text-sm text-amber-900 bg-amber-100 border border-amber-400 rounded-lg p-3">
          {t('ui.voice_unavailable')}
        </p>
      )}
    </div>
  );
}
