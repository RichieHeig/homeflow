# Fix Magic Link - Procédure de Test

## Modifications Apportées

### 1. Variable d'Environnement Canonique

**Fichier `.env`** :
```env
VITE_PUBLIC_APP_URL=https://bolt.new/~/sb1-f42yrfxu
```

Cette URL est l'URL publique réelle de l'application, utilisée pour générer le lien de redirection.

**Important** : Cette URL doit correspondre exactement à l'URL que vous utilisez dans votre navigateur.

### 2. AuthMagicLink.tsx Modifié

- **Suppression** : Plus d'utilisation de `window.location.origin` ou `getAppBaseUrl()`
- **Nouveau comportement** : Utilise toujours `VITE_PUBLIC_APP_URL`
- **Protection** : Affiche une erreur si la variable n'est pas définie
- **Logs** : Console logs pour debug (`[Magic Link] Public App URL` et `Redirect URL`)

### 3. Configuration Supabase Client

Vérifié et confirmé :
- `detectSessionInUrl: true` ✓
- `persistSession: true` ✓
- `autoRefreshToken: true` ✓

---

## Procédure de Test (3 étapes)

### Étape 1 : Vérifier VITE_PUBLIC_APP_URL

Ouvrez la console (F12) et tapez :
```javascript
console.log('VITE_PUBLIC_APP_URL:', import.meta.env.VITE_PUBLIC_APP_URL);
```

**Résultat attendu** :
```
VITE_PUBLIC_APP_URL: https://bolt.new/~/sb1-f42yrfxu
```

**Si vide ou undefined** :
1. Vérifiez que `.env` contient `VITE_PUBLIC_APP_URL=https://bolt.new/~/sb1-f42yrfxu`
2. Redémarrez le serveur de développement (Bolt fait ça automatiquement)

---

### Étape 2 : Demander un Magic Link

1. Cliquez sur "Créer un foyer" ou "Rejoindre un foyer"
2. Entrez votre email
3. Cliquez sur "Recevoir le lien de connexion"

**Vérifications** :

#### Dans la Console (F12) :
```
[Magic Link] Public App URL: https://bolt.new/~/sb1-f42yrfxu
[Magic Link] Redirect URL: https://bolt.new/~/sb1-f42yrfxu/onboarding?intention=create
```

**Vérifiez** :
- L'URL ne contient PAS `localhost`
- L'URL ne contient PAS `webcontainer-api.io`
- L'URL commence par `https://bolt.new/~/sb1-f42yrfxu`

#### Sur la page :
- L'URL de redirection s'affiche en bas dans un bloc gris
- Elle doit correspondre à celle dans la console

**Si l'URL est incorrecte** :
- STOP : Ne continuez pas
- Vérifiez l'étape 1
- Vérifiez que `.env` est correct

---

### Étape 3 : Cliquer sur le lien et vérifier la session

1. Ouvrez votre boîte email
2. Cliquez sur "Log In" dans l'email de Supabase
3. Vous devez être redirigé vers `https://bolt.new/~/sb1-f42yrfxu/onboarding?intention=...`

**Vérification finale dans la console (F12)** :

```javascript
// Vérifier la session
const { data } = await supabase.auth.getSession();
console.log('Session active:', !!data.session);
console.log('Email:', data.session?.user.email);

// Vérifier l'utilisateur
const { data: userData } = await supabase.auth.getUser();
console.log('User ID:', userData.user?.id);
```

**Résultat attendu** :
```
Session active: true
Email: votre-email@exemple.com
User ID: xxx-xxx-xxx-xxx
```

**Si session = null** :
- Vérifiez que l'URL de redirection est autorisée dans Supabase Dashboard
- Consultez `SUPABASE_AUTH_GUIDE.md` pour la configuration Supabase

---

## Diagnostic Automatique

Copiez-collez ce script dans la console (F12) après avoir cliqué sur le Magic Link :

```javascript
async function diagnosticMagicLink() {
  console.log('=== DIAGNOSTIC MAGIC LINK ===\n');

  // 1. Variable d'environnement
  console.log('1. CONFIGURATION');
  const publicUrl = import.meta.env.VITE_PUBLIC_APP_URL;
  console.log('   VITE_PUBLIC_APP_URL:', publicUrl || '❌ NON DÉFINIE');

  if (!publicUrl) {
    console.error('   ❌ ERREUR : VITE_PUBLIC_APP_URL non définie dans .env');
    return;
  }

  if (publicUrl.includes('localhost')) {
    console.warn('   ⚠️  ATTENTION : URL contient localhost');
  }

  if (publicUrl.includes('webcontainer-api.io')) {
    console.error('   ❌ ERREUR : URL contient webcontainer-api.io (URL interne)');
  }

  // 2. URL actuelle
  console.log('\n2. URL ACTUELLE');
  console.log('   URL complète:', window.location.href);
  console.log('   Origin:', window.location.origin);

  if (window.location.href.startsWith(publicUrl)) {
    console.log('   ✅ URL correspond à VITE_PUBLIC_APP_URL');
  } else {
    console.warn('   ⚠️  URL ne correspond pas exactement à VITE_PUBLIC_APP_URL');
  }

  // 3. Session
  console.log('\n3. SESSION SUPABASE');
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('   ❌ Erreur:', error.message);
    } else if (data.session) {
      console.log('   ✅ Session active');
      console.log('   - Email:', data.session.user.email);
      console.log('   - User ID:', data.session.user.id);
      console.log('   - Expire:', new Date(data.session.expires_at * 1000).toLocaleString());
    } else {
      console.warn('   ⚠️  Aucune session (normal si vous n\'avez pas encore cliqué sur le Magic Link)');
    }
  } catch (err) {
    console.error('   ❌ Erreur lors de la récupération de la session:', err);
  }

  // 4. Conclusion
  console.log('\n4. DIAGNOSTIC');
  const { data } = await supabase.auth.getSession();

  if (!publicUrl) {
    console.log('   ❌ Définissez VITE_PUBLIC_APP_URL dans .env');
  } else if (publicUrl.includes('webcontainer-api.io')) {
    console.log('   ❌ Changez VITE_PUBLIC_APP_URL pour utiliser https://bolt.new/~/...');
  } else if (!data.session) {
    console.log('   ⚠️  Aucune session : Demandez un Magic Link et cliquez dessus');
  } else {
    console.log('   ✅ TOUT FONCTIONNE !');
  }

  console.log('\n=== FIN DU DIAGNOSTIC ===');
}

diagnosticMagicLink();
```

---

## Problèmes Fréquents

### Erreur : "URL publique non configurée"

**Cause** : `VITE_PUBLIC_APP_URL` manquante dans `.env`

**Solution** :
1. Ajoutez dans `.env` : `VITE_PUBLIC_APP_URL=https://bolt.new/~/sb1-f42yrfxu`
2. Redémarrez le serveur (automatique sur Bolt)

### Redirection vers une URL *.webcontainer-api.io

**Cause** : L'ancien code utilisait `window.location.origin`

**Solution** :
- Vérifiez que vous utilisez le code modifié (ce fix)
- Vérifiez les logs de la console : ils doivent afficher `https://bolt.new/~/...`

### Session null après clic sur le lien

**Cause** : URL de redirection non autorisée dans Supabase

**Solution** :
1. Allez dans Supabase Dashboard > Authentication > URL Configuration
2. Ajoutez `https://bolt.new/~/sb1-f42yrfxu/**` dans "Redirect URLs"
3. Demandez un NOUVEAU Magic Link

---

## Configuration Supabase Dashboard

**URL du site** :
```
https://bolt.new
```

**URL de redirection autorisées** :
```
https://bolt.new/~/sb1-f42yrfxu/**
https://bolt.new/**
http://localhost:5173/**
```

Sauvegardez et demandez un NOUVEAU Magic Link.

---

## Résumé des Changements

| Avant | Après |
|-------|-------|
| `getAppBaseUrl()` détecte dynamiquement | `VITE_PUBLIC_APP_URL` fixe et canonique |
| `window.location.origin` peut donner une URL interne | Plus jamais d'URL interne |
| Pas de protection si URL incorrecte | Erreur UI si variable manquante |
| Redirection imprévisible | Redirection toujours vers l'URL publique |

**Objectif atteint** : Le Magic Link redirige TOUJOURS vers `https://bolt.new/~/sb1-f42yrfxu/onboarding`, jamais vers une URL interne WebContainer.
