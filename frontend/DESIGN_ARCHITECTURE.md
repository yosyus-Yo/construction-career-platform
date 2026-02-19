# 프론트엔드 디자인 아키텍처

## 1) 디자인 시스템
- **Design Tokens**: `src/tokens/design-tokens.ts` + `src/styles/theme.css`
  - 색상/타이포/간격/반경/그림자 토큰 정의
  - 라이트/다크 테마 변수 분리 (`[data-theme='dark']`)
- **접근성**
  - `:focus-visible` 스타일 기본 제공
  - 컬러 대비 높은 기본 텍스트/배경 조합 사용

## 2) 컴포넌트 계층
- **Atoms**: Button, Input
- **Molecules**: Badge, Toast
- **Sections**: StatCard

## 3) 레이아웃/그리드
- 공통 `AppLayout` + `.container`
- 12-column grid (`.grid`) 기반 반응형 축소(태블릿 6-column)

## 4) 라우팅 아키텍처
- React Router 기반 페이지 분리
- `RoleGuard`로 auth/role 기반 접근 제어
  - `/dashboard`: 전 역할
  - `/company`: RECRUITER
  - `/admin`: ADMIN

## 5) 페이지 맵
- 랜딩: `/`
- 회원/로그인: `/auth`
- 대시보드: `/dashboard`
- 공고목록/상세: `/jobs`, `/jobs/:id`
- 지원흐름: `/apply-flow`
- 기업관리: `/company`
- 관리자: `/admin`
