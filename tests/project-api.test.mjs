import test from 'node:test';
import assert from 'node:assert/strict';
import { apiBaseUrl, ApiError, bearerAuthHeader, getJson, projectImageUrl } from '../src/api/http.ts';
import { parseProjectDetail, parseProjectPage } from '../src/types/project.ts';

const summary = { projectId: 7, generation: 1, title: 'Corner', subtitle: null, banner: null, logo: null };

test('protected requests require the existing access token and produce one Bearer prefix', () => {
  assert.throws(() => bearerAuthHeader(null), /로그인/);
  assert.throws(() => bearerAuthHeader('  '), /로그인/);
  assert.deepEqual(bearerAuthHeader('test-token'), { Authorization: 'Bearer test-token' });
  assert.deepEqual(bearerAuthHeader('Bearer test-token'), { Authorization: 'Bearer test-token' });
});

test('DTO contract accepts nullable fields and empty data, rejects old hardcoded shape', () => {
  const page = { projects: [summary], page: 0, size: 12, totalElements: 1, totalPages: 1 };
  assert.deepEqual(parseProjectPage(page), page);
  assert.equal(parseProjectPage({ ...page, projects: [], totalElements: 0, totalPages: 0 }).projects.length, 0);
  assert.throws(() => parseProjectPage([{ id: 7, generation: '1기' }]));
  assert.throws(() => parseProjectPage({ ...page, projects: [{ ...summary, generation: '1기' }] }));
  const detail = { ...summary, description: 'Club project', stacks: ['React'], members: [{ name: 'Kim', role: 'Frontend' }] };
  assert.deepEqual(parseProjectDetail(detail), detail);
  assert.deepEqual(parseProjectDetail({ ...detail, members: [], stacks: [] }).members, []);
  assert.throws(() => parseProjectDetail({ ...detail, members: null }));
});

test('configuration requires an explicit URL and HTTPS in production', () => {
  assert.equal(apiBaseUrl('http://localhost:8080/', false), 'http://localhost:8080');
  assert.throws(() => apiBaseUrl(undefined, true));
  assert.throws(() => apiBaseUrl('http://localhost:8080', true));
  assert.throws(() => apiBaseUrl('https://user:password@example.invalid', true));
});

test('image paths resolve against the API, null and unsupported schemes stay absent', () => {
  assert.equal(projectImageUrl('/images/banner.png', 'https://example.invalid'), 'https://example.invalid/images/banner.png');
  assert.equal(projectImageUrl('https://cdn.example.invalid/a.png', 'https://example.invalid'), 'https://cdn.example.invalid/a.png');
  assert.equal(projectImageUrl(null, 'https://example.invalid'), undefined);
  assert.equal(projectImageUrl('javascript:alert(1)', 'https://example.invalid'), undefined);
});

test('public JSON fetch, HTTP errors, HTML redirects, network failures and cancellation', async (t) => {
  const signal = new AbortController().signal;
  const fetchMock = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://example.invalid/api/projects');
    assert.equal(options.headers.Authorization, undefined);
    return Response.json({ projects: [] });
  });
  assert.deepEqual(await getJson('https://example.invalid', '/api/projects', signal), { projects: [] });
  fetchMock.mock.mockImplementation(async () => new Response(null, { status: 404 }));
  await assert.rejects(getJson('https://example.invalid', '/api/projects', signal), (error) => error instanceof ApiError && error.status === 404);
  fetchMock.mock.mockImplementation(async () => new Response('<html/>', { headers: { 'content-type': 'text/html' } }));
  await assert.rejects(getJson('https://example.invalid', '/api/projects', signal), /JSON/);
  fetchMock.mock.mockImplementation(async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(getJson('https://example.invalid', '/api/projects', signal), /서버에 연결/);
  const cancelled = new AbortController();
  cancelled.abort();
  const abortError = new DOMException('Aborted', 'AbortError');
  fetchMock.mock.mockImplementation(async () => { throw abortError; });
  await assert.rejects(getJson('https://example.invalid', '/api/projects', cancelled.signal), (error) => error === abortError);
});
