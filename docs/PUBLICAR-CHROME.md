# Publicar o FullTube 2.1.0 (Edge Add-ons e Chrome Web Store)

Nome nas lojas: **FullTube — Janela Limpa e Modo Teatro** (en: *FullTube — Clean Video Window & Theater Mode*).

Todos os textos da ficha (nome, descrições curtas e longas, termos de busca, categoria, finalidade única, justificativas de permissão, declarações de dados, instruções para o revisor, ordem dos screenshots e links) estão em [`LOJA-FICHA.md`](LOJA-FICHA.md). Não copie textos para este arquivo; atualize só a ficha.

O envio às lojas é manual, feito pelo dono da conta. Este projeto não faz upload automático.

## Antes do envio

1. Confirme que `docs/privacy.html` e `docs/privacy.en.html` estão publicados no GitHub Pages
   (`https://thameus.github.io/FullTube-Player-Limpo/privacy.html`).
2. Confirme que a versão do `extension/manifest.json` é `2.1.0` e maior que qualquer versão já publicada.
3. Rode a validação do `AGENTS.md`: JSON do manifesto, `node --check` nos scripts alterados e
   `node extension/test-extension.js`.
4. Teste a pasta `extension/` em `chrome://extensions` e `edge://extensions` com **Load unpacked**:
   YouTube, Twitch, Vimeo, uma página HTML5 genérica, várias janelas, uma página sem player,
   o atalho do modo teatro (`Alt+T`, `Esc`), a troca do atalho em `chrome://extensions/shortcuts`,
   a página de boas-vindas na primeira instalação e a interface nos dois idiomas do navegador.
5. Confira que as imagens de `store-assets/` existem (lista em `LOJA-FICHA.md`).

## Criar o pacote

O ZIP leva a pasta `extension/` inteira, de forma recursiva (incluindo `_locales/`, `icons/` e as
páginas de boas-vindas), **exceto** `test-extension.js`. O `manifest.json` precisa ficar na raiz do ZIP.

Executar no PowerShell, na raiz do projeto:

```powershell
$src   = Join-Path $PWD 'extension'
$stage = Join-Path $env:TEMP 'fulltube-package'
$out   = Join-Path $PWD 'fulltube-chrome-2.1.0.zip'

if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Path $stage | Out-Null

# copia tudo, mantendo a estrutura de pastas, menos o arquivo de teste
Get-ChildItem $src -Recurse -File |
  Where-Object { $_.Name -ne 'test-extension.js' } |
  ForEach-Object {
    $rel  = $_.FullName.Substring($src.Length + 1)
    $dest = Join-Path $stage $rel
    New-Item -ItemType Directory -Path (Split-Path $dest) -Force | Out-Null
    Copy-Item $_.FullName $dest
  }

# o tar do Windows grava caminhos com "/" no ZIP (use o do System32, não o do Git Bash)
$tar = Join-Path $env:SystemRoot 'System32\tar.exe'
if (Test-Path $out) { Remove-Item $out }
& $tar -a -cf $out -C $stage (Get-ChildItem $stage -Name)
Remove-Item $stage -Recurse -Force

# conferência: manifest.json na raiz e sem test-extension.js
& $tar -tf $out
```

Confira na listagem final que `manifest.json` aparece sem pasta na frente, que `_locales/` e os
arquivos `welcome.*` estão presentes e que `test-extension.js` não está.

Não inclua `node_modules`, credenciais, arquivos pessoais nem o diretório inteiro do projeto.
Os ZIPs antigos na raiz (`fulltube-chrome-2.0.0.zip`, `multi-tube-chrome-2.0.0.zip`) não devem ser enviados.

## Atualizar no Microsoft Edge Add-ons (Partner Center)

A extensão já está publicada: <https://microsoftedge.microsoft.com/addons/detail/fulltube-%E2%80%94-player-limpo/ilmcdpbkajdddfgghlbehldmaigfhkig>

1. Abra o [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview) e entre em **FullTube**.
2. Em **Pacotes** (Packages), envie `fulltube-chrome-2.1.0.zip` como nova versão.
3. Em **Listagem** (Store listings), adicione o idioma Inglês e atualize o português, usando `LOJA-FICHA.md`:
   nome, descrição curta, descrição longa, termos de busca, screenshots e imagens promocionais.
4. Em **Propriedades** (Properties), confira a categoria e a URL da política de privacidade.
5. Em **Notas para certificação**, cole as instruções para o revisor.
6. Envie para publicação (**Publish**) e acompanhe a certificação.

## Primeiro envio na Chrome Web Store

1. Abra o [Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Se ainda não tiver conta de desenvolvedor, registre-se, aceite os termos e pague a taxa única cobrada pelo Google.
3. Selecione **Add new item** e envie `fulltube-chrome-2.1.0.zip`.
4. Aba **Store listing**: cole os textos de `LOJA-FICHA.md` (português como idioma padrão, inglês como
   segundo idioma), escolha a categoria, envie o ícone, os screenshots na ordem indicada e as imagens promocionais.
5. Aba **Privacy**: finalidade única, justificativas de cada permissão, declaração de código remoto,
   declaração de uso de dados e URL da política de privacidade, todos conforme `LOJA-FICHA.md`.
6. Aba **Distribution**: defina visibilidade e regiões.
7. Aba **Test instructions**: cole as instruções para o revisor.
8. Selecione **Submit for review**. Para as permissões de host amplas, a revisão pode demorar mais; a
   justificativa está em `LOJA-FICHA.md`.

## Depois de publicar

- [ ] Atualizar a ficha "em breve" da Chrome Web Store no `README.md`, no `README.en.md` e no site (repositório FullTube-Site) com o link real.
- [ ] Pedir avaliação aos primeiros usuários (sem oferecer troca, brinde ou pressão).
- [ ] Atualizar o "About" do repositório no GitHub (descrição, site `https://fulltube.thameus.com.br` e tópicos).
- [ ] Criar o release no GitHub: tag `v2.1.0`, título "FullTube 2.1.0", notas copiadas do `CHANGELOG.md`, ZIP anexado.
- [ ] Conferir se a página da política de privacidade abre nas duas línguas.
- [ ] Registrar qualquer decisão nova em `docs/ai/DECISIONS.md`.

## Referências oficiais

- <https://developer.chrome.com/docs/webstore/prepare>
- <https://developer.chrome.com/docs/webstore/publish>
- <https://developer.chrome.com/docs/webstore/cws-dashboard-privacy>
- <https://learn.microsoft.com/microsoft-edge/extensions-chromium/publish/publish-extension>
