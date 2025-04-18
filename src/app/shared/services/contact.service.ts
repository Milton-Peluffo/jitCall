import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}


  addContact(userId: string, contact: any) {
    return this.firestore
      .collection('users')
      .doc(userId)
      .collection('contacts')
      .add(contact);
  }

  // Función para obtener los contactos del usuario desde su subcolección
  getContacts(userId: string): Observable<any[]> {
    return this.firestore
      .collection('users')
      .doc(userId)
      .collection('contacts')
      .valueChanges({ idField: 'id' });  // Incluye el ID de cada documento
  }

  // Función para buscar un contacto por teléfono
  getContactsByPhone(userId: string, phone: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('users')
        .doc(userId)
        .collection('contacts', ref => ref.where('phone', '==', phone))
        .get()
        .subscribe(snapshot => {
          if (snapshot.empty) {
            resolve(false); // No existe un contacto con este teléfono
          } else {
            resolve(true); // Ya existe un contacto con este teléfono
          }
        }, error => {
          reject(error);
        });
    });
  }
}

