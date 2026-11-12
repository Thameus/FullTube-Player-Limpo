'use strict';

const DEFAULT_BOUNDS = { width: 960, height: 600 };
const boundsKey = host => `multiTubeBounds:${host}`;
const popupKey = tabId => `multiTubePopup:${tabId}`;

function popupUrl(url, player) {
  const target = new URL(url);
  target.searchParams.set('multiTubePopup', '1');
  target.searchParams.set('multiTubeTime', String(Math.max(0, player.currentTime || 0)));
  target.searchParams.set('multiTubeAutoplay', player.autoplay ? '1' : '0');
  target.searchParams.set('multiTubeMuted', player.muted ? '1' : '0');
  target.searchParams.set('multiTubeVolume', String(player.volume ?? 1));
  return target.href;
}

function openMessageWindow(text) {
  const url = `${chrome.runtime.getURL('error.html')}?message=${encodeURIComponent(text)}`;
  chrome.windows.create({ url, type: 'popup', width: 420, height: 180, focused: true });
}

async function injectDetector(tabId) {
  try { await chrome.scripting.executeScript({ target: { tabId }, files: ['player-mode.js'] }); }
  catch (_) { /* activeTab cannot access special pages */ }
}

// activeTab grants the source tab, not a newly-created generic popup. The
// all_urls host permission plus this explicit injection covers that popup.
async function injectPopupMode(tabId) {
  try { await chrome.scripting.executeScript({ target: { tabId }, files: ['player-mode.js'] }); }
  catch (_) { /* no popup-ready means the source is deliberately not paused */ }
}

async function detect(tab) {
  if (!tab?.id || !tab.url || /^(chrome|edge|about|devtools|chrome-extension|view-source|file):/i.test(tab.url)) {
    throw new Error(chrome.i18n.getMessage('errTabNotAllowed'));
  }
  await injectDetector(tab.id);
  try { return await chrome.tabs.sendMessage(tab.id, { type: 'detect-player' }); }
  catch (_) { throw new Error(chrome.i18n.getMessage('errPageInaccessible')); }
}

chrome.action.onClicked.addListener(async tab => {
  try {
    const result = await detect(tab);
    if (!result?.ok || !result.player) throw new Error(result?.error || chrome.i18n.getMessage('errNoPlayer'));
    const player = result.player;
    const host = new URL(tab.url).hostname;
    const saved = await chrome.storage.local.get(boundsKey(host));
    const bounds = saved[boundsKey(host)] || DEFAULT_BOUNDS;
    const created = await chrome.windows.create({
      url: popupUrl(tab.url, player), type: 'popup', focused: true,
      width: bounds.width, height: bounds.height,
      ...(Number.isFinite(bounds.left) ? { left: bounds.left } : {}),
      ...(Number.isFinite(bounds.top) ? { top: bounds.top } : {})
    });
    const popupTabId = created?.tabs?.[0]?.id;
    if (!popupTabId) throw new Error(chrome.i18n.getMessage('errPopupNotPrepared'));
    await chrome.storage.session?.set({ [popupKey(popupTabId)]: {
      host, sourceTabId: tab.id, popupTabId, windowId: created.id,
      index: player.index, ready: false
    } });
    await injectPopupMode(popupTabId);
  } catch (error) {
    openMessageWindow(error instanceof Error ? error.message : chrome.i18n.getMessage('errOpenFailed'));
  }
});

chrome.commands.onCommand.addListener(async command => {
  if (command !== 'toggle-theater') return;
  try {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab?.id) await chrome.tabs.sendMessage(tab.id, { type: 'toggle-theater' });
  } catch (_) { /* no content script on this tab: theater mode is YouTube-only */ }
});

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url || !tab.url.includes('multiTubePopup=1')) return;
  const data = await chrome.storage.session?.get(popupKey(tabId));
  if (data?.[popupKey(tabId)]) await injectPopupMode(tabId);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'popup-ready' || !sender.tab?.id) return false;
  (async () => {
    const key = popupKey(sender.tab.id);
    const data = await chrome.storage.session?.get(key);
    const popup = data?.[key];
    if (!popup) return { ok: false };
    if (!popup.ready) {
      try { await chrome.tabs.sendMessage(popup.sourceTabId, { type: 'pause-source', index: popup.index }); }
      catch (_) { /* source may have navigated */ }
      await chrome.storage.session?.set({ [key]: { ...popup, ready: true } });
    }
    return { ok: true };
  })().then(sendResponse).catch(() => sendResponse({ ok: false }));
  return true;
});

chrome.tabs.onRemoved.addListener(async tabId => {
  await chrome.storage.session?.remove(popupKey(tabId));
});

chrome.windows.onBoundsChanged.addListener(async window => {
  if (window.type !== 'popup' || !window.id) return;
  const all = await chrome.storage.session?.get(null);
  const entry = Object.entries(all || {}).find(([key, value]) => key.startsWith('multiTubePopup:') && value?.windowId === window.id);
  const host = entry?.[1]?.host;
  if (host) await chrome.storage.local.set({ [boundsKey(host)]: { left: window.left, top: window.top, width: window.width, height: window.height } });
});

chrome.windows.onRemoved.addListener(async windowId => {
  const all = await chrome.storage.session?.get(null);
  const entries = Object.entries(all || {}).filter(([key, value]) => key.startsWith('multiTubePopup:') && value?.windowId === windowId);
  for (const [key] of entries) {
    await chrome.storage.session?.remove(key);
  }
});
