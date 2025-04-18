import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    if (!this.email || !this.password) {
      await this.showToast('Por favor, complete ambos campos.');
      return;
    }

    this.isLoading = true;

    try {
      const userCredential = await firstValueFrom(
        this.authService.login(this.email, this.password)
      );

      if (userCredential && userCredential.user) {
        await this.showToast('¡Bienvenido!');
        this.router.navigateByUrl('/home');
      } else {
        await this.showToast('Inicio de sesión fallido. Verifique sus credenciales.');
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      let message = 'Error al iniciar sesión. Intente de nuevo.';

      switch (error?.code) {
        case 'auth/user-not-found':
          message = 'Usuario no encontrado.';
          break;
        case 'auth/wrong-password':
          message = 'Contraseña incorrecta.';
          break;
        case 'auth/invalid-email':
          message = 'Correo electrónico inválido.';
          break;
      }

      await this.showToast(message);
    } finally {
      this.isLoading = false;
    }
  }

  private async showToast(message: string) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
    toast.position = 'bottom';
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    await toast.present();
  }
}