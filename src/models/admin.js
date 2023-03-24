const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const adminSchema = new Schema({
    number: {
        type: Number,
        unique: true
    }
});
const models = model('Admin', adminSchema)

const checkAdmin = async (number) => {
    return models.findOne({ number: number }) == null ? false : true;
}

module.exports = { checkAdmin }
