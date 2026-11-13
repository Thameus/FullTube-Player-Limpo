# Ficha da loja — FullTube 2.1.0

Textos prontos para copiar e colar no Microsoft Edge Add-ons (Partner Center) e na Chrome Web Store (Developer Dashboard). Cada idioma está inteiro na sua própria língua. O passo a passo de envio está em [`PUBLICAR-CHROME.md`](PUBLICAR-CHROME.md).

Limites usados: descrição curta até 132 caracteres; termos de busca do Edge, no máximo 7, até 30 caracteres cada.

## Dados comuns

| Campo | Valor |
|---|---|
| Versão | 2.1.0 |
| Idioma padrão | Português (Brasil); adicionar Inglês como segundo idioma |
| Site / página inicial | https://fulltube.thameus.com.br (confirme que o domínio abre antes de enviar; enquanto o DNS não estiver ativo, use https://fulltube-site.vercel.app) |
| Suporte | https://github.com/Thameus/FullTube-Player-Limpo/issues |
| Política de privacidade | https://thameus.github.io/FullTube-Player-Limpo/privacy.html (inglês: https://thameus.github.io/FullTube-Player-Limpo/privacy.en.html) |
| Código-fonte | https://github.com/Thameus/FullTube-Player-Limpo |
| Ícone da loja | `extension/icons/icon128.png` |
| Categoria | Produtividade (Productivity) |

**Por que Produtividade:** a extensão serve para assistir a vídeos enquanto se faz outra coisa (janela separada, várias janelas, menos distração); não é um player de mídia nem um app de entretenimento.

## Ordem das imagens

Envie nesta ordem (a primeira é a que aparece em destaque). Use a pasta do idioma correspondente.

| # | Português (`store-assets/screenshots/pt-BR/`) | Inglês (`store-assets/screenshots/en/`) |
|---|---|---|
| 1 | `01-janela-limpa.png` | `01-janela-limpa.png` |
| 2 | `02-um-clique.png` | `02-um-clique.png` |
| 3 | `03-modo-teatro.png` | `03-modo-teatro.png` |
| 4 | `04-multitarefa.png` | `04-multitarefa.png` |
| 5 | `05-privacidade.png` | `05-privacidade.png` |

Imagens promocionais:

- Tile pequeno (440×280): `store-assets/promo/small-440x280.png`
- Marquee (1400×560): `store-assets/promo/marquee-1400x560.png`
- Imagem de destaque do repositório (não é enviada às lojas): `store-assets/hero.png`

Vídeo de demonstração (25 s, sem áudio): `store-assets/video/fulltube-demo-pt.mp4` e `store-assets/video/fulltube-demo-en.mp4`. As lojas aceitam vídeo apenas por link do YouTube: envie o MP4 para o YouTube e cole o link no campo de vídeo da ficha de cada idioma.

As imagens e o vídeo são ilustrações geradas para o projeto, sem capturas nem marcas de terceiros.

---

# Português (Brasil)

## Nome

```
FullTube — Janela Limpa e Modo Teatro
```

## Descrição curta (126 caracteres)

```
Assista só ao vídeo: abra o player numa janela limpa ou use o modo teatro do YouTube (Alt+T). Sem baixar vídeos, sem rastreio.
```

## Descrição longa

```
Assista a vídeos sem o resto da página: um clique abre o player em uma janela limpa, e no YouTube o modo teatro ocupa a aba inteira.

Clique no ícone da extensão e o player HTML5 da página abre em uma janela de 960×600, sem menus, comentários ou recomendações. Você continua usando o player e os controles oficiais do site, e pode redimensionar, mover e deixar a janela ao lado do que estiver fazendo.

PRINCIPAIS RECURSOS
• Janela limpa com um clique: o player da página, sem distração.
• Player e controles oficiais: o vídeo é tocado pela própria página, não por um player substituto.
• Lembra de onde você parou: restaura tempo, volume, mudo e posição e tamanho da janela, por site.
• Multitarefa: abra várias janelas ao mesmo tempo, cada uma com seu vídeo.
• Modo teatro (modo cinema) no YouTube: amplia o player na mesma aba, escondendo o restante da página.
• Interface em português e inglês, conforme o idioma do navegador.

SITES COMPATÍVEIS
YouTube, Twitch, Vimeo e qualquer página com vídeo HTML5.

ATALHOS
• Alt+T (YouTube): liga ou desliga o modo teatro. Dá para trocar o atalho em chrome://extensions/shortcuts ou edge://extensions/shortcuts.
• Esc (YouTube, em modo teatro): restaura o layout normal.
• Na janela limpa: Espaço reproduz ou pausa, F ativa a tela cheia, M liga ou desliga o som.

PRIVACIDADE
O FullTube não coleta nem envia dados. Não baixa vídeos, não extrai streams, não lê cookies e não bloqueia anúncios. A posição e o tamanho da janela ficam salvos apenas no seu navegador.

Sobre as permissões: a extensão pede acesso a sites http e https porque, ao clicar no ícone, precisa preparar o player na janela nova em qualquer site em que você esteja, e isso não é possível saber antes. O acesso é usado somente para localizar o vídeo e aplicar tempo, volume e layout; nenhum outro conteúdo das páginas é lido, armazenado ou enviado. O código é aberto: https://github.com/Thameus/FullTube-Player-Limpo

O FullTube é um projeto independente e não é afiliado, associado ou endossado pelo YouTube, pelo Google, pela Twitch, pelo Vimeo ou pela Microsoft.
```

## Termos de busca (Edge, máx. 7)

```
janela limpa de vídeo
player em janela
modo teatro
modo cinema
assistir sem distração
multitarefa
vídeo em outra janela
```

---

# English

## Name

```
FullTube — Clean Video Window & Theater Mode
```

## Short description (120 characters)

```
Watch just the video: pop the player into a clean window or use YouTube theater mode (Alt+T). No downloads, no tracking.
```

## Long description

```
Watch videos without the rest of the page: one click pops the player into a clean window, and on YouTube theater mode fills the whole tab.

Click the extension icon and the page's HTML5 player opens in a 960×600 window with no menus, comments or recommendations. You keep using the site's official player and controls, and you can resize, move and keep the window next to whatever you are doing.

KEY FEATURES
• A clean window in one click: the page's player, distraction-free.
• Official player and controls: the video is played by the site's own page, not by a replacement player.
• Picks up where you left off: restores time, volume, mute state and window position and size, per site.
• Multitasking: open several windows at once, each with its own video.
• Theater mode (cinema mode) on YouTube: enlarges the player in the same tab and hides the rest of the page.
• Interface in English and Portuguese, following your browser language.

SUPPORTED SITES
YouTube, Twitch, Vimeo and any page with an HTML5 video.

SHORTCUTS
• Alt+T (YouTube): turns theater mode on or off. You can change the shortcut at chrome://extensions/shortcuts or edge://extensions/shortcuts.
• Esc (YouTube, in theater mode): restores the normal layout.
• In the clean window: Space plays or pauses, F toggles fullscreen, M mutes or unmutes.

PRIVACY
FullTube does not collect or send any data. It does not download videos, extract streams, read cookies or block ads. Window position and size are saved only in your browser.

About permissions: the extension asks for access to http and https sites because, when you click the icon, it has to prepare the player in the new window on whatever site you are on, and that cannot be known in advance. The access is used only to find the video and apply time, volume and layout; no other page content is read, stored or sent. The code is open source: https://github.com/Thameus/FullTube-Player-Limpo

FullTube is an independent project and is not affiliated with, associated with or endorsed by YouTube, Google, Twitch, Vimeo or Microsoft.
```

## Search terms (Edge, max 7)

```
clean video window
video in separate window
theater mode
cinema mode
distraction-free video
video multitasking
pop-out video player
```

---

# Declarações de revisão (Chrome Web Store e Edge)

Mantenha em inglês nos campos que a loja pedir em inglês; abaixo, o texto em ambos os idiomas.

## Finalidade única / Single purpose

- pt: Abrir o player de vídeo HTML5 da página atual em uma janela limpa e, no YouTube, oferecer um modo teatro na mesma aba, para assistir a vídeos com menos distração.
- en: Open the current page's HTML5 video player in a clean window and, on YouTube, offer a theater mode in the same tab, so people can watch videos with fewer distractions.

## Justificativa das permissões / Permission justifications

**activeTab**
- pt: Acessar a aba em que o usuário clicou no ícone da extensão, para localizar o player HTML5 e ler o tempo, o volume e o estado de mudo antes de abrir a janela.
- en: Access the tab where the user clicked the extension icon, to find the HTML5 player and read its time, volume and mute state before opening the window.

**scripting**
- pt: Injetar o script do modo player na página de origem e na janela nova, para localizar o vídeo, aplicar o layout limpo e restaurar tempo, volume e mudo.
- en: Inject the player-mode script into the source page and the new window, to find the video, apply the clean layout and restore time, volume and mute state.

**storage**
- pt: Guardar localmente a posição e o tamanho da janela por site e dados temporários (storage.session) que ligam a aba de origem à janela.
- en: Store window position and size per site locally, and temporary data (storage.session) linking the source tab to the window.

**windows**
- pt: Criar a janela limpa de 960×600 e restaurar sua posição e seu tamanho.
- en: Create the 960×600 clean window and restore its position and size.

**Permissões de host / Host permissions (`http://*/*`, `https://*/*`)**
- pt: O usuário pode clicar no ícone em qualquer site com vídeo HTML5, e o site não é conhecido de antemão. A janela nova carrega a mesma página e precisa que o script seja injetado nela para encontrar o player e aplicar o layout limpo. O acesso é usado somente para isso; nenhum conteúdo de página é lido para outra finalidade, armazenado ou enviado. O script de modo teatro e de adaptação roda automaticamente apenas em www.youtube.com, www.twitch.tv e vimeo.com.
- en: Users can click the icon on any site with an HTML5 video, and the site is not known in advance. The new window loads the same page and needs the script injected to find the player and apply the clean layout. The access is used only for this; no page content is read for any other purpose, stored or sent. The theater-mode and adapter script runs automatically only on www.youtube.com, www.twitch.tv and vimeo.com.

**Código remoto / Remote code**
- pt: Não. Todo o código está no pacote da extensão.
- en: No. All code is in the extension package.

## Uso de dados / Data use (Chrome Web Store, aba Privacidade)

Recomendação: não marcar nenhuma categoria de dados coletados. A extensão acessa a página e o estado do vídeo apenas no navegador, para executar a função, e não coleta, armazena para fora nem transmite esses dados. (Confira o texto atual do formulário antes de enviar; se a loja tratar o acesso local como "coleta", marque apenas "Conteúdo do site" e mantenha as três certificações.)

Certificações a marcar:

- Não vendo nem transfiro dados de usuários a terceiros, fora dos casos de uso aprovados.
- Não uso nem transfiro dados de usuários para finalidades não relacionadas à função única do item.
- Não uso nem transfiro dados de usuários para determinar crédito ou para fins de empréstimo.

Edge Add-ons: informe que a extensão não coleta dados pessoais e informe a URL da política de privacidade.

## Instruções para o revisor / Reviewer test instructions

```
No account or login is needed.

1. Open a page with an HTML5 video, for example a public video on vimeo.com
   or a plain HTML page with a <video> element.
2. Click the FullTube toolbar icon.
3. A clean 960x600 popup window opens with the same video. The source tab is
   paused only after the popup finds the player.
4. Click the icon again on the source tab: a second independent window opens.
5. Theater mode: open a regular video on youtube.com, press Alt+T. The player
   fills the tab without opening a new window. Press Esc to restore the layout.
6. The theater shortcut can be changed at chrome://extensions/shortcuts
   (edge://extensions/shortcuts on Edge).
7. On a page without a video, or on a browser-internal page, the extension
   shows a friendly error and does nothing else.

The extension makes no network requests of its own and has no remote code.
The source code is at https://github.com/Thameus/FullTube-Player-Limpo
```

Versão em português (opcional, para quem preferir):

```
Não é preciso conta nem login.

1. Abra uma página com vídeo HTML5, por exemplo um vídeo público no vimeo.com
   ou uma página HTML simples com um elemento <video>.
2. Clique no ícone do FullTube na barra de ferramentas.
3. Abre uma janela limpa de 960x600 com o mesmo vídeo. A aba de origem só é
   pausada depois que a janela encontra o player.
4. Clique no ícone de novo na aba de origem: abre uma segunda janela independente.
5. Modo teatro: abra um vídeo comum no youtube.com e pressione Alt+T. O player
   ocupa a aba, sem abrir janela nova. Pressione Esc para restaurar o layout.
6. O atalho do modo teatro pode ser trocado em chrome://extensions/shortcuts
   (edge://extensions/shortcuts no Edge).
7. Em uma página sem vídeo ou em uma página interna do navegador, a extensão
   mostra uma mensagem de erro amigável e não faz mais nada.
```

## Links

- Site: https://fulltube.thameus.com.br
- Suporte: https://github.com/Thameus/FullTube-Player-Limpo/issues
- Política de privacidade: https://thameus.github.io/FullTube-Player-Limpo/privacy.html (inglês: https://thameus.github.io/FullTube-Player-Limpo/privacy.en.html)
