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
