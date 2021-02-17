drop schema if exists `GestioNotes`;

create schema `GestioNotes`;
use `GestioNotes`;

CREATE TABLE curs(
	id INT(10) PRIMARY KEY AUTO_INCREMENT NOT NULL ,
    nomCurs VARCHAR(20)
);

CREATE TABLE categoriaAlumne(
	id INT(10) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    categoria_alumne VARCHAR(20)
);

CREATE TABLE alumnes(
	idAlumne INT(10) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nomUsuari VARCHAR(20),
    contrasena VARCHAR(20) NOT NULL,
    nomComplet VARCHAR(50) NOT NULL,
    imgAvatar VARBINARY(40),
    idCurs INT(10) NOT NULL,
    idCategoria INT(10) NOT NULL,
    FOREIGN KEY (`idCurs`) REFERENCES `curs` (`id`),
    FOREIGN KEY (`idCategoria`) REFERENCES `categoriaAlumne` (`id`)
);

CREATE TABLE profesors(
	idProfesor INT(10) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nomUsuari VARCHAR(20),
    contrasena VARCHAR(20) NOT NULL,
    nomComplet VARCHAR(50) NOT NULL,
    imgAvatar VARBINARY(40),
    departament VARCHAR(20)
);

CREATE TABLE assignatures(
	id INT(10) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nom VARCHAR(3),
    nomComplet VARCHAR(30) NOT NULL,
    hores INT(4),
    modul VARCHAR(20),
    id_curs INT(10) NOT NULL,
    FOREIGN KEY (`id_curs`) REFERENCES `curs` (`id`)
);

CREATE TABLE docencia(
	profesor_id INT(10) NOT NULL,
    asignatura_id INT(10) NOT NULL,
    alumne_id INT(10) NOT NULL,
    nota INT(10) NOT NULL,
    FOREIGN KEY (`profesor_id`) REFERENCES `profesors` (`idProfesor`),
    FOREIGN KEY (`asignatura_id`) REFERENCES `assignatures` (`id`),
    FOREIGN KEY (`alumne_id`) REFERENCES `alumnes` (`idAlumne`)
);

CREATE TABLE missatgeria(
	alumne_id INT(10) NOT NULL,
    profesor_id INT(10) NOT NULL,
    missatge VARCHAR(100),
    img VARCHAR(60),
    FOREIGN KEY (`alumne_id`) REFERENCES `alumnes` (`idAlumne`),
    FOREIGN KEY (`profesor_id`) REFERENCES `profesors` (`idProfesor`)
);


INSERT INTO categoriaAlumne(categoria_alumne) VALUES
	("Repetidor"),
    ("No Repetidor");
    
INSERT INTO curs(nomCurs) VALUES
	("Primer"),
    ("Segon");

# Inserim usuaris (4 alumnes i 2 profesors)

INSERT INTO alumnes(nomUsuari,contrasena, nomComplet, imgAvatar, idCurs, idCategoria) VALUES
    ("Carlos","Carlos123","Carlos Ordoñez Martinez", NULL,1,2),
    ("Paco","Paco123","Paco Fuster Montoya", NULL,1,2),
    ("Laura","Laura123","Laura Martinez Campos", NULL,1,2),
    ("Jonathan","Jonathan123","Jonathan García Peña", NULL,1,2);

INSERT INTO profesors(nomUsuari,contrasena, nomComplet, imgAvatar, departament) VALUES
	("Joan", "Joan", "Joan Codina Pérez", NULL,"Informatica"),
    ("Elena", "Elena123", "Elena Ferrandis Viñoles", NULL,"Informatica");
    
	# Inserim 4 assignatures

INSERT INTO assignatures(nom, nomComplet, hores, modul, id_curs) VALUES
	("PRG","Programació",80,"DAM",1),
    ("BD","Base de Dades",60,"DAM",1),
    ("SGE","Sistemes de Gestió Empresarial",45,"DAM",2),
    ("SI","Sistemes Informatics",50,"DAM",1);

	# Inserim 4 registres que representen les notes i docència

INSERT INTO docencia(profesor_id, asignatura_id, alumne_id, nota) VALUES
	(1,1,2,8),
    (2,3,4,6),
    (2,2,1,5),
    (1,4,3,10);