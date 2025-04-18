import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { AddContactPage } from '../add-contact/add-contact.page';
import { Contact } from 'src/app/interfaces/contact';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ContactService } from 'src/app/shared/services/contact.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})

export class HomePage implements OnInit {
  contacts: Contact[] = [];
  userData: User | null = null;


  constructor(
    private menuCtrl: MenuController,
    private contactService: ContactService,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertController: AlertController,

  ) {}

  ngOnInit() {
    this.loadContacts(); // Cargar los contactos al iniciar la página

  
  }
  // Cargar los contactos del usuario actual
  loadContacts() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.contactService.getContacts(userId).subscribe((data) => {
          this.contacts = data;
        });
      }
    });
  }

  // Abrir el modal para agregar un contacto
  async openAddContactModal() {
    const modal = await this.modalCtrl.create({
      component: AddContactPage
    });

    modal.onDidDismiss().then(() => {
      this.loadContacts(); // Recargar los contactos después de agregar uno nuevo
    });

    await modal.present();
  }


  // Método para abrir el menú
  openMenu() {
    this.menuCtrl.open('main-menu');
  }

  // Método para cerrar sesión
  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, salir',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    });

    await alert.present();
  }

}





