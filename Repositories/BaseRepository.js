const sqlite3 = require("sqlite3");
const DBPath = './streetracing.sqlite3';

module.exports = class BaseRepository {
    connection;

    constructor() {
        if(!this.connection) {
            this.connection = new sqlite3.Database(DBPath, sqlite3.OPEN_READWRITE, (error) => {
                if (error) {
                    return console.error(DBPath, error.message);
                }
            });
        }
    }

    disconnect() {
        if (this.connection) {
            this.connection.close();
            this.connection = undefined;
        }
    }
}