import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

test('project creation sends JWT, JSON DTO and multipart images, and reports failures', async (t) => {
  process.env.VITE_API_BASE_URL = 'http://localhost:8080';
  let token = 'local-test-token';
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => token } });
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createProject, uploadProjectImage } = await vite.ssrLoadModule('/src/api/projects.ts');
    const body = { generation: 3, title: '카드 테스트', subtitle: null, description: '설명', banner: null, logo: null,
      stacks: ['React'], members: [{ name: 'Kim', role: 'Frontend' }] };
    const fetchMock = t.mock.method(globalThis, 'fetch', async (url, options) => {
      assert.equal(url, 'http://localhost:8080/api/projects');
      assert.equal(options.method, 'POST');
      assert.equal(options.headers.Authorization, 'Bearer local-test-token');
      assert.equal(options.headers['Content-Type'], 'application/json');
      assert.deepEqual(JSON.parse(options.body), body);
      return Response.json({ ...body, projectId: 9 }, { status: 201 });
    });
    assert.equal((await createProject(body)).projectId, 9);
    token = null;
    await assert.rejects(createProject(body), /로그인/);
    assert.equal(fetchMock.mock.callCount(), 1);
    token = 'local-test-token';
    for (const [status, message] of [[401, /로그인/], [403, /관리자/], [400, /입력값/], [500, /실패/]]) {
      fetchMock.mock.mockImplementation(async () => new Response(null, { status }));
      await assert.rejects(createProject(body), message);
    }
    fetchMock.mock.mockImplementation(async () => { throw new TypeError('offline'); });
    await assert.rejects(createProject(body), /서버에 연결/);
    fetchMock.mock.mockImplementation(async (url, options) => {
      assert.equal(url, 'http://localhost:8080/api/projects/images');
      assert.equal(options.headers.Authorization, 'Bearer local-test-token');
      assert.equal(options.headers['Content-Type'], undefined);
      assert.ok(options.body instanceof FormData);
      assert.equal(options.body.get('file').name, 'logo.png');
      return Response.json({ url: '/api/projects/images/test.png' }, { status: 201 });
    });
    assert.equal(await uploadProjectImage(new File(['png'], 'logo.png', { type: 'image/png' })), '/api/projects/images/test.png');
    await assert.rejects(uploadProjectImage(new File(['svg'], 'logo.svg', { type: 'image/svg+xml' })), /PNG/);
    await assert.rejects(uploadProjectImage(new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })), /5MB/);
  } finally {
    await vite.close();
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else delete globalThis.localStorage;
    delete process.env.VITE_API_BASE_URL;
  }
});
