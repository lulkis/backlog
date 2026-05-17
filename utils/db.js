const Database = require('better-sqlite3');

const db = new Database('backlog.db');
const db2 = new Database('hltb.db');

module.exports = {db, db2};
