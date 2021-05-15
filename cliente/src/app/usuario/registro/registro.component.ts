import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  //Esta variable es clave, para determinar el nombre del APP del SERVIDOR. TIENE QUE COINCIDIR
  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    clave: ''
  }


  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }


  async guardar(){

    //Verifico que esten todos los datos
    if(this.usuario.nombre == '' || this.usuario.apellido == '' || this.usuario.email == '' || this.usuario.clave == ''){
      alert('No completaste todos los campos del formulario');
    }

    else{

      //Si están todos los datos, guardo del usuario en el service
      let respuesta = false;
      respuesta = await this.usuarioService.registrarse(this.usuario);

      if(respuesta){
        this.usuario = {
          nombre: '',
          apellido: '',
          email: '',
          clave: ''
        };
        
        alert ('La registración fue exitosa');
    }
    else {
      alert('Hubo un error con la registración, verifique');
    }
    }
  }
}
