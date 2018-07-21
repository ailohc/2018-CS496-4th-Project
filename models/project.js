const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  user: {type: Schema.ObjectId, ref:'User'},
  files: Array // {classname: String, code: String}
});

module.exports = mongoose.model('Project', projectSchema);