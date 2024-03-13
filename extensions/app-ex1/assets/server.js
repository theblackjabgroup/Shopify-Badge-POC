const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// core is used to restrit or allow requests

app.use(bodyParser.json());
app.use(cors({
    origin: '*', //Allows requests from any origin. This is often used for development but should be restricted to specific origins in production for security reasons.
    methods: ['GET', 'POST'], 
    credentials: true 
  }));

let receivedData;

app.post('/api/data', (req, res) => {
  const jsonString = req.body;
  console.log('Received JSON data:', jsonString);

  receivedData = jsonString; // get the things that have to marked for badge, which you send
  // by post request, and put them into received data

  res.json({ message: 'JSON data received successfully' });
  //res.redirect('/api/data');
});

app.get('/api/data', (req, res) => {
    const dataToUse = receivedData || {};
    res.json({ message: 'Data received successfully in GET request', data: dataToUse });
  }); // use the info that came earlier and send it back

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
  