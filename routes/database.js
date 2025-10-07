import sqlite3 from "sqlite3";

export function setup_database() {
    //Datenbanken
    const db = new sqlite3.Database('backlog.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the todo app database.');
    });

    db.close()
}