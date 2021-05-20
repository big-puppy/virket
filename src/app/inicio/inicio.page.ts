import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})

export class InicioPage implements OnInit {

  /*****DATOS PERFIL********/

  datosPerfil = { picture: {} };

  /*****PRODUCTOS***********/

  productos = [];
  productosLocales = null
  ofertas = [];

  /*****CARRITO**********/

  carrito = null
  carritoLocal = null;

  constructor(public apis: ApiService, private navCtrl: NavController, private storage: Storage) { }

  ngOnInit() {
    this.obtenerDatosPerfil();
    this.obtenerProductosLocales();
    this.obtenerCarritoLocal();
  }

  /**
   * Obtiene los datos del perfil mdiente el recurso userProfile
   */
  obtenerDatosPerfil() {
    this.apis.userProfile().subscribe(response => {
      this.datosPerfil = response.data
    })
  }

  /**
   * Valida si hay productos en el local sotorage
   * si hay los asignamos a la vairable principal this.prodcutos
   * si no hay consumimos el recurso de allProducts y los asignamos a la vairable principal this.prodcutos
   */
  obtenerProductos() {
    if (this.productosLocales != null) {
      this.productos = this.productosLocales;
      this.ontenerOfertasDelDia();
    } else {
      this.apis.allProducts().subscribe(response => {
        this.productos = response.data
        this.guardarProductosLocales();
        this.ontenerOfertasDelDia();
      })
    }
  }

  /**
   * busca si hay productos en el local storage
   */
  obtenerProductosLocales() {
    this.storage.get('productos').then((val => {
      this.productosLocales = val;
      this.obtenerProductos();
    }));
  }

  /**
   * Guarda los prodcutos en local storage
   */
  guardarProductosLocales() {
    this.storage.set("productos", this.productos)
  }

  /**
   * Obtiene las ofertas del dia filtrano los productos que tengan discount > 0
   * y agrega un nuevo atributo precionSinDescuento que es la suma del discount y product_price 
   */
  ontenerOfertasDelDia() {
    for (var x = 0; x < this.productos.length; x++) {
      if (this.productos[x].discount > 0) {
        this.productos[x]["precionSinDescuento"] = parseFloat(this.productos[x].discount) + parseFloat(this.productos[x].product_price)
        this.ofertas.push(this.productos[x]);
      }
    }
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
    } else {
      producto.is_favorite = favorito;
    }

    for (var x = 0; x < this.productos.length; x++) {
      if (producto.id == this.productos[x].id) {
        this.productos[x] = producto
      }
    }

    this.guardarProductosLocales();
  }


  /*************************CARRITO************************/

  obtenerCarrito() {

    if (this.carritoLocal != null) {
      this.carrito = this.carritoLocal;
    } else {
      this.apis.shoppingCart().subscribe(response => {
        this.carrito = response.data
        this.guardarCarritoLocal();
      })
    }
  }

  /**
   * busca si hay carrito en el local storage
   */
  obtenerCarritoLocal() {
    this.storage.get('carrito').then((val => {
      this.carritoLocal = val;
      this.obtenerCarrito();
    }));
  }

  /**
   * Guarda los prodcutos en local storage
   */
  guardarCarritoLocal() {
    console.log("carrito guardar local => ", this.carrito)
    this.storage.set("carrito", this.carrito)
  }

  agregarAlCarrito(producto){
    producto["color"] = producto.colors[0]
    delete producto.colors;
    this.carrito.products.push(producto);
    this.guardarCarritoLocal();
  }

}