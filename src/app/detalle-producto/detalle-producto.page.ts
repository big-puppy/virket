import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'
import { Storage } from '@ionic/storage';
import { IonicToastService } from '../services/toast/ionic-toast.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage {

  MSG_AGREGAR_FAVORITO = "Se agrego a favoritos"
  MSG_QUITAR_fAVORITO = "Se quito de favoritos"
  MSG_AGREGAR_PRODUCTO = "Producto agregado correctamente"

  producto = []
  productos = [];
  carrito = { products: [], subtotal: 0, shipping: "", total: 0 }

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private storage: Storage, public toastController: IonicToastService) { }

  ionViewDidEnter() {
    this.obtenerProductoInicio();
    this.obtenerProductosLocales();
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

  /**
   * busca si hay productos en el local storage
   */
   obtenerProductosLocales() {
    this.storage.get('productos').then((val => {
      this.productos = val;
    }));
  }

  /**
   * Guarda los prodcutos en local storage
   */
   guardarProductosLocales() {
    this.storage.set("productos", this.productos)
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


  /***********FAVORITO***************/

  /**
   * Con base al producto entrante podemos marcarlo como favorito
   * o no favorito, despues lo reasiganamo en productos
   * y esos productos los sobrescribimos en el local storage
   * @param producto 
   */
   favoritos(producto) {

    var favorito = true;
    var noFavorito = false;

    if (producto.is_favorite == true) {
      producto.is_favorite = noFavorito;
      this.toastController.showToast(this.MSG_QUITAR_fAVORITO)
    } else {
      producto.is_favorite = favorito;
      this.toastController.showToast(this.MSG_AGREGAR_FAVORITO)
    }

    for (var x = 0; x < this.productos.length; x++) {
      if (producto.id == this.productos[x].id) {
        this.productos[x] = producto
      }
    }

    this.guardarProductosLocales();
  }

}
