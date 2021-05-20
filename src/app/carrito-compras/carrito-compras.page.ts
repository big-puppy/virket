import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.page.html',
  styleUrls: ['./carrito-compras.page.scss'],
})
export class CarritoComprasPage implements OnInit {

  carritoLocal = []
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

}
