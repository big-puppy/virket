import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})

export class InicioPage implements OnInit {

  datosPerfil;
  productos;
  
  constructor(public apis: ApiService) { }

  ngOnInit() {
    this.obtenerDatosPerfil();
    this.obtenerProductos();
  }

  obtenerDatosPerfil() {
    this.apis.userProfile().subscribe(response => {
      this.datosPerfil = response.data
      console.log(this.datosPerfil);
    })
  }

  obtenerProductos() {
    this.apis.allProducts().subscribe(response => {
      this.productos = response.data
      console.log(this.productos);
    })
  }

}