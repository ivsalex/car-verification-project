const cron = require('node-cron');

cron.schedule('*/14 * * * *', function () {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    console.log(`Server restarted at: ${hours}:${minutes}:${seconds}`);
});