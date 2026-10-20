import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { chromium, expect, type Page } from '@playwright/test';
import { createPocApp } from '../server/app.ts';
import { db } from '../server/firebase.ts';
import { resetTestFixtures } from './helpers.ts';

test('three isolated browser contexts: proposal, approval, shared update and revocation', { timeout: 60_000 }, async () => {
  await resetTestFixtures();
  const server = createPocApp().listen(3100, '127.0.0.1'); await once(server, 'listening');
  const browser = await chromium.launch({ headless: true, args: ['--disable-background-networking'] });
  const blocked: string[] = [];
  try {
    const pages: Page[] = [];
    for (const role of ['operatore', 'lettore', 'amministratore']) {
      const context = await browser.newContext();
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.hostname === '127.0.0.1' && ['3100', '9099'].includes(url.port)) return route.continue();
        blocked.push(url.origin); return route.abort('blockedbyclient');
      });
      const page = await context.newPage(); pages.push(page);
      await page.goto('http://127.0.0.1:3100');
      await page.getByLabel('Account demo').selectOption(`${role}@example.invalid`);
      await page.getByRole('button', { name: 'Accedi all’emulatore' }).click();
      await expect(page.getByText(`demo-${role === 'operatore' ? 'operator' : role === 'lettore' ? 'reader' : 'admin'}`, { exact: true })).toBeVisible();
    }
    const [operator, reader, admin] = pages;
    assert.equal(await reader.getByRole('button', { name: 'Proponi modifica' }).count(), 0);
    const article = operator.locator('article').filter({ hasText: 'Sportello Alfa' });
    const description = 'Aggiornamento interamente fittizio da browser indipendenti';
    await article.getByLabel('Nuova descrizione fittizia').fill(description);
    await article.getByRole('button', { name: 'Proponi modifica' }).click();
    await expect(admin.getByRole('button', { name: 'Approva', exact: true })).toBeVisible({ timeout: 12_000 });
    await expect(reader.locator('article').filter({ hasText: 'Sportello Alfa' }).getByRole('heading')).toContainText('versione 1');
    await admin.getByRole('button', { name: 'Approva', exact: true }).click();
    for (const page of [operator, reader]) {
      const result = page.locator('article').filter({ hasText: 'Sportello Alfa' });
      await expect(result.getByRole('heading')).toContainText('versione 2', { timeout: 12_000 });
      await expect(result.getByRole('paragraph').filter({ hasText: description })).toBeVisible();
    }
    const member = admin.locator('section').filter({ has: admin.getByRole('heading', { name: 'Abilitazioni demo' }) })
      .locator('p').filter({ hasText: 'demo-operator' });
    await member.getByRole('button', { name: 'Revoca', exact: true }).click();
    await expect(operator.getByRole('status')).toContainText('403', { timeout: 12_000 });
    await expect(operator.getByRole('button', { name: 'Accedi all’emulatore' })).toBeVisible();
    assert.deepEqual(blocked, [], 'Browser attempted a non-local request');
  } finally {
    await browser.close(); await new Promise<void>(resolve => server.close(() => resolve())); await db.terminate();
  }
});
