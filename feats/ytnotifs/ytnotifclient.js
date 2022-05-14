const config = require('../../config.json')
const YouTube = require('discord-youtube-api')
const fs = require('fs')

// Create a youtube a youtube client
const youtube = new YouTube(config.integrations.youtube.key)

/* Retrieve latest lifestyle video */
async function getLatestLifestyleVideo(client) {
    const { latestVideos } = require('./latestvids.json')

    // Get the playlist of all videos and details of the latest video
    let playlist = await youtube.getPlaylistByID(config.integrations.youtube.playlistIDs.lifestyle)
    let latestVidInPlaylist = playlist[0]
    
    // Check against last retrieved video
    let mostRecentVidId = latestVideos.lifestyle
    let currVidId = latestVidInPlaylist.id

    if (mostRecentVidId === currVidId) {
        return 0
    } else {
        // Send out the details
        let currVidTitle = latestVidInPlaylist.title

        let msg = `<@&${config.integrations.youtube.notifRoles.lifestyle}> **NEW LIFESTYLE VIDEO!**\n\n_${currVidTitle}_\n\n:link: https://www.youtube.com/watch?v=${currVidId}`
        let channel = client.channels.cache.get(config.integrations.youtube.notifChannel)

        channel.send(msg)

        // Update the latest video
        latestVideos.lifestyle = currVidId
        let newData = JSON.stringify({ "latestVideos": latestVideos })
        fs.writeFile('./feats/ytnotifs/latestvids.json', newData, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Latest video IDs updated.")
            }
        })
        return 1
    }
}

/* Retrieve latest cowdino video */
async function getLatestCowdinoVideo(client) {
    const { latestVideos } = require('./latestvids.json')

    // Get the playlist of all videos and details of the latest video
    let playlist = await youtube.getPlaylistByID(config.integrations.youtube.playlistIDs.cowdino)
    let latestVidInPlaylist = playlist[0]
    
    // Check against last retrieved video
    let mostRecentVidId = latestVideos.cowdino
    let currVidId = latestVidInPlaylist.id

    if (mostRecentVidId === currVidId) {
        return 0
    } else {
        // Send out the details
        let currVidTitle = latestVidInPlaylist.title
        let msg = `<@&${config.integrations.youtube.notifRoles.cowdino}> **NEW COWDINO ARCADE VIDEO!**\n\n_${currVidTitle}_\n\n:link: https://www.youtube.com/watch?v=${currVidId}`
        let channel = client.channels.cache.get(config.integrations.youtube.notifChannel)

        if (currVidTitle.toLowerCase().includes('vgt')) {
            msg = `<@&${config.integrations.youtube.notifRoles.vgt}> **NEW VIDEO GAME THERAPY!**\n\n_${currVidTitle}_\n\n:link: https://www.youtube.com/watch?v=${currVidId}`
        }

        channel.send(msg)

        // Update the latest video
        latestVideos.cowdino = currVidId
        let newData = JSON.stringify({ "latestVideos": latestVideos })
        fs.writeFile('./feats/ytnotifs/latestvids.json', newData, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Latest video IDs updated.")
            }
        })
        return 1
    }
}

/* Middle call and check */
let getLatestVids = () => {
    console.log('Checking for latest videos...')
    // Check for latest lifestyle
    getLatestLifestyleVideo(client)
    .then(res => {
        // TODO: Get latest cowdino video
        if (res === 0) {
            console.log('No latest lifestyle video found.')
        } else {
            console.log("New lifestyle video found! Message posted to channel.")
        }
    })
    .catch(err => {
        console.log("Error with video notifier!")
        console.log(err)
    })

    // Check for latest cowdino
    getLatestCowdinoVideo(client)
    .then(res => {
        // TODO: Get latest cowdino video
        if (res === 0) {
            console.log('No latest cowdino video found.')
        } else {
            console.log("New cowdino video found! Message posted to channel.")
        }
    })
    .catch(err => {
        console.log("Error with video notifier!")
        console.log(err)
    })
}

/* Initialization function and export */
let start = (clientRef) => {
    console.log('Video notifier started!')
    client = clientRef

    // Run checks every hour and send message if the latest video is different (1hr == 1000 * 3600 milliseconds)
    // You can assign the function to a variable in case we need to be able to yeet it later. Maybe optimize to stop on nights or something
    getLatestVids()
    setInterval(getLatestVids, 1000 * 1800) // Check every 30 mins
    console.log('Initial call to video notifier has executed.')

}

module.exports.start = start;
