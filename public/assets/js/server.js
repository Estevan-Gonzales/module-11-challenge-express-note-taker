const express = require('express');
const path = require('path');

const PORT = 3001;
const app = express();
const notes = require('../../../db/db.json')

app.use(express.json());

app.get('/notes', (req, res) => {
  console.info("returning notes.html");
  res.sendFile(path.join(__dirname, '../../../public/notes.html'));

})

app.get('/api/notes', (req, res) => {
    // Log our request to the terminal
    console.info(`${req.method} request received to get reviews`);
  
    // Sending all reviews to the client
    return res.status(200).json(notes);
  });

  app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);

  