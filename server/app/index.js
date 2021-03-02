const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const fs= require('fs');
const https = require('https');
const fetch = require('node-fetch');
const cors = require('cors');
const Notes = require("./model/notes");
const Asignaturas = require("./model/asignaturas");
const Moduls = require("./model/moduls");

const accessTokenSecret = 'jesus';

const PORT = 8093;

var Login = require('./model/login');

var CrudLogin = require('../db/crudLogin');
const crudLogin = require('../db/crudLogin');
const login = require('./model/login');

var loginCrud = new CrudLogin.CrudLogin();

console.log("Escoltant peticions en el port " + PORT)
let app = express();

let varToken;

/*https.createServer({
    key: fs.readFileSync('./cert/my_cert.key'),
    cert: fs.readFileSync('./cert/certificatProves.crt')
},app).listen(PORT, ()=>{
    console.log("Servidor HTTPS escoltant al port" + PORT + "...");
});*/

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(bodyParser.json());
app.use(cors());
app.listen(PORT);


const users = [
    {
        username: 'pepito',
        password: '1234',
        role: 'admin'
    }
];


mongoose.connect('mongodb://localhost:27017/testMongoose',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });


//app.listen(port);


const authenticateJWT = (req, res, next) => {
    // arrepleguem el JWT d'autorització
    console.log("req: ")
    //console.log(req)
    //console.log(req.headers)
    console.log(req.headers.authorization)
    const authHeader = req.headers.authorization;
    if (authHeader) { // si hi ha toquen
        console.log("si hi ha toquen")
        // recuperem el jwt
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                console.log("err verify")
                console.log(err)
                return res.sendStatus(401);
            } else {
                console.log("not err verify")
            }
            console.log("afegim user")
            console.log(user)
            // afegim a la petició les dades que venien en el jwt user
            req.user = user;
            // s'executa la segïuent funció, un cop s'ha fet el middleware
            console.log("executem next")
            next();
        });
    } else { // no està. contestem directament al client amb un error
        //401(unauthorized)
        console.log("no hi ha token")
        res.sendStatus(401);
    }
};


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
                                
                                    console.log("username: " + username);
                                    console.log("");
                                
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

            console.log("username: ")
            console.log(username)

            console.log("resultado");
            console.log(resultado.id);

            if (resultado.role === "professor") {
                console.log("es profe")
                // Si que es profe
                // Generar els tokens i respondre
                let autToken = jwt.sign({
                    username:username,
                    idUser:resultado.id,
                    role:"professor"
                },accessTokenSecret);

                console.log("idUser: " + resultado.id)
            
            
                console.log("res json");
                //console.log(res);

                res.json({
                    autToken
                });

            } else if (resultado.role === "alumne") {
                console.log("es alumne")

                console.log("uername: " + username)
                console.log("idUser: " + resultado.id)

                // Si que es profe
                // Generar els tokens i respondre
                let autToken = jwt.sign({
                    username:username,
                    idUser:resultado.id,
                    role:"alumne"
                },accessTokenSecret);
            
            
                console.log("res json");
                //console.log(res);

                res.json({
                    autToken
                });

            } else {
                console.log("Vamos a enviar usuario incorrecto")
                // No es profe
                let autToken = jwt.sign({
                    username:username,
                    idUser:resultado.id,
                    role:"alumne"
                },accessTokenSecret);
            
                varToken = autToken;
            
                console.log("res json");
                //console.log(res);
                
                res.json({
                    autToken
                });

                /*res.send({
                    ok:false,
                    msg:"El usuario no és professor. Expulsión directa"
                });*/                
            }
        });
    });
});

//Practica GET /notes
app.get("/notes", authenticateJWT, (req, res) => {
    var notes = new Notes.Notes();
    let id = req.user.idUser;
    let role = req.user.role;
    console.log("get notes")
    console.log("id: "+ id);
    console.log("role: " + role);
    notes.getNotes(id,role,res); 
});

//Practica GET /notes/idAssig
app.get("/notesId", authenticateJWT, (req, res) => {
    var nota = new Notes.Notes();
    let idAssig = req.query.id;
    let idAlumne = req.user.idUser;
    console.log("notesId idUser: " + req.user.idUser)
    let role = req.user.role
    console.log("role: " + role)
    if (role !== "alumne") {
        console.log("El usuari no és alumne")
        res.sendStatus(401);
        return;
    }
    console.log(req.query)
    console.log(req.params)
    console.log("idAssig: ")
    console.log(idAssig)
    console.log("idAlumne: ")
    console.log(idAlumne)
    console.log("role: ")
    // console.log(role)
    console.log("routeParams")
    //console.log(this.$route.params)
    
    nota.getNota(idAlumne, idAssig, role, res);
});

//Get totes les assignatures
app.get("/assignatura", authenticateJWT, (req, res) => {
    var assig = new Asignaturas.Asignaturas();
    assig.getAssignatures(res);
});

//Get assignatura id
app.get("/assignaturaId", authenticateJWT, (req, res) => {
    var assig = new Asignaturas.Asignaturas();
    let id_assig = req.query.id;
    assig.getAssignaturaId(id_assig, res);
});

//Get /moduls als cuals imparteix classe el professor
app.get("/moduls",authenticateJWT,(req,res)=>{
    var modul = new Moduls.Moduls()
    let id = req.user.idUser
    let role = req.user.role
    console.log("id getModuls: ")
    console.log(id)
    console.log("role getModuls: " + role)

    modul.getModuls(id,role,res)
})

//Get /moduls/id_assig
app.get("/modulsId",authenticateJWT,(req,res)=>{
    var modul = new Moduls.Moduls()
    let id = req.user.idUser
    let id_modul = req.query.id
    let role = req.user.role
    console.log('id: ' + id)
    console.log('id_modul: ' + id_modul)
    console.log('role: ' + role)
    modul.getModulId(id,id_modul,role,res)
})



/*loginCrud.getAllUsers(res=>{
    return console.log(res);
});*/

app.get('/bienvenida', (req, res) => {
    console.log(req.query);
    res.send('Hola, bienvenido/a');

});
