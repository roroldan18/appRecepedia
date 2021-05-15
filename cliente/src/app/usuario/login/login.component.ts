import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/usuario.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Esto coincide con APP.JS del server. (Esta info suele estar en la documentación de la API)
  usuario = {
    email: '',
    clave: ''
  }

  constructor(private usuarioService: UsuarioService, private router:Router) { }

  ngOnInit(): void {
  }

  async login(){

    //Verifico que esten todos los datos
    if(this.usuario.email == '' || this.usuario.clave == ''){
      alert('No completaste todos los campos del formulario');
    }

    else{
      //Si están todos los datos, guardo del usuario en el service
      let respuesta = false;
      respuesta = await this.usuarioService.login(this.usuario);

      if(respuesta){
        
        this.usuario = {
          email: '',
          clave: ''
        };

        this.router.navigate(['receta'], { queryParams : { } });
        
        alert ('Login correcto!');
    }
      else {
        alert('Login incorrecto');
      }
    }
  }

}
