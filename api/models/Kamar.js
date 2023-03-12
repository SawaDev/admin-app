import mongoose from "mongoose";

const KamarSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        temir: {
            type: String,
            required: true,
        },
        soni: {
            type: Number,
            required: true,
            min: 0,
        },
        price: {
            type: Number,
            required: true,
        },
        price_in_dollar: {
            type: Number,
            required: true,
        },
        img: {
            type: String,
        },
        desc: {
            type: String,
        },
    },
    { timestamps: true },
);

export default mongoose.model("Kamar", KamarSchema)