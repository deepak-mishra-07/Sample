import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { 
    path: 'signin', 
    loadComponent: () => import('./auth/signin/signin').then(m => m.Signin)
  },
  { 
    path: 'signup', 
    loadComponent: () => import('./auth/signup/signup').then(m => m.Signup)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/signin' }
];
