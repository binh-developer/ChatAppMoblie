const express = require('express');
const {admin} = require('./firebase-config');

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

const port = 3000;
const notification_options = {
  priority: 'high',
  timeToLive: 60 * 60 * 24,
};
app.post('/firebase/notification', (req, res) => {
  // This registration token comes from the client FCM SDKs.
  const registrationToken = req.body.registrationToken;
  const message = req.body.message;

  const payload = {
    notification: {
      title: 'MeChat',
      body: message,
      icon: 'default',
    },
  };

  admin
    .messaging()
    .sendToDevice(registrationToken, payload)
    .then(response => {
      res.status(200).send('Notification sent successfully');
    })
    .catch(error => {
      console.log(error);
    });
});
app.listen(port, () => {
  console.log('Listening to port: ' + port);
});
