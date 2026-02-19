import React from 'react';

export function ApplyFlowPage() {
  const steps = ['프로필 작성', '공고 매칭', '지원서 제출', '검토', '오퍼'];
  return <section className="card" style={{ padding: 20 }}>
    <h2>지원 흐름</h2>
    <ol style={{ display: 'grid', gap: 10 }}>
      {steps.map((s, i) => <li key={s}><strong>{i + 1}.</strong> {s}</li>)}
    </ol>
  </section>;
}
