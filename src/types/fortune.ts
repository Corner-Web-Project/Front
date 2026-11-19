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

/** 문구 종류 코드 (SUMMARY, MESSAGE_SITUATION, LUCKY_COLOR 등). 새 종류를 추가할 수 있도록 string */
export type PhraseType = string;

export interface Phrase {
  id: number;
  type: PhraseType;
  content: string;
  /** 총운 문구(SUMMARY)만 사용 */
  grade: Grade | null;
}
