const axios = require('axios');

const sendSms = async (req, res) => {
  try {
    const { to, body, sender } = req.body;

    const response = await axios.post('https://app.smso.ro/api/v1/send', null, {
      headers: {
        'X-Authorization': process.env.SMS_APIKEY,
      },
      body: {
        to: to,
        body: body,
        sender: sender,
      },
    });

    // Send a response back to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    // Handle errors
    console.error('Error sending SMS:', error);
    res.status(error.response ? error.response.status : 500).json({ error: 'Failed to send SMS' });
  }
};

module.exports = {
  sendSms,
};
