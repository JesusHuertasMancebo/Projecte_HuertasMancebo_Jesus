var db = require("../../db/database");
class Notes {
    mydb = new db.Database();
    constructor() {}

    //Consulta les notes de les assignatures de cada alumne
    getNotes(id, role, res) {
        //console.log("id getNotes: ")
        //console.log(id)
        //console.log("role getNotes: ")
        //console.log(role)
        let conn = this.mydb.getConnection();
        var sql = ""
        if (role == "professor") {
          console.log("professor")
          sql =
            " SELECT * FROM notes, assignatura WHERE notes.id_profe = ? AND notes.id_assig = assignatura.id_assig ";
          
        } else {
          console.log("alumne")
          /*console.log("Profe")
          res.status(401).send({
            OK: false,
            error: "Aquest usuari no esta autoritzat",
          });*/
          sql =
            " SELECT * FROM notes, assignatura WHERE notes.id_alumne = ? AND notes.id_assig = assignatura.id_assig ";
        }
        console.log("SQL: " + sql.replace(/\?/g, id))
        conn.query(sql, [id], (err, results) => {
          if (err) {
            console.log(err);
            res.status(401).send({
              OK: false,
              error: "Error al buscar les notes",
            });
          } else {
            console.log("else")
            var notes = [];
            console.log("results")
            console.log(results)
            results.forEach((valors) => {
              notes.push({
                id_assig: valors.id_assig,
                cod_assig: valors.cod_assig,
                nota: valors.nota,
                links: {
                  get:"GET http://localhost:8093/notes/" + valors.id_assig,
                },
              });
            }),
              res.status(201).send({
                notes,
              });
          }
        });
    }
    //Per a veure una nota en concret
    getNota(id_alumne, id_assig,role, res) {
      if (role == "alumne") {
        let conn = this.mydb.getConnection();
        // let sql = " SELECT * FROM notes as n, assignatura as a WHERE (n.id_alumne = ? AND n.id_assig = a.id_assig AND n.id_assig = ?) ";
        let sql = " SELECT n.*, a.*, u.username FROM notes as n, assignatura as a, users as u WHERE (n.id_assig = a.id_assig AND n.id_assig = ? AND u.id = n.id_alumne AND n.id_alumne = ?) ";
        console.log("getNota sql: " + sql)
        conn.query(sql, [id_assig, id_alumne], (err, results) => {
          if (err) {
            res.status(401).send({
              OK: false,
              error: "Error al buscar la nota de l'assignatura",
            });
          } else {
            //No està matriculat
            console.log("resultats: " + results.length)
            if (results.length == 0) {
              res.status(401).send({
                OK: false,
                error: "L'alumne no està matriculat en aquesta assignatura",
              });
            } else {
              var nota = [];
              results.forEach(valors => {
                nota.push({
                  nota: valors.nota,
                  id_assig: valors.id_assig,
                  cod_assig: valors.cod_assig,
                  id_alumne: valors.id_alumne,
                  username: valors.username,
                  link: {
                    get:
                      "GET http://localhost:8093/notes/" + valors.id_assig,
                  },
                });
              });
              res.status(201).send({OK:true, notes:nota});
            }
          }
        });
      } else {
        res.status(401).send({
          OK: false,
          error: "Usuari no autoritzat",
        });
      }
    }
}
module.exports = {
    Notes: Notes
  };