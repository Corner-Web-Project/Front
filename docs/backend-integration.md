# Corner Room 프론트·백엔드 API 연동

## 연결한 기능

- 프로젝트 목록: `GET /api/projects?generation=1&page=0&size=12`.
- 프로젝트 상세: `GET /api/projects/{projectId}`.
- 가입 신청 제출: `POST /api/join-applications`.
- 팀의 최신 회원가입·JWT 로그인·내 정보 조회·게시판·people 코드를 보존하고 확인된 API의 주소를 `VITE_API_BASE_URL`로 통일했다.
- 프로젝트 카드·상세 UI와 기수 필터를 유지하며 로딩, 오류·재시도, 빈 목록, 상세 404, 페이지 이동을 처리했다. 기수·페이지·상세 ID 변경 시 이전 요청을 취소한다.
- 기존 `projectData.ts` 파일은 보존하되 프로젝트 목록·상세는 실제 API만 사용한다.

## 변경 파일과 이유

| 파일 | 변경 이유 |
| --- | --- |
| `src/types/project.ts` | 실제 `ProjectResponse` DTO와 같은 타입 및 런타임 응답 검증 |
| `src/api/http.ts`, `src/api/config.ts` | 주소 검증, JSON 조회·오류·15초 제한, 이미지 경로, Bearer 헤더 |
| `src/api/projects.ts`, `src/hooks/useApiQuery.ts` | 프로젝트 요청과 취소·재시도·로딩 상태 관리 |
| `src/page/Project.tsx`, `src/page/ProjectDetail.tsx`, `src/components/ProjectCard.tsx` | 하드코딩을 실제 목록·상세 응답으로 교체 |
| `src/page/Join.tsx` | 기존 로컬 가입 신청 연결·유효성 검사·제출 결과 표시 보존, 공통 주소 사용 |
| `src/api/member.ts`, `src/context/AuthContext.tsx`, `src/context/auth.ts`, `src/page/SignIn.tsx` | 팀 JWT 로그인·localStorage 토큰·내 정보 복원 유지, 인증 모듈 충돌 해결 |
| `src/api/post.ts`, `src/page/NoticeWrite.tsx` | 게시글 작성에 팀의 토큰 첨부. 작성자는 백엔드 인증 회원 기준이므로 화면에도 로그인 이름 표시 |
| `src/page/Home.tsx` | 팀 people 화면 보존, 하드코딩 주소 제거, 초기 조회 취소 처리 |
| `.env.example`, `netlify.toml`, `README.md` | 설정 예제·`/api` 프록시·SPA 새로고침 처리·문서 링크 |
| `vite.config.ts` | 로컬 개발용 `/api` 프록시 |
| `src/page/Schedule.tsx` | 하드코딩 주소를 공통 `apiUrl`로 교체 |
| `tests/project-api.test.mjs` | DTO·설정·오류·이미지·JWT 헤더 검증 |
| `tests/local-api-smoke.mjs` | 일회성 로컬 H2 서버와 실제 프론트 API 모듈의 HTTP 연동 검사 |

## 실제 DTO와 인증

목록 응답은 배열 자체가 아니라 `{projects,page,size,totalElements,totalPages}`이다. 프로젝트 ID는 `projectId: number`, 기수는 `generation: number`이며 화면에서 `1기`로 표시한다. `subtitle`, `banner`, `logo`는 null을 허용한다. 상세에는 `description`, `stacks: string[]`, `members: {name,role}[]`가 추가된다.

가입 신청 요청은 `{name,studentId,major,phone,motivation,portfolioUrl,comment}`이며 포트폴리오가 비어 있으면 null을 전송한다. 가입 신청은 성공 후 중복 제출을 막으며 서버 오류를 화면에 표시한다.

로그인은 `POST /api/auth/tokens`에 `{studentId,password}`를 보내고 `{accessToken,tokenType,expiresIn}`를 받는다. 팀의 기존 방식대로 `localStorage`의 `accessToken`을 사용하고 `GET /api/members/me`로 로그인 상태를 복원한다. 인증이 필요한 요청은 `Authorization: Bearer <accessToken>`을 전송한다. 프로젝트 조회는 공개이고 변경은 ADMIN이며 임시 관리자나 우회는 없다.

상대 이미지 경로는 API 서버를 기준으로 해석하며(`VITE_API_BASE_URL`이 비어 있으면 현재 사이트 주소 기준, 즉 프록시 경유) 절대 HTTP(S) URL도 지원한다. 실제 프로젝트 이미지 제공 경로와 파일은 운영 데이터 준비 시 확인해야 한다.

## API 주소 규칙

코드는 모든 요청을 `apiUrl('/api/...')`로 만든다. `VITE_API_BASE_URL`에 따라 요청 주소가 달라진다.

| `VITE_API_BASE_URL` | 요청 주소 | 사용처 |
| --- | --- | --- |
| 비어 있음 | `/api/...` 상대 경로 → 같은 사이트의 프록시가 Back으로 전달 | Netlify 운영, Vite 프록시를 쓰는 로컬 |
| `http://localhost:8080` | `http://localhost:8080/api/...` 직접 호출 | 로컬 개발 |
| `https://...` | 그 주소로 직접 호출 | 운영에서 프록시 대신 HTTPS 백엔드를 직접 쓸 때만 |

운영(빌드 결과)에서 `http://` 주소를 넣으면 Mixed Content를 막기 위해 오류를 표시한다.

## 로컬 설정

Front 루트의 `.env.example`을 `.env.local`로 복사한다:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

값을 비워 두면 `vite.config.ts`의 `server.proxy`가 `/api` 요청을 `http://localhost:8080`으로 전달하므로 같은 결과가 된다. Back은 Java 21로 `./gradlew.bat bootRun`, Front는 `npm run dev`로 실행한다. Vite는 환경변수 변경 후 재시작한다. 기존 `VITE_API_URL`을 쓰던 환경도 `VITE_API_BASE_URL`로 변경해야 한다.

`.env.local`은 `npm run build`에도 반영된다. 로컬에서 운영 빌드를 확인할 때 값이 `http://localhost:8080`이면 HTTPS 오류가 나므로 값을 비우고 빌드한다. `.env.local`은 커밋되지 않아 Netlify 빌드에는 영향이 없다.

Back의 local 프로필은 인메모리 H2이며 초기 프로젝트 데이터가 없으면 빈 목록이 정상이다. H2 데이터는 종료하면 사라진다.

## Netlify 설정

Back은 EC2(`http://32.236.133.40`)에서 HTTP로 실행된다. 브라우저가 HTTPS 사이트에서 HTTP 서버를 직접 부르면 Mixed Content로 막히므로, Netlify 서버가 대신 요청을 전달하는 프록시를 쓴다.

1. `netlify.toml`의 `/api/*` 규칙이 `/api/`로 시작하는 요청을 `http://32.236.133.40/api/:splat`으로 전달한다(`force = true`). 이 규칙은 SPA fallback(`/*` → `/index.html`)보다 위에 있어야 한다.
2. Netlify 프로젝트 환경변수에 `VITE_API_BASE_URL`을 **설정하지 않는다**. 이미 있으면 삭제한다. 값이 있으면 프록시를 거치지 않고 그 주소로 직접 요청하며, `http://` 주소는 HTTPS 오류가 난다.
3. 기존 설정은 `npm run build`, publish `dist`, Node 24이다.
4. 환경변수는 빌드 때 반영되므로 변경 후 새 빌드·배포가 필요하다.
5. 배포 후 `https://cornerroom.netlify.app/api/projects` 같은 GET 주소에서 JSON이 보이면 프록시가 동작하는 것이다.

EC2 주소가 바뀌면 `netlify.toml`의 `to` 주소를 함께 바꾼다. `VITE_` 값은 브라우저에 공개되므로 JWT 비밀키, 비밀번호, DB 접속정보를 넣지 않는다.

Back CORS는 `http://localhost:5173`, `https://cornerroom.netlify.app`을 허용한다. 프록시를 거쳐도 브라우저가 붙인 `Origin: https://cornerroom.netlify.app` 헤더가 Back까지 전달되므로 이 허용 목록이 필요하다. 기존 people 수정 API에 맞춰 PATCH 사전 요청도 허용하되 실제 API의 ADMIN 검증은 유지한다. Netlify preview 도메인은 현재 허용되지 않는다.

공식 참고: [Netlify 환경변수](https://docs.netlify.com/build/environment-variables/overview/), [Vite 환경변수](https://vite.dev/guide/env-and-mode).

## 백엔드 상태와 남은 범위

- Project PR #16은 main에 병합됐다. 가입 신청은 PR #13에서 최신 main과 통합해 검증한다.
- GitHub 배포 이력 0건, Actions 워크플로 0건, 저장소 운영 URL 없음. 이 사실만으로 외부 수동 배포 여부는 단정할 수 없다.
- 운영에는 서버 측 `SPRING_PROFILES_ACTIVE=prod`, `SPRING_DATASOURCE_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` 설정과 MySQL 스키마가 필요하다. prod의 `ddl-auto: validate`에 맞춰 테이블을 준비해야 한다.
- 가입 신청 조회·심사·삭제 권한은 현재 팀의 기존 공개 정책을 유지한다. 이 화면에는 제출만 연결하며 관리 기능을 새로 노출하지 않는다. 운영 전 관리 권한 정책 확정이 필요하다.
- 일정 화면의 `/api/calendar` 호출은 공통 `apiUrl`로 바꿨지만 현재 백엔드에 대응 API가 없어 데이터는 받지 못한다. 프로젝트 등록·이미지 업로드도 이번 범위가 아니다.
- Netlify 프록시를 통한 운영 연동과 브라우저 UI 시각 검증은 완료되지 않았다.

## 검증

```powershell
# Front
node --test tests/project-api.test.mjs
npm run build
npm run lint
# Back
./gradlew.bat test bootJar --console=plain
```

프론트 테스트는 JWT 헤더, DTO/null/빈 응답/구형 데이터 거절, URL 설정, 이미지 URL, 공개 요청, HTTP 404, HTML 오응답, 네트워크 오류, 취소를 확인한다. 백엔드 테스트는 가입 신청 제출·검증·Netlify CORS, 프로젝트 CRUD·권한과 people PATCH 권한을 확인한다.

2026-10-18 결과: 프론트 테스트 5개·빌드·린트 통과, 백엔드 전체 테스트 49개·`bootJar` 통과. Java 21/local 프로필의 일회성 H2 서버에서 프론트 API 모듈을 실제 호출해 프로젝트 목록·404, 회원가입·로그인·내 정보, JWT 게시글 작성·조회, 가입 신청 제출, PATCH 사전 요청과 일반 회원의 ADMIN 요청 403을 확인했다. 검증 서버는 종료했다.

실제 HTTP 검사를 재현하려면 운영 데이터가 없는 별도 local 프로필 서버를 실행한 뒤 `SMOKE_API_BASE_URL`을 그 로컬 HTTP 주소로 지정하고 `node tests/local-api-smoke.mjs`를 실행한다. 테스트는 일반 회원·게시글·가입 신청을 생성하므로 일회성 H2에서만 실행한다. 관리자 계정을 만들거나 권한을 우회하지 않는다.
