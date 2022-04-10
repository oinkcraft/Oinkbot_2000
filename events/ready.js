module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Oinkbot, disguised as ${client.user.tag}, is ready!`);

        // Initalize youtubevideo notifier
        const ytNotifier = require('../feats/ytnotifs/ytnotifclient')
        ytNotifier.start(client)
        // TODO: Disable this if the key is "0000" or something
    } 
}