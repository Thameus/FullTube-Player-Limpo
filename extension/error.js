'use strict';

const params = new URLSearchParams(location.search);
document.getElementById('message').textContent = params.get('message') || 'Não foi possível abrir o player.';
document.getElementById('close').addEventListener('click', () => window.close());
