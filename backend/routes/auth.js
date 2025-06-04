const express = require("express");
const bcrypt = require("bcryptjs");
const { eq } = require("drizzle-orm");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { db } = require("../drizzle/db");
const { users } = require("../drizzle/schema");
const authMiddleware = require("../middleware/authMiddleware");


// Register
router.post("/signup", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email, password, and name are required",
        });
    }
    const { email, password, name } = req.body;
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0];
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    await db.insert(users).values({ email, password: hashed, username: name });
    res.json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Login
router.post("/signin", async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
  
    const { email, password } = req.body;
    
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0];


    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Email not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, name: user.username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ success: true, token: token, user: { name: user.username } });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});


router.get("/users", authMiddleware, async (req, res) => {
  try {
    const result = await db.select({ id: users.id, name: users.username }).from(users);
    res.json({ success: true, users: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
