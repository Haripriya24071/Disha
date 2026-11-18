import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './en.json';

const LangContext = createContext();

export const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'kn', native: 'ಕನ್ನಡ' },
  { code: 'hi', native: 'हिन्दी' },
  { code: 'ta', native: 'தமிழ்' },
  { code: 'te', native: 'తెలుగు' },
  { code: 'ml', native: 'മലയാളം' },
  { code: 'bn', native: 'বাংলা' },
  { code: 'mr', native: 'मराठी' },
];

const FONT_MAP = {
  en: 'Noto Sans',
  kn: 'Noto Sans Kannada',
  hi: 'Noto Sans Devanagari',
  mr: 'Noto Sans Devanagari',
  ta: 'Noto Sans Tamil',
  te: 'Noto Sans Telugu',
  ml: 'Noto Sans Malayalam',
  bn: 'Noto Sans Bengali',
};

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('lang');
    if (saved && FONT_MAP[saved]) return saved;
    const browser = navigator.language?.split('-')[0];
    return FONT_MAP[browser] ? browser : 'en';
  });

  const [dict, setDict] = useState(en);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);

    const fontName = FONT_MAP[lang] || 'Noto Sans';
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;600;700&display=swap`;
    let link = document.getElementById('dynamic-lang-font');
    if (!link) {
      link = document.createElement('link');
      link.id = 'dynamic-lang-font';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = fontUrl;
    document.body.style.fontFamily = `'${fontName}', sans-serif`;

    if (lang === 'en') {
      setDict(en);
    } else {
      import(`./${lang}.json`)
        .then((mod) => setDict(mod.default || mod))
        .catch(() => setDict(en));
    }
  }, [lang]);

  const t = (key, vars = {}) => {
    let str = dict[key];
    if (!str) {
      console.warn(`Missing key [${lang}]: ${key}`);
      str = en[key] || key;
    }
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v ?? '');
    });
    return str;
  };

  return (
    <LangContext.Provider value={{ t, lang, setLang: setLangState }}>
      {children}
    </LangContext.Provider>
  );
}

export const useT = () => useContext(LangContext);
