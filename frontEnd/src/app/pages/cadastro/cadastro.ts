import { Component } from '@angular/core';
import { InputField } from '../../components/input-field/input-field';
import { Button } from '../../components/button/button';
import { ButtonGoogle } from '../../components/button-google/button-google';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [InputField, Button, ButtonGoogle],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss'
})
export class Cadastro {}