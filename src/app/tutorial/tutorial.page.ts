import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage {

  constructor(private navCtrl: NavController) { }

  /**
   * Guarda la sesion para informar que el tutorial ya se vio
   */
  guardarSesion() {
    localStorage.setItem('sesion', 'true');
    this.irPagina()
  }

  /**
   * Redirecciona a la pagina tabs
   */
  irPagina() {
    this.navCtrl.navigateRoot(["tabs"]);
  }

}
