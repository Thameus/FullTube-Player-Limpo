# Changelog

Todas as mudanças relevantes deste projeto são registradas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [2.1.0] - 2026-11-12

### Adicionado

- Interface em português (Brasil) e inglês; o idioma acompanha o do navegador.
- Atalho do modo teatro configurável na página de atalhos do navegador
  (`chrome://extensions/shortcuts` ou `edge://extensions/shortcuts`). O padrão
  continua sendo `Alt+T`.
- Página de boas-vindas aberta uma única vez na instalação. É uma página local
  da extensão e não envia dados.
- Licença MIT (`LICENSE`).
- README em inglês (`README.en.md`), política de privacidade em inglês
  (`docs/privacy.en.html`) e ficha de loja bilíngue (`docs/LOJA-FICHA.md`).

### Alterado

- Novo nome de loja: "FullTube — Janela Limpa e Modo Teatro" (em inglês,
  "FullTube — Clean Video Window & Theater Mode"). A marca continua FullTube.
- Nova descrição da extensão.
- README, política de privacidade e guia de publicação reescritos.
- O pacote de publicação passa a incluir toda a pasta `extension/`
  (exceto `test-extension.js`).

## [2.0.0] - 2026-10-31

### Adicionado

- Primeira versão pública.
- Botão da extensão abre o player HTML5 da página em uma janela limpa de 960×600,
  mantendo o player e os controles oficiais do site.
- Restauração de tempo, volume, mudo e posição/tamanho da janela por site.
- Várias janelas independentes ao mesmo tempo.
- Modo teatro do YouTube na mesma aba com `Alt+T`; `Esc` restaura o layout.
- Suporte a YouTube, Twitch, Vimeo e páginas com vídeo HTML5.
- Política de privacidade.

[2.1.0]: https://github.com/Thameus/FullTube-Player-Limpo/releases/tag/v2.1.0
[2.0.0]: https://github.com/Thameus/FullTube-Player-Limpo/releases/tag/v2.0.0
