import mongoose, { model } from "mongoose";

const { Schema } = mongoose


const usersSchema = new Schema({
    firstName: {type: String, required: true},
    age: {type: Number, required: true},
    address: {
        street: {type: String},
        number: {type: Number},
    },
    professions: [String],
}, {
    timestamps: true,   // this option automatically handles the createdAt and updatedAt fields
})


export default model("Blogpost", usersSchema)  //  this model is now automatically linked to the "Blogposts" collection, if it's not there it will be created