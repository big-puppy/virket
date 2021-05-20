import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'
import { Storage } from '@ionic/storage';
import { IonicToastService } from '../services/ionic-toast.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage {

  MSG_AGREGAR_PRODUCTO = "Producto agregado correctamente"

  producto = []
  carrito = { products: [], subtotal: 0, shipping: "", total: 0 }

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private storage: Storage, public toastController: IonicToastService) { }

  ionViewDidEnter() {
    this.obtenerProductoInicio();
    this.obtenerCarritoLocal();
  }

  /**
   * Obtiene el producto seleccionado en la pantalla inicio
   */
  obtenerProductoInicio() {
    this.route.queryParams.subscribe(params => {
      this.producto = JSON.parse(params["producto"])
      console.log("produdto => ", this.producto)
    })
  }

  /**
   * Regresa a inicio
   */
  regresar() {
    this.navCtrl.back();
  }

  /*************************CARRITO************************/

  /**
   * busca si hay carrito en el local storage
   */
  obtenerCarritoLocal() {
    this.storage.get('carrito').then((val => {
      this.carrito = val;
    }));
  }

  /**
  * Agregar prodcuto entrante al carrito local
  * se crea la propiedad color y se asigna la posicion del color seleccionado de colors
  * se elimina la propiedad colors
  * @param producto 
  */
  agregarAlCarrito(producto, i) {
    producto["color"] = producto.colors[i]
    delete producto.colors;
    this.carrito.products.push(producto);
    this.guardarCarritoLocal();
    this.toastController.showToast(this.MSG_AGREGAR_PRODUCTO)
    this.regresar();
  }

  /**
 * Guarda los prodcutos en el carrito del local storage
 */
  guardarCarritoLocal() {
    this.storage.set("carrito", this.carrito)
  }

}
