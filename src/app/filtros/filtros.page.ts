import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.page.html',
  styleUrls: ['./filtros.page.scss'],
})
export class FiltrosPage {

  productos = null;
  productosCopia = [];

  filtros = []
  estiloFiltro = "catego";

  constructor(private navCtrl: NavController) { }

  ionViewDidEnter() {
    this.obtenerProductosLocales();
  }

  /**
   * busca si hay productos en sesion
   */
  obtenerProductosLocales() {
    this.productos = JSON.parse(sessionStorage.getItem("productos"))
    this.productosCopia = this.productos;
    this.obtenerFiltros()
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

  /**
   * creacion de un arreglo pra guardar solo el dato de la propiedad brand
   * se agrega un objeto para tener el filtro todos
   */
  obtenerFiltros() {

    this.filtros.push({ nombre: "todos", filtra: false, clase: this.estiloFiltro });

    for (var x = 0; x < this.productos.length; x++) {
      this.filtros.push({ nombre: this.productos[x].brand, filtra: false, clase: this.estiloFiltro });
    }

    this.eliminarFiltrosDuplicados();

  }

  /**
   * Elimina los filtros ques estan ma de una vez
   */
  eliminarFiltrosDuplicados() {
    for (var x = 0; x < this.productos.length; x++) {

      var filtrosAux = [];

      for (var y = 0; y < this.filtros.length; y++) {
        if (this.filtros[y].nombre == this.productos[x].brand) {
          filtrosAux.push(y)
        }
      }

      for (var f = 1; f < filtrosAux.length; f++) {
        if (filtrosAux.length > 1) {
          this.filtros.splice(filtrosAux[f], 1)
        }
      }
    }
  }

  /**
   * Manejo de filtro o filtros selccionados
   * @param index 
   */
  filtrarProductos(index) {

    if (this.filtros[index].clase == "catego-sele") {
      this.filtros[index].clase = "catego"
      this.filtros[index].filtra = false
    } else {
      this.filtros[index].clase = "catego-sele"
      this.filtros[index].filtra = true
    }

    var productosAux = [];

    if (index == 0) {

      for (var x = 0; x < this.filtros.length; x++) {
        if (x !== index) {
          this.filtros[x].filtra = false;
          this.filtros[x].clase = this.estiloFiltro
        }
      }

    } else {

      if (this.filtros[0].clase !== this.estiloFiltro) {
        this.filtros[0].clase = "catego"
      }

      for (var x = 0; x < this.filtros.length; x++) {
        for (var y = 0; y < this.productosCopia.length; y++) {
          if (this.productosCopia[y].brand == this.filtros[x].nombre && this.filtros[x].filtra == true) {
            productosAux.push(this.productosCopia[y]);
          }
        }
      }

    }

    if (productosAux.length == 0) {
      this.productos = this.productosCopia;
    } else {
      this.productos = productosAux;
    }

  }

}
