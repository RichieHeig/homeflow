# Configuration des Redirections Supabase pour Bolt.new

## Problème
Les liens magiques redirigent vers `localhost:3000` au lieu de votre URL Bolt.new

## Solution

### Étape 1 : Accéder à la configuration
1. Allez sur : https://supabase.com/dashboard/project/phojtiaaesozznnlaxrl
2. Dans le menu latéral gauche, cliquez sur **Authentication**
3. Cliquez sur **URL Configuration**

### Étape 2 : Configurer les URLs autorisées

Dans la section **Redirect URLs**, ajoutez ces URLs (une par ligne) :

```
https://bolt.new/**
http://localhost:5173/**
http://localhost:3000/**
```

⚠️ **Important** : Le `**` à la fin est crucial - il autorise toutes les sous-routes

### Étape 3 : Configurer la Site URL (optionnel)

Dans **Site URL**, vous pouvez mettre :
```
https://bolt.new
```

Ou laisser :
```
http://localhost:3000
```

### Étape 4 : Sauvegarder
Cliquez sur le bouton **Save** en bas de la page

---

## Vérification

Après avoir sauvegardé :

1. Retournez sur votre application Bolt.new
2. Ouvrez la console du navigateur (F12)
3. Demandez un nouveau lien magique
4. Vérifiez les logs dans la console - vous devriez voir :
   ```
   [Magic Link] Base URL: https://bolt.new/~/sb1-f42yrfxu
   [Magic Link] Redirect URL: https://bolt.new/~/sb1-f42yrfxu/onboarding?intention=...
   ```

5. Vérifiez votre email - le lien devrait maintenant pointer vers `bolt.new`

---

## Captures d'écran des sections

### Où trouver "URL Configuration"
```
Dashboard Supabase
├── Project (votre projet)
    └── Authentication
        └── URL Configuration  ← Cliquez ici
```

### Ce que vous devez voir
```
┌─────────────────────────────────────────┐
│ Site URL                                │
│ https://bolt.new                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Redirect URLs                           │
│ https://bolt.new/**                     │
│ http://localhost:5173/**                │
│ http://localhost:3000/**                │
│ + Add URL                               │
└─────────────────────────────────────────┘

            [Save] button
```

---

## Dépannage

### Si ça ne marche toujours pas après configuration

1. **Videz le cache de votre navigateur** (Ctrl+Shift+R ou Cmd+Shift+R)

2. **Vérifiez que les wildcards sont bien activés** dans votre dashboard Supabase :
   - Les `**` doivent être présents dans les URLs
   - Pas d'espaces avant ou après les URLs

3. **Attendez 1-2 minutes** - Supabase peut prendre quelques instants pour propager les changements

4. **Demandez un NOUVEAU lien magique** - Les anciens liens utilisent l'ancienne configuration

5. **Vérifiez les logs de la console** pour voir quelle URL est générée

### Les anciens emails ne fonctionneront pas
Les liens magiques déjà envoyés utilisent l'ancienne configuration (localhost). Vous devez demander un nouveau lien après avoir sauvegardé la configuration.

---

## Pourquoi ce problème existe

Supabase utilise une liste blanche (whitelist) d'URLs autorisées pour des raisons de sécurité. Par défaut, seul `localhost` est autorisé. Bolt.new utilise des URLs dynamiques comme `/~/sb1-xxxxx`, donc nous devons utiliser un wildcard `**` pour autoriser toutes les variations.
