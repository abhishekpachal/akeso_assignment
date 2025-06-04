const { pgTable, integer, serial, text, varchar, timestamp, pgEnum, jsonb } = require("drizzle-orm/pg-core");

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
});

const priorityEnum = pgEnum("priority_enum", ["low", "medium", "high"]);
const statusEnum = pgEnum("status_enum", ["todo", "in_progress", "done"]);

const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  priority: priorityEnum("priority").notNull(),
  status: statusEnum("status").notNull(),
  user_id: integer("user_id").notNull().references(() => users.id),
  assigned_to: integer("assigned_to").references(() => users.id),
  due_date: timestamp("due_date"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  deleted: integer("deleted").default(0).notNull(), // 0 for not deleted, 1 for deleted
});

const task_history = pgTable("task_history", {
  id: serial("id").primaryKey(),
  task_id: integer("task_id")
    .notNull()
    .references(() => tasks.id),
  change_type: varchar("change_type", { length: 50 }).notNull(),
  previous_value: jsonb("previous_value"),
  new_value: jsonb("new_value"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

module.exports = { users, priorityEnum, statusEnum, tasks, task_history };
