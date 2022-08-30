const mongoose = require("mongoose");
const cities = require('./cities');
const { descriptors, places } = require("./seedHelper")
const Campground = require("../models/campground");


mongoose.connect('mongodb://localhost:27017/Yelp-camp')
    .then(() => {
        console.log("DATABASE CONNECTED")
    })
    .catch(err => {
        console.log("OH NO Mongo connection ERROR!!!!")
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random406 = Math.floor(Math.random() * 406);
        const price = Math.floor(Math.random() * 5000) + 100;
        const camp = new Campground({
            author: "630de04f3bc214f2cd9a3b1e",
            location: `${cities[random406].city}, ${cities[random406].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, atque iusto? Ducimus, facilis? Reiciendis laudantium corporis similique ipsa adipisci voluptate ducimus corrupti necessitatibus voluptates dolorum placeat animi ullam, aliquam laboriosam.",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log("Data Uploaded");
    console.log("Connection Closed")
})