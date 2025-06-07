const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const {
  eq,
  and,
  or,
  gte,
  lte,
  desc,
  inArray,
  asc,
  sql,
} = require("drizzle-orm");
const { db } = require("../drizzle/db");
const { task_history, tasks, users } = require("../drizzle/schema");
const { route } = require("./auth");
const { alias } = require("drizzle-orm/gel-core");
const { sendMessage } = require("../kafkaws/producer");

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { title, description, priority, status, assigned_to, due_date } =
      req.body;
    const user_id = user.userId;
    const user_name = user.name;
    if (
      !title ||
      !description ||
      !priority ||
      !status ||
      !assigned_to ||
      !due_date
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const dueDate = new Date(due_date);
    const notification = `${user_name} assigned you a task`;
    db.transaction(async (tx) => {
      const [result] = await tx
        .insert(tasks)
        .values({
          title: title,
          description: description,
          priority: priority,
          status: status,
          assigned_to: assigned_to,
          due_date: dueDate,
          user_id: user_id,
        })
        .returning({ id: tasks.id });

      const taskId = result.id;

      await tx.insert(task_history).values({
        task_id: taskId,
        change_type: "created",
        previous_value: null,
        notification: notification,
        new_value: {
          title,
          description,
          priority,
          status,
          assigned_to,
          due_date: dueDate,
          user_id,
        },
      });
      return taskId;
    })
      .then(async (taskId) => {
        res.status(200).json({
          success: true,
          taskId: taskId,
          message: "Task created successfully",
        });
        await sendMessage("task-updates", {
          userId: assigned_to,
          payload: {
            event: "task_add",
            title: `NEW TASK : ${title}`,
            description: notification,
            data: { taskId },
          },
        });
      })
      .catch((error) => {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Error creating task" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/update", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const user_id = user.userId;
    const user_name = user.name;
    var { taskId, key, value } = req.body;

    const keySet = ["title", "description", "priority", "status", "due_date"];
    if (!taskId || !key || !value || !keySet.includes(key)) {
      return res.status(400).json({ message: "Invalid request" });
    }
    // if task is not found or does not belong to the user
    if (key === "due_date") {
      if (isNaN(Date.parse(value))) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      value = new Date(value);
    }
    const task = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.user_id, user_id)))
      .limit(1);
    if (task.length === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or does not belong to the user" });
    }
    var keyName = key;
    if (key === "due_date") {
      keyName = "due date";
    }
    const notification = `${user_name} updated ${keyName}`;
    db.transaction(async (tx) => {
      await tx
        .update(tasks)
        .set({ [key]: value })
        .where(and(eq(tasks.id, taskId), eq(tasks.user_id, user_id)))
        .execute();
      await tx.insert(task_history).values({
        task_id: taskId,
        change_type: key,
        notification: notification,
        previous_value: task[0],
        new_value: {
          ...task[0],
          [key]: value,
        },
      });
    })
      .then(async () => {
        res.json({
          success: true,
          key: key,
          message: "Task updated successfully",
        });

        await sendMessage("task-updates", {
          userId: task[0].assigned_to,
          payload: {
            event: "task_update",
            title: `UPDATE : ${task[0].title}`,
            description: notification,
            data: { taskId, key, value },
          },
        });
      })
      .catch((error) => {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Error updating task" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating task" });
  }
});

router.post("/mytasks", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userId = user.userId;
    const {
      filterPriority,
      filterStatus,
      filterDueDateStart,
      filterDueDateEnd,
    } = req.body;
    if (!filterPriority || !Array.isArray(filterPriority)) {
      return res.status(400).json({ message: "Invalid priority filter" });
    }
    if (!filterStatus || !Array.isArray(filterStatus)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }
    const assignedUser = alias(users, "assigned_user");
    const createdByUser = alias(users, "created_by");
    const taskList = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        due_date: tasks.due_date,
        created_at: tasks.created_at,
        created_by: createdByUser.username,
        assigned_user: assignedUser.username,
      })
      .from(tasks)
      .leftJoin(createdByUser, eq(tasks.user_id, createdByUser.id))
      .leftJoin(assignedUser, eq(tasks.assigned_to, assignedUser.id))
      .where(
        and(
          eq(tasks.user_id, userId),
          eq(tasks.deleted, 0),
          inArray(
            tasks.priority,
            filterPriority.length > 0
              ? filterPriority
              : ["low", "medium", "high"]
          ),
          inArray(
            tasks.status,
            filterStatus.length > 0
              ? filterStatus
              : ["todo", "in_progress", "done"]
          ),
          filterDueDateStart
            ? gte(tasks.due_date, new Date(filterDueDateStart))
            : true,
          filterDueDateEnd
            ? lte(tasks.due_date, new Date(filterDueDateEnd))
            : true
        )
      )
      .orderBy(asc(tasks.due_date), desc(tasks.created_at));

    res.json({ success: true, tasks: taskList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

router.post("/assigned", authMiddleware, async (req, res) => {
  const user = req.user;
  const userId = user.userId;
  const { filterPriority, filterStatus, filterDueDateStart, filterDueDateEnd } =
    req.body;
  if (!filterPriority || !Array.isArray(filterPriority)) {
    return res.status(400).json({ message: "Invalid priority filter" });
  }
  if (!filterStatus || !Array.isArray(filterStatus)) {
    return res.status(400).json({ message: "Invalid status filter" });
  }
  try {
    const assignedUser = alias(users, "assigned_user");
    const createdByUser = alias(users, "created_by");
    const assignedTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        due_date: tasks.due_date,
        created_at: tasks.created_at,
        created_by: createdByUser.username,
        assigned_user: assignedUser.username,
      })
      .from(tasks)
      .leftJoin(createdByUser, eq(tasks.user_id, createdByUser.id))
      .leftJoin(assignedUser, eq(tasks.assigned_to, assignedUser.id))
      .where(
        and(
          eq(tasks.assigned_to, userId),
          eq(tasks.deleted, 0),
          inArray(
            tasks.priority,
            filterPriority.length > 0
              ? filterPriority
              : ["low", "medium", "high"]
          ),
          inArray(
            tasks.status,
            filterStatus.length > 0
              ? filterStatus
              : ["todo", "in_progress", "done"]
          ),
          filterDueDateStart
            ? gte(tasks.due_date, new Date(filterDueDateStart))
            : true,
          filterDueDateEnd
            ? lte(tasks.due_date, new Date(filterDueDateEnd))
            : true
        )
      )
      .orderBy(asc(tasks.due_date), desc(tasks.created_at));

    res.json({ success: true, tasks: assignedTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching assigned tasks" });
  }
});

router.get("/details/:taskId", authMiddleware, async (req, res) => {
  const user = req.user;
  const userId = user.userId;
  const taskId = parseInt(req.params.taskId, 10);
  const assignedUser = alias(users, "assigned_user");
  const createdByUser = alias(users, "created_by");
  try {
    const taskDetails = await db
      .select({
        id: tasks.id,
        creator_id: tasks.user_id,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        due_date: tasks.due_date,
        created_at: tasks.created_at,
        created_by: createdByUser.username,
        assigned_user: assignedUser.username,
      })
      .from(tasks)
      .leftJoin(assignedUser, eq(tasks.assigned_to, assignedUser.id))
      .leftJoin(createdByUser, eq(tasks.user_id, createdByUser.id))
      .where(
        and(
          eq(tasks.id, taskId),
          or(eq(tasks.user_id, userId), eq(tasks.assigned_to, userId)),
          eq(tasks.deleted, 0)
        )
      )
      .limit(1);

    if (taskDetails.length === 0) {
      return res.status(400).json({ message: "Task not found" });
    }
    if (taskDetails[0].creator_id == userId) {
      taskDetails[0].can_edit = true;
    } else {
      taskDetails[0].can_edit = false;
    }
    delete taskDetails[0].creator_id;
    res.json({ success: true, task: taskDetails[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching task details" });
  }
});

router.post("/delete", authMiddleware, async (req, res) => {
  const user = req.user;
  const userId = user.userId;
  const user_name = user.name;
  const { taskId } = req.body;

  if (!taskId) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const task = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.user_id, userId)))
      .limit(1);

    if (task.length === 0) {
      return res
        .status(400)
        .json({ message: "Task not found or does not belong to the user" });
    }
    const notification = `${user_name} removed task`;
    await db.transaction(async (tx) => {
      await tx
        .update(tasks)
        .set({ deleted: 1 })
        .where(eq(tasks.id, taskId), eq(tasks.user_id, userId))
        .execute();

      await tx.insert(task_history).values({
        task_id: taskId,
        change_type: "deleted",
        notification: notification,
        previous_value: task[0],
        new_value: null,
      });
    });

    await sendMessage("task-updates", {
      userId: task[0].assigned_to,
      payload: {
        event: "task_delete",
        title: `REMOVED : ${task[0].title}`,
        description: notification,
        data: { taskId },
      },
    });
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting task" });
  }
});

router.get("/notifications", authMiddleware, async (req, res) => {
  const user = req.user;
  const userId = user.userId;

  try {
    const result = await db
      .select()
      .from(task_history)
      .where(
        or(
          sql`${task_history.previous_value}->>'assigned_to' = ${userId}`,
          sql`${task_history.new_value}->>'assigned_to' = ${userId}`
        )
      )
      .orderBy(desc(task_history.timestamp))
      .limit(50);
    const processed = result.map((row) => {
      const changeType = row.change_type;
      const prev = row.previous_value || {};
      const curr = row.new_value || {};

      // Map event field based on change_type
      let event;
      if (changeType === "created") {
        event = "task_add";
      } else if (changeType === "deleted") {
        event = "task_delete";
      } else {
        event = "task_update";
      }

      // Build title with prefix
      let title = null;
      if (changeType === "deleted") {
        title = prev.title || curr.title || null;
        title = title ? `REMOVED : ${title}` : "REMOVED";
      } else if (changeType === "created") {
        title = prev.title || curr.title || null;
        title = title ? `NEW TASK : ${title}` : "NEW TASK";
      } else {
        title = prev.title || curr.title || null;
        title = title ? `UPDATE : ${title}` : "UPDATE";
      }

      return {
        id: row.id,
        event,
        changeType,
        title,
        description: row.notification,
        taskId: row.task_id,
        timestamp: row.timestamp,
      };
    });

    res.json({ success: true, notifications: processed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

module.exports = router;
