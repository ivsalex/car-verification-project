const axios = require('axios');

exports.sendSms = async (req, res) => {
  try {
    const { to, body, sender } = req.body;
    const response = await axios.post('https://app.smso.ro/api/v1/send', {
      to: to,
      body: body,
      sender: sender,
    }, {
      headers: {
        'X-Authorization': process.env.SMS_APIKEY,
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    res.status(error.response ? error.response.status : 500).json({ error: 'Failed to send SMS' });
  }
};

exports.vignetteCheck = async (req, res, next) => {
  const { plateNumber, vin } = req.query;

  if (!vin) {
    return res.status(400).send('Missing Car VIN!');
  }

  const url = `https://www.erovinieta.ro/vgncheck/api/findVignettes?plateNumber=${plateNumber}&vin=${vin}`;

  try {
    const response = await axios.get(url);
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};