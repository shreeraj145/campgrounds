const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };


const imageSchema = new Schema({
    url: String,
    filename: String
})


imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
})

const campgroundSchema = new mongoose.Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);


campgroundSchema.index(
    {
        location: 'text',
        title: 'text'
    },
    {
        weights:
        {
            location: 5,
            title: 2
        }
    }
)


campgroundSchema.virtual('properties').get(function () {
    return {
        id: this._id,
        title: this.title,
        description: this.description
    }
});


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