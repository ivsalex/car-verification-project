const { CronJob } = require('cron');
const https = require('https');

const backendUrl = 'https://api.ivaiondan.ro';
const job = new CronJob('*/14 * * * *', function () {
    console.log('Restarting server!');

    https.get(backendUrl, (res) => {
        if (res.statusCode === 200) {
            console.log('Server restarted!');
        } else {
            console.error(
                `Failed to restart server with status code ${res.statusCode}`
            );
        }
    }).on('error', (err) => {
        console.error('Error during Restart:', err.message)
    });
});

module.exports = job