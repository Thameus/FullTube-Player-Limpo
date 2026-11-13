# Política de privacidade — FullTube

**Última atualização:** 12/11/2026

Esta política também está disponível em inglês: [privacy.en.html](privacy.en.html).

## Finalidade

O FullTube — Janela Limpa e Modo Teatro é uma extensão para Chrome e Edge que
detecta um player HTML5 visível na página atual e abre a mesma página em uma
janela limpa. No YouTube, também oferece um modo teatro na própria aba.

## Dados acessados

Para executar essa finalidade, a extensão pode acessar a página ativa, o
elemento de vídeo HTML5 e o estado técnico da reprodução, como tempo atual,
volume, mudo e reprodução. Esse acesso acontece no seu navegador e serve apenas
para localizar o vídeo e aplicar o layout e o estado de reprodução.

A extensão pede permissão de acesso a sites `http` e `https` porque não é
possível saber de antemão em qual site você vai clicar no ícone. O acesso é usado somente para localizar o vídeo e aplicar tempo, volume e layout; nenhum outro conteúdo das páginas é lido, armazenado ou enviado.

A extensão também armazena localmente as dimensões e a posição da janela, por
site. Dados temporários usados para relacionar a aba de origem à janela ficam em
`storage.session` e são removidos quando deixam de ser necessários.

## Página de boas-vindas e idioma

Na primeira instalação, a extensão abre uma vez uma página de boas-vindas. Ela é
uma página local da própria extensão, não carrega conteúdo de servidores externos
e não envia dados. O idioma da interface (português ou inglês) segue o idioma do
navegador; essa escolha é feita localmente e nenhuma informação é enviada.

## O que não fazemos

- Não lemos, copiamos ou transmitimos cookies.
- Não acessamos senhas, tokens ou credenciais.
- Não extraímos URLs de mídia nem baixamos streams.
- Não usamos captura de aba nem captura de stream (tabCapture, captureStream).
- Não bloqueamos anúncios.
- Não enviamos dados para servidores próprios ou terceiros.
- Não usamos analytics, publicidade ou rastreamento.

## Compartilhamento e retenção

Nenhum dado é compartilhado com terceiros. As preferências de janela ficam no
armazenamento local do navegador e podem ser removidas desinstalando a extensão.
O estado temporário da sessão é descartado quando a sessão do navegador termina
ou quando a janela é fechada.

## Alterações

Se esta política mudar, a data acima será atualizada e o histórico ficará
disponível no repositório do projeto.

## Contato

Para dúvidas sobre esta política, abra uma solicitação no GitHub:
<https://github.com/Thameus/FullTube-Player-Limpo/issues>
