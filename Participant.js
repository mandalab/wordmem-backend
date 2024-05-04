const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  participantID: String,
  words: [String],
  allocated: Boolean,
  completed: Boolean,
  allocated_date: {
    type: Date,
    default: null 
  },
  completed_date: {
    type: Date,
    default: null
  }
});

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
