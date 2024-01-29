const RenderService = require("./Services/RenderService");
const AnswerService = require("./Services/AnswerService");
const UserService = require("./Services/UserService");
const CarService = require("./Services/CarService");

class StreetRacingService {
    async start() {
        const render = new RenderService();
        const answerService = new AnswerService();
        const userService = new UserService();
        let result = await render.renderWithInput(
            'Hey! Welcome to the best street racing game ever! What is your name?',
            'username'
        );
        await userService.create(result.username);

        console.log(
            'Great! A little bit about this game.\n' +
            'At the start you have initial deposit 5000$\n' +
            'This will be enough to buy car but keep in mind that\n' +
            'sometimes you should refuel you car, also you need to fix\n' +
            'your car in case you break it. Also you can sell you but\n' +
            'if it broken or with empty tank the prise will be less.\n' +
            'Entry fee for each race is 200$. If you take 1st place\n' +
            'you will win 1000$!\n' +
            'Let\'s start and have a good luck!'
        )

        let user = await userService.last();
        const userId = user.id;
        await answerService.mainMenu(userId);
    }
}

const game = new StreetRacingService();
game.start();
