import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  sesion;

  constructor(private storage: Storage, private navCtrl: NavController) { }

  ngOnInit() {
    this.obtenerSesion()
  }

  guardarSesion() {
    this.storage.set('sesion', 'true');
    this.irPagina()
  }

  obtenerSesion() {
    this.storage.get('sesion').then((val => {
      console.log("valor -> ", val)
      this.sesion = val;

      if (this.sesion == 'true') {
        this.irPagina()
      }

    }));
  }

  irPagina() {
    this.navCtrl.navigateRoot(["tabs"]);
  }

}
