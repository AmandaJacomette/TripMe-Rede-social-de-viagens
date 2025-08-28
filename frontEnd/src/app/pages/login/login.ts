import { Component } from '@angular/core';
import { InputField } from '../../components/input-field/input-field';
import { Button } from '../../components/button/button';
import { ButtonGoogle } from '../../components/button-google/button-google';
import { RouterModule } from '@angular/router'; 
import { Router } from '@angular/router'; // Importe o Router


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputField, Button, ButtonGoogle, RouterModule], // Adicione RouterModule aqui
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  constructor(private router: Router) {}

  irParaFeed() {
    this.router.navigate(['/criar-post']); // Navega para a rota /criar-post
  }
}
