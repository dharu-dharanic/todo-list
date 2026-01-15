const express = require("express");
const { createTask, getMyTasks, updateTask, deleteTask } = require("../controllers/taskController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", auth, createTask);
router.get("/", auth, getMyTasks);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;
