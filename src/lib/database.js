require('dotenv').config({ 
    path: './.env', 
    debug: true 
})
const mongoose = require('mongoose');

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL);

module.exports = mongoose