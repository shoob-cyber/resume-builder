import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sksahib807_db_user:resume123@cluster0.xjeiifq.mongodb.net/RESUME_BUILDER')
    .then(() => {
        console.log("MongoDB connected successfully");
    })
}
