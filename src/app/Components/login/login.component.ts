import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandService } from '../../Core/services/brand.service';
import { LoginService } from '../../Core/services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  loginForm: FormGroup;
  isLoading = false;
  message = ''; 

  constructor(private fb: FormBuilder, private _loginService: LoginService , private _Router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Added email validator
      password: ['', Validators.required],
    });
  }
  

   async login() {

    const { email, password } = this.loginForm.value; // Access form values
    this.isLoading = true;

    try {
      const { data, error } = await this._loginService.signIn(email, password);
      if (error) {
        this.message = error.message;
        console.log(this.message)


      } else {
        this.message = 'Login successful!';
         localStorage.setItem("UserAuth",data.session.access_token)
        this._Router.navigate(["/car"])
      }
    } catch (err) {
      this.message = 'An unexpected error occurred.';
    } finally {
      this.isLoading = false;
    }
  }
}
