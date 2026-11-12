'use strict';

const t = key => chrome.i18n.getMessage(key);
const params = new URLSearchParams(location.search);
document.documentElement.lang = chrome.i18n.getUILanguage();
document.title = t('errorPageTitle');
document.getElementById('message').textContent = params.get('message') || t('errorDefaultMessage');
const close = document.getElementById('close');
close.textContent = t('errorCloseButton');
close.addEventListener('click', () => window.close());
