# Axis Day Hospital

Aplicação full stack institucional e comercial voltada a médicos externos que desejam conhecer as condições para realizar cirurgias eletivas no Axis Day Hospital. O projeto reúne site público, captação real de leads, autenticação, CRM, CMS, galeria, storage, analytics condicionado ao consentimento, SEO e páginas LGPD.

Headline institucional vigente no hero: **O seu hospital dia**.

A página pública também inclui a seção **Equipamentos**, com uma imagem representativa individual para cada um dos dez aparelhos e descrições editoriais. A Torre de Videocirurgia Stryker 1688 AIM 4K usa imagem fornecida pelo Axis; as demais fontes aparecem nos próprios cards. Disponibilidade, indicação e suporte devem ser confirmados com a equipe Axis.

Nenhum telefone, e-mail, perfil social, credencial, certificação ou dado clínico não confirmado foi preenchido. Campos ausentes permanecem configuráveis no painel.

## Stack

- Next.js 16 com App Router, Server Components e TypeScript strict
- React 19, Tailwind CSS 4, Framer Motion e Lucide
- Supabase Auth, PostgreSQL, Row Level Security e Storage
- React Hook Form e Zod
- Deploy preparado para Vercel

## Requisitos e instalação

- Node.js 20.9 ou superior
- npm 10 ou superior
- Projeto Supabase

```bash
npm install
cp .env.example .env.local
npm run dev
```

Acesse `http://localhost:3000`. Sem as variáveis do Supabase, o site público abre com conteúdo inicial seguro; operações persistentes informam claramente que o serviço ainda não está configurado.

## Variáveis de ambiente

Preencha `.env.local` com os dados do projeto Supabase e a URL pública. A `SUPABASE_SERVICE_ROLE_KEY` é exclusivamente server-side e nunca pode receber o prefixo `NEXT_PUBLIC_`.

Analytics são opcionais. GA4/GTM só carregam após consentimento de analytics; Meta Pixel só carrega após consentimento de marketing.

## Supabase, migrations e seed

Com a Supabase CLI vinculada ao projeto:

```bash
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
npx supabase db seed
```

Também é possível executar, nesta ordem, os arquivos abaixo no SQL Editor:

1. `supabase/migrations/20260817000000_initial.sql`
2. `supabase/seed.sql`

A migration cria tabelas, enums, índices, triggers, bucket `site-assets`, políticas RLS e limite de leads por hash de IP. O seed contém somente os dados empresariais confirmados e as três diretrizes autorizadas: Segurança, Tecnologia e Praticidade.

## Primeiro administrador

1. Em Supabase Dashboard → Authentication → Users, crie o primeiro usuário.
2. O trigger cria automaticamente o perfil como `editor`.
3. No SQL Editor, promova apenas esse usuário conhecido:

```sql
update public.profiles
set role = 'admin'
where id = 'UUID_DO_USUARIO';
```

4. Acesse `/admin/login` com o e-mail e senha cadastrados.

Depois disso, administradores podem convidar usuários em `/admin/usuarios`. Editores podem gerenciar conteúdo, galeria e leads, mas não usuários administradores.

## Painel administrativo

- `/admin`: visão geral real, com estados vazios
- `/admin/leads`: busca, filtros, paginação, status, notas, timeline e CSV
- `/admin/conteudo`: seções e etapas do site
- `/admin/galeria`: upload validado e publicação de imagens
- `/admin/diferenciais`: itens ativos/inativos e ordenação
- `/admin/faq`: perguntas publicáveis
- `/admin/configuracoes`: contato, WhatsApp, mapas, SEO e textos jurídicos
- `/admin/usuarios`: convites, restritos a administradores

## Configuração operacional

- WhatsApp: cadastre número com DDI e mensagem inicial em Configurações.
- Google Maps: cadastre separadamente a URL “Como chegar” e uma URL de embed iniciada por `https://www.google.com/maps/embed`.
- SEO: configure título, descrição, canonical e `NEXT_PUBLIC_SITE_URL`.
- Analytics: configure IDs no ambiente da Vercel; o banner gerencia consentimento por categoria.
- Jurídico: revise e aprove os textos de Política de Privacidade e Termos de Uso no painel antes da publicação final.
- Domínio: adicione o domínio na Vercel, ajuste `NEXT_PUBLIC_SITE_URL`, URLs de redirecionamento no Supabase Auth e faça novo deploy.

## Segurança

O projeto combina validação Zod no servidor, honeypot, rate limit em memória e no banco, hash de IP com salt, RLS, autorização server-side, validação de MIME/tamanho/extensão em uploads, nomes únicos, headers de segurança e auditoria administrativa. A interface não é tratada como camada de autorização.

Defina `LEAD_RATE_LIMIT_SALT` com um valor aleatório e estável no ambiente de produção. Faça rotação imediata de qualquer chave que tenha sido exposta fora do gerenciador de secrets.

## Verificação

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Cadastre todas as variáveis necessárias para Production e Preview.
3. Use `npm run build` como build command.
4. Aplique migration e seed no Supabase antes de liberar formulários e painel.
5. Configure em Supabase Auth as URLs do domínio e `/admin/login`.
6. Teste login, lead, upload, alteração de CMS, consentimento e analytics no ambiente publicado.

O projeto não contém secrets reais e não depende de dados simulados para o dashboard ou CRM.
