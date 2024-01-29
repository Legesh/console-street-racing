const BaseRepository = require("./BaseRepository");

module.exports = class CarRepository extends BaseRepository{
    async getList(price) {
        return new Promise((resolve, reject) => {
            this.connection.all(`SELECT *
                                  FROM cars
                                  WHERE price < ${price}`, (error, row) => {
                if (error) {
                    reject(error);
                }
                const response = [];
                row.forEach((elem) => {
                    response.push(elem);
                })
                resolve(response);
            });
        });
    }

    async find(carId) {
        return new Promise((resolve, reject) => {
            this.connection.get(`SELECT *
                                  FROM cars
                                  WHERE id = ${carId}`, (error, row) => {
                if (error) {
                    reject(error);
                }
                resolve(row);
            });
        });
    }
}