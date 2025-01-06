import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const _isPlatformId = inject(PLATFORM_ID)
  const _router = inject(Router);
 
   if (isPlatformBrowser(_isPlatformId)) {
     if (localStorage.getItem('UserAuth') !== null) {
       return true;
     } else {
       _router.navigate(['/login']);
       return false;
     }
   } else {
     return false;
   }
};
