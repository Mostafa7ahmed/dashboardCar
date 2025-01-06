import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private supabase: SupabaseClient;
  private isAuthenticated = false;
  private readonly _router = inject(Router);

  userData: any = null;

  constructor() { 
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    localStorage.removeItem('UserAuth');
    this.userData = null;
    this._router.navigate(['/login']);
    return await this.supabase.auth.signOut();
  }



  saveUserAuth(): void {
    if (localStorage.getItem('UserAuth') != null) {
      this.userData = jwtDecode(localStorage.getItem('UserAuth')!);
    }
  }


}
