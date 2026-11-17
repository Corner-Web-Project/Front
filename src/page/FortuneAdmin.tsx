import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { createPhrase, deletePhrase, getPhrases, updatePhrase } from '../api/fortune';
import { ApiError } from '../api/http';
import { GRADES, PHRASE_TYPES, isGrade, phraseTypeLabel, type Grade, type Phrase, type PhraseInput } from '../types/fortune';

const PASSWORD_KEY = 'fortuneAdminPassword';
const CUSTOM = '__custom__';

const readPassword = () => {
  try {
    return sessionStorage.getItem(PASSWORD_KEY) ?? '';
  } catch {
    return '';
  }
};

const writePassword = (value: string) => {
  try {
    if (value) sessionStorage.setItem(PASSWORD_KEY, value);
    else sessionStorage.removeItem(PASSWORD_KEY);
  } catch {
    /* 저장 실패 시 이번 화면에서만 사용 */
  }
};

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : '요청에 실패했습니다.');

export default function FortuneAdmin() {
  const [password, setPassword] = useState(readPassword);

  const logout = () => {
    writePassword('');
    setPassword('');
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 text-[#2b1a12]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
      <div className="mb-8 flex items-end justify-between border-b-2 border-[#c8361d] pb-3">
        <div>
          <h1 className="text-2xl font-bold">오미쿠지 문구 관리</h1>
          <p className="mt-1 text-sm text-[#2b1a12]/60">총운 문구, 한마디 조각, 행운 요소 등을 추가·수정·삭제합니다.</p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link to="/Fortune" className="text-[#c8361d] underline-offset-2 hover:underline">
            운세 페이지
          </Link>
          {password && (
            <button type="button" onClick={logout} className="text-[#2b1a12]/60 hover:underline">
              잠금
            </button>
          )}
        </div>
      </div>
      {password ? <PhraseManager password={password} onUnauthorized={logout} /> : <Unlock onUnlock={setPassword} />}
    </div>
  );
}

function Unlock({ onUnlock }: { onUnlock: (password: string) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!value) return;
    setBusy(true);
    setError('');
    try {
      await getPhrases(value);
      writePassword(value);
      onUnlock(value);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-10 flex max-w-sm flex-col gap-3">
      <label htmlFor="fortune-admin-password" className="text-sm font-bold">
        관리자 비밀번호
      </label>
      <input
        id="fortune-admin-password"
        type="password"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="rounded border border-[#2b1a12]/25 bg-white px-3 py-2"
        autoComplete="current-password"
      />
      {error && <p className="text-sm text-[#c8361d]" role="alert">{error}</p>}
      <button type="submit" disabled={busy || !value} className="rounded bg-[#c8361d] py-2 font-bold text-white disabled:opacity-50">
        {busy ? '확인 중…' : '들어가기'}
      </button>
    </form>
  );
}

function PhraseManager({ password, onUnauthorized }: { password: string; onUnauthorized: () => void }) {
  const [phrases, setPhrases] = useState<Phrase[] | null>(null);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleError = useCallback(
    (caught: unknown) => {
      if (caught instanceof ApiError && caught.status === 401) onUnauthorized();
      else setError(errorMessage(caught));
    },
    [onUnauthorized],
  );

  const reload = useCallback(() => {
    setError('');
    getPhrases(password).then(setPhrases, handleError);
  }, [password, handleError]);

  useEffect(() => {
    let cancelled = false;
    getPhrases(password).then(
      (list) => !cancelled && setPhrases(list),
      (caught) => !cancelled && handleError(caught),
    );
    return () => {
      cancelled = true;
    };
  }, [password, handleError]);

  // DB에만 있는 새 종류도 필터에 나타나게
  const types = useMemo(() => {
    const known: string[] = PHRASE_TYPES.map((type) => type.code);
    const extra = [...new Set((phrases ?? []).map((p) => p.type))].filter((type) => !known.includes(type));
    return [...known, ...extra];
  }, [phrases]);

  const visible = (phrases ?? []).filter((phrase) => !filter || phrase.type === filter);

  const create = async (input: PhraseInput) => {
    try {
      const created = await createPhrase(password, input);
      setPhrases((list) => [...(list ?? []), created]);
      return true;
    } catch (caught) {
      handleError(caught);
      return false;
    }
  };

  const save = async (id: number, input: PhraseInput) => {
    try {
      const updated = await updatePhrase(password, id, input);
      setPhrases((list) => (list ?? []).map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
      return true;
    } catch (caught) {
      handleError(caught);
      return false;
    }
  };

  const remove = async (phrase: Phrase) => {
    if (!window.confirm(`"${phrase.content}" 문구를 삭제할까요?`)) return;
    try {
      await deletePhrase(password, phrase.id);
      setPhrases((list) => (list ?? []).filter((p) => p.id !== phrase.id));
    } catch (caught) {
      handleError(caught);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded border border-[#c9a24a] bg-[#fbf6e9] p-5">
        <h2 className="mb-3 font-bold">새 문구 추가</h2>
        <PhraseForm types={types} submitLabel="추가" onSubmit={create} />
      </section>

      {error && (
        <p className="rounded bg-[#c8361d]/10 px-3 py-2 text-sm text-[#9e2414]" role="alert">
          {error}{' '}
          <button type="button" onClick={reload} className="underline">
            다시 불러오기
          </button>
        </p>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">
            문구 목록 <span className="text-sm font-normal text-[#2b1a12]/60">{phrases ? `${visible.length}개` : ''}</span>
          </h2>
          <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded border border-[#2b1a12]/25 bg-white px-2 py-1 text-sm" aria-label="종류로 거르기">
            <option value="">전체 종류</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {phraseTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>

        {!phrases && !error && <p className="py-10 text-center text-sm text-[#2b1a12]/60">불러오는 중…</p>}
        {phrases && visible.length === 0 && <p className="py-10 text-center text-sm text-[#2b1a12]/60">문구가 없습니다.</p>}

        {visible.length > 0 && (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-[#2b1a12]/20 text-left">
                <th className="w-40 py-2 pr-2">종류</th>
                <th className="w-16 py-2 pr-2">등급</th>
                <th className="py-2 pr-2">내용</th>
                <th className="w-28 py-2 text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((phrase) =>
                editingId === phrase.id ? (
                  <tr key={phrase.id} className="border-b border-[#2b1a12]/10 bg-[#fbf6e9]">
                    <td colSpan={4} className="p-3">
                      <PhraseForm
                        types={types}
                        initial={phrase}
                        submitLabel="저장"
                        onSubmit={(input) => save(phrase.id, input)}
                        onCancel={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={phrase.id} className="border-b border-[#2b1a12]/10 align-top">
                    <td className="py-2 pr-2 text-[#2b1a12]/70">{phraseTypeLabel(phrase.type)}</td>
                    <td className="py-2 pr-2 font-bold text-[#c8361d]">{phrase.grade ?? ''}</td>
                    <td className="break-keep py-2 pr-2">{phrase.content}</td>
                    <td className="py-2 text-right">
                      <button type="button" onClick={() => setEditingId(phrase.id)} className="mr-3 text-[#014BAA] hover:underline">
                        수정
                      </button>
                      <button type="button" onClick={() => remove(phrase)} className="text-[#c8361d] hover:underline">
                        삭제
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

interface PhraseFormProps {
  types: string[];
  initial?: Phrase;
  submitLabel: string;
  onSubmit: (input: PhraseInput) => Promise<boolean>;
  onCancel?: () => void;
}

function PhraseForm({ types, initial, submitLabel, onSubmit, onCancel }: PhraseFormProps) {
  const [type, setType] = useState(initial?.type ?? 'SUMMARY');
  const [customType, setCustomType] = useState('');
  const [grade, setGrade] = useState<Grade>(initial?.grade ?? '대길');
  const [content, setContent] = useState(initial?.content ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const resolvedType = type === CUSTOM ? customType.trim().toUpperCase().replace(/\s+/g, '_') : type;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!resolvedType || !/^[A-Z][A-Z0-9_]*$/.test(resolvedType)) {
      setError('새 종류 코드는 영문 대문자·숫자·밑줄로 입력해주세요. (예: LUCKY_ANIMAL)');
      return;
    }
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    setError('');
    setBusy(true);
    const ok = await onSubmit({
      type: resolvedType,
      content: content.trim(),
      grade: resolvedType === 'SUMMARY' && isGrade(grade) ? grade : null,
    });
    setBusy(false);
    if (ok && !initial) setContent('');
  };

  return (
    <form onSubmit={submit} className="flex flex-wrap items-start gap-2">
      <select value={type} onChange={(event) => setType(event.target.value)} className="rounded border border-[#2b1a12]/25 bg-white px-2 py-2 text-sm" aria-label="종류">
        {types.map((code) => (
          <option key={code} value={code}>
            {phraseTypeLabel(code)}
          </option>
        ))}
        <option value={CUSTOM}>+ 새 종류…</option>
      </select>
      {type === CUSTOM && (
        <input
          value={customType}
          onChange={(event) => setCustomType(event.target.value)}
          placeholder="LUCKY_ANIMAL"
          className="w-36 rounded border border-[#2b1a12]/25 bg-white px-2 py-2 text-sm"
          aria-label="새 종류 코드"
        />
      )}
      {resolvedType === 'SUMMARY' && (
        <select value={grade} onChange={(event) => isGrade(event.target.value) && setGrade(event.target.value)} className="rounded border border-[#2b1a12]/25 bg-white px-2 py-2 text-sm" aria-label="등급">
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      )}
      <input
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="문구 내용"
        maxLength={200}
        className="min-w-[220px] flex-1 rounded border border-[#2b1a12]/25 bg-white px-3 py-2 text-sm"
        aria-label="내용"
      />
      <button type="submit" disabled={busy} className="rounded bg-[#c8361d] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
        {busy ? '저장 중…' : submitLabel}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} className="rounded border border-[#2b1a12]/25 px-4 py-2 text-sm">
          취소
        </button>
      )}
      {error && <p className="w-full text-sm text-[#c8361d]" role="alert">{error}</p>}
    </form>
  );
}
