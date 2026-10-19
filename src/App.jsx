import { useEffect } from 'react';

const navigation = [
  ['today', 'grid', 'Today'],
  ['study', 'book', 'Study methods'],
  ['ai', 'spark', 'AI tools'],
  ['quizzes', 'check', 'Quizzes'],
  ['planner', 'calendar', 'Planner'],
  ['progress', 'chart', 'Progress'],
];

function Symbols() {
  return <svg className="icon-library" aria-hidden="true"><symbol id="i-grid" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></symbol><symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5zM4 5.5v16M8 7h8M8 11h8"/></symbol><symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 20V10m8 10V4m8 16v-7M2.5 20.5h19"/></symbol><symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="16" rx="3"/><path d="M8 3v4m8-4v4M4 9.5h16M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01"/></symbol><symbol id="i-spark" viewBox="0 0 24 24"><path d="m12 2 1.8 7.2L21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-2.8zM19 2l.8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8z"/></symbol><symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></symbol><symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol><symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol><symbol id="i-flame" viewBox="0 0 24 24"><path d="M12 22c4.4 0 7.5-3.1 7.5-7.2 0-3.1-1.8-5.2-4.1-7.3.1 2.2-.8 3.3-1.7 3.8C14.1 7.2 12.1 3.8 8 2c.4 4.8-3.5 7.5-3.5 12.7C4.5 18.8 7.6 22 12 22Z"/></symbol><symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></symbol><symbol id="i-leaf" viewBox="0 0 24 24"><path d="M20.5 3.5c-10 0-16 4-16 11a6 6 0 0 0 6 6c7 0 11-6 10-17ZM4.5 20.5c2-5 5-8 10-11"/></symbol></svg>;
}

function Icon({ name }) { return <svg aria-hidden="true"><use href={`#i-${name}`} /></svg>; }

function Sidebar() {
  return <aside className="sidebar" id="sidebar">
    <a className="brand" href="#today" aria-label="StudyLoop home"><span className="brand-mark"><Icon name="leaf" /></span><span>study<span className="brand-light">loop</span></span></a>
    <div className="side-label">YOUR DESK</div>
    <nav className="side-nav" aria-label="Main navigation">{navigation.map(([page, icon, label]) => <button key={page} className={`nav-item${page === 'today' ? ' active' : ''}`} data-page={page}><Icon name={icon}/><span>{label}</span>{page === 'quizzes' && <span className="nav-count" id="nav-due">0</span>}</button>)}</nav>
    <div className="side-label subject-label">YOUR SUBJECTS <button className="tiny-add" id="add-subject" aria-label="Add subject">+</button></div>
    <div className="subject-list" id="subject-list" />
    <div className="sidebar-bottom"><button className="profile-button" data-page="settings"><span className="avatar" id="profile-initial">S</span><span className="profile-copy"><strong id="profile-name">Study profile</strong><small id="profile-year">Set up your details</small></span><span className="profile-more">···</span></button></div>
  </aside>;
}

function Header() {
  return <header className="topbar"><button id="menu-toggle" className="icon-button mobile-menu" aria-label="Open menu"><Icon name="menu"/></button><div className="breadcrumb"><span>My space</span><span className="crumb-slash">/</span><strong id="page-title">Today</strong></div><div className="topbar-right"><span className="streak-pill"><Icon name="flame"/><b id="streak-count">0</b><span>day streak</span></span><button className="avatar small-avatar" data-page="settings" aria-label="Your profile" id="top-avatar">S</button></div></header>;
}

export default function App() {
  useEffect(() => {
    let alive = true;
    import('./controllers/studyloop-controller.js').then(({ mountStudyLoop }) => { if (alive) mountStudyLoop(); });
    return () => { alive = false; };
  }, []);

  return <><Symbols/><div className="app-shell"><Sidebar/><main className="main-area"><Header/><div className="content" id="content" /></main></div><div className="toast" id="toast" role="status" aria-live="polite" /></>;
}
