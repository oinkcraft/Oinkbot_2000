const swears = require('../feats/swearfilter/swears.json')
const config = require('../config.json')
const Discord = require('discord.js');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        // Pull initial things
        let content = message.cleanContent.toLowerCase();
        let author = message.author;

        // TODO: Make the swear stuff a helper function (this even may be more broadly used as well as calling the swear function for edited messages)
        // Variables to set for an embed message
        let simple = true

        // See if a simple swear exists
        let foundWord = await content.split(/\s+/).find(word => swears.simple[word] !== undefined)
        if (foundWord === undefined) {
            // Check for more "complex" curses via regex matching
            foundWord = await content.split(/\s+/).find(word => {
                Object.keys(swears.complex).forEach(complexSwear => {
                    if (word.match(new RegExp(complexSwear))){
                        simple = false
                        return word
                    }
                })
            })
        }

        // Thus, check to see if we have found a swear word present in the message
        if (foundWord !== undefined){
            await message.reply('Swearing is not allowed :eyes:')
            let wordCategory = simple === true ? swears['simple'][foundWord].join(' and ') : swears['complex'][foundWord].join(' and ')
            const response = new Discord.MessageEmbed()
                .setAuthor({ name: 'Please refrain from swearing!' })
                .addField("You were caught on", foundWord)
                .addField("It was categorized as:", wordCategory)
                .setColor('#ff0000')
                .setFooter({ text: 'This message was also logged to the staff team.'});
            author.createDM().then(channel => channel.send(
                {embeds: [response]}
            ))
            message.delete({wait: 0})

            // Log to staff channel
            const log = new Discord.MessageEmbed()
                .setAuthor({ name: "Swear blocked." })
                .addField("User responsible: ", author.username)
                .addField("Caught word:", foundWord)
                .addField("Categorized as:", wordCategory)
                .setColor("#FFA500")
            client.channels.cache.get(config.channels.auditLog).send(
                {embeds: [log]}
            )
            return true;
        }
        return false;
    }
}