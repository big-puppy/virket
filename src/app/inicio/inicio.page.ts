import { Component } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import { IonicToastService } from '../services/ionic-toast.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})

export class InicioPage {

  myToast: any;

  /*****DATOS PERFIL********/

  datosPerfil = { fullName: '', picture: {} };

  /*****PRODUCTOS***********/

  productos = [];
  productosLocales = null
  ofertas = [];

  /*****CARRITO**********/

  carrito = { products: [], subtotal: 0, shipping: "", total: 0 }
  carritoLocal = null;

  constructor(public apis: ApiService, private navCtrl: NavController, private storage: Storage, public toastController: IonicToastService) { }

  ionViewDidEnter() {
    this.obtenerDatosPerfil();
    this.obtenerProductosLocales();
    this.obtenerCarritoLocal();
  }

  /**
   * Obtiene los datos del perfil mediente el recurso userProfile
   * corta el fullName y rescribe soo con el promer nombre
   */
  obtenerDatosPerfil() {
    this.apis.userProfile().subscribe(response => {
      this.datosPerfil = response.data
      var name = this.datosPerfil.fullName.split(" ")
      this.datosPerfil.fullName = name[0];
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
      for (var x = 0; x < this.productos.length; x++) {
        this.productos[x].agregar = false;
      }
      this.ontenerOfertasDelDia();
    } else {
      this.apis.allProducts().subscribe(response => {
        this.productos = response.data
        for (var x = 0; x < this.productos.length; x++) {
          this.productos[x].agregar = false;
        }
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
  favoritos(producto,i) {

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

    this.ocultar(i);

    this.guardarProductosLocales();
  }


  /*************************CARRITO************************/

  mostrar(i) {

    for (var x = 0; x < this.productos.length; x++) {
      this.productos[x].agregar = false;
    }

    this.productos[i].agregar = true;
  }

  ocultar(i) {

    this.productos[i].agregar = false;
  }

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
    this.storage.set("carrito", this.carrito)
  }

  /**
   * Agregar prodcuto entrante al carrito local
   * se crea la propiedad color y se asigna la poscion 0 de colors
   * se elimina la propiedad colors
   * @param producto 
   */
  agregarAlCarrito(producto,i) {
    producto["color"] = producto.colors[0]
    delete producto.colors;
    this.carrito.products.push(producto);
    this.calcularTotal();
    this.guardarCarritoLocal();
    this.ocultar(i)
    this.toastController.showToast('Producto agregado correctamente')
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
  }
}