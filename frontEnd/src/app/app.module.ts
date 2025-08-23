import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// Componentes
import { App } from './app';
import { InputField } from './components/input-field/input-field';
import { Button } from './components/button/button';
import { Login } from './pages/login/login';

@NgModule({
  declarations: [
    // Remova todos os componentes standalone e o App daqui
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // Importe os componentes standalone aqui
    App,
    InputField,
    Button,
    Login
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule {}