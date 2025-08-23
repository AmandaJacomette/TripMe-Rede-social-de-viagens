import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './pages/login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Login],
  template: '<app-login></app-login>',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontEnd');
}
