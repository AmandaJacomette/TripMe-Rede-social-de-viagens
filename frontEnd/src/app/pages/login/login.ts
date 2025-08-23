import { Component } from '@angular/core';
import { InputField } from '../../components/input-field/input-field';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputField, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

}
