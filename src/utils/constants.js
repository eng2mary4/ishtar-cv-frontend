import React from 'react';

// Department icon emojis mapped to department names
export const deptIcons = {
  'تقنيات التمريض': '🩺',
  'تقنيات التجميل': '💄',
  'تقنيات الصيدلة': '💊',
  'تقنيات التخدير': '💉',
  'صناعة الأسنان': '🦷',
  'الأشعة والسونار': '📡',
  'تقنيات فحص البصر': '👁️',
  'تقنيات طب الطوارئ': '🚑',
};

export const getDeptIcon = (name) => deptIcons[name] || '🏥';

export const DEGREES = [
  {ar:'دكتوراه',                          en:'PhD'},
  {ar:'بورد',                             en:'Board'},
  {ar:'ماجستير',                          en:"Master's"},
  {ar:'دبلوم عالي معادل للماجستير',      en:"High Diploma (Master's Equivalent)"},
  {ar:'دبلوم عالي',                       en:'High Diploma'},
  {ar:'بكالوريوس',                        en:"Bachelor's"},
];
export const ACADEMIC_TITLES = [
  {ar:'مدرس مساعد',  en:'Assistant Instructor'},
  {ar:'مدرس',        en:'Instructor'},
  {ar:'أستاذ مساعد', en:'Assistant Professor'},
  {ar:'أستاذ',       en:'Professor'},
];

export const degreeEn      = (ar) => DEGREES.find(d => d.ar === ar)?.en || '';
export const titleEn       = (ar) => ACADEMIC_TITLES.find(d => d.ar === ar)?.en || '';

export const MOTHER_TONGUES = [
  {ar:'العربية',     en:'Arabic'},
  {ar:'الكردية',     en:'Kurdish'},
  {ar:'التركمانية',  en:'Turkmen'},
  {ar:'الإنكليزية',  en:'English'},
  {ar:'الفارسية',    en:'Persian'},
  {ar:'السريانية',   en:'Syriac'},
];
export const motherTongueEn = (ar) => MOTHER_TONGUES.find(m => m.ar === ar)?.en || '';

export const LINK_CONFIGS = [
  { key: 'google_scholar', label: 'Google Scholar', color: '#4285F4', bg: '#e8f0fe', icon: 'GS' },
  { key: 'scopus', label: 'Scopus', color: '#E9711C', bg: '#fef0e6', icon: 'SC' },
  { key: 'research_id', label: 'ResearchID', color: '#00B4D8', bg: '#e0f7fa', icon: 'RI' },
  { key: 'researchgate', label: 'ResearchGate', color: '#00D0AF', bg: '#e0faf6', icon: 'RG' },
  { key: 'web_of_science', label: 'Web of Science', color: '#CC0000', bg: '#ffe8e8', icon: 'WS' },
  { key: 'orcid', label: 'ORCID', color: '#A6CE39', bg: '#f4fce3', icon: 'OR' },
  { key: 'linkedin', label: 'LinkedIn', color: '#0077B5', bg: '#e8f4fc', icon: 'LI' },
];
