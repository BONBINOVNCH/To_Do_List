const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { validateTask, validateObjectId } = require("../middleware/validation");

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Отримати список всіх завдань
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Список завдань
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - title
 *                   - data
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Назва завдання
 *                     example: Зробити домашнє завдання
 *                   description:
 *                     type: string
 *                     description: Опис завдання
 *                     example: Виконати вправи з математики
 *                   priority:
 *                     type: string
 *                     enum:
 *                       - high
 *                       - medium
 *                       - low
 *                     default: low
 *                     example: medium
 *                   data:
 *                     type: string
 *                     format: date
 *                     example: 2025-12-22
 *                   createAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-12-22T18:30:00.000Z
 */

router.get("/", async (req, res) => {
    try {
        const { priority, sortBy } = req.query;
        let query = {};

        if (priority) {
            query.priority = priority;
        }

        let tasks = await Task.find(query);

        if (sortBy === "data") {
            tasks.sort({ data: -1 });
        } else if (sortBy === "priority") {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            const allTasks = await tasks;
            const sortedTasks = allTasks.sort((a, b) => {
                priorityOrder[a.priority] - priorityOrder[b.priority];
            });

            return res.json({
                success: true,
                tasks: sortedTasks,
            });
        }

        const result = await tasks;

        return res.json({
            success: true,
            tasks: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Помилка отримання завдань",
            error: err.message,
        });
    }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Створити нове завдання
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Купити продукти
 *               description:
 *                 type: string
 *                 example: Молоко, хліб, яйця
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: low
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-24
 *     responses:
 *       200:
 *         description: Завдання успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Завдання успішно створено
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: Купити продукти
 *                     description:
 *                       type: string
 *                       example: Молоко, хліб, яйця
 *                     priority:
 *                       type: string
 *                       example: low
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: 2025-12-24
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Помилка створення завдання
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Помилка створення завдання
 *                 error:
 *                   type: string
 */

router.post("/", validateTask, async (req, res) => {
    try {
        const { title, description, priority, date } = req.body;

        const newTask = await Task.create({
            title,
            description: description || "",
            priority: priority || "low",
            date: date || new Date().toISOString().split("T")[0],
        });

        return res.json({
            success: true,
            message: "Завдання успішно створено",
            task: newTask,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Помилка створення завдання",
            error: err.message,
        });
    }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Оновити існуюче завдання
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID завдання
 *         schema:
 *           type: string
 *           example: 64b7f3e2a1c9a3f1d1234567
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Оновлена назва
 *               description:
 *                 type: string
 *                 example: Оновлений опис
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: medium
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-30
 *     responses:
 *       200:
 *         description: Завдання успішно оновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Завдання успішно оновлено
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64b7f3e2a1c9a3f1d1234567
 *                     title:
 *                       type: string
 *                       example: Оновлена назва
 *                     description:
 *                       type: string
 *                       example: Оновлений опис
 *                     priority:
 *                       type: string
 *                       example: medium
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: 2025-12-30
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Завдання не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Завдання не знайдено
 *       400:
 *         description: Помилка редагування
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Помилка редагування
 *                 error:
 *                   type: string
 */

router.put("/:id", validateObjectId, validateTask, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, date } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, priority, date },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Завдання не знайдено",
            });
        }
        res.json({
            success: true,
            message: "Завдання успішно оновлено",
            task: updatedTask,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Помилка редагування",
            error: err.message,
        });
    }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Видалити завдання
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID завдання
 *         schema:
 *           type: string
 *           example: 64b7f3e2a1c9a3f1d1234567
 *     responses:
 *       200:
 *         description: Завдання успішно видалено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Завдання видалено
 *       404:
 *         description: Завдання не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Не знайдено
 *       500:
 *         description: Сталась помилка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Сталась помилка
 *                 error:
 *                   type: string
 */

router.delete("/:id", validateObjectId, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: "Не знайдено",
            });
        }

        res.json({
            success: true,
            message: "Завдання видалено",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Сталась помилка",
            errror: err.message,
        });
    }
});

module.exports = router;
