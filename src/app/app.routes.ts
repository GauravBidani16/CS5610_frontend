import { AdminComponent } from './components/admin/admin.component';
import { ImageDetailsComponent } from './components/image-details/image-details.component';
import { SearchComponent } from './components/search/search.component';
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
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'profile/:username',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/my-profile/my-profile.component').then(m => m.MyProfileComponent)
  },
  {
    path: 'unsplash',
    loadComponent: () => import('./components/unsplash/unsplash.component').then(m => m.UnsplashComponent)
  },
  { path: 'search', component: SearchComponent },
  { path: 'search/:query', component: SearchComponent },
  { path: 'details/:query', component: ImageDetailsComponent },
  { path: 'admin', component: AdminComponent },
  {
    path: '',
    pathMatch: 'full' as const,
    redirectTo: '/home'
  },

  // { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  // { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },

  // { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  // { path: 'admin', canActivate: [authGuard, roleGuard], loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) },

  { path: '**', redirectTo: '/login' }
];
