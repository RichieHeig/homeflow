# Guide Configuration Magic Link Supabase

## Checklist Configuration Supabase Dashboard

### 1. Accéder aux Paramètres d'Authentification

1. Ouvrez votre projet Supabase : https://supabase.com/dashboard/project/wjqzpeknlqgkndsnwgtp
2. Dans le menu latéral, cliquez sur **Authentication**
3. Cliquez sur **URL Configuration**

### 2. Configuration pour Bolt.new

**URL du site** :
```
https://bolt.new
```

**URL de redirection autorisées** (ajoutez TOUTES ces lignes) :
```
https://bolt.new/~/sb1-f42yrfxu/**
https://bolt.new/**
http://localhost:5173/**
https://homeflow-household-t-wahn.bolt.host/**
```

### 3. Sauvegarder

Cliquez sur **Save** en bas de la page.

---

## Procédure de Test (3 étapes)

### Étape 1 : Demander un nouveau Magic Link

1. Ouvrez l'application sur Bolt.new
2. Cliquez sur "Créer un foyer" ou "Rejoindre un foyer"
3. Entrez votre email et cliquez sur "Recevoir le lien de connexion"
4. **IMPORTANT** : Notez l'URL de redirection affichée - elle DOIT contenir `bolt.new`, pas `localhost`

### Étape 2 : Vérifier l'email et cliquer sur le lien

1. Ouvrez votre boîte email
2. Ouvrez l'email "Your Magic Link" de Supabase
3. Cliquez sur "Log In"
4. **Vérifiez l'URL** dans votre navigateur - elle doit commencer par `https://bolt.new/~/sb1-f42yrfxu`

### Étape 3 : Vérifier la connexion

1. Vous devez être redirigé vers `/onboarding?intention=create` (ou `join`)
2. Ouvrez la console développeur (F12)
3. Tapez : `await supabase.auth.getUser()`
4. Vous devez voir votre utilisateur avec un `id` et votre `email`

---

## Vérification du Code

Le code est déjà configuré correctement :

- **Redirection dynamique** : `getAppBaseUrl()` détecte automatiquement si vous êtes sur Bolt.new ou localhost
- **Supabase client** : Configuré avec `detectSessionInUrl: true`, `persistSession: true`, et `autoRefreshToken: true`
- **Aide UI** : Messages clairs pour utiliser le lien le plus récent

---

## Problèmes Fréquents

### Le lien redirige vers localhost:3000

**Cause** : L'URL du site dans Supabase pointe vers une ancienne URL

**Solution** :
1. Vérifier que "URL du site" = `https://bolt.new`
2. Demander un NOUVEAU lien magic link (les anciens liens gardent l'ancienne config)

### Le lien redirige vers localhost:5173 mais je suis sur Bolt.new

**Cause** : "URL du site" pointe vers localhost

**Solution** : Changer "URL du site" vers `https://bolt.new`

### Session non détectée après clic

**Cause** : URL de redirection non autorisée

**Solution** : Ajouter toutes les URLs de redirection listées ci-dessus

---

## Console de Debug

Ouvrez la console (F12) pour voir les logs :

```javascript
// Vérifier l'URL de base détectée
console.log('Base URL:', window.location.origin);

// Vérifier la session actuelle
const { data } = await supabase.auth.getSession();
console.log('Session:', data.session);

// Vérifier l'utilisateur
const { data: userData } = await supabase.auth.getUser();
console.log('User:', userData.user);
```
