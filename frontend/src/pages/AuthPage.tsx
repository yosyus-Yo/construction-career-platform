import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../api';
import { useAuth } from '../providers/AuthProvider';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password12!');
  const [role, setRole] = useState<Role>('CANDIDATE');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const nav = useNavigate();

  const submit = async () => {
    try {
      setError('');
      if (mode === 'login') await login(email, password);
      else await register(email, password, role);
      nav('/dashboard');
    } catch (e: any) {
      setError(e.message || '인증 실패');
    }
  };

  return <section className="card" style={{ maxWidth: 480, margin: '24px auto', padding: 20 }}>
    <h2 style={{ marginTop: 0 }}>{mode === 'login' ? '로그인' : '회원가입'}</h2>
    <div style={{ display: 'grid', gap: 10 }}>
      <Input placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} />
      <Input placeholder="비밀번호" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {mode === 'register' && <select value={role} onChange={e => setRole(e.target.value as Role)}>
        <option value="CANDIDATE">구직자</option><option value="RECRUITER">기업</option><option value="ADMIN">관리자</option>
      </select>}
      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
      <Button onClick={submit}>{mode === 'login' ? '로그인' : '회원가입'}</Button>
      <Button variant="ghost" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? '회원가입으로 전환' : '로그인으로 전환'}
      </Button>
    </div>
  </section>;
}
