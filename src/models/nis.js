const mongoose = require('mongoose');


const { Schema, model } = mongoose;

const nisSchema = new Schema({
  nis: { type: Number, unique: true},
  nama: String
});

const models = model('Nis',nisSchema)

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