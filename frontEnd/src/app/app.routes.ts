import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
//import { Feed } from './pages/feed/feed';
import { CriarPost } from './pages/criar-post/criar-post';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  {path: 'criar-post', component: CriarPost}
];