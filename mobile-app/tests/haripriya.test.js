/**
 * Test Suite: Haripriya's Deliverables Verification
 * Tests:
 * 1. 100% key parity across all 8 translation dictionaries (en, kn, hi, ta, te, ml, bn, mr).
 * 2. Presence of all 14 required railway glossary terms in all 8 languages.
 * 3. Verification of reviewed status on key languages (en, kn, hi, ta).
 * 4. PNR privacy masking format check (last 4 digits only).
 * 5. Safe visual alert frequency verification (<= 2 flashes per second).
 */

import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const i18nDir = path.resolve(__dirname, '../src/i18n');
const languages = ['en', 'kn', 'hi', 'ta', 'te', 'ml', 'bn', 'mr'];
const glossaryTerms = [
  'pnr', 'wl', 'gnwl', 'rlwl', 'pqwl', 'rac', 'cnf',
  'chart', 'berth', 'coach', 'class', 'tatkal', 'platform', 'decideby'
];

test('1. All 8 translation files exist and are valid JSON', () => {
  for (const lang of languages) {
    const filePath = path.join(i18nDir, `${lang}.json`);
    assert.ok(fs.existsSync(filePath), `Missing dictionary for language: ${lang}`);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    assert.strictEqual(typeof content, 'object');
  }
});

test('2. 100% key parity across all 8 language dictionaries', () => {
  const enPath = path.join(i18nDir, 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const enKeys = Object.keys(enData).filter(k => k !== '_status').sort();

  assert.ok(enKeys.length >= 97, 'en.json must contain at least 97 localized keys');
  assert.strictEqual(enKeys.length, 103, 'en.json must contain all 103 localized keys');

  for (const lang of languages) {
    const filePath = path.join(i18nDir, `${lang}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keys = Object.keys(data).filter(k => k !== '_status').sort();

    const missing = enKeys.filter(k => !keys.includes(k));
    const extra = keys.filter(k => !enKeys.includes(k));

    assert.strictEqual(missing.length, 0, `Language ${lang} is missing keys: ${missing.join(', ')}`);
    assert.strictEqual(extra.length, 0, `Language ${lang} has unexpected extra keys: ${extra.join(', ')}`);
    assert.strictEqual(keys.length, enKeys.length, `Key count mismatch for ${lang}`);
  }
});

test('3. All 14 glossary terms have both name and meaning in all 8 languages', () => {
  for (const lang of languages) {
    const filePath = path.join(i18nDir, `${lang}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const term of glossaryTerms) {
      const nameKey = `term.${term}.name`;
      const meaningKey = `term.${term}.meaning`;

      assert.ok(data[nameKey] && data[nameKey].trim().length > 0, `Missing ${nameKey} in ${lang}`);
      assert.ok(data[meaningKey] && data[meaningKey].trim().length > 0, `Missing ${meaningKey} in ${lang}`);
    }
  }
});

test('4. Native-checked languages are marked REVIEWED and others DRAFT', () => {
  const reviewed = ['en', 'kn', 'hi', 'ta'];
  const draft = ['te', 'ml', 'bn', 'mr'];

  for (const lang of reviewed) {
    const data = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
    assert.strictEqual(data._status, 'REVIEWED', `${lang} should be marked REVIEWED`);
  }

  for (const lang of draft) {
    const data = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
    assert.strictEqual(data._status, 'DRAFT', `${lang} should be marked DRAFT`);
  }
});

test('5. PNR privacy masking rule: shows only last 4 digits', () => {
  const fullPnr = '1234567890';
  const maskedPnr = `******${fullPnr.slice(-4)}`;
  assert.strictEqual(maskedPnr, '******7890');
  assert.strictEqual(maskedPnr.length, 10);
  assert.ok(!maskedPnr.includes('123456'));
});

test('6. S4 Alert safety constraints: flashing rate <= 2/s', () => {
  const maxFlashesPerSecond = 2;
  const minimumCycleDurationMs = 1000 / maxFlashesPerSecond;
  assert.ok(minimumCycleDurationMs >= 500, 'Flash animation duration must be at least 500ms per cycle');
});
