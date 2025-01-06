import { LoginService } from './../../Core/services/login.service';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
 
  constructor(private _LoginService:LoginService){}

  logout(){
    this._LoginService.signOut();
  }
}
