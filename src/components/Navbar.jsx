import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../utils/LangContext';

export default function Navbar() {
  const loc = useLocation();
  const { lang, setLang, t } = useLang();
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="شعار معهد عشتار" className="navbar-logo"/>
          <div>
            <div className="navbar-title">{t('nav_institute')}</div>
            <div className="navbar-sub">{t('nav_sub')}</div>
          </div>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div className="navbar-nav">
            <Link to="/" className={`nav-link ${loc.pathname==='/'?'active':''}`}>{t('nav_instructors')}</Link>
          </div>
          <button onClick={()=>setLang(lang==='ar'?'en':'ar')} style={{
            display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:8,
            background:'var(--primary-pale)',border:'1.5px solid var(--primary-pale2)',
            color:'var(--primary)',fontSize:13,fontWeight:800,cursor:'pointer',fontFamily:'var(--font)',
            transition:'all .2s',
          }}
            onMouseOver={e=>e.currentTarget.style.background='var(--primary-pale2)'}
            onMouseOut={e=>e.currentTarget.style.background='var(--primary-pale)'}
          >
            {/* <span style={{fontSize:16}}>{lang==='ar'?'🇬🇧':'🇮🇶'}</span> */}
            {lang==='ar'?'EN':'AR'}
          </button>
        </div>
      </div>
    </nav>
  );
}
