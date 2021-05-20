import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class IonicToastService {

  myToast: any;

  constructor(public toast: ToastController) { }

  showToast(mensaje) {
    this.myToast = this.toast.create({
      message: mensaje,
      duration: 2000
    }).then((toastData) => {
      toastData.present();
    });
  }
}
