import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  //El HTTP Options es para poder trabajar con Cookies y con la sesion en el servidor.
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    withCredentials: true, //El WithCredentials TRUE me permite trabajar con Cookies
    observe: 'response' as 'response'
  };

  uri = environment.url;

  constructor(private http: HttpClient) { }

  //Agrego el metodo REGISTRARSE y le mando unUsuario
  async registrarse(unUsuario) {
    try {
      let respuesta : any;
      respuesta = await this.http.post(this.uri+'/registro', unUsuario).toPromise();
      return true;

    }
     catch (error) {
      console.log(error.message);
      return false;
    }
  }

  //Agrego el metodo LOGIN y le mando unLogin
  async login(unLogin){
    try {
      let respuesta : any;
      respuesta = await this.http.post(this.uri+'/login', unLogin).toPromise(); //El httpOptions lo voy a agregar siempre para trabajar con sesion
      
      localStorage.setItem('email', unLogin.email);
      return true;

    }
     catch (error) {
      console.log(error.message);
      return false;
    }
  }
}
