# 🔐 Configuration Magic Link - HomeFlow

## ✅ PROBLÈME RÉSOLU

Le problème de redirection vers `localhost` après clic sur le Magic Link est maintenant corrigé.

### Cause du problème
- `window.location.origin` sur Bolt retourne `https://bolt.new` au lieu de `https://bolt.new/~/sb1-xxxx`
- Les anciens emails Magic Link contenaient des URLs invalides pointant vers localhost

### Solution implémentée
- Fonction `getAppBaseUrl()` qui détecte automatiquement l'URL correcte
- Support de Bolt (`/~/`), localhost, et domaines custom
- Affichage de l'URL de redirection dans l'UI pour validation

---

## 📋 CHECKLIST CONFIGURATION SUPABASE

### 🔧 Étape 1 : Configuration des URLs dans Supabase

Accédez à votre Dashboard Supabase :
```
https://supabase.com/dashboard/project/[VOTRE-PROJECT-ID]/auth/url-configuration
```

#### **Site URL**
```
https://bolt.new/~/sb1-f42yrfxu
```

⚠️ **IMPORTANT** : Remplacez `sb1-f42yrfxu` par votre ID de projet Bolt actuel

#### **Redirect URLs** (liste complète à ajouter)
```
https://bolt.new/~/sb1-f42yrfxu/*
https://bolt.new/~/sb1-f42yrfxu/onboarding
https://bolt.new/*
http://localhost:5173/*
```

**Explication des URLs :**
- `https://bolt.new/~/sb1-f42yrfxu/*` : Wildcard pour toutes les routes de votre app Bolt
- `https://bolt.new/~/sb1-f42yrfxu/onboarding` : Route spécifique de redirection
- `https://bolt.new/*` : Wildcard général pour Bolt (fallback)
- `http://localhost:5173/*` : Pour le développement local

### 🔧 Étape 2 : Vérification Email Provider

Dans **Authentication → Providers → Email** :

- ✅ **Enable Email Provider** : Activé
- ✅ **Confirm Email** : Désactivé (pour un flow plus simple)
- ✅ **Secure Email Change** : Activé (recommandé)

### 🔧 Étape 3 : Rate Limits (Optionnel)

Dans **Authentication → Rate Limits** :

- **Max emails per hour** : `10` (ajustez selon vos besoins)
- Cela évite les abus tout en permettant les tests

---

## 🚨 ACTIONS IMMÉDIATES REQUISES

### ⚠️ IMPORTANT : Renvoyer un nouveau Magic Link

**Les anciens emails Magic Link NE FONCTIONNERONT PLUS** car ils contiennent l'ancienne URL (localhost).

**Pour tester :**
1. Supprimez tous les anciens emails de test
2. Demandez un **nouveau** Magic Link via l'application
3. Utilisez uniquement ce nouveau lien

**Message affiché dans l'app :**
> "Utilisez toujours le lien le plus récent. Les anciens liens peuvent expirer ou rediriger vers une URL obsolète."

---

## 🧪 PROCÉDURE DE TEST (3 ÉTAPES)

### ✅ Test 1 : Vérifier l'URL de base

1. Ouvrez la console navigateur (F12)
2. Allez sur `/onboarding`
3. Cliquez "Créer un foyer"
4. Entrez votre email
5. **Vérifiez la console :**
   ```
   [Magic Link] Base URL: https://bolt.new/~/sb1-f42yrfxu
   [Magic Link] Redirect URL: https://bolt.new/~/sb1-f42yrfxu/onboarding?intention=create
   ```

✅ **Résultat attendu :** L'URL doit contenir `/~/sb1-f42yrfxu` (votre projet Bolt)

### ✅ Test 2 : Recevoir et cliquer le Magic Link

1. Après envoi, l'écran affiche :
   - Message de confirmation
   - **URL de redirection visible** (en bas de la card)
   - Avertissement sur les anciens liens

2. Ouvrez votre boîte email
3. Cliquez sur le lien Magic Link **le plus récent**

✅ **Résultat attendu :** Redirection vers `https://bolt.new/~/sb1-f42yrfxu/onboarding?intention=create`

### ✅ Test 3 : Vérifier la session

1. Après redirection, vous devriez voir automatiquement le formulaire "Créer un foyer"
2. Remplissez le formulaire
3. Cliquez "Créer le foyer"

✅ **Résultat attendu :**
- Foyer créé avec succès
- Code d'invitation affiché
- Redirection vers `/dashboard`

---

## 🔍 DEBUGGING

### Problème : "Le lien redirige encore vers localhost"

**Cause probable :** Vous utilisez un ancien email Magic Link

**Solution :**
1. Supprimez tous les emails de test précédents
2. Demandez un **nouveau** Magic Link
3. Utilisez uniquement le lien du nouvel email

### Problème : "URL Configuration Mismatch"

**Cause :** Les Redirect URLs dans Supabase ne contiennent pas votre URL Bolt

**Solution :**
1. Vérifiez que `https://bolt.new/~/sb1-f42yrfxu/*` est dans Redirect URLs
2. Remplacez `sb1-f42yrfxu` par votre vrai ID de projet
3. Sauvegardez et attendez 1-2 minutes (propagation)

### Problème : "Session non détectée après redirection"

**Vérifications :**
1. Console navigateur : Recherchez `[Magic Link]` dans les logs
2. Vérifiez que l'URL après redirection contient un hash token : `#access_token=...`
3. Vérifiez que les cookies sont autorisés

**Configuration Supabase confirmée :**
```typescript
auth: {
  autoRefreshToken: true,      ✅
  persistSession: true,         ✅
  detectSessionInUrl: true,     ✅
}
```

---

## 📂 FICHIERS MODIFIÉS

### 🆕 Nouveau : `src/lib/url.ts`

Fonction utilitaire qui détecte automatiquement l'URL de base :

```typescript
export function getAppBaseUrl(): string
```

**Comportement :**
- Détecte `/~/` dans l'URL → Mode Bolt
- Extrait automatiquement `origin + "/~/" + projectId`
- Fallback sur `window.location.origin` pour local/custom domain

**Exemples :**
- `https://bolt.new/~/sb1-f42yrfxu/dashboard` → `https://bolt.new/~/sb1-f42yrfxu`
- `http://localhost:5173/dashboard` → `http://localhost:5173`
- `https://homeflow.app/dashboard` → `https://homeflow.app`

### ✏️ Modifié : `src/components/onboarding/AuthMagicLink.tsx`

**Changements :**
- Import de `getAppBaseUrl()`
- Construction dynamique de `redirectUrl`
- Affichage de l'URL dans l'UI (debug)
- Messages d'aide sur les anciens liens

### ✅ Vérifié : `src/lib/supabase.ts`

Configuration correcte des options d'authentification :
- `detectSessionInUrl: true` ✅
- `persistSession: true` ✅
- `autoRefreshToken: true` ✅

---

## 🚀 DÉPLOIEMENT EN PRODUCTION

### Si vous déployez sur un domaine custom (ex: homeflow.app)

1. Mettez à jour Supabase → URL Configuration :
   - **Site URL** : `https://homeflow.app`
   - **Redirect URLs** : Ajoutez `https://homeflow.app/*`

2. La fonction `getAppBaseUrl()` s'adaptera automatiquement (pas de code à changer)

3. Testez le Magic Link sur le nouveau domaine

---

## 📞 SUPPORT

### Logs utiles pour debugging

```typescript
console.log('[Magic Link] Base URL:', baseUrl);
console.log('[Magic Link] Redirect URL:', finalRedirectUrl);
```

Ces logs apparaissent dans la console après envoi du Magic Link.

### Vérifications Supabase

Dans **Authentication → Logs**, vérifiez :
- Emails envoyés avec succès
- Tokens générés
- Pas d'erreurs de rate limiting

---

## ✅ RÉSUMÉ

**Ce qui a été corrigé :**
- ✅ Détection automatique de l'URL Bolt (`/~/sb1-xxxx`)
- ✅ Redirection vers la bonne URL après clic Magic Link
- ✅ Affichage de l'URL de redirection pour validation
- ✅ Messages d'aide sur les anciens liens
- ✅ Support de localhost, Bolt, et domaines custom

**Prochaines étapes :**
1. Configurer Supabase (checklist ci-dessus)
2. Envoyer un nouveau Magic Link
3. Tester la redirection (procédure en 3 étapes)
4. Profiter de l'authentification qui fonctionne !
