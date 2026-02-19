import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/atoms/Button';

export function LandingPage() {
  return <section className="card" style={{ padding: 28, marginTop: 8 }}>
    <p style={{ color: 'var(--color-accent)', fontWeight: 700, marginBottom: 6 }}>AI 기반 건설 경력 매칭</p>
    <h1 style={{ marginTop: 0, fontSize: '2rem' }}>건설 커리어를 더 빠르고 정교하게 연결하세요</h1>
    <p style={{ color: 'var(--color-text-muted)' }}>대형 잡플랫폼 패턴을 반영해 직관적인 지원/채용 플로우를 제공합니다.</p>
    <div style={{ display: 'flex', gap: 10 }}>
      <Link to="/auth"><Button>시작하기</Button></Link>
      <Link to="/jobs"><Button variant="ghost">공고 보기</Button></Link>
    </div>
  </section>;
}
