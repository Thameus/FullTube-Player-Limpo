# multi-tube — Regras do projeto

## Especificação atual

- Plataforma primária: extensão Chrome/Edge Manifest V3.
- A ação da extensão detecta automaticamente um único player HTML5 ativo/visível na aba atual.
- Cada clique detecta o player e abre diretamente um popup limpo real de **960×600**.
- O popup recarrega a mesma URL; não há modo alternativo nem janela de escolha.
- Não há dashboard, seleção manual de players ou limite artificial de popups: múltiplas janelas são permitidas.
- O popup preserva controles do site quando possível, aplica bounds salvos por host, restaura
  timestamp, volume/mudo e tenta autoplay quando a origem estava tocando.
- YouTube e Twitch têm adapters/heurísticas; Vimeo e páginas genéricas usam a heurística HTML5.
- Páginas especiais ou sem player exibem erro amigável. A origem só é pausada depois que o popup
  detecta e configura um player válido.
- Não usar cookies, scraping, extração de stream, bypass de DRM ou bloqueio de anúncios.
- O player continua sendo a página real do site, em popup do navegador; não usar iframe como modo
  principal.

## Regras de colaboração

- Antes de editar, ler `_loop/ATUAL.md`, este arquivo e `docs/ANALISE-E-PLANO.md`.
- Conferir alterações existentes e não sobrescrever trabalho de outro agente.
- Não usar credenciais, tokens, cookies exportados ou dados pessoais em prompts, logs ou commits.
- Não instalar serviços pagos, publicar a extensão ou fazer push sem autorização.
- Todo agente que editar roda os testes relevantes e informa arquivos, comandos e resultados.
- Falha de login do Google não deve ser contornada por falsificação agressiva de navegador.

## Validação obrigatória da extensão

- Validar JSON de `extension/manifest.json`.
- Rodar `node --check` em cada script JavaScript alterado.
- Rodar `node extension/test-extension.js`.
- Verificar que a injeção genérica usa `host_permissions` e não pausa a origem sem `popup-ready`.

## Contrato de entrega

```text
STATUS: done | blocked
FINDINGS:
- fato verificável
DECISION:
- decisão aplicada
FILES:
- caminhos alterados
TESTS:
- comando → resultado
NEXT:
- próximo passo objetivo
```
