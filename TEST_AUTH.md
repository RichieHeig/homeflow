# Procédure de Test Auth - 3 Étapes

## Étape 1 : Demander un Magic Link

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur "Créer un foyer" ou "Rejoindre un foyer"
3. Entrez votre email et cliquez sur "Recevoir le lien de connexion"

**Vérification** : Vous devez voir l'URL de redirection affichée. Elle DOIT correspondre à votre environnement :
- Sur Bolt.new : `https://bolt.new/~/sb1-f42yrfxu/onboarding?intention=...`
- Sur localhost : `http://localhost:5173/onboarding?intention=...`

Si ce n'est pas le cas, vérifiez votre configuration Supabase (voir SUPABASE_AUTH_GUIDE.md).

---

## Étape 2 : Cliquer sur le lien dans l'email

1. Ouvrez votre boîte email
2. Trouvez l'email "Your Magic Link" de Supabase
3. Cliquez sur le bouton "Log In"

**Vérification** : L'URL dans votre navigateur après le clic doit :
- Commencer par votre environnement (bolt.new ou localhost:5173)
- Contenir `/onboarding?intention=...`
- Vous rediriger automatiquement vers l'application

Si vous arrivez sur une page d'erreur ou `localhost:3000`, votre configuration Supabase est incorrecte.

---

## Étape 3 : Vérifier la session

Ouvrez la console développeur (F12) et collez ce code :

```javascript
// Test 1 : Vérifier la session
const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
console.log('Session:', sessionData.session);
console.log('Erreur session:', sessionError);

// Test 2 : Vérifier l'utilisateur
const { data: userData, error: userError } = await supabase.auth.getUser();
console.log('Utilisateur:', userData.user);
console.log('Erreur utilisateur:', userError);

// Test 3 : Vérifier l'URL détectée
console.log('URL actuelle:', window.location.href);
console.log('Origin:', window.location.origin);
```

**Résultat attendu** :
- `Session` : Objet avec `access_token`, `refresh_token`, etc.
- `Utilisateur` : Objet avec `id`, `email`, `aud: "authenticated"`, etc.
- Aucune erreur

**Si session = null** :
- Vérifiez que l'URL de redirection est autorisée dans Supabase
- Vérifiez que vous avez cliqué sur le lien le plus récent
- Consultez SUPABASE_AUTH_GUIDE.md

---

## Test Automatique Complet

Copiez-collez ce script dans la console (F12) pour un diagnostic complet :

```javascript
async function testAuth() {
  console.log('=== TEST AUTHENTIFICATION HOMEFLOW ===\n');

  // 1. Environnement
  console.log('1. ENVIRONNEMENT');
  console.log('   URL complète:', window.location.href);
  console.log('   Origin:', window.location.origin);
  console.log('   Pathname:', window.location.pathname);
  console.log('   Environnement détecté:', window.location.href.includes('/~/') ? 'Bolt.new' : 'Local/Production');

  // 2. Session
  console.log('\n2. SESSION');
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error('   ❌ Erreur session:', sessionError);
  } else if (sessionData.session) {
    console.log('   ✅ Session active');
    console.log('   - Email:', sessionData.session.user.email);
    console.log('   - User ID:', sessionData.session.user.id);
    console.log('   - Expire à:', new Date(sessionData.session.expires_at * 1000).toLocaleString());
  } else {
    console.warn('   ⚠️  Aucune session active');
  }

  // 3. Utilisateur
  console.log('\n3. UTILISATEUR');
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error('   ❌ Erreur utilisateur:', userError);
  } else if (userData.user) {
    console.log('   ✅ Utilisateur connecté');
    console.log('   - ID:', userData.user.id);
    console.log('   - Email:', userData.user.email);
    console.log('   - Rôle:', userData.user.aud);
    console.log('   - Confirmé:', userData.user.email_confirmed_at ? 'Oui' : 'Non');
  } else {
    console.warn('   ⚠️  Aucun utilisateur');
  }

  // 4. LocalStorage
  console.log('\n4. LOCALSTORAGE');
  const supabaseKeys = Object.keys(localStorage).filter(k => k.includes('supabase'));
  if (supabaseKeys.length > 0) {
    console.log('   ✅ Clés Supabase trouvées:', supabaseKeys.length);
    supabaseKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`   - ${key}: ${value ? value.substring(0, 50) + '...' : 'vide'}`);
    });
  } else {
    console.warn('   ⚠️  Aucune clé Supabase dans localStorage');
  }

  // 5. Conclusion
  console.log('\n5. DIAGNOSTIC');
  if (sessionData.session && userData.user) {
    console.log('   ✅ TOUT FONCTIONNE ! Vous êtes authentifié.');
  } else {
    console.log('   ❌ PROBLÈME DÉTECTÉ');
    console.log('   Actions recommandées :');
    console.log('   1. Vérifiez la config Supabase (SUPABASE_AUTH_GUIDE.md)');
    console.log('   2. Demandez un nouveau Magic Link');
    console.log('   3. Vérifiez que vous cliquez sur le lien le plus récent');
  }

  console.log('\n=== FIN DU TEST ===');
}

// Lancer le test
testAuth();
```

---

## Problèmes Fréquents

### "Session: null" après clic sur le lien

**Cause** : URL de redirection non autorisée dans Supabase

**Solution** :
1. Allez dans Supabase Dashboard > Authentication > URL Configuration
2. Ajoutez l'URL de redirection dans la liste
3. Sauvegardez
4. Demandez un NOUVEAU lien

### Redirigé vers "localhost:3000" ou mauvaise URL

**Cause** : "URL du site" incorrecte dans Supabase

**Solution** :
1. Changez "URL du site" pour correspondre à votre environnement
2. Demandez un NOUVEAU lien (les anciens liens gardent l'ancienne config)

### "User: null" mais "Session: {...}"

**Cause** : Session expirée ou corrompue

**Solution** :
```javascript
// Dans la console
await supabase.auth.signOut();
// Puis redemandez un Magic Link
```
