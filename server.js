const express = require('express');
const path = require('path');
const fs = require('fs');

//Random ID Generator
const {Generator} = require('randomly-id-generator');

const PORT = process.env.port
const app = express();
app.use(express.static(path.join(__dirname, '/public')));


app.use(express.json());

//Get notes.html file
app.get('/notes', (req, res) => {
  console.info("returning notes.html....");
  console.log(__dirname);
  res.sendFile(path.join(__dirname, './public/pages/notes.html'));

});

//Send all notes
app.get('/api/notes', (req, res) => {
    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const parsedNotes = JSON.parse(data);
        res.status(200).json(parsedNotes);
      }
    });
  });

//Create a new note
app.post('/api/notes', (req, res) => {
    console.log(`${req.method} request received to add a note`)
    const {title, text} = req.body

    if (title && text) {

      const id = new Generator().generate();

      const newNote = {
        title,
        text,
        id
      }

      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const parsedNotes = JSON.parse(data);

          parsedNotes.push(newNote);

          fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
              (writeErr) => writeErr ? console.error(writeErr) : console.info('Successfully updated notes!')
          );
        }
      });

      const response = {
        status: 'success',
        body: newNote
      };

      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting notes');
    }
});

//Wildcard leads to index.html
app.get('*', (req, res) => {
    console.info("returning index.html");
    res.sendFile(path.join(__dirname, '/public/index.html'));

});

app.listen(PORT, () =>
    console.log(`App listening at ${PORT}`)
);