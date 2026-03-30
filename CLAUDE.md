# Portfolio — CLAUDE.md

## Stack

- **Framework**: Vite + React + TypeScript
- **Estilização**: Tailwind CSS v3 (dark mode via classe `dark` no `<html>`)
- **Animações**: Framer Motion (`whileInView` para animações no scroll)
- **Ícones**: lucide-react + SVGs inline em `src/components/icons.tsx` (GitHub e LinkedIn, removidos da lucide-react v1.x)
- **Fonte**: Barlow (Google Fonts, carregada no `index.html`)
- **Formatação**: Prettier (tabs, 4 espaços de largura, sem ponto e vírgula, aspas simples)

## Estrutura

```
src/
├── components/
│   ├── Header.tsx     — nav fixa, toggle dark/light, menu mobile
│   ├── About.tsx      — seção sobre mim com progresso da faculdade dinâmico
│   ├── Projects.tsx   — lista de projetos com cards animados
│   ├── Footer.tsx     — rodapé simples
│   └── icons.tsx      — SVGs de marca (GithubIcon, LinkedinIcon)
├── data/
│   └── portfolio.json — ÚNICA fonte de dados do site
├── hooks/
│   └── useTheme.ts    — gerencia dark/light mode (persiste no localStorage)
├── types/
│   └── portfolio.ts   — tipos TypeScript para os dados do JSON
└── vite-env.d.ts      — declarações de tipo do Vite (CSS imports, etc.)
```

## Como atualizar o conteúdo

Edite apenas `src/data/portfolio.json`. Nenhum componente precisa ser alterado para adicionar projetos, atualizar bio, etc.

### Adicionar um projeto

```json
{
	"id": 4,
	"name": "Nome do Projeto",
	"description": "Breve descrição do que o projeto faz.",
	"image": "URL ou caminho relativo para imagem (ex: /images/projeto.png)",
	"link": "https://link-do-projeto.com"
}
```

Imagens locais devem ficar em `public/images/`.

### Atualizar foto de perfil

Altere o campo `"photo"` no JSON. Pode ser uma URL externa ou um arquivo em `public/` (ex: `"/photo.jpg"`).

## Semestre da faculdade (dinâmico)

O cálculo é automático. No JSON, `education.startYear` e `education.startSemester` definem o início do curso. O componente `About.tsx` calcula o semestre atual com base na data do sistema. Não precisa ser atualizado manualmente.

## Comandos

```bash
pnpm dev      # servidor de desenvolvimento
pnpm build    # build para produção (dist/)
pnpm preview  # preview do build
pnpm format   # formata todos os arquivos com Prettier
```

## Skills

- `/new-project` — adiciona um novo projeto ao `portfolio.json`. Solicita nome, imagem, link e descrição caso não fornecidos. Definida em `.claude/skills/new-project/SKILL.md` (não commitada, `.claude/` está no `.gitignore`).

## Identidade visual

- **Fonte**: Barlow (400, 500, 600, 700)
- **Cor de destaque**: `#2563EB` (blue-600) no modo claro / `#60A5FA` (blue-400) no modo escuro
- **Fundo**: branco (`#FFFFFF`) no modo claro / `#020617` (slate-950) no modo escuro
- **Textos**: slate-900/slate-100 (principal), slate-500/slate-400 (secundário)
- **Seções alternadas**: About em branco/slate-950 · Projects em slate-50/slate-900

## Deploy

O site é hospedado em **rychard.dev**, com domínio gerenciado na Cloudflare. O arquivo `wrangler.toml` na raiz configura o deploy via Cloudflare Workers/Pages, servindo os arquivos estáticos da pasta `dist/`.
