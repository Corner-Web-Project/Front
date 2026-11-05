# Corner Room 프론트·백엔드 API 연동

## 연결한 기능

- 프로젝트 목록: `GET /api/projects?generation=1&page=0&size=12`.
- 프로젝트 상세: `GET /api/projects/{projectId}`.
- 관리자 프로젝트 등록: `POST /api/projects`. 목록의 `+ 프로젝트 등록`에서 `/Projectup` 폼으로 이동하고, 성공하면 생성된 상세 화면으로 이동한다.
- 관리자 이미지 업로드: `POST /api/projects/images` (`multipart/form-data`, `file`). 반환된 `url`을 프로젝트의 `logo`, `banner`에 저장하며 이미지 조회는 공개다.
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
| `.env.example`, `netlify.toml`, `README.md` | 설정 예제·SPA 새로고침 처리·문서 링크 |
| `tests/project-api.test.mjs` | DTO·설정·오류·이미지·JWT 헤더 검증 |
| `tests/local-api-smoke.mjs` | 일회성 로컬 H2 서버와 실제 프론트 API 모듈의 HTTP 연동 검사 |

## 실제 DTO와 인증

목록 응답은 배열 자체가 아니라 `{projects,page,size,totalElements,totalPages}`이다. 프로젝트 ID는 `projectId: number`, 기수는 `generation: number`이며 화면에서 `1기`로 표시한다. `subtitle`, `banner`, `logo`는 null을 허용한다. 상세에는 `description`, `stacks: string[]`, `members: {name,role}[]`가 추가된다.

가입 신청 요청은 `{name,studentId,major,phone,motivation,portfolioUrl,comment}`이며 포트폴리오가 비어 있으면 null을 전송한다. 가입 신청은 성공 후 중복 제출을 막으며 서버 오류를 화면에 표시한다.

로그인은 `POST /api/auth/tokens`에 `{studentId,password}`를 보내고 `{accessToken,tokenType,expiresIn}`를 받는다. 팀의 기존 방식대로 `localStorage`의 `accessToken`을 사용하고 `GET /api/members/me`로 로그인 상태를 복원한다. 인증이 필요한 요청은 `Authorization: Bearer <accessToken>`을 전송한다. 프로젝트 조회는 공개이고 변경은 ADMIN이며 임시 관리자나 우회는 없다.

상대 이미지 경로는 API 서버를 기준으로 해석하며 절대 HTTP(S) URL도 지원한다. 실제 프로젝트 이미지 제공 경로와 파일은 운영 데이터 준비 시 확인해야 한다.

## 로컬 설정

Front 루트의 `.env.example`을 `.env.local`로 복사한다:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

Back은 Java 21로 `./gradlew.bat bootRun`, Front는 `npm run dev`로 실행한다. Vite는 환경변수 변경 후 재시작한다. 기존 `VITE_API_URL`을 쓰던 환경도 `VITE_API_BASE_URL`로 변경해야 한다. 설정이 없으면 임의 서버로 요청하지 않고 오류를 표시한다.

Back의 local 프로필은 인메모리 H2이며 초기 프로젝트 데이터가 없으면 빈 목록이 정상이다. H2 데이터는 종료하면 사라진다.

## Netlify 설정: 배포 승인 후 적용

1. 실제 외부 HTTPS 백엔드 주소와 배포 커밋을 먼저 확인한다. 현재 저장소에서 운영 주소는 확인되지 않았다.
2. Netlify 프로젝트 환경변수에 `VITE_API_BASE_URL`을 실제 서버 기본 주소로 설정한다. 코드가 `/api/projects` 등 경로를 붙이므로 해당 경로를 환경변수에 중복해서 넣지 않는다.
3. Production 컨텍스트와 Builds 범위(선택이 없으면 기본 전체)에 값을 제공한다.
4. 기존 설정은 `npm run build`, publish `dist`, Node 24이며 `netlify.toml`의 SPA fallback을 유지한다.
5. 환경변수는 빌드 때 반영되므로 변경 후 새 빌드·배포가 필요하다. 이 작업에서는 Netlify 설정 변경이나 배포를 실행하지 않았다.

`VITE_` 값은 브라우저에 공개된다. JWT 비밀키, 비밀번호, DB 접속정보를 넣지 않는다.

Back CORS는 `http://localhost:5173`, `https://cornerroom.netlify.app`을 허용한다. 기존 people 수정 API에 맞춰 PATCH 사전 요청도 허용하되 실제 API의 ADMIN 검증은 유지한다. Netlify preview 도메인은 현재 허용되지 않는다.

공식 참고: [Netlify 환경변수](https://docs.netlify.com/build/environment-variables/overview/), [Vite 환경변수](https://vite.dev/guide/env-and-mode).

## 백엔드 상태와 남은 범위

- Project PR #16은 main에 병합됐다. 가입 신청은 PR #13에서 최신 main과 통합해 검증한다.
- GitHub 배포 이력 0건, Actions 워크플로 0건, 저장소 운영 URL 없음. 이 사실만으로 외부 수동 배포 여부는 단정할 수 없다.
- 운영에는 서버 측 `SPRING_PROFILES_ACTIVE=prod`, `SPRING_DATASOURCE_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` 설정과 MySQL 스키마가 필요하다. prod의 `ddl-auto: validate`에 맞춰 테이블을 준비해야 한다.
- 가입 신청 조회·심사·삭제 권한은 현재 팀의 기존 공개 정책을 유지한다. 이 화면에는 제출만 연결하며 관리 기능을 새로 노출하지 않는다. 운영 전 관리 권한 정책 확정이 필요하다.
- 일정 화면의 기존 `/api/calendar` 호출은 현재 백엔드에 대응 API가 없어 연결 범위에서 제외했다.
- 실제 운영 HTTPS·MySQL·브라우저 UI 시각 검증은 완료되지 않았다.

## 검증

```powershell
# Front
node --test tests/project-api.test.mjs
node --test tests/project-write.test.mjs
npm run build
npm run lint
# Back
./gradlew.bat test bootJar --console=plain
```

프론트 테스트는 JWT 헤더, DTO/null/빈 응답/구형 데이터 거절, URL 설정, 이미지 URL, 공개 요청, HTTP 404, HTML 오응답, 네트워크 오류, 취소를 확인한다. 백엔드 테스트는 가입 신청 제출·검증·Netlify CORS, 프로젝트 CRUD·권한과 people PATCH 권한을 확인한다.

2026-10-18 결과: 프론트 테스트 5개·빌드·린트 통과, 백엔드 전체 테스트 49개·`bootJar` 통과. Java 21/local 프로필의 일회성 H2 서버에서 프론트 API 모듈을 실제 호출해 프로젝트 목록·404, 회원가입·로그인·내 정보, JWT 게시글 작성·조회, 가입 신청 제출, PATCH 사전 요청과 일반 회원의 ADMIN 요청 403을 확인했다. 검증 서버는 종료했다.

실제 HTTP 검사를 재현하려면 운영 데이터가 없는 별도 local 프로필 서버를 실행한 뒤 `SMOKE_API_BASE_URL`을 그 로컬 HTTP 주소로 지정하고 `node tests/local-api-smoke.mjs`를 실행한다. 테스트는 일반 회원·게시글·가입 신청을 생성하므로 일회성 H2에서만 실행한다. 관리자 계정을 만들거나 권한을 우회하지 않는다.

## 프로젝트 등록 사용법

ADMIN 계정으로 로그인 → 프로젝트 목록 → `+ 프로젝트 등록` → 기수·이름·상세 설명 입력 → 등록. 한 줄 설명·기술 스택·팀원·로고·배너는 선택 항목이다. 기술 스택은 쉼표로 구분한다. 입력 오류나 서버 오류 시 입력값을 유지하며, 등록 중에는 중복 제출을 막는다. 일반 회원은 등록 폼을 사용할 수 없고 서버에서도 403으로 차단한다.

이미지는 실제 PNG/JPEG만 허용하며 파일당 5MB, 1600만 화소 이하이다. 서버는 파일 내용을 검증하고 UUID 이름의 PNG로 다시 저장한다. Back의 기본 저장 경로는 `./uploads/projects`이고, `--app.project-image-directory=/absolute/persistent/path`로 변경할 수 있다. 배포 환경에서는 이 경로를 영속 볼륨에 연결해야 한다. DB에는 파일 경로가 저장된다. 업로드 후 등록을 취소한 이미지의 자동 정리는 아직 제공하지 않는다.

2026-11-05: 프론트 린트·빌드·API 테스트, 백엔드 전체 테스트, 브라우저의 관리자 로그인 → 이미지 첨부 → 등록 → 상세·목록 표시를 확인했다. 로컬 H2용 테스트 계정은 실행 중인 DB에만 생성했으며 소스에 관리자 자동 생성 코드는 추가하지 않았다.
