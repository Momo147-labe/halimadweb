// Middleware d'authentification pour injecter le token JWT dans les requêtes SSR / serverFn
import { createMiddleware } from '@tanstack/react-start';

export const attachSupabaseAuth = createMiddleware({ type: 'function' }).client(
  async ({ next }) => {
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('halimad.token');
    }
    
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
