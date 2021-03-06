import { Component } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/recursos-api/api.service';
import { IonicToastService } from '../services/toast/ionic-toast.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})

export class InicioPage {

  MSG_AGREGAR_FAVORITO = "Se agrego a favoritos"
  MSG_QUITAR_fAVORITO = "Se quito de favoritos"
  MSG_AGREGAR_PRODUCTO = "Producto agregado correctamente"

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

  constructor(public apis: ApiService, private navCtrl: NavController, public toastController: IonicToastService) { }

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

  /********************PRODUCTOS*****************/

  /**
   * Valida si hay productos en el local sotorage
   * si hay los asignamos a la vairable principal this.prodcutos
   * si no hay consumimos el recurso de allProducts y los asignamos a la vairable principal this.prodcutos
   */
  obtenerProductos() {
    if (this.productosLocales != null) {
      this.productos = this.productosLocales;
      this.manejoDePropiedadSeccion();
      this.ontenerOfertasDelDia();
    } else {
      this.apis.allProducts().subscribe(response => {
        this.productos = response.data
        this.manejoDePropiedadSeccion();
        this.guardarProductosLocales();
        this.ontenerOfertasDelDia();
      })
    }
  }

  /**
   * busca si hay productos en la sesion
   */
  obtenerProductosLocales() {
    this.productosLocales = JSON.parse(sessionStorage.getItem("productos"));
    this.obtenerProductos();
  }

  /**
   * Guarda los prodcutos en sesion
   */
  guardarProductosLocales() {
    sessionStorage.setItem('productos', JSON.stringify(this.productos));
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
   * y esos productos los sobrescribimos en sesion
   * @param producto 
   */
  favoritos(producto, index) {

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

    this.ocultarSeccion(index);

    this.guardarProductosLocales();
  }


  /*************************CARRITO************************/

  /**
   * Muestra la seccion para a??adir al carito o marcar como favotiro
   * @param indice 
   */
  mostrarSeccion(indice) {

    this.manejoDePropiedadSeccion();

    this.productos[indice].seccion = true;
  }

  /**
   * Oculta la seccion para a??adir al carito o marcar como favotiro
   * @param indice 
   */
  ocultarSeccion(indice) {

    this.productos[indice].seccion = false;
  }

  /**
   * Agrega el atributo seccion a todos los productos 
   * con el valor false
   */
  manejoDePropiedadSeccion() {

    for (var x = 0; x < this.productos.length; x++) {
      this.productos[x].seccion = false;
    }

  }

/**
 * si el carrito local tiene datos se asigna a la variable principal this.carrito
 * si el caarito local es null se consume el recurso shoppingCart y se asigna a la variable principal this.carrito
 */
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
   * busca si hay carrito en sesion
   */
  obtenerCarritoLocal() {
    this.carritoLocal = JSON.parse(sessionStorage.getItem("carrito"))
    this.obtenerCarrito();
  }

  /**
   * Guarda los prodcutos en el carrito de sesion
   */
  guardarCarritoLocal() {
    sessionStorage.setItem("carrito", JSON.stringify(this.carrito))
  }

  /**
   * Agregar prodcuto entrante al carrito local
   * se crea la propiedad color y se asigna la poscion 0 de colors
   * se elimina la propiedad colors
   * @param producto 
   */
  agregarAlCarrito(producto, i) {
    producto["color"] = producto.colors[0]
    delete producto.colors;
    this.carrito.products.push(producto);
    this.guardarCarritoLocal();
    this.ocultarSeccion(i)
    this.toastController.showToast(this.MSG_AGREGAR_PRODUCTO)
  }
}