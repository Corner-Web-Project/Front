import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

test('merged admin navigation and project form respect the same login role', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { AuthContext } = await vite.ssrLoadModule('/src/context/auth.ts');
    const { default: Nav } = await vite.ssrLoadModule('/src/components/Nav.tsx');
    const { default: Projectup } = await vite.ssrLoadModule('/src/page/Projectup.tsx');
    const { default: Admin } = await vite.ssrLoadModule('/src/page/Admin.tsx');
    const render = (Component, user) => renderToStaticMarkup(
      createElement(MemoryRouter, null,
        createElement(AuthContext.Provider, { value: { user, login() {}, logout() {} } },
          createElement(Component))),
    );
    const admin = { memberId: 7, id: '20260001', name: '운영진', role: 'ADMIN' };
    const nav = render(Nav, admin);
    assert.match(nav, /href="\/Projectup"/);
    assert.match(nav, /href="\/Admin"/);
    assert.match(render(Projectup, admin), /<form/);
    assert.match(render(Admin, admin), /회원 관리/);

    for (const user of [null, { ...admin, role: 'MEMBER' }]) {
      const nav = render(Nav, user);
      assert.doesNotMatch(nav, /href="\/(?:Projectup|Admin)"/);
      const project = render(Projectup, user);
      assert.doesNotMatch(project, /<form/);
      assert.match(project, /관리자 계정으로 로그인/);
      assert.match(render(Admin, user), /관리자만 접근/);
      assert.match(project, user ? /href="\/Project"/ : /href="\/SignIn"/);
    }
  } finally {
    await vite.close();
  }
});
