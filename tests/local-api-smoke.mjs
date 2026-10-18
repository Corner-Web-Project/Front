// Opt-in check against a disposable local H2 backend. Never run against an operating database.
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createServer } from 'vite';

if (!process.env.SMOKE_API_BASE_URL) throw new Error('Set SMOKE_API_BASE_URL to a disposable local H2 backend.');
const backend = new URL(process.env.SMOKE_API_BASE_URL);
if (backend.protocol !== 'http:' || !['localhost', '127.0.0.1'].includes(backend.hostname)) {
  throw new Error('This smoke check only accepts a local HTTP backend.');
}
process.env.VITE_API_BASE_URL = backend.origin;
const storage = new Map();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
} });
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { getProjects, getProject } = await vite.ssrLoadModule('/src/api/projects.ts');
  const { createMember, createToken, getMyMember } = await vite.ssrLoadModule('/src/api/member.ts');
  const { createPost, getPost } = await vite.ssrLoadModule('/src/api/post.ts');
  const signal = new AbortController().signal;
  const projects = await getProjects(1, 0, signal);
  assert.ok(Array.isArray(projects.projects));
  await assert.rejects(getProject('2147483647', signal), (error) => error.status === 404);
  await assert.rejects(createPost({ category: '질문', title: 'Smoke', content: 'Local integration check' }), /로그인/);

  const studentId = `smoke${Date.now()}`;
  const password = randomBytes(24).toString('base64url');
  const member = await createMember({ studentId, password, name: 'Local Smoke', email: `${studentId}@example.invalid` });
  const accessToken = await createToken({ studentId, password });
  const me = await getMyMember(accessToken);
  assert.equal(me.memberId, member.memberId);
  assert.equal(me.studentId, studentId);
  storage.set('accessToken', accessToken);
  const postId = await createPost({ category: '질문', title: 'Smoke', content: 'Local integration check' });
  const post = await getPost(postId);
  assert.equal(post.author, 'Local Smoke');
  assert.equal(post.title, 'Smoke');

  const submitted = await fetch(`${backend.origin}/api/join-applications`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://cornerroom.netlify.app' },
    body: JSON.stringify({ name: 'Local Smoke', studentId, major: 'Computer Science', phone: '010-0000-0000', motivation: 'Local integration check', portfolioUrl: null, comment: 'Test fixture' }),
  });
  assert.equal(submitted.status, 201);
  assert.equal(submitted.headers.get('access-control-allow-origin'), 'https://cornerroom.netlify.app');
  assert.equal((await submitted.json()).status, 'PENDING');
  const preflight = await fetch(`${backend.origin}/api/people/1`, { method: 'OPTIONS', headers: {
    Origin: 'https://cornerroom.netlify.app', 'Access-Control-Request-Method': 'PATCH', 'Access-Control-Request-Headers': 'Authorization, Content-Type',
  } });
  assert.equal(preflight.status, 200);
  const forbidden = await fetch(`${backend.origin}/api/projects`, { method: 'POST', headers: {
    Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
  }, body: JSON.stringify({ generation: 1, title: 'Smoke', description: 'Must not be created' }) });
  assert.equal(forbidden.status, 403);
  console.log('PASS: frontend API modules -> local Spring Boot; project list/404, sign-up/login/me, JWT post creation/read, join submission, Netlify PATCH preflight and ADMIN enforcement.');
} finally {
  storage.clear();
  await vite.close();
}
