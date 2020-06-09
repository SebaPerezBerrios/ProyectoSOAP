BEGIN TRANSACTION;
DROP TABLE IF EXISTS carreras_2020 CASCADE;
CREATE TABLE carreras_2020 (
        pk bigserial NOT NULL,
        nombre varchar(256) NOT NULL,
        nem decimal NOT NULL,
        ranking decimal NOT NULL,
        lenguaje decimal NOT NULL,
        matematica decimal NOT NULL,
        ciencias_historia decimal NOT NULL,
        puntaje_minimo integer NOT NULL,
        puntaje_minimo_ponderado integer,
        vacantes integer NOT NULL,
        primero decimal NOT NULL,
        ultimo decimal NOT NULL,
        PRIMARY KEY (pk)
);
COMMIT;
 
