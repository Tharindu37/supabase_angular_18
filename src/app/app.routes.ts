import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: 'chat',
    loadComponent: () =>
      import('./components/chat/chat.component').then(
        (com) => com.ChatComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (com) => com.LoginComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (com) => com.LoginComponent
      ),
  },
];
