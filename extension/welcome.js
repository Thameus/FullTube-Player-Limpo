'use strict';

const t = key => chrome.i18n.getMessage(key);
document.documentElement.lang = chrome.i18n.getUILanguage();
document.title = t('welcomePageTitle');
document.querySelectorAll('[data-i18n]').forEach(element => {
  element.textContent = t(element.dataset.i18n);
});
document.querySelectorAll('button[data-copy]').forEach(button => {
  const label = button.textContent;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = t('welcomeCopied');
      setTimeout(() => { button.textContent = label; }, 1500);
    } catch (_) { /* clipboard unavailable: the text stays selectable */ }
  });
});
