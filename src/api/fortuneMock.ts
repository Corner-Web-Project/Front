// 백엔드 없이 화면을 확인하기 위한 mock (VITE_FORTUNE_MOCK=true).
// 실제 서비스에서는 서버가 같은 규칙(이름 + 한국 날짜 시드)으로 뽑는다.
import { GRADES, type FortuneResult, type FortuneStats, type FortuneStatsResponse, type Grade, type Phrase, type PhraseInput } from '../types/fortune';
import { ApiError } from './http';
import { kstDate, pickWeighted, seededRandom } from '../utils/fortuneSeed';

const MOCK_ADMIN_PASSWORD = 'admin';
const KEY = { results: 'fortuneMock.results', phrases: 'fortuneMock.phrases' };

export const GRADE_WEIGHTS: Record<Grade, number> = { 대길: 8, 중길: 20, 소길: 27, 길: 22, 말길: 13, 흉: 10 };

const DEFAULT_PHRASES: Record<string, string[]> = {
  MESSAGE_SITUATION: ['점심을 먹고 나서', '아침 햇살이 들 때', '퇴근길 버스 안에서', '오후 세 시쯤', '잠들기 전'],
  MESSAGE_ACTION: ['먼저 인사를 건네면', '창문을 활짝 열면', '미뤄둔 일을 하나 끝내면', '좋아하는 노래를 들으면', '물 한 잔을 마시면'],
  MESSAGE_RESULT: ['기분 좋은 소식을 듣게 돼요.', '뜻밖의 도움을 받게 돼요.', '마음이 한결 가벼워져요.', '작은 행운이 따라와요.', '좋은 생각이 떠올라요.'],
  LUCKY_COLOR: ['주홍', '연두', '하늘색', '금색', '쪽빛', '미색'],
  LUCKY_ITEM: ['손수건', '볼펜', '열쇠고리', '이어폰', '머리끈', '수첩'],
  LUCKY_FOOD: ['떡볶이', '유자차', '김밥', '단팥빵', '귤', '우동'],
  LUCKY_PLACE: ['도서관', '공원 벤치', '편의점', '창가 자리', '계단', '카페'],
  LUCKY_TIME: ['오전 9시', '정오', '오후 3시', '해 질 녘', '밤 10시'],
  LUCKY_DIRECTION: ['동쪽', '서쪽', '남쪽', '북쪽', '남동쪽', '북서쪽'],
  LUCKY_KEYWORD: ['시작', '여유', '인연', '집중', '용기', '정리'],
  CAUTION: ['급한 결정', '늦잠', '과식', '말실수', '분실물', '과한 지출'],
  MISSION: ['오랜 친구에게 안부 묻기', '책상 정리하기', '10분 산책하기', '감사한 일 세 가지 적기', '물 여덟 잔 마시기'],
};
const DEFAULT_SUMMARIES: Record<Grade, string[]> = {
  대길: ['하늘이 돕는 날. 바라던 일이 술술 풀립니다.', '모든 문이 활짝 열려 있어요. 망설이지 말고 나아가세요.'],
  중길: ['노력한 만큼 보답이 돌아오는 날입니다.', '주변의 도움으로 큰 걸음을 내딛게 됩니다.'],
  소길: ['작지만 확실한 기쁨이 찾아옵니다.', '평소처럼 지내면 소소한 행운이 함께해요.'],
  길: ['순탄한 하루. 차분히 하면 좋은 결과가 있어요.', '꾸준함이 빛을 보는 날입니다.'],
  말길: ['처음엔 더디지만 끝은 좋습니다.', '서두르지 않으면 늦게라도 복이 옵니다.'],
  흉: ['오늘은 몸을 낮추고 조심히. 액땜하면 내일은 좋아져요.', '작은 실수가 생길 수 있으니 한 번 더 확인하세요.'],
};

function defaultPhrases(): Phrase[] {
  const list: Phrase[] = [];
  for (const grade of GRADES) {
    for (const content of DEFAULT_SUMMARIES[grade]) list.push({ id: list.length + 1, type: 'SUMMARY', content, grade });
  }
  for (const [type, contents] of Object.entries(DEFAULT_PHRASES)) {
    for (const content of contents) list.push({ id: list.length + 1, type, content, grade: null });
  }
  return list;
}

const pick = (random: () => number, list: string[]) => (list.length ? list[Math.floor(random() * list.length)] : '—');

// ---- localStorage 저장소 ----

function load<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* 저장소를 쓸 수 없으면 기본값 사용 */
  }
  return fallback();
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 무시 */
  }
}

const delay = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 250));

export async function drawFortune(rawName: string): Promise<FortuneResult> {
  const name = rawName.trim();
  if (!name) throw new ApiError(400, '이름을 입력해주세요.');
  const date = kstDate();
  const random = seededRandom(`${name}|${date}`);
  const phrases = load(KEY.phrases, defaultPhrases);
  const ofType = (type: string) => phrases.filter((p) => p.type === type).map((p) => p.content);

  const grade = pickWeighted(random, GRADE_WEIGHTS);
  const results = load<FortuneResult[]>(KEY.results, () => []);
  const gradeRank = results.filter((r) => r.date === date && r.grade === grade).length + 1;

  const result: FortuneResult = {
    id: crypto.randomUUID().replace(/-/g, '').slice(0, 12),
    name,
    date,
    grade,
    stickNumber: Math.floor(random() * 100) + 1,
    summary: pick(random, phrases.filter((p) => p.type === 'SUMMARY' && p.grade === grade).map((p) => p.content)),
    message: [pick(random, ofType('MESSAGE_SITUATION')), pick(random, ofType('MESSAGE_ACTION')), pick(random, ofType('MESSAGE_RESULT'))].join(' '),
    lucky: {
      color: pick(random, ofType('LUCKY_COLOR')),
      item: pick(random, ofType('LUCKY_ITEM')),
      food: pick(random, ofType('LUCKY_FOOD')),
      place: pick(random, ofType('LUCKY_PLACE')),
      time: pick(random, ofType('LUCKY_TIME')),
      direction: pick(random, ofType('LUCKY_DIRECTION')),
      keyword: pick(random, ofType('LUCKY_KEYWORD')),
      number: Math.floor(random() * 99) + 1,
    },
    caution: pick(random, ofType('CAUTION')),
    mission: pick(random, ofType('MISSION')),
    gradeRank,
    drawnAt: new Date().toISOString(),
  };
  save(KEY.results, [...results, result]);
  return delay(result);
}

export async function getFortune(id: string): Promise<FortuneResult | null> {
  return delay(load<FortuneResult[]>(KEY.results, () => []).find((r) => r.id === id) ?? null);
}

function countStats(results: FortuneResult[]): FortuneStats {
  const byGrade = Object.fromEntries(GRADES.map((g) => [g, 0])) as Record<Grade, number>;
  for (const r of results) byGrade[r.grade] += 1;
  return { total: results.length, byGrade };
}

export async function getFortuneStats(): Promise<FortuneStatsResponse> {
  const results = load<FortuneResult[]>(KEY.results, () => []);
  const date = kstDate();
  return delay({ date, today: countStats(results.filter((r) => r.date === date)), cumulative: countStats(results) });
}

function checkPassword(password: string) {
  if (password !== MOCK_ADMIN_PASSWORD) throw new ApiError(401, '관리자 비밀번호가 올바르지 않습니다.');
}

export async function getPhrases(password: string, type?: string): Promise<Phrase[]> {
  checkPassword(password);
  const phrases = load(KEY.phrases, defaultPhrases);
  return delay(type ? phrases.filter((p) => p.type === type) : phrases);
}

export async function createPhrase(password: string, input: PhraseInput): Promise<Phrase> {
  checkPassword(password);
  const phrases = load(KEY.phrases, defaultPhrases);
  const phrase = { ...input, id: Math.max(0, ...phrases.map((p) => p.id)) + 1 };
  save(KEY.phrases, [...phrases, phrase]);
  return delay(phrase);
}

export async function updatePhrase(password: string, id: number, input: PhraseInput): Promise<Phrase> {
  checkPassword(password);
  const phrases = load(KEY.phrases, defaultPhrases);
  if (!phrases.some((p) => p.id === id)) throw new ApiError(404, '문구를 찾을 수 없습니다.');
  const phrase = { ...input, id };
  save(KEY.phrases, phrases.map((p) => (p.id === id ? phrase : p)));
  return delay(phrase);
}

export async function deletePhrase(password: string, id: number): Promise<void> {
  checkPassword(password);
  save(KEY.phrases, load(KEY.phrases, defaultPhrases).filter((p) => p.id !== id));
  await delay(undefined);
}
