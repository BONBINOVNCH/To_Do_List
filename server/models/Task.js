const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Назва завдання обов'язкова"],
        trim: true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
    },
    priority: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "low",
    },

    data: {
        type: String,
        default: new Date().toISOString().split("T")[0],
        required: true,
    },
    createAt: {
        type: Date,
        defautl: new Date(),
    },
});

module.exports = mongoose.model("tasks", taskSchema);

// const { title } = require("process");
// const { getDB, ObjectId } = require("../config/db");

// class Task {
//     static collection() {
//         return getDB().collection("tasks");
//     }

//     static async create(taskData) {
//         const task = {
//             title: taskData.title,
//             description: taskData.description,
//             priority: taskData.priority,
//             data: taskData.date,
//             createAt: new Date(),
//         };

//         const result = await this.collection().insertOne(task);

//         return {
//             _id: result.insertedId,
//             ...task,
//         };
//     }
//     static async findAll(filter = {}, sortBy = null) {
//         let query = {};

//         if (filter.priority) {
//             query.priority = filter.priority;
//         }

//         const cursor = this.collection().find(query);

//         if (sortBy === "data") {
//             cursor.sort({ date: -1 });
//         } else if (sortBy === "priority") {
//             const priorityOrder = { high: 1, medium: 2, low: 3 };
//             const tasks = await cursor.toArray();

//             return tasks.sort(
//                 (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
//             );
//         }

//         return cursor.toArray();
//     }

//     static async findById(id) {
//         return await this.collection().findOne({ _id: ObjectId(id) });
//     }

//     static async update(id, updateData) {
//         const updateFileds = {};

//         if (updateData.title) {
//             updateFields.title = updateData.title;
//         }

//         if (updateData.description) {
//             updateFileds.description = updateData.description;
//         }

//         if (updateData.priority) {
//             updateFileds.priority = updateData.priority;
//         }

//         if (updateData.date) {
//             updateFileds.date = updateData.date;
//         }

//         const result = await this.collection().updateOne(
//             { _id: new ObjectId(id) },
//             { $set: updateFileds }
//         );

//         return result;
//     }

//     static async delete(id) {
//         return await this.collection().deleteOne({ _id: new ObjectId(id) });
//     }
// }
