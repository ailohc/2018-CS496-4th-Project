const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  pw: String,
  projects: [{type: Schema.ObjectId, ref: 'Project'}]
});

module.exports = mongoose.model('User', userSchema);