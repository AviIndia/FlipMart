import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  
  const role = localStorage.getItem('role');

  if (role) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
