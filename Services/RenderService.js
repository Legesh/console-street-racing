const {Select, prompt} = require("enquirer");

module.exports = class RenderService {
    async renderWithOptions(text, actions) {
        let prompt = new Select({
            name: 'option',
            message: text,
            choices: actions
        });
        return await prompt.run()
    }

    async renderWithInput(text, name) {
        return await prompt({
            type: 'input',
            name: String(name),
            message: String(text)
        });
    }
}