import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontEnd');
}
