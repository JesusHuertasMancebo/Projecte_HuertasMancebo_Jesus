var db = require("../../db/database");

class Moduls {
  mydb = new db.Database();

  constructor() {}

  getModuls(id,role,res) {
    if (role == "professor") {
        let conn = this.mydb.getConnection();
        let sql =" SELECT assignatura.* FROM assignatura, notes WHERE notes.id_profe = ? AND notes.id_assig = assignatura.id_assig GROUP BY assignatura.id_assig";
        //console.log("sql: ")
        //console.log(sql)
        //console.log("role: ")
        //console.log(role)
        conn.query(sql,[id],(err,results)=>{
            console.log("id: ")
            console.log(id)
            if(err){
                res.status(401).send({
                    OK:false,
                    error:"Aquest professor no te cap modul"
                })
            }else{
                var modul = []
                console.log("results: ")
                results.forEach(resu => {
                    modul.push({
                        id_assig: resu.id_assig,
                        cod_assig: resu.cod_assig,
                        nom_assig: resu.nom_assig,
                        modul: resu.modul,
                        curs: resu.curs,
                        hores: resu.hores
                    })
                })
                console.log(results)
                res.status(200).send({results})
            }
        })
    }else{
        res.status(401).send({
            OK:false,
            error:"Usuari no autoritzat"
        })
    }
  }

  getModulId(id_profe,id_alumne,role,res){
    if(role=="professor"){

      console.log("id_profe: " + id_profe)
      console.log("id_alumne: " + id_profe)

      let conn = this.mydb.getConnection()
      let sql = " SELECT n.id_alumne,alu.full_name,n.id_assig,a.cod_assig,n.nota FROM notes as n, assignatura as a,users as alu "+
                " WHERE n.id_alumne = alu.id AND n.id_profe = ? AND n.id_assig = ? AND n.id_assig = a.id_assig "
      conn.query(sql,[id_profe,id_alumne],(err,results)=>{
          if(err){
              res.status(404).send({
                  OK:false,
                  error:"No s'han trobat les dades"
              })
          }else{
              var atributs = []
              results.forEach(element => {
                  
                  element.links = {
                      assig:"GET https://localhost:8093/assignatura/"+ element.id_assig,
                      alumne:"GET https://localhost:8093/alumne/"+element.id_alumne,
                      nota: "PUT https://localhost:8093/moduls/"+element.id_assig +"/"+ element.id_alumne
                      
                  }
                  atributs.push(element)
                  
              });
          }
          if(atributs.length > 0){
              res.status(200).send({ OK:true,atributs})    
          }else{
              res.status(200).send({OK:true, results:"Aquest professor imparteix aquest modul",atributs })
          }
          
      })
    }
    else{
        res.status(401).send({
            OK:false,
            error:"L´usuari no està autoritzat"
        })
    }
  }
}
module.exports = {
    Moduls: Moduls,
};