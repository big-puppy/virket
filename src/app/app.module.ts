import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { 

  sesion;

  constructor(private storage: Storage, private navCtrl: NavController){
    this.obtenerSesion()
  }
 
  /**
   * Validar si ya se vio el tutorial y con base a eso se redirige
   * a tabs o a tutorial
   */
  obtenerSesion() {
    
    this.storage.get('sesion').then((val => {

      this.sesion = val;

      if (this.sesion == 'true') {
        this.irPagina("tabs")
      }else{
        this.irPagina("tutorial")
      }

    }));
  }

  /**
   * Redirecciona a la pagina solicitada
   * @param pagina 
   */
  irPagina(pagina) {
    this.navCtrl.navigateRoot([pagina]);
  }
}
