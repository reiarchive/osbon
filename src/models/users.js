const mongoose = require('mongoose');


const { Schema, model } = mongoose;

const userSchema = new Schema({
  number: { 
    type: Number, 
    unique: true 
  },
  nis: { 
    type: Number
  },
  isVote: {
    type: Boolean,
    default: false
  },
  real_name: String,
  whatsapp_name: String,
  name: String,
  firstRegister: {
    type: Date,
    default: Date.now
  }
});

const models = model('User', userSchema)

const getOne = async (criteria) => {
  return await models.findOne(criteria)
}

const getByFields = async (criteria) => {
  return await models.find({}, criteria).exec();
}

const insertFields = async(data) => {
  return await new models(data).save();
}

const updateFields = async (search, update) => {
  return await models.findOneAndUpdate(search, update);
}

module.exports = { getOne, getByFields, insertFields, updateFields }