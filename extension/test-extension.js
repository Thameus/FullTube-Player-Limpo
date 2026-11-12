'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.background.service_worker, 'service-worker.js');
assert.deepEqual(manifest.permissions.sort(), ['activeTab', 'scripting', 'storage', 'windows']);
assert.deepEqual(manifest.host_permissions.sort(), ['http://*/*', 'https://*/*']);
assert.deepEqual(manifest.icons, {
  '16': 'icons/icon16.png',
  '48': 'icons/icon48.png',
  '128': 'icons/icon128.png'
});
for (const file of ['error.html', 'error.js', 'player-mode.js', 'service-worker.js']) {
  assert.equal(fs.existsSync(path.join(root, file)), true, `${file} must exist`);
}
for (const file of ['icons/icon16.png', 'icons/icon48.png', 'icons/icon128.png']) {
  assert.equal(fs.existsSync(path.join(root, file)), true, `${file} must exist`);
}
for (const file of ['choice.html', 'choice.js']) {
  assert.equal(fs.existsSync(path.join(root, file)), false, `${file} must be removed`);
}
assert.equal(fs.existsSync(path.join(root, 'dashboard.html')), false);
const worker = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
const player = fs.readFileSync(path.join(root, 'player-mode.js'), 'utf8');
assert.match(worker, /chrome\.windows\.create\(\{[\s\S]*type: 'popup'/);
assert.match(worker, /width: bounds\.width/);
assert.match(worker, /popup-ready/);
assert.doesNotMatch(worker, /choice|pending|pip/i);
assert.doesNotMatch(player, /picture.?in.?picture|requestPictureInPicture|pip/i);
assert.doesNotMatch(player, /show-pip-fallback|clear-pip-fallback/);
console.log('extension manifest/static tests: ok');

// ---- i18n, command, welcome ----
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const pt = readJson('_locales/pt_BR/messages.json');
const en = readJson('_locales/en/messages.json');
assert.equal(manifest.default_locale, 'pt_BR');
assert.deepEqual(Object.keys(pt).sort(), Object.keys(en).sort(), 'locale key sets must match');
for (const locale of [pt, en]) {
  for (const [key, value] of Object.entries(locale)) {
    assert.equal(typeof value.message, 'string', `${key} needs a message`);
    assert.ok(value.message.length > 0, `${key} must not be empty`);
  }
  assert.ok(locale.extDescription.message.length <= 132, 'description must be <= 132 chars');
  assert.ok(locale.extName.message.length <= 75, 'name must be <= 75 chars');
}
const used = new Set();
const manifestText = fs.readFileSync(path.join(root, 'manifest.json'), 'utf8');
for (const m of manifestText.matchAll(/__MSG_(\w+)__/g)) used.add(m[1]);
for (const file of ['service-worker.js', 'player-mode.js', 'error.js', 'welcome.js']) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const m of text.matchAll(/getMessage\(\s*'(\w+)'/g)) used.add(m[1]);
}
for (const file of ['welcome.html', 'error.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  for (const m of html.matchAll(/data-i18n="(\w+)"/g)) used.add(m[1]);
  for (const m of html.matchAll(/<script\b([^>]*)>/gi)) {
    assert.match(m[1], /\bsrc="[^"]+"/, `${file} must not contain inline scripts`);
  }
  assert.doesNotMatch(html, /\son\w+\s*=/i, `${file} must not use inline event handlers`);
}
// error.js and welcome.js resolve their keys through a local helper t('key').
for (const file of ['error.js', 'welcome.js']) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const m of text.matchAll(/\bt\(\s*'(\w+)'/g)) used.add(m[1]);
}
assert.ok(used.size > 0);
for (const key of used) {
  assert.ok(key in pt, `pt_BR missing key ${key}`);
  assert.ok(key in en, `en missing key ${key}`);
}
assert.equal(manifest.version, '2.1.0');
assert.equal(manifest.homepage_url, 'https://fulltube.thameus.com.br');
assert.equal(manifest.commands['toggle-theater'].suggested_key.default, 'Alt+T');
assert.match(manifest.commands['toggle-theater'].description, /^__MSG_\w+__$/);
for (const file of ['welcome.html', 'welcome.js', 'welcome.css']) {
  assert.equal(fs.existsSync(path.join(root, file)), true, `${file} must exist`);
}
assert.doesNotMatch(fs.readFileSync(path.join(root, 'welcome.html'), 'utf8'), /<style\b|\sstyle=/i, 'welcome.html must not use inline styles');
assert.match(worker, /commands\.onCommand/);
assert.match(worker, /reason === 'install'/);
assert.match(player, /toggle-theater/);
console.log('extension i18n/welcome tests: ok');
