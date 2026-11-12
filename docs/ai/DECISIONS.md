# Decisões

| Data | Pergunta | Decisão | Motivo |
|---|---|---|---|
| 2026-11-12 | Qual nome usar na loja? | Manter a marca "FullTube" e acrescentar subtítulo: pt "FullTube — Janela Limpa e Modo Teatro", en "FullTube — Clean Video Window & Theater Mode". O repositório continua `Thameus/FullTube-Player-Limpo`. | Existem outras 3 extensões chamadas "FullTube"; o subtítulo descreve o que a extensão faz e diferencia a ficha. Trocar a marca perderia o nome e o ID já publicados. |
| 2026-11-12 | Qual licença? | MIT, titular "Thameus", ano 2026. | Licença simples e permissiva, comum em extensões de código aberto, sem custo de manutenção. |
| 2026-11-12 | Onde fica o site? | Repositório separado `FullTube-Site`, hospedado na Vercel, como o Pitstop-Site. URL: https://fulltube.thameus.com.br | Mantém o código da extensão separado do site e segue o padrão já usado em outro projeto. A política de privacidade continua no GitHub Pages deste repositório. |
| 2026-11-12 | O que o agente pode fazer nesta rodada? | Autorizado: commit e push para o GitHub e criação de release no GitHub. O envio às lojas (Edge Add-ons e Chrome Web Store) continua manual, feito pelo dono. | AGENTS.md proíbe publicar e fazer push sem autorização; a autorização vale só para esta rodada e para estes itens. |
| 2026-11-12 | Manter ou trocar as permissões de host (`http://*/*`, `https://*/*`)? | Manter e explicar com honestidade na ficha, no README e na política de privacidade. Não migrar para permissões opcionais. | A injeção do popup em sites genéricos depende dessas permissões. Permissões opcionais exigiriam um pedido extra a cada site e quebrariam o fluxo de um clique. |
| 2026-11-12 | Como produzir os screenshots da loja? | Ilustrações em HTML/CSS (mockups), sem imagens, marcas ou capturas de terceiros. | Evita problemas de direitos autorais e de uso de marca de terceiros e permite gerar as imagens de novo a cada versão. |
