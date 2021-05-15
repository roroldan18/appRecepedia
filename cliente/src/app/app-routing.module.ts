import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecetaContenedorComponent } from './receta-contenedor/receta-contenedor.component';
import { LoginComponent } from './usuario/login/login.component';
import { RegistroComponent } from './usuario/registro/registro.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'receta', component: RecetaContenedorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
