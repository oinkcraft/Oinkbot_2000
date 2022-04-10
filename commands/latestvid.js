const { SlashCommandBuilder } = require('@discordjs/builders');
const { tempstore } = require("../config.json")
const { latestVideos } = require('../feats/ytnotifs/latestvids.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("latestvideo")
    .setDescription("Shows you the latest video from the [lifestyle|cowdino arcade] channel"), 
    // TODO: Arguments?
    async execute(interaction){
        let latestLifestyleVidId = latestVideos.lifestyle
        await interaction.reply(`The latest lifestyle video is http://www.youtube.com/watch?v=${latestLifestyleVidId}`)
    },
};