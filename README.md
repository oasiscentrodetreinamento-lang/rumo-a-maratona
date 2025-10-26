# Rumo a Maratona sub

Site profissional de planejamento e acompanhamento de treino para a Maratona do Rio 2026.

**Meta:** Completar a maratona em 3h30min (pace 4:58/km)  
**Atleta:** Maylon Watson  
**Período:** Bloco 1 (8 semanas) - Outubro a Dezembro 2025

---

## 🎯 Funcionalidades

### ✅ Plano de Treino Profissional
- **8 semanas** de treino periodizado (Bloco 1 de 11)
- **Teste de zonas** de corrida na primeira semana
- Treinos variados: intervalados, tempo run, long runs, velocidade, fartlek
- **Provas preparatórias** incluídas (10km na semana 6)
- Volume progressivo: 34km a 59km por semana

### ✅ Acompanhamento de Progresso
- **Marcação de treinos** concluídos com persistência local
- **Registro detalhado** de distância, tempo, pace e observações
- **Dashboard** com estatísticas em tempo real
- Progresso semanal e geral visualizado

### ✅ Visualização de Dados
- **Gráfico de frequência** de treinos por semana
- **Gráfico de volume** semanal (km)
- **Gráfico de evolução** de pace ao longo do tempo
- Interface interativa com tooltips

### ✅ Exercícios de Fortalecimento
- **10 exercícios** específicos para corrida
- Foco em core, glúteos, pernas e estabilização
- Instruções detalhadas de execução

### ✅ Zonas de Treino
- **5 zonas** de frequência cardíaca e pace
- Baseadas no teste de 5km
- Descrição e aplicação de cada zona

---

## 🚀 Como Hospedar

### Opção 1: GitHub Pages

1. **Criar repositório no GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Rumo a Maratona"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/rumo-a-maratona.git
   git push -u origin main
   ```

2. **Configurar GitHub Pages:**
   - Vá em **Settings** → **Pages**
   - Em **Source**, selecione **GitHub Actions**
   - Crie o arquivo `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
           with:
             version: 8
         - uses: actions/setup-node@v4
           with:
             node-version: 22
             cache: 'pnpm'
         - run: pnpm install
         - run: pnpm run build
           env:
             NODE_ENV: production
         - uses: actions/upload-pages-artifact@v3
           with:
             path: ./client/dist

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - uses: actions/deploy-pages@v4
           id: deployment
   ```

3. **Aguardar deploy:**
   - O site estará disponível em: `https://SEU_USUARIO.github.io/rumo-a-maratona/`

---

### Opção 2: Vercel (Recomendado)

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd /caminho/para/rumo-a-maratona
   vercel
   ```

3. **Seguir as instruções:**
   - Login com GitHub/GitLab/Bitbucket
   - Confirmar configurações do projeto
   - O Vercel detectará automaticamente a configuração

4. **Deploy de produção:**
   ```bash
   vercel --prod
   ```

5. **Domínio personalizado (opcional):**
   - Acesse o dashboard da Vercel
   - Vá em **Settings** → **Domains**
   - Adicione seu domínio personalizado

**Vantagens da Vercel:**
- ✅ Deploy automático a cada push
- ✅ Preview de PRs
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Analytics integrado

---

## 🛠️ Desenvolvimento Local

### Pré-requisitos
- Node.js 22+
- pnpm 8+

### Instalação
```bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/rumo-a-maratona.git
cd rumo-a-maratona

# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

O site estará disponível em `http://localhost:3000`

### Build de Produção
```bash
pnpm build
```

Os arquivos otimizados estarão em `client/dist/`

---

## 📱 Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Estilização
- **shadcn/ui** - Componentes UI
- **Recharts** - Gráficos interativos
- **Vite** - Build tool
- **Wouter** - Roteamento

---

## 🎨 Design

- **Paleta de cores:** Preto, cinza e branco
- **Tema:** Dark mode
- **Tipografia:** System fonts
- **Layout:** Responsivo (mobile-first)

---

## 📊 Estrutura de Dados

Os dados do treino estão em `client/public/training-data.json`:

```json
{
  "athlete": { ... },
  "block1": {
    "weeks": [ ... ]
  },
  "strengthExercises": [ ... ],
  "trainingZones": { ... }
}
```

O progresso é salvo no **localStorage** do navegador:
- Chave: `trainingProgress`
- Formato: Array de objetos `CompletedWorkout`

---

## 🔄 Atualizações Futuras

### Bloco 2 (Semanas 9-16)
Para adicionar o próximo bloco de treino:

1. Edite `client/public/training-data.json`
2. Adicione a propriedade `block2` seguindo a mesma estrutura
3. Atualize o componente `Home.tsx` para alternar entre blocos

### Funcionalidades Planejadas
- [ ] Exportar dados para CSV/PDF
- [ ] Integração com Strava/Garmin
- [ ] Notificações de treino
- [ ] Calculadora de pace
- [ ] Histórico de blocos anteriores

---

## 📝 Licença

Este projeto é pessoal e foi desenvolvido especificamente para **Maylon Watson**.

---

## 🏃‍♂️ Sobre o Atleta

**Nome:** Maylon Watson  
**Idade:** 24 anos (25 em 05/01/2026)  
**Peso:** 80kg | **Altura:** 1,74m | **BF:** 14%  

**Performance Atual:**
- 5km: 22min (pace 4:24/km)
- 11km: 60min (pace 5:27/km)

**Meta:**
- Maratona do Rio 2026 (Setembro)
- Tempo: 3h30min (pace 4:58/km)

---

## 📞 Contato

Para dúvidas ou sugestões sobre o plano de treino, consulte um profissional de educação física especializado em corrida.

---

**Desenvolvido com 💪 para a jornada rumo à maratona!**

