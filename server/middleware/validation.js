const { response } = require("express");

function validateTask(req, res, next) {
    const { title, priority } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: `Назва завдання є обов'язковою`,
        });
    }

    if (!priority || !["high", "medium", "low"].includes(priority)) {
        return res.status(400).json({
            success: false,
            message: "Пріорітет поинен бути high, medium or low",
        });
    }

    next();
}
function validateObjectId(req, res, next) {
    const mongoose = require("mongoose");

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Некоректне айді",
        });
    }

    next();
}

module.exports = { validateObjectId, validateTask };
