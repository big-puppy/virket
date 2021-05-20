import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.page.html',
  styleUrls: ['./filtros.page.scss'],
})
export class FiltrosPage {

  productos = [];
  prodcutosCopia = [];

  constructor(private storage: Storage, private navCtrl: NavController) { }

  ionViewDidEnter(){
    this.obtenerProductosLocales();
  }

  /**
   * busca si hay productos en el local storage
   */
  obtenerProductosLocales() {
    this.storage.get('productos').then((val => {
      this.productos = val;
      this.prodcutosCopia = this.productos;
    }));
  }

   /**
   * Con base al producto entrante navegamos a la pagina detalle-producto y podemos
   * ver el detalle de ese producto
   * @param producto 
   */
    verDetalleProducto(producto) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          producto: JSON.stringify(producto)
        }
      }
      this.navCtrl.navigateRoot(["detalle-producto"], navigationExtras);
    }

}
