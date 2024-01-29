const UserRepository = require("../Repositories/UserRepository");
module.exports = class UserService {
    #initBalance = 5000;
    #repository;
    constructor(){
        this.#repository = new UserRepository()
    }

    async create(username) {
        await this.#repository.create(
            username,
            this.#initBalance
        )
    }

    async getByID(id) {
        return await this.#repository.find(id)
    }

    async last() {
        return await this.#repository.last()
    }

    async checkBalance(userId) {
        let result = await this.#repository.find(userId)
        return result.balance;
    }

    async changeBalance(user, amount, operator) {
        let currentBalance = await this.checkBalance(user.id)
        let newBalance = operator === '+' ? currentBalance + amount : currentBalance - amount;
        await this.#repository.update(
            user.id,
            newBalance
        )
        return newBalance;
    }
}