import { Component} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ContactService } from 'src/app/shared/services/contact.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
  standalone: false
})
export class AddContactPage {

  name = '';
  lastname = '';
  phone = '';


  constructor(
    private contactService: ContactService,
    private modalCtrl: ModalController,
    private authService: AuthService,

  ) { }

dismiss(){
  this.modalCtrl.dismiss();
}

addContact() {
  this.authService.getUser().subscribe(user => {  
    if (user) {
      const userId = user.uid;
      const contact = {
        name: this.name,
        lastname: this.lastname,
        phone: this.phone,
        userId: userId
      };


      this.contactService.addContact(userId, contact).then(() => {
        console.log('Contacto agregado:', contact);
        this.dismiss(); // Cerrar el modal después de agregar el contacto
      }).catch((error: any) => {
        console.error('Error al agregar el contacto:', error);
      });
    }
  });
}

}
