# Publicação na Netlify — Angelica Lamounier Beauty

## 1. Publicação direta via ZIP (recomendado)
1. Acesse o painel da **Netlify** (`Sites` → `Add new site` → `Deploy manually`).
2. Arraste o arquivo `angelicalamounierbeauty-netlify.zip` para a área de envio.
3. O site entra no ar imediatamente com `index.html` na raiz, todos os recursos incluídos e `netlify.toml` configurado.

## 2. Envio manual ao GitHub sem subpastas + Netlify sem build
1. Envie todos os arquivos da pasta `entrega/sem-subpastas` (ou extraídos de `angelicalamounierbeauty-github-sem-subpastas.zip`) diretamente para a raiz do repositório no GitHub. Não há subpastas para criar.
2. Na Netlify, conecte o repositório (ou faça deploy manual da pasta):
   - **Build command:** deixe em branco (`""`)
   - **Publish directory:** `.` (raiz)
   - O arquivo `netlify.toml` já traz essa configuração pronta.

## 3. Configuração centralizada do WhatsApp
O número confirmado (`37 9819-2692`, formatado como `553798192692` em `src/config/contact.ts`) já está ativo no botão **Solicitar pelo WhatsApp**, abrindo a conversa apenas após ação explícita da cliente.

Caso precise alterar o número futuramente:
- Atualize `whatsappRawDisplay` e `whatsappE164Confirmed` em `src/config/contact.ts`.
- Gere um novo build (`npm run build`) e execute `python3 scripts/build_delivery.py`.
