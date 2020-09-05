const { Schema, model } = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true }
})

module.exports = model('Course', schema)