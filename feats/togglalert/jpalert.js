const config = require('../../config.json')
const axios = require('axios')

togglKey = config.integrations.toggl.key

let getJapaneseEntries = async (owner) => {
    let date = new Date()
    date.setHours(0, 0, 0, 0)
    let entries = await axios.get(`https://api.track.toggl.com/api/v9/me/time_entries?since=${date.getTime() / 1000}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
      "Authorization": `Basic ${btoa(`${togglKey}:api_token`)}`
        },
      }).then(resp => {
        
        let totalSeconds = 0
        resp.data.forEach((entry) => { // Apparently I'm forgetting the reduce syntax????
            if (entry.project_id == 176302878) {
                totalSeconds += entry.duration
            }
        });
        // let totalMinutes = Math.round(totalSeconds / 60).toFixed(2);
        // let totalHours = Math.round(totalMinutes / 60).toFixed(2);
        let totalMinutes = (totalSeconds / 60).toFixed(2);
        let totalHours = (totalMinutes / 60).toFixed(2);
        let msg = `Looks like Mark has done ${totalMinutes} minutes, or ${totalHours} hours, of Japanese today...`
        if (totalHours < 2) {
            msg += `\nThat's not at the 2 hour goal... :eyes:`
        }
        let channel = client.channels.cache.get(config.channels.accountability)
        channel.send(msg)
      }).catch(err => {
        console.log(err)
      })
}

let start = (clientRef) => {
    console.log('JP alert started!')
    client = clientRef

    // Run checks every hour and send message if the latest video is different (1hr == 1000 * 3600 milliseconds)
    // You can assign the function to a variable in case we need to be able to yeet it later. Maybe optimize to stop on nights or something
    getJapaneseEntries()
    setInterval(getJapaneseEntries, 1000 * 1800 * 2 * 6) // Check every 6hrs 
    console.log('Initial call to JP alert has executed.')

}

module.exports.start = start;