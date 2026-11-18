# Publicação na Netlify — Angelica Lamounier Beauty

## Opção 1: Enviar este repositório direto para o GitHub e conectar na Netlify
1. Exporte/envie este repositório completo para o GitHub.
2. Conecte o repositório na **Netlify** (`Add new site` → `Import an existing project`).
3. O arquivo `netlify.toml` da raiz já está configurado automaticamente com:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `22`

## Opção 2: Upload manual via ZIP (`entrega/angelicalamounierbeauty-netlify.zip`)
1. No painel da **Netlify** (`Sites` → `Add new site` → `Deploy manually`), arraste o arquivo `entrega/angelicalamounierbeauty-netlify.zip`.
2. Ele já contém a pasta compilada com `index.html` na raiz.

## Opção 3: Envio manual ao GitHub sem subpastas e sem build
1. Envie **apenas** os arquivos de dentro de `entrega/sem-subpastas/` (ou extraídos de `entrega/angelicalamounierbeauty-github-sem-subpastas.zip`) diretamente para a raiz de um repositório no GitHub.
2. Esse pacote possui seu próprio `netlify.toml` configurado com `publish = "."` e sem comando de build.

## Configuração centralizada do WhatsApp
O número confirmado (`37 9819-2692`, formatado como `553798192692` em `src/config/contact.ts`) já está ativo no botão **Solicitar pelo WhatsApp**, abrindo a conversa apenas após ação explícita da cliente.
