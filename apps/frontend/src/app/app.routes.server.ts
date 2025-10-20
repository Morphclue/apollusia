import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Use Server-Side Rendering for all routes (no prerendering)
  // This avoids issues with Keycloak and other runtime dependencies
  { path: '**', renderMode: RenderMode.Server },
];
