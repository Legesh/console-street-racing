const RenderService = require("./RenderService");
const CarService = require("./CarService");
const RaceService = require("./RaceService");
const UserService = require("./UserService");

module.exports = class AnswerService {
    renderService;

    constructor() {
        this.renderService = new RenderService();
        this.carService = new CarService();
        this.raceService = new RaceService();
        this.userService = new UserService();
    }

    async mainMenu(userId) {
        let res = await this.renderService.renderWithOptions(
            'What are you want to do?',
            ['Race', 'Check balance', 'Check my cars']
        );
        switch (res) {
            case 'Check my cars':
                await this.carListMenu(userId);
                break;
            case 'Check balance':
                await this.myBalance(userId);
                break;
            case 'Race':
                await this.startRace(userId);
                break;
        }
     }

    async carListMenu(userId) {
        let cars = await this.carService.getMyCars(userId);

        if(cars.length === 0) {
            console.log('You haven\'t a car, please buy one first')
            await this.showAvailableCars(userId);
        }

        for(let index in cars) {
            let carDetails = await this.carService.getOriginalInfo(cars[index].car_id)
            console.log(carDetails.id + ' - ' + carDetails.model);
        }

        let res = await this.renderService.renderWithOptions(
            'What are you want to do with you garage?',
            ['By one more car', 'Car details', 'Main menu']
        );
        switch (res) {
            case 'By one more car':
                await this.showAvailableCars(userId);
                break;
            case 'Car details':
                await this.carDetails(userId);
                break;
            case 'Main menu':
                await this.mainMenu(userId);
                break;
        }
    }

    async carDetails(userId, carID = null) {
        if(!carID) {
            let result = await this.renderService.renderWithInput(
                'Input car number for details:',
                'car_id'
            );
            carID = result.car_id;
        }

        let carDetails = await this.carService.getOriginalInfo(carID);
        let myCarInfo = await this.carService.find(userId, carID);

        console.log(
            'Model - ' + carDetails.model,
            '\nSpeed - ' + carDetails.speed,
            '\nOriginal price - ' + carDetails.price,
            '\nCan be sold by - ' + this.carService.calculateNewPrice(myCarInfo, carDetails),
            '\nIs selected - ' + myCarInfo.selected,
            '\nIs broken - ' + myCarInfo.is_broken,
            '\nFuel - ' + myCarInfo.fuel
        )

        let res = await this.renderService.renderWithOptions(
            'What are you want to do?',
            ['Sell car', 'Select this as default', 'Fix car', 'Refuel car', 'Main menu']
        );

        switch (res) {
            case 'Sell car':
                await this.sellCar(userId, carID);
                break;
            case 'Select this as default':
                await this.selectDefaultCar(userId, carID);
                break;
            case 'Fix car':
                await this.fixCar(userId, carID);
                break;
            case 'Refuel car':
                await this.refuelCar(userId, carID);
                break;
            case 'Main menu':
                await this.mainMenu(userId);
                break;
        }
    }

    async sellCar(userId, carID) {
        await this.carService.sell(userId, carID);
        console.log("Car sold!");
        console.log("Here is your actual list of cars:");
        await this.carListMenu(userId);
    }

    async myBalance(userId) {
        let balance = await this.userService.checkBalance(userId)
        console.log('Your balance - ' + balance + '$')
        await this.mainMenu(userId)
    }

    async showAvailableCars(userId) {
        let userBalance = await this.userService.checkBalance(userId);
        console.log("You have " + userBalance + "$, and can buy one of this cars:")
        let cars = await this.carService.getAllCarsByPrice(userBalance);
        for(let index in cars) {
            console.log(cars[index].id + ' - ' + cars[index].model + ' (price = ' + cars[index].price + ', max speed - ' + cars[index].speed + ')');
        }
        let result = await this.renderService.renderWithInput(
            'Which car do you want to buy? Enter number (0 - for cancel):',
            'car_id'
        );
        if(result.car_id != 0) {
            await this.carService.buy(userId, result.car_id)
        }
        await this.mainMenu(userId)
    }

    async selectDefaultCar(userId, carID) {
        await this.carService.selectNewCar(userId, carID);
        console.log("New default car selected")

        await this.mainMenu(userId)
    }

    async fixCar(userId, carID) {
        let res = await this.carService.fix(userId, carID);
        if(res) {
            console.log("Car fixed! Now you can take part in competition!")
        } else {
            console.log("Unfortunately you haven\'t enough money. You can sell the car and by something chipper.")
        }

        await this.mainMenu(userId)
    }

    async refuelCar(userId, carID) {
        await this.carService.refuelCar(userId, carID);
        console.log("Car refueled!")
        await this.mainMenu(userId)
    }

    async startRace(userId) {
        let user = await this.userService.getByID(userId)
        let result = await this.raceService.startRace(user)
        switch (result) {
            case 'empty_tank':
                console.log('You hadn\'t enough fuel so stopped directly after the start and loose this race! Refuel your car or select another one and try again!')
                break;
            case 'was_broken':
                console.log('Your car was broken and you even didn\'t start the race, so you loose. Fix the car or select another one and try again!')
                break;
            case 'break':
                console.log('You missed the turn and fly out from the road, so you loose and now your car is broken. Fix the car or select another one and try again!')
                break;
            case 'win':
                console.log('You are amazing! Congratulations! You win!')
                break;
            case 'loose':
                console.log('Unfortunately you loose. But don\'t gave up, try again!')
                break;
            case 'no_car':
                console.log('You haven\'t a car, please buy one first')
                await this.showAvailableCars(user.id);
                break;
            case 'no_money':
                console.log('You haven\'t enough money. Try sell the car and by something chipper.')
                await this.showAvailableCars(user.id);
                break;
        }
        await this.mainMenu(user.id);
    }
}