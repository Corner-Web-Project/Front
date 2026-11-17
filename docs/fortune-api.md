# 오미쿠지 운세 — 프론트가 기대하는 백엔드 API

프론트 구현: `src/page/Fortune.tsx`, `src/api/fortune.ts`
화면 경로: `/Fortune`, `/Fortune/result/:id`(공유 링크)

> 문구 관리자 페이지는 사이트 전체 관리자와 상의한 뒤 정하기로 해서 이번 프론트에서 제외했다.

백엔드 없이 화면을 확인하려면 `.env.local`에 `VITE_FORTUNE_MOCK=true`를 넣고 Vite를 재시작한다.
mock 모드는 브라우저 localStorage에 기록한다.

## 공통

- 기본 주소는 기존과 같이 `VITE_API_BASE_URL`을 쓴다.
- 요청·응답은 JSON이다. 오류는 HTTP 상태 코드로 구분한다. 프론트는 404(결과 없음)를 따로 처리한다.
- 등급 값은 한글 문자열 `대길 | 중길 | 소길 | 길 | 말길 | 흉`이다.

## 1. 뽑기 — `POST /api/fortunes`

요청: `{ "name": "홍길동" }` (앞뒤 공백 제거, 1~20자. 비어 있으면 400)

서버 처리:

1. 시드는 `이름 + "|" + 한국 날짜(Asia/Seoul, YYYY-MM-DD)`로 만든다. 같은 이름이면 같은 날 항상 같은 결과가 나온다.
2. 등급은 DB의 weight 비율로 뽑는다. 기본값은 대길 8, 중길 20, 소길 27, 길 22, 말길 13, 흉 10이다.
3. 총운은 해당 등급의 `SUMMARY` 문구 중 하나를 고른다.
4. 한마디는 `MESSAGE_SITUATION`, `MESSAGE_ACTION`, `MESSAGE_RESULT`에서 하나씩 골라 공백으로 잇는다.
5. 행운 요소, 조심할 것, 미션도 각 종류에서 하나씩 고른다. 행운의 숫자는 1~99이고, 막대 번호(`stickNumber`)는 1~100이다.
6. 결과를 뽑기 기록에 저장하고 고유 ID를 발급한다. 추측하기 어려운 문자열을 권장한다.
7. `gradeRank`는 오늘 같은 등급을 뽑은 기록 수이며, 이번 기록을 포함한다.

> 문구 목록이 바뀌어도 같은 날 결과가 흔들리지 않게 하려면, 문구를 고를 때 ID 순으로 정렬한 목록을 쓴다.
> 참고용 난수 구현(FNV-1a + mulberry32, 가중치 뽑기)은 `src/utils/fortuneSeed.ts`에 있다.

응답 `200`:

```json
{
  "id": "a1b2c3d4e5f6",
  "name": "홍길동",
  "date": "2026-11-17",
  "grade": "대길",
  "stickNumber": 26,
  "summary": "하늘이 돕는 날. 바라던 일이 술술 풀립니다.",
  "message": "점심을 먹고 나서 먼저 인사를 건네면 기분 좋은 소식을 듣게 돼요.",
  "lucky": {
    "color": "주홍", "item": "손수건", "food": "떡볶이", "place": "편의점",
    "time": "오전 9시", "direction": "동쪽", "keyword": "정리", "number": 49
  },
  "caution": "급한 결정",
  "mission": "책상 정리하기",
  "gradeRank": 13,
  "drawnAt": "2026-11-17T12:34:56Z"
}
```

## 2. 결과 조회(공유 링크) — `GET /api/fortunes/{id}`

뽑기와 같은 형식으로 응답한다. 결과가 없으면 `404`를 보내며, 프론트는 이때 "찾을 수 없어요"와 "나도 뽑아보기"를 보여준다.

## 3. 통계 — `GET /api/fortunes/stats`

오늘과 누적 통계를 한 번에 응답한다. "오늘"은 한국 날짜 기준이다. 뽑힌 적 없는 등급도 0으로 포함한다.

```json
{
  "date": "2026-11-17",
  "today":      { "total": 42,   "byGrade": { "대길": 3,  "중길": 9,   "소길": 12,  "길": 10,  "말길": 5,   "흉": 3 } },
  "cumulative": { "total": 1234, "byGrade": { "대길": 98, "중길": 250, "소길": 330, "길": 270, "말길": 160, "흉": 126 } }
}
```

## 4. 문구 데이터

문구와 행운 요소는 DB 문구 테이블에 "종류" 칸으로 구분해 저장한다. 관리 방식(관리자 화면, API)은 추후 결정한다.

문구 종류 코드:

| 구분 | 코드 |
| --- | --- |
| 총운 | `SUMMARY` |
| 한마디 조각 | `MESSAGE_SITUATION`, `MESSAGE_ACTION`, `MESSAGE_RESULT` |
| 행운 요소 | `LUCKY_COLOR`, `LUCKY_ITEM`, `LUCKY_FOOD`, `LUCKY_PLACE`, `LUCKY_TIME`, `LUCKY_DIRECTION`, `LUCKY_KEYWORD` |
| 기타 | `CAUTION`, `MISSION` |

새 종류(예: `LUCKY_ANIMAL`)는 테이블 구조를 바꾸지 않고 행만 추가하면 된다.
다만 운세 종이에 표시하려면 응답 필드와 `FortunePaper.tsx`에 칸을 추가해야 한다.

## 기본 데이터

서버를 처음 실행할 때 등급 6개(weight 포함)와 종류별 기본 문구를 넣는다.
예시 문구는 `src/api/fortuneMock.ts`의 `DEFAULT_SUMMARIES`, `DEFAULT_PHRASES`를 그대로 써도 된다.
