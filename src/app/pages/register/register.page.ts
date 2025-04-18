import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  name = '';
  lastname = '';
  phone = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onRegister() {
    if (!this.name || !this.lastname || !this.phone || !this.email || !this.password) {
      this.showToast('Por favor, completa todos los campos.');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.showToast('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (this.password.length < 6) {
      this.showToast('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      console.log('Registrando usuario con datos:', {
        name: this.name,
        lastname: this.lastname,
        phone: this.phone,
        email: this.email
      });

      const result: { user: any; userData: User } = await this.authService.register(
        this.email,
        this.password,
        this.name,
        this.lastname,
        this.phone
      );

      console.log('Resultado del registro:', result);

      if (!result || !result.user) {
        throw new Error('No se pudo registrar el usuario correctamente.');
      }

      this.showToast('¡Registro exitoso!');
      await this.router.navigate(['/login']);

    } catch (error: any) {
      console.error('Error en el registro:', error);
      this.showToast('Error en el registro: ' + (error?.message || 'Desconocido'));
    }
  }

  private async showToast(message: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    document.body.appendChild(toast);
    await toast.present();
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }
}
