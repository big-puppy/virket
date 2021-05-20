import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.page.html',
  styleUrls: ['./carrito-compras.page.scss'],
})
export class CarritoComprasPage implements OnInit {

  carritoLocal = {products:[]}
  constructor(public apis: ApiService, private storage: Storage) { }

  ngOnInit() {
    this.obtenerCarritoLocal();
  }

  /**
   * busca si hay carrito en el local storage
   */
  obtenerCarritoLocal() {
    this.storage.get('carrito').then((val => {
      this.carritoLocal = val;
      console.log(this.carritoLocal)
    }));
  }

  /**
   * Borra el producto selccionado del carrito
   * @param producto 
   */
  borrarProdcutoDelCarrito(producto) {
    for (var x = 0; x < this.carritoLocal.products.length; x++) {
      if (producto.id == this.carritoLocal.products[x].id) {
        this.carritoLocal.products.splice(x, 1)
      }
    }
  }

}
