# PTMT Frontend

**Paper To My Tutor** - 논문 기반 맞춤형 학습 커리큘럼 생성 서비스 프론트엔드

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 개요

논문을 업로드하면 AI가 분석하여 개인 맞춤형 학습 커리큘럼을 생성해주는 서비스입니다. 사용자의 학습 목적, 수준, 가용 시간에 따라 최적화된 학습 경로를 제공합니다.

## 기술 스택

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + shadcn/ui |
| Icons | Lucide React |
| Package Manager | npm |

## 프로젝트 구조

```
PTMT-Frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 루트 레이아웃
│   ├── page.tsx              # 홈페이지 (랜딩)
│   ├── globals.css           # 전역 스타일
│   ├── auth/                 # 인증 페이지
│   │   ├── login/            # 로그인
│   │   └── signup/           # 회원가입
│   └── curriculum/           # 커리큘럼 관련 페이지
│       ├── upload-paper/     # 논문 업로드
│       ├── settings/         # 학습 옵션 설정
│       ├── generating/       # 생성 중 화면
│       ├── [id]/             # 커리큘럼 상세 (그래프 뷰)
│       └── history/          # 커리큘럼 히스토리
├── components/               # 재사용 컴포넌트
│   ├── layout/               # 레이아웃 컴포넌트
│   │   ├── Header.tsx        # 헤더
│   │   ├── Footer.tsx        # 푸터
│   │   └── Logo.tsx          # 로고
│   └── ui/                   # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── lib/                      # 유틸리티 및 공유 로직
│   ├── api.ts                # API 클라이언트
│   ├── auth-context.tsx      # 인증 Context
│   ├── curriculum-context.tsx # 커리큘럼 Context
│   ├── types.ts              # TypeScript 타입 정의
│   ├── utils.ts              # 유틸리티 함수
│   └── dummy-curriculum.ts   # 개발용 더미 데이터
└── public/                   # 정적 파일
```

## 페이지 구조

| Route | 페이지 | 설명 |
|-------|--------|------|
| `/` | 홈 | 서비스 소개 랜딩 페이지 |
| `/auth/login` | 로그인 | 이메일/비밀번호 로그인 |
| `/auth/signup` | 회원가입 | 신규 회원가입 |
| `/curriculum/upload-paper` | 논문 업로드 | PDF 업로드, 링크 제출, 제목 검색 |
| `/curriculum/settings` | 옵션 설정 | 학습 목적, 수준, 시간 등 설정 |
| `/curriculum/generating` | 생성 중 | AI 커리큘럼 생성 진행 화면 |
| `/curriculum/[id]` | 커리큘럼 상세 | 그래프 뷰, 학습 진행 |
| `/curriculum/history` | 히스토리 | 생성한 커리큘럼 목록 |

## 시작하기

### 사전 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### 환경 변수 설정

```bash
# .env.local 파일 생성
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 사용 가능한 스크립트

```bash
npm run dev       # 개발 서버 실행 (http://localhost:3000)
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버 실행
npm run lint      # ESLint 검사
```

## API 연동

### Mock 모드 전환

`lib/api.ts` 파일에서 Mock 모드를 전환할 수 있습니다:

```typescript
// Mock 모드 (백엔드 없이 개발)
const USE_MOCK = true;

// 실제 백엔드 연동
const USE_MOCK = false;
```

### API 클라이언트 사용법

```typescript
import { api } from '@/lib/api';

// 로그인
const response = await api.auth.login({ email, password });

// PDF 업로드
const result = await api.papers.uploadPdf(file);

// 커리큘럼 목록 조회
const curriculums = await api.curriculums.getList({ page: 1, limit: 10 });

// 그래프 조회
const graph = await api.curriculums.getGraph(curriculumId);

// 학습 진행 업데이트
await api.progress.update(curriculumId, {
  keyword_id: 'node-1',
  status: 'completed'
});
```

## 상태 관리

### AuthContext

사용자 인증 상태 관리:

```typescript
import { useAuth } from '@/lib/auth-context';

const { user, isAuthenticated, login, logout } = useAuth();
```

### CurriculumContext

커리큘럼 생성 플로우 상태 관리:

```typescript
import { useCurriculum } from '@/lib/curriculum-context';

const { 
  paper,          // 업로드된 논문 정보
  options,        // 선택한 옵션
  setPaper,
  setOptions,
  reset 
} = useCurriculum();
```

## 타입 정의

주요 타입들은 `lib/types.ts`에 정의되어 있습니다:

| 타입 | 설명 |
|------|------|
| `User` | 사용자 정보 |
| `AuthResponse` | 로그인/회원가입 응답 |
| `Paper` | 논문 정보 |
| `Keyword` | 추출된 키워드 |
| `CurriculumOptions` | 학습 옵션 |
| `CurriculumGraph` | 그래프 데이터 (노드, 엣지) |
| `CurriculumNode` | 학습 노드 |
| `Resource` | 학습 리소스 |
| `LearningProgress` | 학습 진행 상태 |

### Enum Values

```typescript
// 학습 목적
type CurriculumPurpose = 
  | "deep_research"       // 심층 연구
  | "simple_study"        // 개념 학습
  | "trend_check"         // 트렌드 파악
  | "code_implementation" // 구현 실습
  | "exam_preparation";   // 시험 준비

// 사용자 수준
type UserLevel = 
  | "non_major"   // 입문자
  | "bachelor"    // 학부생
  | "master"      // 대학원생
  | "researcher"  // 연구원
  | "industry";   // 현업

// 커리큘럼 상태
type CurriculumStatus = 
  | "draft"         // 초안
  | "options_saved" // 설정 완료
  | "generating"    // 생성 중
  | "ready"         // 완료
  | "failed";       // 실패

// 리소스 타입
type ResourceType = "paper" | "article" | "video" | "code";

// 진행 상태
type ProgressStatus = "locked" | "in_progress" | "completed" | "skipped";
```

## UI 컴포넌트

shadcn/ui 기반 컴포넌트:

| 컴포넌트 | 파일 | 용도 |
|----------|------|------|
| Button | `ui/button.tsx` | 버튼 |
| Card | `ui/card.tsx` | 카드 컨테이너 |
| Input | `ui/input.tsx` | 텍스트 입력 |
| Label | `ui/label.tsx` | 라벨 |
| Badge | `ui/badge.tsx` | 상태 뱃지 |
| Avatar | `ui/avatar.tsx` | 프로필 이미지 |
| Tabs | `ui/tabs.tsx` | 탭 네비게이션 |
| Separator | `ui/separator.tsx` | 구분선 |

## 사용자 플로우

```
1. 홈페이지 → 서비스 소개

2. 로그인/회원가입 → 인증

3. 논문 업로드
   ├── PDF 파일 업로드
   ├── 논문 링크 제출
   └── 제목으로 검색

4. 옵션 설정
   ├── 학습 목적 선택
   ├── 현재 수준 선택
   ├── 이미 아는 개념 체크
   ├── 학습 기간 설정
   └── 선호 리소스 선택

5. 커리큘럼 생성 중 → 진행률 표시

6. 커리큘럼 상세
   ├── 그래프 뷰 (노드/엣지)
   ├── 각 노드별 학습 리소스
   └── 진행 상태 관리

7. 히스토리 → 이전 커리큘럼 목록
```

## 백엔드 연동

### 개발 환경

```bash
# 1. 백엔드 서버 실행 (별도 터미널)
cd ../PTMT-Backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000

# 2. 프론트엔드 실행
npm run dev
```

### CORS 설정

백엔드에서 다음 origin을 허용해야 합니다:
- `http://localhost:3000`
- `http://localhost:3001`

## TODO (구현 예정)

- [ ] 그래프 시각화 (D3.js / React Flow)
- [ ] 다크 모드 지원
- [ ] PWA 지원
- [ ] 소셜 로그인 (Google, GitHub)
- [ ] 학습 알림 기능
- [ ] 커리큘럼 공유 기능
- [ ] 반응형 모바일 UI 최적화

## 관련 문서

- [API 설계 문서](./API_DESIGN.md) - 전체 API 스펙
- [백엔드 README](../PTMT-Backend/README.md) - 백엔드 프로젝트
- [백엔드 API Reference](../PTMT-Backend/docs/API_REFERENCE.md) - API 상세 문서

## Learn More (Next.js)

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 라이선스

Private
