const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'], 
    credentials: true 
  }));

let receivedData;

app.post('/api/data', (req, res) => {
  const jsonString = req.body;
  console.log('Received JSON data:', jsonString);

  receivedData = jsonString;

  res.json({ message: 'JSON data received successfully' });
  res.redirect('/api/data');
});

app.get('/api/data', (req, res) => {
    const dataToUse = receivedData || {};
    res.json({ message: 'Data received successfully in GET request', data: dataToUse });
  });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
  