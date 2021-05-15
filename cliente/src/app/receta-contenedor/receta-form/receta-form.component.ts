import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RecetaService } from 'src/app/receta.service';

@Component({
  selector: 'app-receta-form',
  templateUrl: './receta-form.component.html',
  styleUrls: ['./receta-form.component.css']
})
export class RecetaFormComponent implements OnInit {

  @Output() guardeRecetaNueva = new EventEmitter();

  receta = {
    nombre: '',
    ingredientes: '',
    pasos: ''
  };

  constructor(private recetaService: RecetaService) { }

  ngOnInit(): void {
  }


  async guardar(){

    //Verifico que esten todos los datos
    if(this.receta.nombre == '' || this.receta.ingredientes == '' || this.receta.pasos == ''){
      alert('No completaste todos los campos del formulario');
    }

    else{

      //Si están todos los datos, guardo la receta en el service
      let respuesta = false;
      respuesta = await this.recetaService.crearRecetaNueva(this.receta);

      if(respuesta){
        this.receta = {
          nombre: '',
          ingredientes: '',
          pasos: ''
        };

        this.guardeRecetaNueva.emit();
    }
    else {
      alert('Hubo un error en el guardado, verifique');
    }
    }

  }
}
