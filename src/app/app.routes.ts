import { Routes } from '@angular/router';
import { CarComponent } from './Components/car/car.component';
import { BodyComponent } from './Components/body/body.component';
import { BrandComponent } from './Components/brand/brand.component';
import { LoginComponent } from './Components/login/login.component';
import { RoutesComponent } from './Layouts/routes/routes.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { authGuard } from './Core/guards/auth.guard';
import { isauthGuard } from './Core/guards/isauth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'car', 
    pathMatch: 'full', 
  },
  {
    path: '',
    component: RoutesComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'car',
        title: 'Car',
        component: CarComponent,
      },
      {
        path: 'brand',
        title: 'Brand',
        component: BrandComponent,
      },
      {
        path: 'body',
        title: 'Body',
        component: BodyComponent,
      },
    ],
  },
  {
    path: 'login',
    title: 'Login',
    canActivate: [isauthGuard],
    component: LoginComponent,
  },
  {
    path: '**',
    title: 'Not Found',
    component: NotfoundComponent,
  },
];
