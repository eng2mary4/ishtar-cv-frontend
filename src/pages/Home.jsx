import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Award, Building2 } from 'lucide-react';
import api, { fixPhoto } from '../utils/api';
import { getDeptIcon, DEGREES, ACADEMIC_TITLES, degreeEn, titleEn } from '../utils/constants';
import { useLang } from '../utils/LangContext';

export default function Home() {
  const navigate = useNavigate();
  const { lang, t, f } = useLang();
  const [instructors, setInstructors] = useState([]);
  const [mostVisited, setMostVisited]  = useState([]);
  const [departments, setDepartments]  = useState([]);
  const [stats, setStats]              = useState({});
  const [loading, setLoading]          = useState(false);
  const [searched, setSearched]        = useState(false);
  const [search, setSearch]            = useState('');
  const [degree, setDegree]            = useState('');
  const [academicTitle, setAcademicTitle] = useState('');
  const [deptId, setDeptId]            = useState('');
  const [activeDept, setActiveDept]    = useState(null);

  useEffect(()=>{
    api.post('/stats/visit',{page:'/'}).catch(()=>{});
    api.get('/departments').then(r=>setDepartments(r.data)).catch(()=>{});
    api.get('/instructors/most-visited').then(r=>setMostVisited(r.data)).catch(()=>{});
    api.get('/stats').then(r=>setStats(r.data)).catch(()=>{});
  },[]);

  const doSearch = useCallback(async (s,d,at,did)=>{
    setLoading(true); setSearched(true);
    try {
      const params={};
      if(s)   params.search=s;
      if(d)   params.degree=d;
      if(at)  params.academic_title=at;
      if(did) params.department_id=did;
      const r=await api.get('/instructors',{params});
      setInstructors(r.data);
    } catch { setInstructors([]); }
    setLoading(false);
  },[]);

  const handleDeptClick=(dept)=>{
    const newId=activeDept===dept.id?'':dept.id;
    setActiveDept(newId||null); setDeptId(String(newId));
    doSearch(search,degree,academicTitle,String(newId));
  };
  const handleSearchBtn=()=>doSearch(search,degree,academicTitle,deptId);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-pill au"><div className="hero-pill-dot"/>{t('hero_pill')}</div>
          <h1 className="au1">
            {t('hero_title3_normal')}<br/>
            <em>{t('hero_title3_em')}</em>
          </h1>
          <p className="hero-desc au2">{t('hero_desc')}</p>

          <div style={{width:'100%'}}>
          <div className="search-box au3">
            <div className="search-row">
              <div className="search-wrap">
                <Search size={16} className="search-ico"/>
                <input className="search-inp" placeholder={t('search_placeholder')} value={search}
                  onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearchBtn()}/>
              </div>
              <button className="btn-search" onClick={handleSearchBtn}><Search size={14}/> {t('search_btn')}</button>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:4}}>
              <FilterSelect label={t('filter_degree')}  value={degree}        onChange={v=>{setDegree(v);doSearch(search,v,academicTitle,deptId);}} options={DEGREES.map(d=>({value:d.ar,label:f(d.ar,d.en)}))}/>
              <FilterSelect label={t('filter_title')}   value={academicTitle} onChange={v=>{setAcademicTitle(v);doSearch(search,degree,v,deptId);}} options={ACADEMIC_TITLES.map(d=>({value:d.ar,label:f(d.ar,d.en)}))}/>
              <FilterSelect label={t('filter_dept')}    value={deptId}        onChange={v=>{setDeptId(v);setActiveDept(v?Number(v):null);doSearch(search,degree,academicTitle,v);}} options={departments.map(d=>({value:String(d.id),label:f(d.name_ar,d.name_en)}))}/>
            </div>

            {(degree||academicTitle||deptId)&&(
              <div style={{display:'flex',alignItems:'center',gap:8,marginTop:10,flexWrap:'wrap'}}>
                <span style={{fontSize:11,color:'var(--text-muted)',fontWeight:600}}>{t('active_filters')}</span>
                {degree&&<Chip label={f(DEGREES.find(d=>d.ar===degree)?.ar,DEGREES.find(d=>d.ar===degree)?.en)||degree} onRemove={()=>{setDegree('');doSearch(search,'',academicTitle,deptId);}}/>}
                {academicTitle&&<Chip label={f(ACADEMIC_TITLES.find(d=>d.ar===academicTitle)?.ar,ACADEMIC_TITLES.find(d=>d.ar===academicTitle)?.en)||academicTitle} onRemove={()=>{setAcademicTitle('');doSearch(search,degree,'',deptId);}}/>}
                {deptId&&<Chip label={f(departments.find(d=>String(d.id)===deptId)?.name_ar,departments.find(d=>String(d.id)===deptId)?.name_en)} onRemove={()=>{setDeptId('');setActiveDept(null);doSearch(search,degree,academicTitle,'');}}/>}
                <button onClick={()=>{setDegree('');setAcademicTitle('');setDeptId('');setActiveDept(null);doSearch(search,'','','');}} style={{fontSize:11,color:'var(--text-muted)',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font)',textDecoration:'underline'}}>{t('clear_all')}</button>
              </div>
            )}
          </div>
          </div>
        </div>

        <div className="stats-strip au4">
          <div className="stats-strip-inner">
            {[
              {num:stats.total_instructors||0,    lbl:t('stat_instructors')},
              {num:departments.length,             lbl:t('stat_depts')},
              {num:stats.total_publications||0,    lbl:t('stat_pubs')},
              {num:(stats.total_visits||0).toLocaleString(lang==='ar'?'ar-IQ':'en-US'), lbl:t('stat_visits')},
            ].map((s,i)=>(
              <div key={i} className="stat-item"><div className="stat-num">{s.num}</div><div className="stat-lbl">{s.lbl}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section" style={{paddingBottom:20}}>
        <div className="container">
          <div className="sec-header">
            <div className="sec-eyebrow">{t('dept_eyebrow')}</div>
            <h2 className="sec-title">{t('dept_title')}</h2>
            <div className="sec-rule"/>
          </div>
          <div className="dept-grid">
            {departments.map((dept,i)=>(
              <div key={dept.id} className={`dept-card au ${activeDept===dept.id?'active':''}`}
                style={{animationDelay:`${i*.05}s`,opacity:0}} onClick={()=>handleDeptClick(dept)}>
                <div className="dept-icon-box"><span>{getDeptIcon(dept.name_ar)}</span></div>
                <div className="dept-name">{f(dept.name_ar, dept.name_en)}</div>
                <div className="dept-count">{dept.instructor_count||0} {t('dept_count')}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      {searched&&(
        <section className="section" style={{paddingTop:16}}>
          <div className="container">
            <div className="results-card">
              <div className="results-bar">
                <span className="results-bar-title">{t('results_title')}</span>
                <span className="results-bar-count">{t('results_count')} <strong>{instructors.length}</strong> {t('results_count2')}</span>
              </div>
              {loading
                ?<div className="loading-wrap"><div className="spinner"/><span className="load-text">{t('loading')}</span></div>
                :instructors.length===0
                  ?<div className="empty-state"><div className="empty-ico">🔍</div><h3>{t('no_results')}</h3></div>
                  :<div style={{overflowX:'auto'}}>
                    <table>
                      <colgroup>
                        <col style={{width:52}}/>
                        <col style={{width:'32%'}}/>
                        <col style={{width:145}}/>
                        <col style={{width:160}}/>
                        <col style={{width:'28%'}}/>
                        <col style={{width:88}}/>
                      </colgroup>
                      <thead><tr>
                        <th>{t('col_num')}</th><th>{t('col_name')}</th><th>{t('col_degree')}</th>
                        <th>{t('col_title')}</th><th>{t('col_dept')}</th><th>{t('col_visits')}</th>
                      </tr></thead>
                      <tbody>
                        {instructors.map((ins,i)=>(
                          <tr key={ins.id} onClick={()=>navigate(`/instructor/${ins.id}`)}>
                            <td style={{color:'var(--text-muted)',fontWeight:600}}>{i+1}</td>
                            <td>
                              <div className="t-av">
                                <div className="t-av-img">
                                  {fixPhoto(ins.photo)?<img src={fixPhoto(ins.photo)} alt=""/>:(f(ins.full_name,ins.full_name_en)||'?')[0]}
                                </div>
                                <span className="t-av-name">{f(ins.full_name,ins.full_name_en)}</span>
                              </div>
                            </td>
                            <td><span className="badge badge-blue">{f(ins.degree,degreeEn(ins.degree))}</span></td>
                            <td><span className="badge badge-gold">{f(ins.academic_title,titleEn(ins.academic_title))}</span></td>
                            <td style={{color:'var(--text-muted)',fontSize:13}}>{getDeptIcon(ins.department_name)} {f(ins.department_name,ins.department_name_en)||'—'}</td>
                            <td><span style={{display:'flex',alignItems:'center',gap:4,color:'var(--gold)',fontWeight:700}}><Eye size={12}/>{ins.visit_count}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>}
            </div>
          </div>
        </section>
      )}

      {/* Most Visited */}
      <section className="section">
        <div className="container">
          <div className="sec-header">
            <div className="sec-eyebrow">{t('mv_eyebrow')}</div>
            <h2 className="sec-title">{t('mv_title')}</h2>
            <div className="sec-rule"/>
          </div>
          <div className="mv-grid">
            {mostVisited.map((ins,i)=>(
              <div key={ins.id} className="mv-card au" style={{animationDelay:`${i*.07}s`,opacity:0}} onClick={()=>navigate(`/instructor/${ins.id}`)}>
                <div className="mv-top">
                  <div className="mv-av">
                    {fixPhoto(ins.photo)?<img src={fixPhoto(ins.photo)} alt={ins.full_name}/>:<span>{(f(ins.full_name,ins.full_name_en)||'?')[0]}</span>}
                  </div>
                  <div className="mv-name">{f(ins.full_name,ins.full_name_en)}</div>
                  <div className="mv-role">{f(ins.academic_title,titleEn(ins.academic_title))}</div>
                </div>
                <div className="mv-body">
                  <div className="mv-row"><Award size={12}/><span>{f(ins.degree,degreeEn(ins.degree))}</span></div>
                  <div className="mv-row"><Building2 size={12}/><span>{f(ins.department_name,ins.department_name_en)||'—'}</span></div>
                </div>
                <div className="mv-foot">
                  <span style={{fontSize:11,color:'var(--text-muted)'}}>{t('visits')}</span>
                  <span className="mv-views"><Eye size={12}/>{ins.visit_count?.toLocaleString(lang==='ar'?'ar-IQ':'en-US')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Chip({label,onRemove}){
  return(
    <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:100,background:'var(--primary-pale2)',color:'var(--primary)',fontSize:12,fontWeight:700}}>
      {label}<button onClick={onRemove} style={{background:'none',border:'none',cursor:'pointer',color:'var(--primary)',fontSize:14,fontWeight:900,padding:0,lineHeight:1}}>×</button>
    </span>
  );
}

function FilterSelect({label,value,onChange,options}){
  const [open,setOpen]=React.useState(false);
  const ref=React.useRef(null);
  const { t } = useLang();
  const selected=options.find(o=>o.value===value);
  React.useEffect(()=>{
    const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener('mousedown',h);
    return()=>document.removeEventListener('mousedown',h);
  },[]);
  const Opt=({val,lbl})=>{
    const active=value===val||(!val&&!value);
    return(
      <div onClick={()=>{onChange(val);setOpen(false);}} style={{padding:'10px 14px',fontSize:13,cursor:'pointer',fontWeight:active?700:400,color:active?'#203162':'#1a2340',background:active?'#eef1f9':'transparent',display:'flex',alignItems:'center',justifyContent:'space-between'}}
        onMouseOver={e=>{if(!active)e.currentTarget.style.background='#f3f4f5';}}
        onMouseOut={e=>{e.currentTarget.style.background=active?'#eef1f9':'transparent';}}>
        {val===''?t('filter_all'):lbl}
        {active&&<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 4" stroke="#203162" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
    );
  };
  return(
    <div ref={ref} style={{display:'flex',flexDirection:'column',gap:5,position:'relative'}}>
      <label style={{fontSize:10,fontWeight:700,color:'rgba(32,49,98,0.5)',letterSpacing:'1px',textTransform:'uppercase'}}>{label}</label>
      <button type="button" onClick={()=>setOpen(o=>!o)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 14px',background:'#fff',border:open?'2px solid #203162':'2px solid rgba(32,49,98,0.1)',borderRadius:9,fontSize:13,fontWeight:selected?700:400,color:selected?'#203162':'#7a8aaa',cursor:'pointer',fontFamily:'var(--font)',transition:'border .15s',width:'100%'}}>
        <span>{selected?selected.label:t('filter_all')}</span>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{transform:open?'rotate(180deg)':'none',transition:'transform .2s',flexShrink:0,marginRight:2}}>
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open&&(
        <div style={{position:'absolute',top:'calc(100% + 4px)',left:0,right:0,background:'#fff',border:'1.5px solid rgba(32,49,98,0.12)',borderRadius:9,boxShadow:'0 8px 32px rgba(32,49,98,0.16)',zIndex:9999,maxHeight:260,overflowY:'auto'}}>
          <Opt val="" lbl=""/>
          <div style={{height:1,background:'rgba(32,49,98,0.06)',margin:'0 10px'}}/>
          {options.map(opt=><Opt key={opt.value} val={opt.value} lbl={opt.label}/>)}
        </div>
      )}
    </div>
  );
}
