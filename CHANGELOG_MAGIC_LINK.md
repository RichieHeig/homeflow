# Changelog - Fix Magic Link Redirect

## Problème Résolu

Le Magic Link générait parfois des redirections vers des URLs internes WebContainer (`*.webcontainer-api.io`) au lieu de l'URL publique Bolt (`https://bolt.new/~/sb1-f42yrfxu`), empêchant l'authentification.

## Solution Implémentée

### 1. Variable d'Environnement Canonique

**Nouveau** : Ajout de `VITE_PUBLIC_APP_URL` dans `.env`

```env
VITE_PUBLIC_APP_URL=https://bolt.new/~/sb1-f42yrfxu
```

Cette variable représente l'URL publique réelle de l'application et est utilisée pour tous les Magic Links.

### 2. Modifications du Code

**Fichier** : `src/components/onboarding/AuthMagicLink.tsx`

**Avant** :
```typescript
const baseUrl = getAppBaseUrl(); // Utilisait window.location.origin
const finalRedirectUrl = `${baseUrl}/onboarding?intention=${intention}`;
```

**Après** :
```typescript
const publicAppUrl = import.meta.env.VITE_PUBLIC_APP_URL;

// Protection si variable manquante
if (!publicAppUrl) {
  showError('URL publique non configurée');
  return;
}

const finalRedirectUrl = `${publicAppUrl}/onboarding?intention=${intention}`;
```

**Changements clés** :
- ❌ Suppression : `getAppBaseUrl()` et `window.location.origin`
- ✅ Ajout : Utilisation de `VITE_PUBLIC_APP_URL`
- ✅ Ajout : Protection UI si variable manquante
- ✅ Ajout : Logs console explicites
- ✅ Ajout : Icon `AlertTriangle` pour les erreurs

### 3. Protection UI

Si `VITE_PUBLIC_APP_URL` n'est pas définie, un message d'erreur s'affiche :

```
⚠️ Configuration manquante
URL publique de l'application non configurée.
Veuillez définir VITE_PUBLIC_APP_URL dans votre fichier .env
```

### 4. Configuration Supabase

**Vérifiée et confirmée** :
- `detectSessionInUrl: true`
- `persistSession: true`
- `autoRefreshToken: true`

## Fichiers Modifiés

1. `.env` - Ajout de `VITE_PUBLIC_APP_URL`
2. `.env.example` - Ajout de `VITE_PUBLIC_APP_URL` avec exemple
3. `src/components/onboarding/AuthMagicLink.tsx` - Utilisation de la variable d'environnement
4. `README.md` - Documentation mise à jour

## Fichiers Créés

1. `MAGIC_LINK_FIX.md` - Guide complet avec procédure de test
2. `CHANGELOG_MAGIC_LINK.md` - Ce fichier

## Avantages

| Avant | Après |
|-------|-------|
| URL détectée dynamiquement | URL fixe et canonique |
| Risque d'URL interne WebContainer | Toujours l'URL publique |
| Pas de validation | Erreur claire si mal configuré |
| Comportement imprévisible | Comportement déterministe |

## Procédure de Test

Voir **[MAGIC_LINK_FIX.md](./MAGIC_LINK_FIX.md)** pour :
- Procédure complète en 3 étapes
- Script de diagnostic automatique
- Solutions aux problèmes fréquents

## Migration

Si vous utilisez déjà l'application :

1. Ajoutez `VITE_PUBLIC_APP_URL` dans votre `.env`
2. Redémarrez le serveur de développement
3. Demandez un NOUVEAU Magic Link
4. Testez avec la procédure dans MAGIC_LINK_FIX.md

## Support

En cas de problème :
1. Vérifiez `VITE_PUBLIC_APP_URL` dans la console (F12)
2. Lancez le script de diagnostic dans MAGIC_LINK_FIX.md
3. Vérifiez les logs console : `[Magic Link] Public App URL`
4. Consultez SUPABASE_AUTH_GUIDE.md pour la config Supabase
