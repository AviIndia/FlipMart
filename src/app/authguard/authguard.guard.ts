import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authguardGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const cust_id = localStorage.getItem('cust_id');
  const role = localStorage.getItem('role');

  // ✅ buyer logged in
  if (cust_id && role === 'buyer') {
    return true;
  }

  // ❌ not logged in
  router.navigate(['/login']);
  return false;
};
