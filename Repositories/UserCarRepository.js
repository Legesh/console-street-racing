const BaseRepository = require("./BaseRepository");

module.exports = class UserCarRepository extends BaseRepository{
    async find(userId, carId) {
        return new Promise((resolve, reject) => {
            this.connection.get(`SELECT *
                                  FROM user_cars
                                  WHERE user_id = ${userId} AND car_id = ${carId}`, (error, row) => {
                if (error) {
                    reject(error);
                }
                resolve(row);
            });
        });
    }
    async getDefault(userId) {
        return new Promise((resolve, reject) => {
            this.connection.get(`SELECT *
                                  FROM user_cars
                                  WHERE user_id = ${userId} AND selected = 1 limit 1`, (error, row) => {
                if (error) {
                    reject(error);
                }
                resolve(row);
            });
        });
    }

    async create(userId, carId) {
        let res = new Promise((resolve, reject) => {
            this.connection.run(`update user_cars set 'selected' = false where 'user_id' = ${userId}`,
                (error, row) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(row);
                });
            this.connection.get(`insert into user_cars ('user_id', 'car_id', 'selected') values (${userId}, ${carId}, true)`,
                (error, row) => {
                if (error) {
                    reject(error);
                }
                resolve(row);
            });
        });
        return res;
    }

    async update(userId, carId, selected, isBroken, fuel) {
        return new Promise((resolve, reject) => {
            this.connection.update(
                `update user_cars set 
                     'selected' = ${selected},
                     'is_broken' = ${isBroken},
                     'fuel' = ${fuel},
                 WHERE user_id = ${userId} AND car_id = ${carId}`,
                (error, row) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(row);
                });
        });
    }

    async selectCar(carId, userId) {
        return new Promise((resolve, reject) => {
            this.connection.run(
                `update user_cars set 
                     selected = true
                 WHERE user_id = ${userId} AND car_id = ${carId}`,
                (error, row) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(row);
                });
        });
    }

    async unselectAllCars(userId) {
        return new Promise((resolve, reject) => {
            this.connection.run(
                `update user_cars set 
                     selected = false
                 WHERE user_id = ${userId}`,
                (error, row) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(row);
                });
        });
    }

    async refuel(userId, carId) {
        return new Promise((resolve, reject) => {
            this.connection.run(
                `update user_cars set 
                     fuel = 60
                 WHERE user_id = ${userId} AND car_id = ${carId}`,
                (error, row) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(row);
                });
        });
    }

    async decreaseFuel(userId, carId, fuel) {
        return new Promise((resolve, reject) => {
            this.connection.run(
                `update user_cars set 
                     fuel = ${fuel}
                 WHERE user_id = ${userId} AND car_id = ${carId}`,
                (error, row) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(row);
                });
        });
    }

    async fixCar(userId, carId) {
        return new Promise((resolve, reject) => {
            this.connection.run(
                `update user_cars set
                    is_broken = 0
                 WHERE user_id = ${userId} AND car_id = ${carId}`,
                (error, row) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(row);
                });
        });
    }

    async breakCar(userId, carId) {
        return new Promise((resolve, reject) => {
            this.connection.run(
                `update user_cars set 
                     'is_broken' = true
                 WHERE user_id = ${userId} AND car_id = ${carId}`,
                (error, row) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(row);
                });
        });
    }

    async delete(userId, carId, selected, isBroken, fuel) {
        let res = new Promise((resolve, reject) => {
            this.connection.run(
                `delete from user_cars
                 WHERE user_id = ${userId} AND car_id = ${carId}`,
                (error, row) => {
                if (error) {
                    reject(error);
                }
                resolve(row);
            });
        });
        return res;
    }

    async getList(userId) {
        let res = new Promise((resolve, reject) => {
            this.connection.all(`SELECT *
                                  FROM user_cars
                                  WHERE user_id = ${userId}`, (error, row) => {
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
        return res;
    }
}