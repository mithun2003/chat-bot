import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../../services/token/token.service';

/**
 * Authentication Guard Function
 *
 * This function is used as a guard to protect routes that require authentication.
 * It checks for the presence of an authentication token. If a token is present,
 * the user is allowed to access the route. If not, the user is redirected to the
 * login page.
 *
 * @returns True if the user is authenticated and can access the route, otherwise False.
 */
export const authGuard = (): boolean | Observable<boolean> => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  if (!tokenService.token) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};
