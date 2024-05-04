const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  participantId: String,
  target_words: [String],
  hindiProficiency: String,
  distractor: String,
  math: String,
  responses: [String],
  age: Number,
  gender: String,
  language: String,
  education: String,
  roll: String
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
