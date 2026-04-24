import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './i18n';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'ar');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.style.direction  = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = (l) => setLangState(l);
  const t = (key) => translations[lang]?.[key] ?? translations['ar'][key] ?? key;
  // pick field by lang: f(ar_val, en_val)
  const f = (ar, en) => { const a = ar||''; const e = en||''; if (lang === 'en' && e.trim()) return e; return a || e; };

  return (
    <LangContext.Provider value={{ lang, setLang, t, f }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
