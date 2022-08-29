const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;


const campgroundSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})


campgroundSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await review.deleteMany({
            id:
            {
                $in: doc.reviews
            }
        })
    }
})

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;