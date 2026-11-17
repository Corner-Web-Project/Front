// 오미쿠지 운세 API 계약 (docs/fortune-api.md 참고)

export const GRADES = ['대길', '중길', '소길', '길', '말길', '흉'] as const;
export type Grade = (typeof GRADES)[number];

export interface LuckyItems {
  color: string;
  item: string;
  food: string;
  place: string;
  time: string;
  direction: string;
  keyword: string;
  number: number;
}

export interface FortuneResult {
  id: string;
  name: string;
  /** 한국 시간 기준 뽑은 날짜 (YYYY-MM-DD) */
  date: string;
  grade: Grade;
  /** 막대에 적히는 번호 */
  stickNumber: number;
  summary: string;
  message: string;
  lucky: LuckyItems;
  caution: string;
  mission: string;
  /** 그날 같은 등급을 뽑은 사람 중 몇 번째인지 */
  gradeRank: number;
  drawnAt: string;
}

export interface FortuneStats {
  total: number;
  byGrade: Record<Grade, number>;
}

export interface FortuneStatsResponse {
  date: string;
  today: FortuneStats;
  cumulative: FortuneStats;
}

/** 문구 종류. 새 종류는 문자열만 추가하면 되도록 string을 허용한다. */
export const PHRASE_TYPES = [
  { code: 'SUMMARY', label: '총운 문구' },
  { code: 'MESSAGE_SITUATION', label: '한마디 조각 1 (상황)' },
  { code: 'MESSAGE_ACTION', label: '한마디 조각 2 (행동)' },
  { code: 'MESSAGE_RESULT', label: '한마디 조각 3 (결과)' },
  { code: 'LUCKY_COLOR', label: '행운의 색' },
  { code: 'LUCKY_ITEM', label: '행운의 아이템' },
  { code: 'LUCKY_FOOD', label: '행운의 음식' },
  { code: 'LUCKY_PLACE', label: '행운의 장소' },
  { code: 'LUCKY_TIME', label: '행운의 시간' },
  { code: 'LUCKY_DIRECTION', label: '행운의 방향' },
  { code: 'LUCKY_KEYWORD', label: '행운의 키워드' },
  { code: 'CAUTION', label: '조심할 것' },
  { code: 'MISSION', label: '오늘의 미션' },
] as const;

export type PhraseType = string;

export interface Phrase {
  id: number;
  type: PhraseType;
  content: string;
  /** 총운 문구(SUMMARY)만 사용 */
  grade: Grade | null;
}

export type PhraseInput = Omit<Phrase, 'id'>;

export const phraseTypeLabel = (type: string) =>
  PHRASE_TYPES.find((item) => item.code === type)?.label ?? type;

export const isGrade = (value: unknown): value is Grade =>
  typeof value === 'string' && (GRADES as readonly string[]).includes(value);
