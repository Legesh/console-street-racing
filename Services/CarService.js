const CarRepository = require("../Repositories/CarRepository");
const UserCarRepository = require("../Repositories/UserCarRepository");
const UserRepository = require("../Repositories/UserRepository");
const UserService = require("./UserService");

module.exports = class CarService {
    #carRepository;
    #userCarRepository;
    #userRepository;
    #userService;
    constructor() {
        this.#carRepository = new CarRepository();
        this.#userCarRepository = new UserCarRepository();
        this.#userRepository = new UserRepository();
        this.#userService = new UserService();
    }

    async getOriginalInfo(carId) {
        return await this.#carRepository.find(carId)
    }

    async find(userId, carId) {
        return await this.#userCarRepository.find(userId, carId)
    }

    async buy(userId, carId) {
        let user = await this.#userRepository.find(userId)
        let car = await this.#carRepository.find(carId)
        if(user.balance > car.price) {
            await this.#userCarRepository.create(userId, carId);
            await this.#userService.changeBalance(user, car.price, '-');
        }
    }

    async getMyCars(userId) {
        return await this.#userCarRepository.getList(userId)
    }

    async getAllCarsByPrice(price) {
        return await this.#carRepository.getList(price)
    }

    async sell(userId, carId) {
        let user = await this.#userRepository.find(userId)
        let car = await this.#carRepository.find(carId)
        let userCar = await this.#userCarRepository.find(userId, carId)
        let newPrice = this.calculateNewPrice(userCar, car);

        this.#userCarRepository.delete(userId, carId);
        await this.#userService.changeBalance(user, newPrice, '+');
        if(userCar.selected) {
            this.selectNewCar(userId)
        }
    }

    calculateNewPrice(userCar, car) {
        let newPrice;
        if(userCar.is_broken) {
            newPrice = car.price / 3;
        } else {
            newPrice = car.price * 0.8;
        }
        if(userCar.fuel < 10) {
            newPrice = newPrice * 0.9
        }

        return newPrice;
    }

    async selectNewCar(userId, carId = null) {
        if(!carId) {
            let allCars = await this.#userCarRepository.getList(userId)
            if(allCars.length === 0) {
                return
            }
            let newSelectedCar = allCars[Math.floor(Math.random()*allCars.length)];
            carId = newSelectedCar.id;
        }
        await this.#userCarRepository.unselectAllCars(userId)
        await this.#userCarRepository.selectCar(carId, userId)
    }

    async fix(userId, carId) {
        let user = await this.#userRepository.find(userId)
        let car = await this.#carRepository.find(carId)
        let fixPrice = car.price * 0.2;
        if(user.balance > fixPrice) {
            await this.#userCarRepository.fixCar(userId, carId);
            await this.#userService.changeBalance(user, fixPrice, '-');
            return true;
        }
        return false;
    }

    async refuelCar(userId, carId) {
        let user = await this.#userRepository.find(userId)
        let userCar = await this.#userCarRepository.find(userId, carId)
        let fuelPrice = 60 - userCar.fuel;
        if(user.balance > fuelPrice) {
            let res = await this.#userCarRepository.refuel(userId, carId);
            await this.#userService.changeBalance(user, fuelPrice, '-');
        }
    }
}