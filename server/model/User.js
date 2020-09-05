const { Schema, model } = require('mongoose')

const schema = new Schema({
  githubId: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
})

module.exports = model('User', schema)