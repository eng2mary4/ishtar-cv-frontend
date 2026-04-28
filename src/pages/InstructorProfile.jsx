import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Eye, BookOpen, Award, Briefcase,
  GraduationCap, Globe, ChevronDown, ChevronUp,
  User, Microscope, ExternalLink, Mail, Calendar, Flag,
  FileText, Download
} from 'lucide-react';
import api, { fixPhoto } from '../utils/api';
import { getDeptIcon, LINK_CONFIGS, degreeEn, titleEn, motherTongueEn } from '../utils/constants';
import { useLang } from '../utils/LangContext';

const TAB_IDS = [
  {id:'personal',     icon:<User size={14}/>},
  {id:'academic',     icon:<GraduationCap size={14}/>},
  {id:'skills',       icon:<Award size={14}/>},
  {id:'positions',    icon:<Briefcase size={14}/>},
  {id:'teaching',     icon:<BookOpen size={14}/>},
  {id:'awards',       icon:<Award size={14}/>},
  {id:'associations', icon:<Globe size={14}/>},
  {id:'publications', icon:<Microscope size={14}/>},
  {id:'links',        icon:<ExternalLink size={14}/>},
  {id:'cv',           icon:<FileText size={14}/>},
];

export default function InstructorProfile() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { lang, t, f } = useLang();
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [openYears, setOpenYears] = useState({});

  useEffect(()=>{
    api.get(`/instructors/${id}`)
      .then(r=>{ setData(r.data); setLoading(false); })
      .catch(()=>setLoading(false));
    window.scrollTo(0,0);
  },[id]);

  if (loading) return <div className="loading-wrap" style={{minHeight:'60vh'}}><div className="spinner"/><span className="load-text">{t('loading')}</span></div>;
  if (!data)   return <div className="empty-state" style={{minHeight:'60vh'}}><div className="empty-ico">👤</div><h3>{t('no_data')}</h3></div>;

  const pubsByYear=(data.publications||[]).reduce((acc,pub)=>{
    const y=pub.year||'غير محدد'; if(!acc[y]) acc[y]=[]; acc[y].push(pub); return acc;
  },{});
  const sortedYears=Object.keys(pubsByYear).sort((a,b)=>b-a);

  const displayName = f(data.full_name, data.full_name_en);

  return (
    <div style={{background:'var(--bg)',minHeight:'100vh'}}>
      <div style={{background:'#fff',borderBottom:'1px solid var(--border)'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'20px 28px 0'}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <button onClick={()=>navigate(-1)} style={{
              display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:8,
              background:'var(--primary-pale)',border:'1.5px solid var(--primary-pale2)',
              color:'var(--primary)',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'var(--font)',
            }}>
              <ArrowRight size={14}/> {t('back')}
            </button>
            <span style={{fontSize:13,color:'var(--text-muted)'}}>
              {t('instructors')} / <span style={{color:'var(--primary)',fontWeight:700}}>{displayName}</span>
            </span>
          </div>
        </div>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 28px 28px'}}>
          <div style={{display:'flex',gap:28,alignItems:'flex-start',flexWrap:'wrap'}}>
            {/* Photo */}
            <div style={{flexShrink:0}}>
              <div style={{width:130,height:130,borderRadius:16,overflow:'hidden',background:'var(--bg2)',border:'3px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:52,boxShadow:'0 4px 20px rgba(32,49,98,0.10)'}}>
                {fixPhoto(data.photo)?<img src={fixPhoto(data.photo)} alt={displayName} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:'👤'}
              </div>
              <div style={{marginTop:10,textAlign:'center',fontSize:12,color:'var(--text-muted)',display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
                <Eye size={12} style={{color:'var(--gold)'}}/>
                <span style={{fontWeight:700,color:'var(--gold)'}}>{data.visit_count?.toLocaleString(lang==='ar'?'ar-IQ':'en-US')}</span> {t('visits')}
              </div>
            </div>

            {/* Info */}
            <div style={{flex:1,minWidth:260}}>
              <div style={{fontSize:'clamp(22px,2.8vw,34px)',fontWeight:900,color:'var(--primary)',marginBottom:12,lineHeight:1.25}}>
                {displayName}
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
                {data.degree&&<span style={{padding:'5px 14px',borderRadius:100,fontSize:12,fontWeight:700,background:'var(--gold-pale2)',color:'#8a5a00',border:'1px solid rgba(199,134,23,0.25)'}}>{f(data.degree,degreeEn(data.degree))}</span>}
                {data.academic_title&&<span style={{padding:'5px 14px',borderRadius:100,fontSize:12,fontWeight:700,background:'var(--primary-pale)',color:'var(--primary)',border:'1px solid var(--primary-pale2)'}}>{f(data.academic_title,titleEn(data.academic_title))}</span>}
                {data.department_name&&<span style={{padding:'5px 14px',borderRadius:100,fontSize:12,fontWeight:600,background:'var(--bg2)',color:'var(--text2)',border:'1px solid var(--border)'}}>{getDeptIcon(data.department_name)} {f(data.department_name,data.department_name_en)}</span>}
                {data.formation&&<span style={{padding:'5px 14px',borderRadius:100,fontSize:12,fontWeight:600,background:'var(--bg2)',color:'var(--text2)',border:'1px solid var(--border)'}}>{f(data.formation,data.formation_en)}</span>}
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:20}}>
                {data.general_specialization&&<QI icon={<Microscope size={13}/>} label={f(data.general_specialization,data.general_specialization_en)}/>}
                {data.official_email&&<QI icon={<Mail size={13}/>} label={data.official_email}/>}
                {data.nationality&&<QI icon={<Flag size={13}/>} label={f(data.nationality,data.nationality_en)}/>}
                {data.birth_year&&<QI icon={<Calendar size={13}/>} label={`${data.birth_year}`}/>}
              </div>
            </div>

            {/* Academic links */}
            {LINK_CONFIGS.some(c=>data[c.key])&&(
              <div style={{background:'var(--primary)',borderRadius:'var(--radius)',padding:'20px 18px',width:'fit-content',flexShrink:0}}>
                <div style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.5)',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:14}}>{t('academic_networks')}</div>
                {(()=>{
                  const links=LINK_CONFIGS.filter(c=>data[c.key]);
                  const Btn=({cfg})=>(
                    <a href={data[cfg.key]} target="_blank" rel="noopener noreferrer"
                      style={{display:'flex',alignItems:'center',gap:7,padding:'8px 10px',borderRadius:8,background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.85)',fontSize:11,fontWeight:700,transition:'background .2s',textDecoration:'none'}}
                      onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                      onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                    >
                      <span style={{width:22,height:22,borderRadius:5,background:cfg.bg,color:cfg.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,flexShrink:0}}>{cfg.icon}</span>
                      {cfg.label.split(' ')[0]}
                    </a>
                  );
                  return(
                    <>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,maxHeight:'92px',overflowY:'auto',scrollbarWidth:'none',paddingRight:2}} className="hide-scrollbar">
                        {links.map(cfg=><Btn key={cfg.key} cfg={cfg}/>)}
                      </div>
                      {links.length>4&&<div style={{fontSize:10,color:'rgba(255,255,255,0.25)',textAlign:'center',marginTop:7}}>{t('scroll_more')}</div>}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 28px'}}>
          <TabsBar activeTab={activeTab} setActiveTab={setActiveTab} t={t}/>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{maxWidth:1280,margin:'0 auto',padding:'32px 28px'}}>

        {activeTab==='personal'&&(
          <div className="info-card">
            <div className="info-card-title"><User size={16}/> {t('sec_personal')}</div>
            <div className="info-grid">
              {[
                [t('field_name'),       f(data.full_name,data.full_name_en)],
                [t('field_gender'),     data.gender==='male'?t('field_gender_m'):t('field_gender_f')],
                [t('field_birth'),      data.birth_year],
                [t('field_nationality'),f(data.nationality,data.nationality_en)],
                [t('field_degree'),     f(data.degree,degreeEn(data.degree))],
                [t('field_ac_title'),   f(data.academic_title,titleEn(data.academic_title))],
                [t('field_formation'),  f(data.formation,data.formation_en)],
                [t('field_dept'),       f(data.department_name,data.department_name_en)],
                [t('field_general_spec'),f(data.general_specialization,data.general_specialization_en)],
                [t('field_precise_spec'),f(data.precise_specialization,data.precise_specialization_en)],
                [t('field_mother_tongue'),f(data.mother_tongue,motherTongueEn(data.mother_tongue))],
                [t('field_other_lang'), f(data.other_languages,data.other_languages_en)],
                [t('field_official_email'),data.official_email],
                [t('field_personal_email'),data.personal_email],
              ].filter(([,v])=>v).map(([l,v])=>(
                <div key={l} className="info-field">
                  <div className="info-lbl">{l}</div>
                  <div className="info-val">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==='academic'&&(
          <div className="info-card">
            <div className="info-card-title"><GraduationCap size={16}/> {t('sec_academic')}</div>
            {data.academic_history?.length?(
              <div className="timeline">
                {data.academic_history.map((h,i)=>(
                  <div key={i} className="tl-item">
                    <div className="tl-dot"/>
                    <div className="tl-title">{f(h.degree,h.degree_en)}</div>
                    <div className="tl-sub">{f(h.institution,h.institution_en)}</div>
                    <div className="tl-date">{h.year}{(h.country||h.country_en)&&` | ${f(h.country,h.country_en)}`}</div>
                  </div>
                ))}
              </div>
            ):<EmptySec t={t}/>}
          </div>
        )}

        {activeTab==='skills'&&(
          <div className="info-card">
            <div className="info-card-title"><Award size={16}/> {t('sec_skills')}</div>
            {data.skills?.length?(
              <div className="skills-cloud">
                {data.skills.map((s,i)=>(
                  <div key={i} className="skill-chip">
                    {f(s.skill_name,s.skill_name_en)}
                    {(s.category||s.category_en)&&<span className="skill-cat-lbl">• {f(s.category,s.category_en)}</span>}
                  </div>
                ))}
              </div>
            ):<EmptySec t={t}/>}
          </div>
        )}

        {activeTab==='positions'&&(
          <div className="info-card">
            <div className="info-card-title"><Briefcase size={16}/> {t('sec_positions')}</div>
            {data.positions?.length?(
              <div className="timeline">
                {data.positions.map((p,i)=>(
                  <div key={i} className="tl-item">
                    <div className="tl-dot" style={p.is_current?{background:'linear-gradient(135deg,#22c55e,#16a34a)'}:{}}/>
                    <div className="tl-title">{f(p.title,p.title_en)}</div>
                    <div className="tl-sub">{f(p.institution,p.institution_en)}</div>
                    <div className="tl-date">{p.start_year} — {p.is_current?<span className="badge badge-green">{t('until_now')}</span>:p.end_year}</div>
                  </div>
                ))}
              </div>
            ):<EmptySec t={t}/>}
          </div>
        )}

        {activeTab==='teaching'&&(
          <div className="info-card">
            <div className="info-card-title"><BookOpen size={16}/> {t('sec_teaching')}</div>
            {data.teaching?.length?data.teaching.map((te,i)=>(
              <div key={i} className="teach-row">
                <div>
                  <div className="teach-subj">{f(te.subject,te.subject_en)}</div>
                  <div className="teach-inst">{f(te.institution,te.institution_en)}</div>
                </div>
                <div style={{display:'flex',gap:7,alignItems:'center'}}>
                  {(te.level||te.level_en)&&<span className="badge badge-blue">{f(te.level,te.level_en)}</span>}
                  {te.year&&<span style={{color:'var(--gold)',fontSize:12,fontWeight:700}}>{te.year}</span>}
                </div>
              </div>
            )):<EmptySec t={t}/>}
          </div>
        )}

        {activeTab==='awards'&&(
          <div className="info-card">
            <div className="info-card-title"><Award size={16}/> {t('sec_awards')}</div>
            {data.awards?.length?data.awards.map((a,i)=>(
              <div key={i} className="award-row">
                <div className="award-ico">🏆</div>
                <div>
                  <div className="award-title">{f(a.title,a.title_en)}</div>
                  <div className="award-meta">{f(a.issuer,a.issuer_en)}{a.year&&` | ${a.year}`}</div>
                </div>
              </div>
            )):<EmptySec t={t}/>}
          </div>
        )}

        {activeTab==='associations'&&(
          <div className="info-card">
            <div className="info-card-title"><Globe size={16}/> {t('sec_assoc')}</div>
            {data.associations?.length?data.associations.map((a,i)=>(
              <div key={i} className="assoc-row">
                <div>
                  <div style={{fontWeight:600}}>{f(a.name,a.name_en)}</div>
                  {(a.role||a.role_en)&&<div style={{fontSize:12,color:'var(--text-muted)'}}>{f(a.role,a.role_en)}</div>}
                </div>
                {a.year&&<span style={{color:'var(--gold)',fontSize:12,fontWeight:700}}>{a.year}</span>}
              </div>
            )):<EmptySec t={t}/>}
          </div>
        )}

        {activeTab==='publications'&&(
          <div className="info-card">
            <div className="info-card-title">
              <Microscope size={16}/> {t('sec_pubs')}
              <span style={{marginInlineStart:'auto',fontSize:11,background:'var(--primary)',color:'#fff',padding:'2px 12px',borderRadius:100,fontWeight:700}}>
                {data.publications?.length||0} {t('pub_count')}
              </span>
            </div>
            {sortedYears.length?sortedYears.map(year=>(
              <div key={year} className="pub-yr-block">
                <div className={`pub-yr-toggle ${openYears[year]?'open':''}`} onClick={()=>setOpenYears(p=>({...p,[year]:!p[year]}))}>
                  <span className="pub-yr-num">{year}</span>
                  <span className="pub-yr-badge">{pubsByYear[year].length} {t('pub_count')}</span>
                  <span style={{marginInlineStart:'auto',color:'var(--text-muted)'}}>{openYears[year]?<ChevronUp size={14}/>:<ChevronDown size={14}/>}</span>
                </div>
                {openYears[year]&&(
                  <div className="pub-list">
                    {pubsByYear[year].map((pub,i)=>(
                      <div key={i} className="pub-item">
                        <div className="pub-title">
                          {pub.url
                            ?<a href={pub.url} target="_blank" rel="noopener noreferrer">{f(pub.title_ar,pub.title)||pub.title}</a>
                            :f(pub.title_ar,pub.title)||pub.title}
                        </div>
                        {pub.authors&&<div className="pub-authors">{t('authors')} {pub.authors}</div>}
                        {pub.journal&&<div className="pub-journal">{pub.journal}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )):<EmptySec t={t}/>}
          </div>
        )}

        {activeTab==='links'&&(
          <div className="info-card">
            <div className="info-card-title"><ExternalLink size={16}/> {t('sec_links')}</div>
            <div className="links-list">
              {LINK_CONFIGS.map(cfg=>{
                const url=data[cfg.key]; if(!url) return null;
                return(
                  <a key={cfg.key} href={url} target="_blank" rel="noopener noreferrer" className="link-row">
                    <div className="link-icon-box" style={{background:cfg.bg,color:cfg.color}}>{cfg.icon}</div>
                    <div style={{flex:1,overflow:'hidden'}}>
                      <div className="link-lbl" style={{color:cfg.color}}>{cfg.label}</div>
                      <div className="link-url">{url}</div>
                    </div>
                    <ExternalLink size={12} style={{color:'var(--text-muted)',flexShrink:0}}/>
                  </a>
                );
              })}
              {data.custom_links?.length>0&&(
                <>
                  <div style={{margin:'18px 0 12px',fontWeight:700,fontSize:13,color:'var(--text-muted)',letterSpacing:'1px',textTransform:'uppercase'}}>{t('sec_custom_links')}</div>
                  {data.custom_links.map((l,i)=>(
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="link-row">
                      <div className="link-icon-box" style={{background:'var(--primary-pale)',color:'var(--primary)',fontSize:18}}>{l.icon||'🔗'}</div>
                      <div style={{flex:1,overflow:'hidden'}}>
                        <div className="link-lbl" style={{color:'var(--primary)'}}>{l.label}</div>
                        <div className="link-url">{l.url}</div>
                      </div>
                      <ExternalLink size={12} style={{color:'var(--text-muted)',flexShrink:0}}/>
                    </a>
                  ))}
                </>
              )}
              {!LINK_CONFIGS.some(cfg=>data[cfg.key])&&!data.custom_links?.length&&<EmptySec t={t}/>}
            </div>
          </div>
        )}

        {activeTab==='cv'&&(
          <div className="info-card">
            <div className="info-card-title">
              <FileText size={16}/> {t('sec_cv')}
            </div>
            {data.cv_file ? (
              <div style={{textAlign:'center',padding:'30px 20px'}}>
                <div style={{fontSize:64,marginBottom:12}}>📄</div>
                <div style={{fontSize:16,fontWeight:600,color:'var(--text)',marginBottom:20}}>{displayName}</div>
                <a href={fixPhoto(data.cv_file)} target="_blank" rel="noopener noreferrer"
                  style={{
                    display:'inline-flex',
                    alignItems:'center',
                    gap:8,
                    padding:'12px 28px',
                    background:'var(--primary)',
                    color:'#fff',
                    borderRadius:8,
                    fontSize:14,
                    fontWeight:700,
                    textDecoration:'none',
                    transition:'all .2s'
                  }}
                  onMouseOver={e=>e.currentTarget.style.opacity='0.9'}
                  onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                  <FileText size={16}/> {t('cv_open')}
                </a>
              </div>
            ) : (
              <div style={{textAlign:'center',padding:'60px 40px'}}>
                <div style={{fontSize:48,marginBottom:14}}>📄</div>
                <div style={{fontSize:15,color:'var(--text-muted)',fontWeight:600}}>{t('cv_no_file')}</div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{marginTop:28,padding:'14px 0',borderTop:'1px solid var(--border2)',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,fontSize:12,color:'var(--text-muted)'}}>
          <span>{t('last_updated')} {new Date(data.last_updated).toLocaleString(lang==='ar'?'ar-IQ':'en-US')}</span>
          <span style={{display:'flex',alignItems:'center',gap:5}}>
            <Eye size={12} style={{color:'var(--gold)'}}/>
            <strong style={{color:'var(--gold)'}}>{data.visit_count?.toLocaleString(lang==='ar'?'ar-IQ':'en-US')}</strong> {t('profile_visits')}
          </span>
        </div>
      </div>
    </div>
  );
}

function QI({icon,label}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:5,fontSize:13,color:'var(--text-muted)'}}>
      <span style={{color:'var(--primary)',flexShrink:0}}>{icon}</span>{label}
    </div>
  );
}

function EmptySec({t}){
  return <div style={{textAlign:'center',padding:'40px',color:'var(--text-muted)',fontSize:14}}>{t('no_data')}</div>;
}

function TabsBar({activeTab,setActiveTab,t}){
  const containerRef=React.useRef(null);
  const activeRef=React.useRef(null);
  const tabLabels={personal:t('tab_personal'),academic:t('tab_academic'),skills:t('tab_skills'),positions:t('tab_positions'),teaching:t('tab_teaching'),awards:t('tab_awards'),associations:t('tab_assoc'),publications:t('tab_pubs'),links:t('tab_links'),cv:t('tab_cv')};

  React.useEffect(()=>{
    const c=containerRef.current,a=activeRef.current;
    if(!c||!a) return;
    const cr=c.getBoundingClientRect(),ar=a.getBoundingClientRect();
    c.scrollBy({left:(ar.left+ar.width/2)-(cr.left+cr.width/2),behavior:'smooth'});
  },[activeTab]);

  React.useEffect(()=>{
    const c=containerRef.current; if(!c) return;
    setTimeout(()=>{c.scrollBy({left:80,behavior:'smooth'});setTimeout(()=>c.scrollBy({left:-80,behavior:'smooth'}),500);},800);
  },[]);

  return(
    <div ref={containerRef} style={{display:'flex',gap:0,overflowX:'auto',borderTop:'1px solid var(--border)',scrollbarWidth:'none',msOverflowStyle:'none'}} className="hide-scrollbar">
      {TAB_IDS.map(tab=>(
        <button key={tab.id} ref={activeTab===tab.id?activeRef:null} onClick={()=>setActiveTab(tab.id)}
          style={{padding:'13px 18px',fontSize:13,fontWeight:700,color:activeTab===tab.id?'var(--primary)':'var(--text-muted)',background:'transparent',border:'none',borderBottom:activeTab===tab.id?'2px solid var(--gold)':'2px solid transparent',cursor:'pointer',whiteSpace:'nowrap',fontFamily:'var(--font)',display:'flex',alignItems:'center',gap:6,transition:'all .2s',marginBottom:-1}}>
          <span style={{color:activeTab===tab.id?'var(--gold)':'var(--text-muted)'}}>{tab.icon}</span>
          {tabLabels[tab.id]}
        </button>
      ))}
    </div>
  );
}
