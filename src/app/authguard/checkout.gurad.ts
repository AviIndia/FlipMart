import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const checkoutGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  
  const role = localStorage.getItem('role');

 // ❌ Not logged in OR not buyer
  if (role !== 'buyer') {
    router.navigate(['/login-register'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // ✅ Logged in buyer
  return true;
};
