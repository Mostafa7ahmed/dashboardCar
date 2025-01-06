import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { isPlatformBrowser } from '@angular/common';

export const isauthGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService); 
  const router = inject(Router); 
  const _isPlatformId = inject(PLATFORM_ID)

  if (isPlatformBrowser(_isPlatformId)) {
    const _router = inject(Router);
    if (localStorage.getItem('UserAuth') !== null) {
      _router.navigate(['/car']);

      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }

  return true;
};
