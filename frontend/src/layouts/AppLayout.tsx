import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Button } from '../components/atoms/Button';

export function AppLayout() {
  const { user, logout } = useAuth();
  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };
  return <div>
    <header className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}>
      <Link to="/" style={{ fontWeight: 700 }}>BuildCareer</Link>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/jobs">공고</Link>
        {user && <Link to="/dashboard">대시보드</Link>}
        {user?.role === 'RECRUITER' && <Link to="/company">기업관리</Link>}
        {user?.role === 'ADMIN' && <Link to="/admin">관리자</Link>}
        <Button variant="ghost" onClick={toggleTheme}>🌓</Button>
        {user ? <Button variant="ghost" onClick={logout}>로그아웃</Button> : <Link to="/auth">로그인</Link>}
      </nav>
    </header>
    <main className="container" style={{ paddingBottom: 40 }}><Outlet /></main>
  </div>;
}
