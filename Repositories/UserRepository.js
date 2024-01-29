const BaseRepository = require("./BaseRepository");

module.exports = class UserRepository extends BaseRepository{
    async find(id) {
        return new Promise((resolve, reject) => {
            this.connection.get(`SELECT *
                                  FROM users
                                  WHERE id = ${id}`, (error, row) => {
                if (error) {
                    reject(error);
                }
                resolve(row);
            });
        });
    }

    async last() {
        let res = new Promise((resolve, reject) => {
            this.connection.get(`SELECT *
                                  FROM users
                                  order by id desc limit 1`, (error, row) => {
                if (error) {
                    reject(error);
                }
                resolve(row);
            });
        });
        return res;
    }

    async create(username, balance) {
        let res = new Promise((resolve, reject) => {
            this.connection.exec(`insert into users ('name', 'balance') values ('${username}', '${balance}')`,
                (error, row) => {
                if (error) {
                    reject(error);
                }
                resolve(row);
                return row;
            });
        });
        return res;
    }

    async update(id, balance) {
        return new Promise((resolve, reject) => {
            this.connection.run(`update users set balance = ${balance} where id = ${id}`,
                (error, row) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(row);
                });
        });
    }
}