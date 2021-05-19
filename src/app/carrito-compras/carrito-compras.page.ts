import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.page.html',
  styleUrls: ['./carrito-compras.page.scss'],
})
export class CarritoComprasPage implements OnInit {

  carrito = []
  constructor(public apis: ApiService) { }

  ngOnInit() {
    this.obtenerCarrito();
  }

  obtenerCarrito() {
    this.apis.shoppingCart().subscribe(response => {
      this.carrito = response.data
      console.log(this.carrito)
    })
  }

}
