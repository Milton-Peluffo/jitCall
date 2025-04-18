import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
  
})
export class HeaderComponent  implements OnInit {

  @Input() backRoute: string = '/intro'; 
  @Input() title: string = 'jitCall';
  
  constructor(private router: Router, private authservice: AuthService) { }

  goBack() {
    this.router.navigate([this.backRoute]);
  }

  ngOnInit() {}


}
