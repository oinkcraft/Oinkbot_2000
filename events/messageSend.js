const swearFilterHelper = require('../feats/swearfilter/swearFilterHelper')

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        // Pull initial things
        let author = message.author;

        // Call the swear filter
        swearFilterHelper.filterMessage(message, author, client)
    }
}