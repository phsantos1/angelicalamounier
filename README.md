# Angelica Lamounier Beauty

Site editorial em **TypeScript + React + Vite + Tailwind CSS + Motion** para o estúdio **Angelica Lamounier Beauty** (*“Sua beleza, com a sua essência.”*).

## Estrutura do projeto (TypeScript)

- `src/config/contact.ts` — configuração única e centralizada de Instagram e WhatsApp (`37 9819-2692`).
- `src/data/studioData.ts` — serviços (*Maquiagem*, *Sobrancelhas*, *Unhas*), referências visuais ilustrativas do portfólio, perguntas frequentes e tokens do guia de estilo.
- `src/utils/booking.ts` — tipagem, validações de data/horário (bloqueando datas e horários passados) e composição da mensagem com `encodeURIComponent`.
- `src/components/` — cabeçalho com menu mobile acessível, abertura editorial, essência, serviços conectados, portfólio com lightbox acessível, agendamento em 3 etapas com resumo editável, FAQ, guia de estilo visual e rodapé.

## Scripts locais

```bash
npm install
npm run dev      # inicia servidor local de desenvolvimento
npm run lint     # valida tipagem TypeScript (tsc --noEmit)
npm run build    # gera a build de produção em dist/
```

## Publicação na Netlify via GitHub

O arquivo `netlify.toml` na raiz já configura o build automático do projeto TypeScript:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `22` (definida também em `.nvmrc`)

Ao conectar este repositório na Netlify, certifique-se de que **Site configuration → Build & deploy → Build settings** esteja usando `npm run build` e `dist` (sem sobrescrita manual antiga apontando para `.`).
