import { useEffect, useState } from 'react';

export function useApiQuery<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    load: typeof load;
    attempt: number;
    data?: T;
    error?: Error;
  }>();

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => load(controller.signal)).then(
      (data) => {
        if (!controller.signal.aborted) setResult({ load, attempt, data });
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({ load, attempt, error: error instanceof Error ? error : new Error('조회 중 오류가 발생했습니다.') });
        }
      },
    );
    return () => controller.abort();
  }, [load, attempt]);

  const current = result?.load === load && result.attempt === attempt ? result : undefined;
  return { data: current?.data, error: current?.error, loading: !current, retry: () => setAttempt((value) => value + 1) };
}
