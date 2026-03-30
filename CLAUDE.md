# Portfolio — CLAUDE.md

## Stack

- **Framework**: Vite + React + TypeScript
- **Estilização**: Tailwind CSS v3 (dark mode via classe `dark` no `<html>`)
- **Animações**: Framer Motion (`whileInView` para animações no scroll)
- **Ícones**: lucide-react
- **Fonte**: Barlow (Google Fonts, carregada no `index.html`)

## Estrutura

```
src/
├── components/
│   ├── Header.tsx     — nav fixa, toggle dark/light, menu mobile
│   ├── About.tsx      — seção sobre mim com progresso da faculdade dinâmico
│   ├── Projects.tsx   — lista de projetos com cards animados
│   └── Footer.tsx     — rodapé simples
├── data/
│   └── portfolio.json — ÚNICA fonte de dados do site
├── hooks/
│   └── useTheme.ts    — gerencia dark/light mode (persiste no localStorage)
└── types/
    └── portfolio.ts   — tipos TypeScript para os dados do JSON
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
```

## Deploy

O site é hospedado em **rychard.dev**, com domínio gerenciado na Cloudflare.
