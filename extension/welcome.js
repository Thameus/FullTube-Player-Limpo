'use strict';

const t = key => chrome.i18n.getMessage(key);
document.documentElement.lang = chrome.i18n.getUILanguage();
document.title = t('welcomePageTitle');
document.querySelectorAll('[data-i18n]').forEach(element => {
  element.textContent = t(element.dataset.i18n);
});
const copyStatus = document.getElementById('copy-status');
document.querySelectorAll('button[data-copy]').forEach(button => {
  const label = button.textContent;
  // Distinct accessible name per button, built from the address it copies.
  button.setAttribute('aria-label', chrome.i18n.getMessage('welcomeCopyAria', [button.dataset.copy]));
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = t('welcomeCopied');
      // Clear first so repeated copies are announced again by role="status".
      if (copyStatus) {
        copyStatus.textContent = '';
        setTimeout(() => { copyStatus.textContent = t('welcomeCopied'); }, 100);
      }
      setTimeout(() => { button.textContent = label; }, 1500);
    } catch (_) { /* clipboard unavailable: the text stays selectable */ }
  });
});
