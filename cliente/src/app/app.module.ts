import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './usuario/registro/registro.component';
import { LoginComponent } from './usuario/login/login.component';
import { RecetaFormComponent } from './receta-contenedor/receta-form/receta-form.component';
import { RecetaListComponent } from './receta-contenedor/receta-list/receta-list.component';
import { RecetaContenedorComponent } from './receta-contenedor/receta-contenedor.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
    RecetaFormComponent,
    RecetaListComponent,
    RecetaContenedorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
