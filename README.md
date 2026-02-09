# PTMT Frontend

페튜와 매튜(Paper Tutor & Map Tutor) 서비스의 프런트엔드 레포지토리입니다.

논문을 업로드하면 AI가 분석하여 개인 맞춤형 학습 커리큘럼을 생성해주는 서비스입니다. 사용자의 학습 목적, 수준, 가용 시간에 따라 최적화된 학습 경로를 제공합니다.

<img width="3842" height="1916" alt="image" src="https://github.com/user-attachments/assets/2e317cc1-33d9-4ae1-a1f5-49070b10e474" />


## 기술 스택

- Next.js 16
- TypeScript 5
- React 19
- Tailwind CSS 4
- Radix UI + shadcn/ui
- Lucide React + Material Icons
- npm

## 실행 방법

### 사전 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 의존성 설치

```bash
# 의존성 설치
npm install
```

### 환경 변수 설정

```bash
# .env.local 파일 생성
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 개발 서버 실행

```bash
# 개발 서버 실행
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 활용 가능 스크립트

```bash
npm run dev       # 개발 서버 실행 (http://localhost:3000)
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버 실행
npm run lint      # ESLint 검사
```

## 프로젝트 구조

```bash
PTMT-Frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 루트 레이아웃
│   ├── page.tsx              # 홈페이지 (랜딩)
│   ├── globals.css           # 전역 스타일
│   ├── auth/                 # 인증 페이지
│   │   ├── login/            # 로그인
│   │   └── signup/           # 회원가입
│   │── curriculum/           # 커리큘럼 관련 페이지
│   │   ├── upload-paper/     # 논문 업로드
│   │   ├── settings/         # 학습 옵션 설정
│   │   ├── generating/       # 생성 중 화면
│   │   ├── [id]/             # 커리큘럼 상세 (그래프 뷰)
│   ├──user/                  # 사용자 페이지
│   │   └── history/          # 커리큘럼 히스토리
├── components/               # 재사용 컴포넌트
│   ├─ auth/                  # 인증 컴포넌트
│   │  └─ AuthLoading.tsx
│   ├─ layout/                # 레이아웃 컴포넌트
│   │   ├── Header.tsx        
│   │   ├── Footer.tsx        
│   │   └── Logo.tsx 
│   ├─ queue/                 # 대기열 컴포넌트
│   │  ├─ QueueStatusCard.tsx
│   │  └─ QueueWaitingModal.tsx         
│   └── ui/                   # ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── const/                    # 고정 값(상수)
├── hooks/                    # hook
├── lib/                      # 유틸리티 및 공유 로직
├── public/                   # 정적 파일
└── README.md
```
