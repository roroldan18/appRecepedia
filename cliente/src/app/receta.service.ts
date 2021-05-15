import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  static listar(): any[] | PromiseLike<any[]> {
    throw new Error('Method not implemented.');
  }
  
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    withCredentials: true, //El WithCredentials TRUE me permite trabajar con Cookies
    observe: 'response' as 'response'
  };

  uri = environment.url;

  constructor(private http: HttpClient) { }

  /* Agrego los metodos que permito hacer:
  Post - Get ID - Get Nombre - Get - Update -  */

  async crearRecetaNueva(unaReceta) {
    try {
      await this.http.post(this.uri+'/receta', this.httpOptions).toPromise();
      return true;
    } 
    catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async listarReceta(){
    try {
      let respuesta : any;
      respuesta = await this.http.get(this.uri+'/receta', this.httpOptions).toPromise();
      return respuesta;
    } 
    catch (error) {
      console.log(error.message)
      return [];
    }
  }

  //Ejemplo de Buscar por ID o por nombre, en el mismo metodo

  async buscarReceta(idReceta = '', nombreReceta = ''){
    try {
      let respuesta : any;

      if (idReceta != ''){
        respuesta = await this.http.get(this.uri+'/receta/'+idReceta, this.httpOptions).toPromise();
        return [respuesta]; //Transformo en Array porque es una sola
      }
      if (nombreReceta != ''){
        respuesta = await this.http.get(this.uri+'/receta/search/'+nombreReceta, this.httpOptions).toPromise();
        return respuesta;
      }
      
    } catch (error) {
      console.log(error.message)

    }
  }

  //Metodos por separado
/*   async obtenerRecetaPorID(idReceta){
    try {
      let respuesta : any;
      respuesta = await this.http.get(this.uri+'/receta/'+idReceta, this.httpOptions).toPromise();
      return respuesta;
    } 
    catch (error) {
      console.log(error.message)
      return [];
    }
  }

  async obtenerRecetaPorNombre(nombreReceta){
    try {
      let respuesta : any;
      respuesta = await this.http.get(this.uri+'/receta/'+nombreReceta, this.httpOptions).toPromise();
      return respuesta;
    } 
    catch (error) {
      console.log(error.message)
      return [];
    }
  } */

  async modificarReceta(unaReceta){
    try {      
      await this.http.put(this.uri+'/receta/'+unaReceta._id, unaReceta, this.httpOptions).toPromise();
       // Le agrego UnaReceta que es lo que me esta devolviendo
      return true; 
      // Si espero que me mande la receta, entonces no tengo que hacerlo asi. Deberia mandar la Respuesta
      // Si solo necesito confirmación, está OK porque me dice: TRUE
    }
     
    catch (error) {
      console.log(error.message)
      return false;
    }
  }

  async borrarReceta(idReceta){
    try {
      await this.http.delete(this.uri+'/receta/'+idReceta, this.httpOptions).toPromise();
      return true;
    }

    catch (error) {
      console.log(error.message)
      return false;
    }
  }
}
