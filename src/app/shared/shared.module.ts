import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';



@NgModule({
  declarations: [
    HeaderComponent,
 
  ],
  exports: [
    HeaderComponent,
    RouterModule,
 
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule 
  ],
  providers: [

    AuthService

  ]
})
export class SharedModule { }