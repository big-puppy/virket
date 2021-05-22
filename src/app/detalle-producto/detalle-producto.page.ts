import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'
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

  color = 0;
  producto = []
  productos = [];
  carrito = { products: [], subtotal: 0, shipping: "", total: 0 }

  constructor(private navCtrl: NavController, private route: ActivatedRoute, public toastController: IonicToastService) { }

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
    })
  }

  /**
   * Regresa a inicio
   */
  regresar() {
    this.navCtrl.back();
  }

  /**
   * busca si hay productos en sesion
   */
  obtenerProductosLocales() {
    this.productos = JSON.parse(sessionStorage.getItem("productos"))
  }

  /**
   * Guarda los prodcutos en sesion
   */
  guardarProductosLocales() {
    sessionStorage.setItem("productos", JSON.stringify(this.productos))
  }

  /**
   * Enfoca el color que selccionas
   * obtiene el indice del color seleccionado y lo guarda en this.color
   * @param div 
   * @param index 
   */
  enfocarColor(div, index) {
    var elemento = document.getElementById("cont-colores");
    this.color = index;
    for (var x = 0; x < elemento.children.length; x++) {
      elemento.children[x].className = "color"
    }
    div.srcElement.className = "color-selec";

  }

  /*************************CARRITO************************/

  /**
   * busca si hay carrito en sesion
   */
  obtenerCarritoLocal() {
    this.carrito = JSON.parse(sessionStorage.getItem("carrito"))
  }

  /**
  * Agregar prodcuto entrante al carrito local
  * se crea la propiedad color y se asigna la posicion del color seleccionado de colors
  * se elimina la propiedad colors
  * @param producto 
  */
  agregarAlCarrito(producto) {
    producto["color"] = producto.colors[this.color]
    delete producto.colors;
    this.carrito.products.push(producto);
    this.guardarCarritoLocal();
    this.toastController.showToast(this.MSG_AGREGAR_PRODUCTO)
    this.regresar();
  }

  /**
 * Guarda los prodcutos en sesion
 */
  guardarCarritoLocal() {
    sessionStorage.setItem("carrito", JSON.stringify(this.carrito))
  }


  /***********FAVORITO***************/

  /**
   * Con base al producto entrante podemos marcarlo como favorito
   * o no favorito, despues lo reasiganamo en productos
   * y esos productos los sobrescribimos en sesion
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
