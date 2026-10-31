# Publicar o FullTube — Player Limpo na Chrome Web Store

## Ficha sugerida da loja

**Nome:** FullTube — Player Limpo

**Descrição curta:**

> Abra vídeos em uma janela limpa ou use o modo teatro do YouTube na mesma aba,
> sem baixar ou extrair vídeos.

**Descrição detalhada:**

> O FullTube — Player Limpo reduz a distração ao assistir vídeos na web.
> Clique no ícone da extensão para abrir o player HTML5 ativo em uma janela
> independente, com tamanho e posição restaurados por site.
>
> No YouTube, pressione `Alt+T` para ativar o modo teatro na própria aba:
> menus, comentários e recomendações ficam ocultos, enquanto o player ocupa a
> janela. Pressione `Esc` para restaurar o layout original.
>
> O vídeo continua sendo reproduzido pelo player oficial do site. A extensão
> não baixa, não extrai streams, não acessa cookies, não bloqueia anúncios e
> não usa iframes para substituir o player original.
>
> **Principais recursos**
> - janela limpa de 960×600 para o player ativo;
> - suporte a YouTube, Twitch, Vimeo e páginas com vídeo HTML5;
> - restauração de tempo, volume, mudo, autoplay e tamanho da janela;
> - múltiplas janelas independentes;
> - modo teatro do YouTube com `Alt+T` e saída por `Esc`.

**Categoria sugerida:** Produtividade

**Identidade visual:** ícone roxo com player vermelho inspirado no YouTube e
contraste branco. Os arquivos oficiais são `extension/icons/icon16.png`,
`icon48.png` e `icon128.png`.

**Texto de uma screenshot:**

> Assista só ao player, sem o restante da página.

**Texto de uma segunda screenshot:**

> Modo teatro no YouTube: `Alt+T` para ampliar, `Esc` para restaurar.

## Antes do envio

1. Publique `docs/privacy.html` no GitHub Pages e use a URL pública HTTPS na
   ficha da loja.
2. Teste a pasta `extension/` em `chrome://extensions` usando **Load unpacked**.
3. Teste YouTube, Twitch, Vimeo, uma página HTML5 genérica, múltiplas janelas e
   uma página sem acesso ao conteúdo.
4. Confirme que a versão do `manifest.json` é maior que qualquer versão já
   publicada.

## Criar o pacote

O ZIP deve conter os arquivos da pasta `extension/` diretamente na raiz. O
`manifest.json` não pode ficar dentro de uma subpasta.

Exemplo no PowerShell, executado na raiz do projeto:

```powershell
$stage = Join-Path $env:TEMP 'fulltube-package'
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Path (Join-Path $stage 'icons') -Force | Out-Null
Copy-Item .\extension\manifest.json,.\extension\service-worker.js,.\extension\player-mode.js,.\extension\error.html,.\extension\error.js -Destination $stage
Copy-Item .\extension\icons\icon16.png,.\extension\icons\icon48.png,.\extension\icons\icon128.png -Destination (Join-Path $stage 'icons')
$out = Join-Path $PWD 'fulltube-chrome-2.0.0.zip'
if (Test-Path $out) { Remove-Item $out }
Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $out
Remove-Item $stage -Recurse -Force
```

O arquivo de teste `test-extension.js` fica fora do pacote de produção.

Não inclua `node_modules`, credenciais, arquivos pessoais ou o diretório
inteiro do projeto.

## Enviar

1. Abra <https://chrome.google.com/webstore/devconsole>.
2. Registre a conta de desenvolvedor, aceite os termos e pague a taxa única
   solicitada pelo Google.
3. Selecione **Add new item** e envie o ZIP.
4. Preencha a ficha, incluindo descrição, categoria, screenshots e ícone.
5. Na seção de privacidade, informe a finalidade única, justifique as
   permissões, declare que não há código remoto e informe a política de
   privacidade pública.
6. Declare os dados acessados de forma consistente com a política deste projeto.
7. Adicione instruções de teste para o revisor:

   - abrir uma página com um vídeo HTML5;
   - clicar no ícone FullTube;
   - confirmar a janela popup de 960×600;
   - repetir o clique para confirmar múltiplas janelas;
   - confirmar que a origem só pausa depois que o popup encontra o player.

   Para testar o modo teatro do YouTube, abrir um vídeo normal, pressionar
   `Alt+T`, confirmar que o player amplia sem trocar de aba e pressionar `Esc`
   para confirmar a restauração.

8. Selecione **Submit for Review**. O envio e a revisão acontecem no painel;
   este projeto não executa upload automaticamente.

## Justificativas das permissões

- `activeTab`: detectar o player HTML5 na página que o usuário escolheu ao
  clicar na ação.
- `scripting`: injetar o mesmo modo de player na página de origem e no popup.
- `storage`: guardar bounds da janela e estado temporário da relação origem/
  popup.
- `windows`: criar a janela popup e restaurar seu tamanho e posição.
- `http://*/*` e `https://*/*`: permitir que o popup real seja preparado em
  qualquer site HTTP ou HTTPS que o usuário abrir explicitamente.

## Referências oficiais

- <https://developer.chrome.com/docs/webstore/prepare>
- <https://developer.chrome.com/docs/webstore/publish>
- <https://developer.chrome.com/docs/webstore/cws-dashboard-privacy>
