const mongoose = require("mongoose");
const cities = require('./cities');
const { descriptors, places } = require("./seedHelper")
const Campground = require("../models/campground");


mongoose.connect("mongodb+srv://shreerajpalande:Goodwill%401997@cluster0.c8fudw4.mongodb.net/?retryWrites=true&w=majority")
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
    for (let i = 0; i < 300; i++) {
        const random406 = Math.floor(Math.random() * 406);
        const price = Math.floor(Math.random() * 5000) + 100;
        const camp = new Campground({
            author: "630de04f3bc214f2cd9a3b1e",
            location: `${cities[random406].city}, ${cities[random406].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { type: 'Point', coordinates: [cities[random406].longitude, cities[random406].latitude] },
            images: [
                {
                    url: 'https://res.cloudinary.com/db9bosujb/image/upload/v1661968071/Escapalogy/p6bxlepugiwo5m9l6vd6.jpg',
                    filename: 'Escapalogy/p6bxlepugiwo5m9l6vd6'
                },
                {
                    url: 'https://res.cloudinary.com/db9bosujb/image/upload/v1661968075/Escapalogy/psmsojx2fon1hblefsog.jpg',
                    filename: 'Escapalogy/psmsojx2fon1hblefsog'
                },
                {
                    url: 'https://res.cloudinary.com/db9bosujb/image/upload/v1661968077/Escapalogy/q4fijj5xmndczalieuqg.jpg',
                    filename: 'Escapalogy/q4fijj5xmndczalieuqg'
                }
            ],
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