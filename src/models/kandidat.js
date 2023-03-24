const mongoose = require('mongoose');


const { Schema, model } = mongoose;

const kandidatSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    picture: String,
    name: String,
    visi: String,
    misi: String,
    jumlah_vote: {
        type: Number,
        default: 0
    }
});

const models = model('Kandidat', kandidatSchema)

const increaseVote = async (kandidat_id) => {
    return models.findOneAndUpdate(
        { id: kandidat_id },
        { $inc: { jumlah_vote: 1 } },
        { new: true },
    );
}

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

module.exports = { getOne, getByFields, insertFields, updateFields, increaseVote }




