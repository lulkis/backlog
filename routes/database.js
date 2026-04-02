import Database from "better-sqlite3";
import fs from "fs";
import csv from "csv-parser";

export function setup_database() {
    //Datenbanken
    const db = new Database('backlog.db');

    db.exec(
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
        "score VARCHAR(128)," +
        "CHECK (status IN ('open', 'started', 'finished'))" +
        ");"
    );

    db.exec(
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
        "score VARCHAR(128)," +
        "CHECK (status IN ('open', 'started', 'finished'))" +
        ");"
    );

    db.exec(
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

    db.exec(
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
        "score VARCHAR(128)," +
        "cast TEXT," +
        "CHECK (status IN ('open', 'started', 'finished'))" +
        ");"
    );

    db.exec(
        "CREATE TABLE IF NOT EXISTS movie_finished (" +
        "id INTEGER PRIMARY KEY NOT NULL," +
        "date VARCHAR(128)," +
        "rating INTEGER," +
        "valuation TEXT," +
        "like BOOLEAN," +
        "finishcount INTEGER default 1," +
        "FOREIGN KEY(id) REFERENCES movie(id)" +
        ");"
    );

    db.exec(
        "CREATE TABLE IF NOT EXISTS series_finished (" +
        "id INTEGER PRIMARY KEY NOT NULL," +
        "date VARCHAR(128)," +
        "rating INTEGER," +
        "valuation TEXT," +
        "like BOOLEAN," +
        "finishcount INTEGER default 1," +
        "FOREIGN KEY(id) REFERENCES series(id)" +
        ");"
    );

    db.exec(
        "CREATE TABLE IF NOT EXISTS game_finished (" +
        "id INTEGER PRIMARY KEY NOT NULL," +
        "date VARCHAR(128)," +
        "rating INTEGER," +
        "valuation TEXT," +
        "like BOOLEAN," +
        "finishcount INTEGER default 1," +
        "FOREIGN KEY(id) REFERENCES game(id)" +
        ");"
    );

    db.exec(
        "CREATE TABLE IF NOT EXISTS book_finished (" +
        "id INTEGER PRIMARY KEY NOT NULL," +
        "date VARCHAR(128)," +
        "rating INTEGER," +
        "valuation TEXT," +
        "like BOOLEAN," +
        "finishcount INTEGER default 1," +
        "FOREIGN KEY(id) REFERENCES book(id)" +
        ");"
    );

    db.exec(
        "CREATE TABLE IF NOT EXISTS lists (" +
        "id INTEGER PRIMARY KEY NOT NULL," +
        "name VARCHAR(128)," +
        "description TEXT" +
        "color VARCHAR(10)" +
        ");"
    );

    db.exec(
        "CREATE TABLE IF NOT EXISTS list_content (" +
        "id INTEGER PRIMARY KEY NOT NULL," +
        "list INT," +
        "media INT," +
        "type TEXT," +
        "FOREIGN KEY(list) REFERENCES lists(id)" +
        ");"
    );

    db.close()

    const db2 = new Database('hltb.db');

    db2.exec("CREATE TABLE IF NOT EXISTS games (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
        "title TEXT NOT NULL," +
        "main TEXT," +
        "main_extra TEXT," +
        "completionist TEXT" +
        ");"
    );


}
