import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: false
})
export class IntroPage implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      window.location.href = '/login';
    }, 3000);
  }

}
