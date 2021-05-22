import { Component } from '@angular/core';
import { IonicToastService } from '../services/toast/ionic-toast.service';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.page.html',
  styleUrls: ['./carrito-compras.page.scss'],
})
export class CarritoComprasPage {

  MSG_BORRAR_PRODUCTO = "Prodcuto eliminado"

  carrito = { products: [], subtotal: 0, shipping: "", total: 0 }

  seccionarPantalla = "cont-gris"
  banderaMenuTotal = false;

  constructor(public toastController: IonicToastService) { }

  ionViewDidEnter() {
    this.obtenerCarritoLocal();
  }

  /**
   * busca si hay carrito en sesion
   */
  obtenerCarritoLocal() {
    this.carrito = JSON.parse(sessionStorage.getItem("carrito"))
    this.establecerEnvio()
    this.calcularTotal();
  }

  /**
   * Borra el producto selccionado del carrito
   * @param producto 
   */
  borrarProdcutoDelCarrito(producto) {
    for (var x = 0; x < this.carrito.products.length; x++) {
      if (producto.id == this.carrito.products[x].id) {
        this.carrito.products.splice(x, 1)
      }
    }
    this.establecerEnvio();
    this.calcularTotal();
    this.toastController.showToast(this.MSG_BORRAR_PRODUCTO);
  }

  /**
   * Guarda los prodcutos en el carrito de sesion
   */
  guardarCarritoLocal() {
    sessionStorage.setItem("carrito", JSON.stringify(this.carrito))
  }

  /**
   * calcula el subtotal con base a la suma del product_price de cada producto
   * calcula el total con base a la suma del subtotal y el shipping
   */
  calcularTotal() {
    var total = 0;
    for (var x = 0; x < this.carrito.products.length; x++) {
      total += parseFloat(this.carrito.products[x].product_price);
    }
    this.carrito.subtotal = total;
    this.carrito.total = this.carrito.subtotal + parseFloat(this.carrito.shipping)
    this.guardarCarritoLocal();
  }

  /**
   * Establece el shipping cuando no hay prodcutos a 0
   * y cuando hay uno o mas productos a 150
   */
  establecerEnvio() {
    if (this.carrito.products.length > 0) {
      this.carrito.shipping = "150";
    } else if (this.carrito.products.length == 0) {
      this.carrito.shipping = "";
    }
  }

  /**
   * Muestra la info del total
   */
  mostrarTotal() {
    this.banderaMenuTotal = true;
    this.seccionarPantalla = "cont-gris-aux"
  }

  /**
   * Oculta la info del total
   */
  ocultarTotal() {
    this.banderaMenuTotal = false;
    this.seccionarPantalla = "cont-gris"
  }

}
