const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const Participant = require('./Participant'); 
const Survey = require('./Survey');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

const port = process.env.PORT || 5000;

const dbURI = 'mongodb+srv://prajneya:Fbj8y4ZvqFBjntXi@cluster0.fgtq1uv.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(port, () => console.log(`Listening on port ${port}`)))
  .catch((err) => console.log(err));

app.use(express.json());

app.post('/api/survey', async (req, res) => {
    try {
      const surveyData = new Survey({
        ...req.body // Destructure all fields from the request body
      });
      const savedSurvey = await surveyData.save();
      participant = await Participant.findOne({ participantID: savedSurvey.participantId });
      participant.completed = true;
      participant.completed_date = new Date();
      await participant.save();
      
      res.status(201).json(savedSurvey);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

app.get('/api/participants/allocate', async (req, res) => {
    try {
      // Find the first participant that hasn't been allocated yet
      var participant = await Participant.findOne({ allocated: false });
      if (!participant) {
        const oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000);
        participant = await Participant.findOne({
          completed: false,
          allocated_date: { $lt: oneHourAgo }
        });
        if (!participant) {
            return res.status(404).send('No available participant IDs.');
        }
      }
  
      // Mark the participant as allocated (You would need to add this field in your schema)
      participant.allocated = true;
      participant.allocated_date = new Date();
      await participant.save();
  
      res.json({ participantID: participant.participantID, words: participant.words });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Create a new participant
app.post('/api/participants', async (req, res) => {
    console.log("REQ", req)
    console.log("REQ BODY", req.body)
    console.log("REQ BODY WORDS", req.body["words"])
    const newParticipant = new Participant({
      participantID: `participant_${Date.now()}`, 
      words: req.body["words"],
      allocated: false,
      completed: false,
      allocated_date: null,
      completed_date: null
    });
    try {
      const savedParticipant = await newParticipant.save();
      res.json(savedParticipant);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });