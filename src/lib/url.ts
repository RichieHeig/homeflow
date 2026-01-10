/**
 * Récupère l'URL de base de l'application
 * Gère les cas spéciaux comme Bolt.new avec les URLs en /~/
 *
 * Exemples :
 * - https://bolt.new/~/sb1-f42yrfxu/dashboard -> https://bolt.new/~/sb1-f42yrfxu
 * - http://localhost:5173/dashboard -> http://localhost:5173
 * - https://homeflow.app/dashboard -> https://homeflow.app
 */
export function getAppBaseUrl(): string {
  const currentUrl = window.location.href;
  const origin = window.location.origin;

  // Détection Bolt : URL contient "/~/"
  if (currentUrl.includes('/~/')) {
    try {
      // Parse l'URL complète
      const url = new URL(currentUrl);
      const pathSegments = url.pathname.split('/').filter(Boolean);

      // Sur Bolt, la structure est : /~/ + project-id + /route
      // pathSegments = ['~', 'sb1-xxxx', 'dashboard', ...]
      // On récupère les 2 premiers segments après le split
      if (pathSegments.length >= 2 && pathSegments[0] === '~') {
        const projectId = pathSegments[1];
        return `${origin}/~/${projectId}`;
      }
    } catch (error) {
      console.error('Error parsing Bolt URL:', error);
    }
  }

  // Cas classique : local, domaine custom
  return origin;
}

/**
 * Construit l'URL complète pour une route donnée
 * @param path - Chemin relatif (ex: '/onboarding', '/dashboard')
 */
export function buildAppUrl(path: string): string {
  const baseUrl = getAppBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
