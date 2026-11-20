import { loadEnv } from 'vite';
import { apiBaseUrl } from '../src/api/http.ts';

// Vite embeds this value at build time, including when dist is uploaded manually.
const env = loadEnv('production', process.cwd(), 'VITE_');
apiBaseUrl(env.VITE_API_BASE_URL, true);
console.log('운영 API 주소 검증 완료');
