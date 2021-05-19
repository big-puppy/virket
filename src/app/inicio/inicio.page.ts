import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})

export class InicioPage implements OnInit {

  datosPerfil = { picture: {} };
  productos = [] ;
  ofertas = [] ;

  constructor(public apis: ApiService) { }

ngOnInit() {
  this.obtenerDatosPerfil();
  this.obtenerProductos();
}

obtenerDatosPerfil() {
  this.apis.userProfile().subscribe(response => {
    this.datosPerfil = response.data
  })
}

obtenerProductos() {
  this.apis.allProducts().subscribe(response => {
    this.productos = response.data
    this.ontenerOfertasDelDia();
  })
}

ontenerOfertasDelDia(){
  for(var x = 0;x<this.productos.length;x++){
    if(this.productos[x].discount > 0 ){
      this.productos[x]["precionSinDescuento"] = parseFloat(this.productos[x].discount) + parseFloat(this.productos[x].product_price)
      this.ofertas.push(this.productos[x]);
    }
  }
}

  

}