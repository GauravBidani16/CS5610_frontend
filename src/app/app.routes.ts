import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';


export const routes = [
  // { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/dashboard/dashboard.component') },
  // { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile.component') },
  { 
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    pathMatch: 'full' as const,
    redirectTo: '/register'
  },

  // { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  // { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },

  // { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  // { path: 'admin', canActivate: [authGuard, roleGuard], loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) },

  { path: '**', redirectTo: '/login' }

];
