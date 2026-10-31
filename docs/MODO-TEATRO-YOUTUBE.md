# Modo teatro do YouTube

## Comportamento

O modo teatro é um recurso opcional da extensão. Ele mantém o usuário na aba
original do YouTube, esconde o layout ao redor do vídeo e amplia o player para
ocupar a janela.

- `Alt+T`: entra ou sai do modo teatro;
- `Esc`: sai do modo teatro e restaura o layout normal;
- nenhum botão ou controle adicional fica sobre o vídeo;
- o atalho também aparece no texto do ícone da extensão e nesta documentação;
- o modo não usa a Fullscreen API e não abre uma nova janela;
- os controles nativos do YouTube continuam disponíveis.

## Implementação

O recurso está em `extension/player-mode.js` e é instalado apenas em páginas do
YouTube fora do popup. A classe `multi-tube-theater-active` controla o layout.
Ao sair, dois eventos `resize` são emitidos para que o YouTube recalcule o
player responsivo original.

O vídeo usa `object-fit: contain`, preservando a proporção e evitando cortes.
Podem aparecer barras pretas quando a proporção da janela for diferente da do
vídeo.

## Como testar

1. Recarregue `extension/` em `chrome://extensions` ou `edge://extensions`.
2. Abra um vídeo comum no YouTube.
3. Pressione `Alt+T` e confirme que o restante da página desaparece.
4. Pressione `Esc` e confirme que o player e o layout retornam ao tamanho normal.

Esse recurso é separado do popup aberto pelo clique no ícone da extensão.
