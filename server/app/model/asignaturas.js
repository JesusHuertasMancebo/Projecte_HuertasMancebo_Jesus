var db = require("../../db/database");
class Asignaturas {
  mydb = new db.Database();

  constructor() {}

  getAssignatures(res) {
    let conn = this.mydb.getConnection();
    let sql = " SELECT * FROM assignatura";
    //console.log("sql: ")
    //console.log(sql)
    conn.query(sql, (err, results) => {
      if (err) {
        res.status(401).send({
          OK: false,
          error: " No s´han trobat les assignatures",
        });
      } else {
        res.status(201).send({ OK: true, results });
      }
    });
  }

  getAssignaturaId(id, res) {
    let conn = this.mydb.getConnection();
    let sql = " SELECT * FROM assignatura WHERE id_assig = ? ";
    //console.log("sql: ")
    //console.log(sql)
    conn.query(sql, [id], (err, results) => {
      console.log("id: ")
      console.log(id)
      if (err) {
        res.status(401).send({
          OK: false,
          error: " No s´ha trobat l´assignatura",
        });
      } else {
        res.status(201).send({ OK: true, results });
      }
    });
  }
}
module.exports = {
  Asignaturas: Asignaturas
};