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
        "header_space FLOAT," +
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
        "year_end INTEGER," +
        "genre VARCHAR(128)," +
        "country VARCHAR(128)," +
        "description TEXT," +
        "header_space FLOAT," +
        "status VARCHAR(128)," +
        "added VARCHAR(128)," +
        "idea VARCHAR(128)," +
        "studio VARCHAR(128)," +
        "cast TEXT," +
        "episodes TEXT," +
        "cancelled BOOLEAN," +
        "CHECK (status IN ('open', 'started', 'finished'))" +
        ");"
    );

    db.run(
        "CREATE TABLE IF NOT EXISTS book (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
        "name VARCHAR(128) NOT NULL," +
        "year INTEGER," +
        "genre VARCHAR(128)," +
        "country VARCHAR(128)," +
        "description TEXT," +
        "header_space FLOAT," +
        "status VARCHAR(128)," +
        "added VARCHAR(128)," +
        "author VARCHAR(128)," +
        "length INTEGER," +
        "publisher VARCHAR(128)," +
        "illustrator VARCHAR(128)," +
        "CHECK (status IN ('open', 'started', 'finished'))" +
        ");"
    );

    db.run(
        "CREATE TABLE IF NOT EXISTS game (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
        "name VARCHAR(128) NOT NULL," +
        "year INTEGER," +
        "genre VARCHAR(128)," +
        "country VARCHAR(128)," +
        "description TEXT," +
        "header_space FLOAT," +
        "status VARCHAR(128)," +
        "added VARCHAR(128)," +
        "developer VARCHAR(128)," +
        "publisher VARCHAR(128)," +
        "CHECK (status IN ('open', 'started', 'finished'))" +
        ");"
    );

    db.run(
        "CREATE TABLE IF NOT EXISTS movie_finished (" +
        "id INTEGER PRIMARY KEY NOT NULL," +
        "date VARCHAR(128)," +
        "rating INTEGER," +
        "valuation TEXT," +
        "like BOOLEAN," +
        "FOREIGN KEY(id) REFERENCES movie(id)" +
        ");"
    );

    db.run(
        "CREATE TABLE IF NOT EXISTS series_finished (" +
        "id INTEGER PRIMARY KEY NOT NULL," +
        "date VARCHAR(128)," +
        "rating INTEGER," +
        "valuation TEXT," +
        "like BOOLEAN," +
        "FOREIGN KEY(id) REFERENCES series(id)" +
        ");"
    );

    db.run(
        "CREATE TABLE IF NOT EXISTS game_finished (" +
        "id INTEGER PRIMARY KEY NOT NULL," +
        "date VARCHAR(128)," +
        "rating INTEGER," +
        "valuation TEXT," +
        "like BOOLEAN," +
        "FOREIGN KEY(id) REFERENCES game(id)" +
        ");"
    );

    db.run(
        "CREATE TABLE IF NOT EXISTS book_finished (" +
        "id INTEGER PRIMARY KEY NOT NULL," +
        "date VARCHAR(128)," +
        "rating INTEGER," +
        "valuation TEXT," +
        "like BOOLEAN," +
        "FOREIGN KEY(id) REFERENCES book(id)" +
        ");"
    );

    db.close()
}