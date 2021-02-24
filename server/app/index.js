const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const fs= require('fs');
const https = require('https');
const fetch = require('node-fetch');

const accessTokenSecret = 'jesus';

const PORT = 8081;

var Login = require('./model/login');

var CrudLogin = require('../db/crudLogin');
const crudLogin = require('../db/crudLogin');
const login = require('./model/login');

var loginCrud = new CrudLogin.CrudLogin();

console.log("Escoltant peticions en el port " + PORT)
let app = express();

/*https.createServer({
    key: fs.readFileSync('./cert/my_cert.key'),
    cert: fs.readFileSync('./cert/certificatProves.crt')
},app).listen(PORT, ()=>{
    console.log("Servidor HTTPS escoltant al port" + PORT + "...");
});*/
app.listen(PORT);


const users = [
    {
        username: 'pepito',
        password: '1234'
        //role: 'admin'
    }
];


mongoose.connect('mongodb://localhost:27017/testMongoose',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

let contactoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{9}$/
    }, edad: {
        type: Number,
        min: 18,
        max: 120
    }
});

let Contacto = mongoose.model('contactos', contactoSchema);


//app.listen(port);
app.use(bodyParser.json());

const authenticateJWT = (req, res, next) => {
    // arrepleguem el JWT d'autorització
    const authHeader = req.headers.authorization;
    if (authHeader) { // si hi ha toquen
        // recuperem el jwt
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            // afegim a la petició les dades que venien en el jwt user
            req.user = user;
            // s'executa la segïuent funció, un cop s'ha fet el middleware
            next();
        });
    } else { // no està. contestem directament al client amb un error
        //401(unauthorized)
        res.sendStatus(401);
    }
};

app.post('/contactos', (req, res) => {
    let nuevoContacto = new Contacto({
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        edad: req.body.edad
    });
    nuevoContacto.save().then(resultado => {
        res.status(200)
            .send({ ok: true, resultado: resultado });
    }).catch(error => {
        res.status(400).send({
            ok: false,
            error: "Error añadiendo contacto"
        });
    });
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//Practica POST register
app.post('/register',(req,res)=>{
    let nomComplet = req.body.nomComplet;
    let dni = req.body.dni;
    let username = req.body.username;
    let password = req.body.password;
    let avatar = "";

    loginCrud.getUser_Username(username, (results,err)=>{
        if(err) {
            res.status(500)
                .send({ok:false, error:err});
        } else {
            //Error si añades otro usuario igual
            if(results.length) {
                res.status(400)
                    .send({ok:false, error: "Ya hemos añadido a este usuario"});
            } else {
                loginCrud.verificarDniProfesor(dni, (resultDni, err)=> {
                    if(err) {
                        res.status(500)
                            .send({ok:false, error: "Error: " + err});
                    } else {
                        console.log("resultDni");
                        console.log(resultDni);
                        //Se inserta al usuario
                        loginCrud.insertarUsuario({username:username, password:password, full_name:nomComplet, avatar:avatar}, (results,err,fields)=>{
                            //Error si el dni ya existe
                            console.log("index.js: ");
                            console.log(err);
                            if(err != null) {
                                res.status(500)
                                    .send({ok:false, error: "Error: el dni ya existe en la bd"});
                            } else {
                                var idUsuario = results.insertId;
                                //Se comprueba si es profesor, si es se insertará en la tabla professor
                                console.log("idUsuario: ");
                                console.log(idUsuario);
                                console.log("resultDni: ");
                                console.log(resultDni.length);

                                if(dni.length > 0) {
                                    console.log("insertarProfesor")
                                    loginCrud.insertarProfesor(idUsuario, dni);

                                    let autToken = jwt.sign({
                                        username:username,
                                        role:"professor"
                                    },accessTokenSecret);
                                
                                
                                    console.log("res json");
                                    //console.log(res);
                    
                                    res.json({
                                        autToken
                                    });


                                //Si es alumno, se insertará en la tabla alumne
                                } else {
                                    console.log("insertarAlumno")
                                    loginCrud.insertarAlumno(idUsuario);

                                    let autToken = jwt.sign({
                                        username:username,
                                        role:"alumne"
                                    },accessTokenSecret);
                                
                                
                                    console.log("res json");
                                    //console.log(res);
                    
                                    res.json({
                                        autToken
                                    });
                                    
                                }
                            }
                        });
                    }
                })
            }
        }
    });

});

//Practica POST login
app.post('/login',(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    
    console.log("req");
    console.log(req);
    
    console.log("body");
    console.log(req.body);

    
    //Es lo mateix que les variables de dalt
    //let {username,password}=req.body;
    console.log("username: " + username);
    console.log("password: " + password);

    //sql username i password
    loginCrud.userPassValid(username, password, resultadoValid=>{

        //Comprobar si es alumne o profe
        console.log("resultadoValid");
        console.log(resultadoValid)
        console.log(resultadoValid.length)

        if (resultadoValid.length == 0) {
            res.send({
                ok:false,
                msg:"El usuari o password es incorrecta"
            });
            return;
        }
        console.log("continuamos")
        loginCrud.usuariProfeAlumne(username, resultado=>{

            console.log("resultado");
            console.log(resultado);
            if (resultado) {
                // Si que es profe
                // Generar els tokens i respondre
                let autToken = jwt.sign({
                    username:username,
                    role:"professor"
                },accessTokenSecret);
            
            
                console.log("res json");
                //console.log(res);

                res.json({
                    autToken
                });

            } else {
                console.log("Vamos a enviar usuario incorrecto")
                // No es profe
                res.send({
                    ok:false,
                    msg:"El usuario no és professor. Expulsión directa"
                });
            }
        });
    });
});

loginCrud.getAllUsers(res=>{
    return console.log(res);
});



app.get('/contactos', (req, res) => {
    Contacto.find().then(resultado => {
        res.status(200)
            .send({ ok: true, resultado: resultado });
    }).catch(error => {
        res.status(500).
            send({ ok: false, error: "Error obteniendo contactos" });
    });
});

app.get('/bienvenida', (req, res) => {
    console.log(req.query);
    res.send('Hola, bienvenido/a');

});

/*

app.get('/contactos', authenticateJWT, (req, res) => {
    Contacto.find()
        .then(resultado => {
            res.status(200)
                .send({ ok: true, res: resultado });
        }).catch(error => {
            res.status(500).
                send({ ok: false, error: "Error obteniendo contactos" })
        });
});

app.get('/contactos/:id',authenticateJWT, (req, res) => {
    const user = req.user;

    if(user.role=="admin"){
        Contacto.findById(req.params.id)
        .then(resultado => {
            if (resultado)
                res.status(200)
                    .send({ ok: true, resultado: resultado });
            else
                res.status(400)
                    .send({ ok: false, error: "No se han encontrado contactos" });
        })
        .catch(error => {
            res.status(400)
                .send({ ok: false, error: "Error buscando el contacto indicado" });
        });
    }else {
        res.status(402).send({
            ok:false,
            msg:"No tens dret a accedir açí"
        });
    }

    
});

app.post('/contactos', (req, res) => {
    let nuevoContacto = new Contacto({
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        edad: req.body.edad
    });
    nuevoContacto.save().then(resultado => {
        res.status(200)
            .send({ ok: true, resultado: resultado });
    }).catch(error => {
        res.status(400).send({
            ok: false,
            error: "Error añadiendo contacto"
        });
    });
});

app.put('/contactos/:id', (req, res) => {
    Contacto.findByIdAndUpdate(req.params.id, {
        $set: {
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            edad: req.body.edad
        }
    }, { new: true }).then(resultado => {
        res.status(200)
            .send({ ok: true, resultado: resultado });
    }).catch(error => {
        res.status(400)
            .send({
                ok: false,
                error: "Error actualizando contacto"
            });
    });
});

app.delete('/contactos/:id', (req, res) => {


    Contacto.findByIdAndRemove(req.params.id)
        .then(resultado => {
            res.status(200)
                .send({ ok: true, resultado: resultado });
        }).catch(error => {
            res.status(400)
                .send({
                    ok: false,
                    error: "Error eliminando contacto"
                });
        });
});

app.post('/login',(req,res)=>{
    //let userName = req.body.userName;
    //let password = req.body.password;
    
    //Es lo mateix que les variables de dalt
    let {username,password}=req.body;

    const usuari = users.find(u=>{
        return u.username==username && u.password==password
    });

    if(usuari) {
        //Creem el token 
        let autToken = jwt.sign({
            username:username,
            role:u.role
        },accessTokenSecret);

        //L´enviem al client
        res.status(200).json(autToken);

    }else {
        res.status(400).send({
            ok:false,
            msg:"El usuari o password es incorrecta"
        });
    }

});*/