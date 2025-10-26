# 🚀 Guia de Deploy - Rumo a Maratona

## 📋 Pré-requisitos
- Conta no GitHub (já criada ✅)
- Conta na Vercel (criar ou já ter)

---

## 📤 PASSO 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new

2. Preencha:
   - **Repository name:** `rumo-a-maratona`
   - **Description:** "Site de treino para Maratona do Rio 2026"
   - **Public** (deixe marcado)
   - ✅ **MARQUE:** "Add a README file"

3. Clique em **"Create repository"**

---

## 📂 PASSO 2: Fazer Upload dos Arquivos

1. Na página do repositório que acabou de criar, clique em **"Add file"** → **"Upload files"**

2. **Arraste TODOS os arquivos e pastas** da pasta extraída do ZIP:
   - ✅ Pasta `client` (completa)
   - ✅ Arquivo `package.json`
   - ✅ Arquivo `pnpm-lock.yaml`
   - ✅ Arquivo `vercel.json`
   - ✅ Arquivo `.gitignore`
   - ✅ Arquivo `.vercelignore`
   - ✅ Arquivo `README.md` (substitui o que foi criado)
   - ✅ Arquivo `DEPLOY-GUIDE.md` (este arquivo)
   - ✅ Pasta `plano-treino-bloco1.md`

3. Espere o upload terminar (1-2 minutos)

4. No campo de commit (embaixo), escreva: `Initial commit - Site Rumo a Maratona`

5. Clique em **"Commit changes"**

✅ Arquivos no GitHub!

---

## 🚀 PASSO 3: Deploy na Vercel

### 3.1 - Login na Vercel

1. Acesse: https://vercel.com/login
2. Clique em **"Continue with GitHub"**
3. Faça login no GitHub (se pedir)
4. Clique em **"Authorize Vercel"**

### 3.2 - Importar Projeto

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Encontre **"rumo-a-maratona"** na lista
3. Clique em **"Import"**

### 3.3 - Configurar Deploy

**A Vercel vai detectar automaticamente as configurações do `vercel.json`!**

Você deve ver:
- ✅ Framework Preset: Vite
- ✅ Build Command: `cd client && npm install && npm run build`
- ✅ Output Directory: `client/dist`
- ✅ Install Command: `npm install`

**NÃO PRECISA MUDAR NADA!** Apenas clique em **"Deploy"**

### 3.4 - Aguardar Deploy

O deploy vai levar 2-3 minutos. Você verá:
- 🔄 Installing dependencies...
- 🔨 Building...
- 🚀 Deploying...
- 🎉 Deployment completed!

### 3.5 - Acessar o Site

Quando terminar:
- 🎊 Confetti na tela
- 🔗 URL do site (exemplo: `rumo-a-maratona.vercel.app`)

Clique em **"Visit"** para ver seu site funcionando!

---

## ✅ Pronto!

Seu site está no ar! 🎉

**URL:** `https://rumo-a-maratona-SEU-USUARIO.vercel.app`

---

## 🔄 Para Atualizar o Site no Futuro

Quando houver mudanças (Bloco 2, correções, etc.):

1. Acesse: `https://github.com/SEU_USUARIO/rumo-a-maratona`
2. Clique em "Add file" → "Upload files"
3. Arraste os arquivos novos/atualizados
4. Commit changes

**A Vercel faz deploy automático em 1-2 minutos!** 🚀

---

## 📱 Adicionar à Tela Inicial (Usar como App)

**iPhone:**
1. Abra o site no Safari
2. Toque no ícone de compartilhar
3. "Adicionar à Tela de Início"

**Android:**
1. Abra o site no Chrome
2. Menu (3 pontinhos)
3. "Adicionar à tela inicial"

---

## 🆘 Problemas?

Se der erro no deploy, verifique:
1. ✅ Todos os arquivos foram enviados para o GitHub?
2. ✅ A pasta `client` está completa?
3. ✅ O arquivo `vercel.json` está na raiz do repositório?

Se continuar com erro, entre em contato!

---

**Boa sorte no treino! 🏃‍♂️💪**

