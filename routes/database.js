import sqlite3 from "sqlite3";

export function setup_database() {
    //Datenbanken
    const db = new sqlite3.Database('backlog.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the backlog database.');
    });

    db.run(
        "CREATE TABLE IF NOT EXISTS movie (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
        "name VARCHAR(128) NOT NULL," +
        "year INTEGER," +
        "genre VARCHAR(128)," +
        "country VARCHAR(128)," +
        "description TEXT," +
        "status VARCHAR(128)," +
        "added VARCHAR(128)," +
        "studio VARCHAR(128)," +
        "director VARCHAR(128)," +
        "length INTEGER," +
        "cast TEXT," +
        "CHECK (status IN ('open', 'started', 'finished'))" +
        ");"
    );

    db.run(
        "CREATE TABLE IF NOT EXISTS series (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
        "name VARCHAR(128) NOT NULL," +
        "year INTEGER," +
        "genre VARCHAR(128)," +
        "country VARCHAR(128)," +
        "description TEXT," +
        "status VARCHAR(128)," +
        "added VARCHAR(128)," +
        "idea VARCHAR(128)" +
        "studio VARCHAR(128)" +
        "cast TEXT" +
        "episodes TEXT" +
        "CHECK (status IN ('open', 'started', 'finished'))" +
        ");"
    );

    db.close()
}