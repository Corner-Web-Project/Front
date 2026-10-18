# Corner Room 프로젝트 조회 연동

## 분석 기준 (2026-10-18)

- Front 작업본: `main`, 시작 커밋 `3a5387b`. 기존 `src/page/Join.tsx` 미커밋 수정은 보존.
- Front 최신 원격 main: `639bb1e`. 회원·게시판·people 연동이 추가되었으며 이번 작업에서는 병합하지 않음.
- Back 작업본: `feature/join/6`, `987f8eb`. 프로젝트·가입 신청 API가 포함됨.
- Back 최신 원격 main: `f59128d`. 프로젝트 API는 아직 포함되지 않음. 프로젝트 기능은 `feature/project/14` (`73ded4b`)와 현재 작업 브랜치에 존재.
- `git fetch origin`으로 원격 참조만 갱신하고 차이를 분석. checkout, merge, commit, push, PR, 배포는 실행하지 않음.
- React/TypeScript/Tailwind/Vite 프론트는 React Router를 사용. Back은 Spring Boot 3.5.5/Java 21, Security/JWT, JPA, 로컬 H2/운영 MySQL 구조.
- 공개 Netlify 주소: https://cornerroom.netlify.app/ . 조회 도구에서는 해당 페이지 접근이 실패하여 실제 배포 번들의 API 호출은 검증하지 못함.
- 운영 백엔드 주소·배포 이력은 저장소에서 확인되지 않음. 사용자도 배포 여부가 불확실하다고 답변. 미배포로 확정하지 않고 **운영 주소 미확정**으로 취급.

## 구현과 API 계약

1. `src/types/project.ts`: `ProjectResponse.Summary`, `Detail`, `PageResult`에 대응하는 타입 및 응답 검증. ID는 `projectId: number`, 기수는 `generation: number`. subtitle/banner/logo는 null 허용.
2. `src/api/http.ts`, `src/api/projects.ts`: `VITE_API_BASE_URL` 기반 공개 GET. 설정 누락, 운영 HTTP, 비정상 응답, 네트워크 실패, 15초 시간제한 처리. 기본 서버 주소를 추측하지 않음.
3. `src/hooks/useApiQuery.ts`: 로딩·오류·재시도. 기수·페이지·상세 ID 변경 및 언마운트 시 이전 요청 취소, 늦은 응답 무시.
4. `src/page/Project.tsx`: `GET /api/projects?generation=1&page=0&size=12`. 응답은 `{projects,page,size,totalElements,totalPages}`. 기수는 서버에서 필터링, 페이지 이동 제공. 카드 UI·기수 버튼 유지.
5. `src/page/ProjectDetail.tsx`, `src/components/ProjectCard.tsx`: `GET /api/projects/{projectId}` 연동. 숫자 기수를 화면에서 `1기`로 표시, 상세 404·잘못된 ID·팀원 없음·이미지 없음 처리. 원래 제목·설명·팀원 레이아웃 유지.
6. 기존 `src/data/projectData.ts`와 등록 폼 타입은 팀 코드 보존을 위해 남겨두되 목록·상세에서 더 이상 사용하지 않음. 응답의 상대 이미지 경로는 API 서버 기준으로 해석하며 절대 HTTP(S) URL도 지원. 실제 파일 제공 경로는 운영 데이터 준비 시 확인 필요.

## 인증과 CORS

- `SecurityConfig`: 프로젝트 GET은 공개, POST/PUT/DELETE는 ADMIN. 이번 범위는 두 공개 조회이며 토큰을 첨부하지 않음. 관리자 등록·수정·삭제나 이미지 업로드는 연결하지 않음.
- Back 실제 로그인: `POST /api/auth/tokens`, 요청 `{studentId,password}`, 응답 `{accessToken,tokenType,expiresIn}`. 인증 요청은 `Authorization: Bearer <accessToken>`. `GET /api/members/me`는 인증 필요.
- Front 최신 원격 main의 팀 인증 코드는 `localStorage`의 `accessToken` 및 `/api/members/me`로 상태 복원. 현재 작업본의 로그인은 이전 `/SignIn` 구현이므로 이 화면까지 연동 완료되었다고 볼 수 없음. 별도 인증 체계는 추가하지 않음.
- 원격 Front의 회원·게시판 코드는 `VITE_API_URL`을 사용하고 Home에도 API 호출이 있으므로, 추후 **승인된 병합 후** 모든 호출을 `VITE_API_BASE_URL`로 통일하고 인증 필요 쓰기 요청의 Bearer 헤더를 점검해야 함.
- 기존 Back CORS는 `http://localhost:5173`, `https://cornerroom.netlify.app`를 명시 허용. Spring Security의 CORS 연결도 있음. 보안 정책 변경 없음.
- 추가한 MockMvc 테스트로 실제 Netlify Origin의 GET·preflight 허용 및 다른 Origin의 거절 확인.
- 일정 화면 `/api/calendar`는 현재 Back 컨트롤러에 없음. 이 API를 새로 추정하거나 연결하지 않음. 기존 가입 신청 수정도 그대로 보존.

## 로컬 실행

Front 루트에서 `.env.example`을 `.env.local`로 복사하고 실행:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

```powershell
npm run dev
```

Back에서 Java 21로 `./gradlew.bat bootRun` 실행. 기본 local 프로필은 인메모리 H2이며 초기 데이터가 없으면 빈 프로젝트 목록이 정상이다. 테스트 데이터는 프론트에 표시하지 않으며 관리자 우회·임시 계정을 만들지 않음.

## Netlify 설정 (승인 후 수행할 절차)

1. 프로젝트 API가 포함된 백엔드 배포 브랜치/커밋과 실제 외부 접근 가능한 HTTPS 주소를 먼저 확인한다. 현재 원격 main만 배포하면 프로젝트 API가 없다.
2. Netlify 프로젝트의 환경변수 설정에서 `VITE_API_BASE_URL`에 **실제 백엔드 주소**를 입력한다. `/api/projects`가 아닌 서버 기본 주소이며 코드가 `/api/projects`를 붙인다. 임의 운영 URL은 문서나 환경변수에 입력하지 않는다.
3. Production 컨텍스트와 Builds 범위(범위 선택이 없으면 기본 전체)에 변수를 제공한다. `VITE_` 값은 브라우저에 공개되므로 JWT 비밀키, 비밀번호, DB 접속정보를 넣지 않는다.
4. 기존 `netlify.toml`: 빌드 `npm run build`, publish `dist`, Node 24, SPA fallback `/index.html`. 이 설정을 유지한다.
5. Vite 환경변수는 빌드 시 반영되므로 변경 후 새 빌드/배포가 필요하다. 이번 작업에서는 실행하지 않았다.
6. 배포 후 `/Project`, `/Project/{실제 ID}` 직접 접근과 새로고침, 브라우저 Network의 대상 URL·JSON·CORS 헤더·오류·빈 목록을 확인한다. Netlify preview 도메인은 현재 CORS 허용 대상이 아니다.

공식 참고: [Netlify 환경변수](https://docs.netlify.com/build/environment-variables/overview/), [Vite 환경변수](https://vite.dev/guide/env-and-mode).

## 백엔드 운영 준비에 필요한 정보

- 배포 서비스/서버, 외부 HTTPS 주소, 배포 대상 브랜치·커밋, 프로젝트 API 배포 여부.
- 서버 환경변수: `SPRING_PROFILES_ACTIVE=prod`, `SPRING_DATASOURCE_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`. 값은 서버 관리 환경에서 설정하고 프론트에 전달하지 않음.
- 운영 MySQL 스키마 준비. 현재 prod는 `ddl-auto: validate`여서 테이블이 없으면 시작하지 못함. 원격 DB 주소는 기본 localhost 대신 실제 서버 환경에서 설정.
- 실제 프로젝트 데이터와 배너/로고 이미지 제공 주소. H2 테스트 성공은 MySQL·운영 배포 검증을 대체하지 않음.

## 후속 Project PR 병합 (2026-10-18)

- 사용자 승인에 따라 별도 작업 폴더에서 Project 브랜치와 최신 main(`f59128d`)을 통합했다. 실제 미해결 충돌은 없었으며 SecurityConfig의 프로젝트·people 권한과 Project/ProjectMember 엔티티를 유지했다.
- 전체 테스트 44개와 `bootJar` 성공, CodeRabbit 검토 성공 후 `7dfe208`을 `feature/project/14`에 푸시했다. 이 테스트 집합은 가입 신청 기능이 없는 Project PR 기준이므로 앞선 가입 신청 브랜치의 47개와 다르다.
- [Project PR #16](https://github.com/Corner-Web-Project/Back/pull/16)을 main에 병합했다. 병합 커밋: `d7a2e89158a150443725e384bd3d7e0d5a0ea791`. 따라서 위 최초 분석과 달리 **이제 원격 main에 프로젝트 API가 포함된다**.
- Front의 미커밋 연동 수정과 기존 Join 수정, Back 가입 신청 브랜치는 보존했다. 프론트 최신 원격 main과의 통합은 아직 진행하지 않았다.
- GitHub 배포 이력 0건, Actions 워크플로 0건, 저장소 homepage 및 운영 배포 URL 없음. 로컬 8080도 조회 시점에 리스닝 상태가 아니었다. 이 근거만으로 외부 수동 배포 유무나 IntelliJ 실행 이력을 단정할 수 없다.
- 실제 백엔드 배포와 Netlify 환경변수 설정은 진행하지 않았다. 운영 주소 확인이 여전히 필요하다.

## 검증 명령

```powershell
# Front
node --test tests/project-api.test.mjs
npm run build
npm run lint
# Back
./gradlew.bat test --console=plain
```

프론트 테스트는 DTO/null/빈 응답/구형 데이터 거절, URL 설정, 이미지 URL, 공개 요청, HTTP 404, HTML 오응답, 네트워크 오류, 취소를 검증한다. 실제 운영 서버 호출 및 브라우저 UI 시각 검증은 별도 확인이 필요하다.

2026-10-18 실행 결과:

| 검증 | 결과 |
| --- | --- |
| Front API 처리 테스트 | 4개 통과 |
| Front TypeScript 및 Vite 빌드 | 통과 |
| Front ESLint | 통과 |
| Back 전체 테스트 | 47개 통과, 실패·오류 0 |
| Back 프로젝트 테스트 | 위 47개 중 7개, Netlify CORS 허용·다른 Origin 거절 포함 |
| 두 저장소 `git diff --check` | 통과 |
| 운영 HTTPS API·MySQL·브라우저 화면 | 미검증 |

Back 변경 파일은 `src/test/java/com/cornerroom/back/controller/ProjectControllerTest.java`(CORS 회귀 검증)와 `docs/projects-api.md`(현재 JWT 구현 및 401/403 설명 정정)뿐이며 실행 코드·보안 설정은 변경하지 않았다. Front 추가 테스트는 `tests/project-api.test.mjs`, 설정 설명은 `.env.example`, 문서 진입 링크는 `README.md`에 추가했다.
