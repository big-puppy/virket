import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage implements OnInit {

  producto = []

  constructor(private navCtrl: NavController, private route: ActivatedRoute) {
    this.obtenerProductoInicio();
  }

  ngOnInit() {

  }

  obtenerProductoInicio() {
    this.route.queryParams.subscribe(params => {
      this.producto = JSON.parse(params["producto"])
      console.log("produdto => ", this.producto)
    })
  }

  regresar() {
    this.navCtrl.back();
  }

}
