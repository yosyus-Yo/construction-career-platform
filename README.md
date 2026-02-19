# Construction Career Platform

건설업 특화 경력직 채용 플랫폼 API (TypeScript + Express + Prisma/SQLite)

## 보안/개인정보
- JWT 인증 + RBAC(ADMIN/RECRUITER/CANDIDATE)
- 민감 필드 로그 마스킹(redact)
- 후보자 전화번호 AES-256-GCM 암호화 저장
- 이력서 원문 비영속 처리(요약 digest + 키워드만 저장)
- 감사로그(AuditLog) 자동 기록

## 실행
```bash
cp .env.example .env
npm install
npm run db:push
npm run seed
npm run dev
```

## 테스트
```bash
npm test           # unit+integration + coverage
npm run test:e2e   # playwright e2e
npm run test:perf  # autocannon 성능 측정
```
