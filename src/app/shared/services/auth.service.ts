import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  /**
   * Registra un nuevo usuario en Firebase Authentication
   * y guarda sus datos adicionales en Firestore
   */
  async register(email: string, password: string, name: string, lastname: string, phone: string): Promise<{ user: any; userData: User }> {
    try {
      // 1. Crear usuario en Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (!user || !user.uid) {
        throw new Error('No se pudo obtener el UID del usuario después del registro.');
      }

      // 2. Validar formato del teléfono
      const phoneNumber = Number(phone);
      if (isNaN(phoneNumber)) {
        throw new Error('El número de teléfono debe contener solo dígitos.');
      }

      // 3. Preparar datos para Firestore
      const userData: User = {
        uid: user.uid,
        email: email,
        name: name,
        lastname: lastname,
        phone: phoneNumber
      };

      // 4. Guardar en Firestore con manejo explícito de errores
      await this.firestore.collection('users').doc(user.uid).set(userData)
        .then(() => {
          console.log('✅ Datos del usuario guardados en Firestore:', userData);
        })
        .catch((firestoreError) => {
          console.error('❌ Error al guardar en Firestore:', firestoreError);
          throw new Error('Error al guardar los datos adicionales del usuario.');
        });

      return { user, userData };

    } catch (error: any) {
      console.error('🔥 Error completo en AuthService.register:', error);
      
      // Mensajes de error específicos
      let errorMessage = 'Error desconocido al registrar el usuario.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está registrado.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (error.message.includes('teléfono')) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Inicia sesión con email y contraseña
   */
  login(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      catchError((error) => {
        console.error('Error en AuthService.login:', error);
        
        let errorMessage = 'Error al iniciar sesión.';
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'Usuario no encontrado.';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Contraseña incorrecta.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Cierra la sesión actual
   */
  logout(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error en AuthService.logout:', error);
        throw new Error('Ocurrió un error al cerrar sesión.');
      });
  }

  /**
   * Obtiene el estado de autenticación actual
   */
  getUser(): Observable<any> {
    return this.afAuth.authState;
  }

  /**
   * Verifica si el usuario actual está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    return !!user;
  }
}