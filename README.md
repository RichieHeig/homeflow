# HomeFlow

Application moderne de gestion des tâches domestiques avec équilibrage intelligent de la charge de travail et système de leaderboard gamifié.

## Fonctionnalités

- **Gestion intelligente des tâches** : Algorithme d'équilibrage basé sur la charge de travail et l'historique
- **TaskFlow** : Suggestions de tâches personnalisées selon l'énergie et le temps disponible
- **Leaderboard** : Système de points et classement gamifié
- **Multi-foyers** : Support de plusieurs ménages avec codes d'invitation
- **PWA** : Application installable, mode hors ligne, notifications
- **Authentification** : Système sécurisé avec Supabase Auth
- **Responsive** : Interface optimisée pour mobile, tablette et desktop
- **Mode sombre** : Support du thème sombre

## Stack technique

- **Frontend** : React 18, TypeScript, Vite
- **UI** : Tailwind CSS, shadcn/ui components
- **Routing** : React Router v7
- **State Management** : Zustand
- **Backend** : Supabase (PostgreSQL, Auth, RLS)
- **Charts** : Recharts
- **PWA** : Vite PWA Plugin, Workbox
- **Icons** : Lucide React

## Prérequis

- Node.js 18+ et npm
- Compte Supabase

## Configuration Authentification (IMPORTANT)

**Si vous utilisez le Magic Link pour l'authentification** :

1. **Configuration Frontend** : [MAGIC_LINK_FIX.md](./MAGIC_LINK_FIX.md) - Fix définitif pour éviter les redirections vers des URLs internes WebContainer
2. **Configuration Supabase** : [SUPABASE_AUTH_GUIDE.md](./SUPABASE_AUTH_GUIDE.md) - Configuration du dashboard Supabase

Points critiques :
- Définissez `VITE_PUBLIC_APP_URL` dans `.env` avec votre URL publique (Bolt.new ou domaine custom)
- Configurez Supabase Dashboard avec les URLs de redirection autorisées
- Demandez un NOUVEAU lien après modification de la config

## Installation

1. Clonez le dépôt :
```bash
git clone <repository-url>
cd homeflow
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```

4. Éditez `.env` avec vos credentials Supabase :
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Lancez le serveur de développement :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build de production (typecheck + build)
- `npm run preview` - Prévisualise le build de production
- `npm run preview-https` - Prévisualise avec HTTPS (pour tester PWA)
- `npm run lint` - Vérifie le code avec ESLint
- `npm run typecheck` - Vérifie les types TypeScript

## Structure du projet

```
homeflow/
├── src/
│   ├── components/         # Composants React
│   │   ├── dashboard/      # Composants du dashboard
│   │   ├── layout/         # Layout (Navbar, Sidebar, AppLayout)
│   │   ├── members/        # Gestion des membres
│   │   ├── onboarding/     # Onboarding utilisateur
│   │   ├── pwa/            # Composants PWA (InstallPrompt, etc.)
│   │   ├── settings/       # Paramètres
│   │   ├── taskflow/       # TaskFlow
│   │   ├── tasks/          # Gestion des tâches
│   │   └── ui/             # Composants UI réutilisables
│   ├── contexts/           # React contexts (ToastContext)
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilitaires et logique métier
│   │   ├── supabase.ts     # Client Supabase
│   │   ├── taskAlgorithm.ts # Algorithme d'équilibrage
│   │   ├── tasks.ts        # API des tâches
│   │   ├── members.ts      # API des membres
│   │   └── preferences.ts  # API des préférences
│   ├── pages/              # Pages principales
│   ├── stores/             # State management (Zustand)
│   ├── types/              # Types TypeScript
│   ├── App.tsx             # Composant racine
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── public/                 # Assets statiques
├── supabase/               # Migrations et schéma DB
│   └── migrations/         # Migrations SQL
└── dist/                   # Build de production

```

## Base de données

Le projet utilise Supabase avec PostgreSQL. Les migrations se trouvent dans `supabase/migrations/`.

### Tables principales :

- `households` - Foyers
- `members` - Membres des foyers
- `tasks` - Tâches
- `completions` - Historique des tâches complétées
- `preferences` - Préférences utilisateur

### Sécurité :

Toutes les tables utilisent Row Level Security (RLS) pour garantir que :
- Les utilisateurs ne peuvent accéder qu'aux données de leur foyer
- Les opérations sont validées côté serveur
- Les données sont protégées même en cas de fuite de clé API

## Algorithme d'équilibrage

L'algorithme d'attribution des tâches prend en compte :

1. **Charge de travail** : Nombre de tâches actives par membre
2. **Historique** : Qui a fait la tâche récemment
3. **Disponibilité** : Membres actifs dans le foyer
4. **Équité** : Distribution équilibrée sur la durée

Le système calcule un score pour chaque membre et attribue la tâche au membre avec le score le plus faible.

## PWA (Progressive Web App)

L'application est une PWA complète avec :

- **Installation** : Prompt d'installation après 30 secondes
- **Mode hors ligne** : Cache des assets et API avec Workbox
- **Mises à jour** : Notification automatique des nouvelles versions
- **Indicateur réseau** : Affichage du statut en ligne/hors ligne

### Stratégies de cache :

- **Assets** (JS, CSS, images) : Cache-first
- **API Supabase** : Network-first avec fallback cache (5min)
- **Images externes** : Cache-first (30 jours)

## Déploiement

### Vercel (recommandé)

1. Connectez votre dépôt Git à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement à chaque push

### Netlify

1. Connectez votre dépôt Git à Netlify
2. Build command : `npm run build`
3. Publish directory : `dist`
4. Configurez les variables d'environnement

### Build manuel

```bash
npm run build
```

Le dossier `dist/` contient les fichiers statiques prêts à être déployés.

## Variables d'environnement de production

Pour la production, configurez ces variables sur votre plateforme d'hébergement :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## License

MIT
