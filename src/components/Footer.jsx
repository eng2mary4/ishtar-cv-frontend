import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import api from '../utils/api';
import { useLang } from '../utils/LangContext';

export default function Footer() {
  const [visits, setVisits] = useState(0);
  const { lang, t } = useLang();
  useEffect(()=>{ api.get('/stats').then(r=>setVisits(r.data.total_visits)).catch(()=>{}); },[]);
  return (
    <footer className="footer">
      <div className="footer-logo-wrap">
        <img src="/logo.png" alt="معهد عشتار" className="footer-logo-img"/>
        <div>
          <div className="footer-title">{t('nav_institute')}</div>
          <div className="footer-sub">{t('nav_sub')}</div>
        </div>
      </div>
      <div className="footer-rule"/>
      <div className="footer-copy">{t('footer_copy')} © {new Date().getFullYear()}</div>
      <div className="footer-visits">
        <Eye size={13}/>
        {t('footer_visits')} {visits.toLocaleString(lang==='ar'?'ar-IQ':'en-US')}
      </div>
    </footer>
  );
}
