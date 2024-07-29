const { application } = require('express');
const Car = require('./model/event.js');
const mongoose = require('mongoose');
const methoOverride = require('method-override');
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methoOverride('_method'));
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`connected to mongodb ${mongoose.connection.name}`);
});

app.get('/cars', async (req, res) => {
    res.redirect("/cars/new");
});

app.post('/cars', async (req, res) => {
    const car = new Car({
        model: req.body.model,
        make: req.body.make,
        year: req.body.year,
        description: req.body.description
    });
    await car.save();
    res.redirect('/cars/show');
})

app.get('/cars/new', (req, res) => {
    res.render('./events/new.ejs');
});

app.get('/cars/show', async (req, res) => {
    const cars = await Car.find();
    res.render('./events/show.ejs', { cars: cars });
})

app.get('/cars/:id/update', async (req, res) => {
    const car = await Car.findById(req.params.id.trim());
    res.render('events/update.ejs', { car: car });
});

app.put('/cars/:id', async (req, res) => {
    const carid = req.params.id.trim();
    await Car.findByIdAndUpdate(carid, {
        model: req.body.model,
        make: req.body.make,
        year: req.body.year,
        description: req.body.description,
    }, { new: true }); // returns to us the updated document without creating a new doc
    res.redirect('/cars/show')
})

app.get('/cars/:id', async (req, res) => {
    const car = await Car.findById(req.params.id);
    res.render('events/show-by-id.ejs', { car: car });
});

app.delete('/cars/:id', async (req, res) => {
    const carid = req.params.id.trim();
    await Car.findByIdAndDelete(carid)
    res.redirect('/cars/show');
})

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.listen(8000, () => {
    console.log('Running on 8000');
});
