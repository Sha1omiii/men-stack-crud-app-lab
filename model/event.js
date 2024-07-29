const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    model: String,
    make: String,
    year: Number,
    description: String,
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;