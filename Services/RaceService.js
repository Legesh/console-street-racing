const UserCarRepository = require("../Repositories/UserCarRepository");
const UserRepository = require("../Repositories/UserRepository");
const CarRepository = require("../Repositories/CarRepository");
const UserService = require("./UserService");

module.exports = class RaceService {
    #userCarRepository;
    #userRepository;
    #userService;
    #carRepository;
    constructor() {
        this.currentState = 'win';
        this.#userCarRepository = new UserCarRepository();
        this.#userRepository = new UserRepository();
        this.#userService = new UserService();
        this.#carRepository = new CarRepository();
    }

    changeState(state) {
        this.currentState = state;
    }

    async startRace(user) {
        let carState = await this.#userCarRepository.getDefault(user.id)
        if(!carState) {
            this.changeState('no_car');
            return this.currentState;
        }
        let balance = await this.#userService.checkBalance(user.id)
        if(balance < 200) {
            this.changeState('no_money');
            return this.currentState;
        }
        await this.#userService.changeBalance(user, 200, '-')
        if(carState.fuel >= 9) {
            await this.#userCarRepository.decreaseFuel(user.id, carState.car_id, carState.fuel-10)
        }
        await this.checkResult(carState, user);
        return this.currentState;
    }

    async checkResult(carState, user) {
        if(carState.fuel < 10) {
            this.changeState('empty_tank');
            return
        }
        if(carState.is_broken) {
            this.changeState('was_broken');
            return
        }
        let randForBrakeCar = Math.random();
        if (randForBrakeCar < 0.1) {
            this.changeState('break');
            await this.#userCarRepository.breakCar(carState.user_id, carState.car_id)
            return
        }
        let randForWin = Math.random() * 100;
        let car = await this.#carRepository.find(carState.car_id)
        if (randForWin < car.win_probability) {
            await this.#userService.changeBalance(user, 1000, '+')
            this.changeState('win');
        }else{
            this.changeState('loose');
        }
    }
}