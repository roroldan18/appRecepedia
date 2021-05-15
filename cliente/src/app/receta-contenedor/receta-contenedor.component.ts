import { Component, OnInit } from '@angular/core';
import { RecetaService } from '../receta.service';

@Component({
  selector: 'app-receta-contenedor',
  templateUrl: './receta-contenedor.component.html',
  styleUrls: ['./receta-contenedor.component.css']
})
export class RecetaContenedorComponent implements OnInit {

  recetas = [];

  constructor(private recetaService: RecetaService) { }

  async ngOnInit() {
    //Llamo al service a traves del metodo refrezcarListado
    this.refrezcarListado();
  }

  async refrezcarListado(){
    this.recetas = await this.recetaService.listarReceta();
  }



}
