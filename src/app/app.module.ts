import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { NavController } from '@ionic/angular';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { 

  sesion;

  constructor(private navCtrl: NavController){
    this.obtenerSesion()
  }
 
  /**
   * Validar si ya se vio el tutorial y con base a eso se redirige
   * a tabs o a tutorial
   */
  obtenerSesion() {
    
    this.sesion = localStorage.getItem('sesion')

      if (this.sesion == 'true') {
        this.irPagina("tabs")
      }else{
        this.irPagina("tutorial")
      }
  }

  /**
   * Redirecciona a la pagina solicitada
   * @param pagina 
   */
  irPagina(pagina) {
    this.navCtrl.navigateRoot([pagina]);
  }
}
