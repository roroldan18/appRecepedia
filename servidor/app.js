const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
var bcrypt = require('bcrypt');
const session = require('express-session');
const { uri } = require('./config');

const app = express();

app.use(session({ secret: 'abracadabra', cookie: { maxAge: 60000 }}));
app.use(express.json()); //para que ande el Body
app.use(cors());

const port = process.env.PORT?process.env.PORT:3000;

//------------------------------- ME CONECTO AL MONGO DB-----------------------------


async function conectar() {
    try{
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Conectado a la base de datos metodo: mongoodb - async-await");
    }
    catch(e){
        console.log(e);
    }
};

conectar();

/* ----------------------------- ARMO LOS ESQUEMAS ------------------------------ */

 const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    clave: String
 });

 const UsuarioModel = mongoose.model('usuario', UsuarioSchema);

 

 const RecetasSchema = new mongoose.Schema({
    nombre: String,
    ingredientes: String,
    pasos: String,
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
    }
 });

 const RecetasModel = mongoose.model('receta', RecetasSchema);


//------------------------------  REGISTRO DE USUARIO ----------------------------


app.post('/registro', async (req, res) => {
    try {
        //Paso 1: Valido que me hayan enviado todos los datos

            if (!req.body.nombre || !req.body.apellido || !req.body.email || !req.body.clave){
                throw new Error('No enviaste todos los datos');
            };

            // Paso 2: Verifico que no exista el email en la base porque es el campo de nombre de usuario
            // y debe ser unicio si o si.

        const existe = await UsuarioModel.find({email: req.body.email});

        //Si no existe, me va a devolver un array vacio. Por eso se comprueba con el Length == 0

        if (existe.length > 0) {
            throw new Error('Ese email ya se encuentra registrado');
        };

        
        //Paso 3: ENCRIPTO LA CLAVE

        const clave = await bcrypt.hash(req.body.clave, 10); // el 10 son las cantidades de caracteres que quiero que tenga la encriptacion

        //Paso 4: armo el objeto a guardar (usuario)
        const usuario = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            clave: clave
        };

        //Paso 5: guardo el nuevo usuario
        const respuesta = await UsuarioModel.create(usuario);

        res.send('Ya te registraste');
    }
    catch(e){
        console.log(e.message);
        res.status(413).send({"Error": e.message});
    }
}); 


//------------------------------LOGIN-----------------------------------


app.post('/login', async (req, res) => {
    try{

        //Paso 1: Reviso que me haya mandado los datos necesarios
        if(!req.body.email || !req.body.clave){
            res.status(413).send({
                mensaje: 'No enviaste los datos'
            });
            return; // si uso Res.status, tngo que poner return, sino uso el Throw New Error
        };

        //Paso 2: Verifico que exista el usuario. Buscar el usuario por el nombre de usuario, en este caso el email
        const usuario = await UsuarioModel.find({email: req.body.email});

        if (usuario.length == 0){
            res.status(413).send({
                mensaje: 'Nombre de usuario o password incorrecto'
            });
            return;
        }

        //Paso 3: Ahora verifico si la password coincide

        if (!bcrypt.compareSync(req.body.clave, usuario[0].clave)) {
            res.status(413).send({
                mensaje: 'Nombre de usuario o password incorrecto'
            });
            return;
        }

        //Paso 4: Creo la sesion

        req.session.usuario_id = usuario[0]._id; //-- Creo la variable de sesion
        res.status(200).send({mensaje: 'Login correcto'});
}
    catch(e) {
        console.log(e.message);
        res.status(413).send({Error: e.message});
    }
});


//------------------------- RECETAS ---------------------------

app.post('/receta', async (req, res) => {
    try{
        //Paso 1: me fijo si esta logueado
        if(!req.session.usuario_id) {
            throw new Error('No estas logueado');
        }

        //Paso 2: valido los datos de entrada

        if(!req.body.nombre || !req.body.ingredientes || !req.body.pasos) {
            throw new Error('No enviaste todos los datos');
        };

        //Paso 3: verifico que el nombre no exista para el usuario que está consultando
        //EN ESTE CASO, LA VERIFICACION ES PARA ESTE USUARIO SOLO, POR ESO SE AGREGA EL USUARIO_ID
        //Quizas hay verificaciones que sean en general para todos.

        const recetaExiste = await RecetasModel.find({nombre: req.body.nombre, usuario_id: req.session.usuario_id});

        if(recetaExiste.length > 0){
            throw new Error ('Ya tenes una receta con ese nombre');
        }

        const receta = {
            nombre: req.body.nombre,
            ingredientes: req.body.ingredientes,
            pasos: req.body.pasos,
            usuario_id: req.session.usuario_id
        }

        const recetaGuardada = await RecetasModel.create(receta);
        res.status(200).send(recetaGuardada);

    }
    catch(e){
        console.log(e.message);
        res.status(413).send({Error: e.message});
    }
})

//TAREA
// Get para una receta en particular-  app.get(receta/id)
// app.get '/receta/:nombre' para que traiga el nombre que mandaron
//app.update('/receta/:id) -- ojo, no se puede modificar el nombre. Solo los pasos y/o ingredientes
// app.delete(/receta/:id)


app.get('/receta', async (req, res) => {
    try{
        if(!req.session.usuario_id) {
            throw new Error('No estas logueado');
        }

        const recetas = await RecetasModel.find({usuario_id: req.session.usuario_id});


        res.status(200).send(recetas);

    }
    catch(e) {
        console.log(e.message);
        res.status(413).send({Error: e.message});
    }
})




app.get('/receta/:id', async (req, res) => {
    try{
        //Paso 1: me fijo si esta logueado
        if(!req.session.usuario_id) {
            throw new Error('No estas logueado');
        }

        //Paso 2: busco la receta
        const unaReceta = await RecetasModel.findById(req.params.id);

        if(!unaReceta){
            throw new Error('No existe la receta');
        }

        //Paso 3: Verifico que la receta sea de ese usuario
        if(unaReceta.usuario_id != req.session.usuario_id){
            throw new Error('No existe la receta');
        }

        //Paso 4: Verificado los puntos,
        res.status(200).send(unaReceta);

    }
    catch(e) {
        console.log(e.message);
        res.status(413).send({Error: e.message});
    }
})

app.get('/receta/search/:nombre', async (req, res) => {
    try{
        //Paso 1: Verifico que este logueado
        if(!req.session.usuario_id) {
            throw new Error('No estas logueado');
        }

        //Paso 2: Verifico que la receta exista para ese usuario
        const recetas = await RecetasModel.find({nombre: req.params.nombre, usuario_id: req.session.usuario_id});

        if(recetas.length == 0){
            throw new Error('No existe esa receta')
        }

        //Paso 3: Envio la receta
        res.send(recetas);

    }
    catch(e) {
        console.log(e.message);
        res.status(413).send({Error: e.message});
    }
})

//UPDATE: no se puede modificar el nombre

 app.put('receta/:id', async (req, res) => {
    try{
        if(!req.session.usuario_id) {
            throw new Error('No estas logueado');
        }

//Me fijo si existe la receta
        const unaReceta = await RecetasModel.findById(req.params.id);
        if(!unaReceta){
            throw new Error('No existe la receta');
        }
//Me fijo si la receta corresponde al usuario
        if(unaReceta.usuario_id != req.session.usuario_id){
            throw new Error('No existe la receta');
        }

//Valido la informacion Recibida
        if (!req.body.pasos && !req.body.ingredientes){
            throw new Error("No enviaste nada para cambiar");
        };

//Armo el UPDATE

        if(req.body.pasos){
            unaReceta.pasos = req.body.pasos;
        }
        if(req.body.ingredientes) {
            unaReceta.ingredientes = req.body.ingredientes;
        }

        const recetaModificada = await RecetaModel.findByIdAndUpdate(req.params.id, unaReceta, {new:true});
        res.send(recetaModificada);
    }
    catch(e) {
        console.log(e.message);
        res.status(413).send({Error: e.message});
    }
}) 

app.delete('/receta/:id', async (req, res) => {
    try{
        //Paso 1: me fijo si esta logueado
        if(!req.session.usuario_id) {
            throw new Error('No estas logueado');
        }

        //Paso 2: Borro
        await RecetasModel.findOneAndDelete({_id: req.params.id, usuario_id: req.session.usuario_id});

        //Paso 3: Respondo,
        res.send({mensaje: 'Se borro correctamente'});

    }
    catch(e) {
        console.log(e.message);
        res.status(413).send({Error: e.message});
    }
})



app.listen(port, () => {
    console.log('Servidor escuchando en el puerto '+ port);
});




/* 
app.get('receta/:id', async (req, res) => {
    try{

    }
    catch(e) {
        console.log(e.message);
        res.status(413).send({Error: e.message});
    }
})
 */