const { mongoose } = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to database");
    } catch (err) {
        console.error("Помилка підключення: ", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

// const { MongoClient, ObjectId } = require("mongodb");

// require("dotenv").config();

// let db;

// async function connectDB() {
//     try {
//         const client = new MongoClient(process.env.MONGODB_URL);
//         await client.connect();
//         db = client.db();
//         console.log("Connected to DB");
//         return db;
//     } catch (e) {
//         console.log("Помилка підключення: " + e);
//         process.exit(1);
//     }
// }

// function getDB() {
//     if (!db) {
//         throw new Error("База даних підключена");
//     }

//     return db;
// }

// module.exports = { connectDB, getDB, ObjectId };
