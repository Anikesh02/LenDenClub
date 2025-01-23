const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../utils/auth");
const db = require("../config/database");

router.post(
  "/register",
  [
    body("username").isLength({ min: 3 }),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const hashedPassword = await auth.hashPassword(password);

      db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        function (err) {
          if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
              return res.status(400).json({ error: "Username already exists" });
            }
            return res.status(500).json({ error: "Server error" });
          }
          const token = auth.generateToken(this.lastID);
          res.status(201).json({ message: "User created successfully", token });
        }
      );
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: "Server error" });
        }
        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const validPassword = await auth.comparePasswords(
          password,
          user.password
        );
        if (!validPassword) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = auth.generateToken(user.id);
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/profile", auth.verifyToken, (req, res) => {
  db.get(
    "SELECT id, username, created_at FROM users WHERE id = ?",
    [req.userId],
    (err, user) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Server error" });
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    }
  );
});

router.put("/profile", auth.verifyToken, (req, res) => {
  const { username } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({ error: "Invalid username" });
  }

  db.get(
    "SELECT id FROM users WHERE username = ? AND id != ?",
    [username, req.userId],
    (err, existingUser) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Server error checking username" });
      }

      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }

      db.run(
        "UPDATE users SET username = ? WHERE id = ?",
        [username, req.userId],
        function (err) {
          if (err) {
            console.error("Update error:", err);
            return res
              .status(500)
              .json({ error: "Server error during update" });
          }

          db.get(
            "SELECT id, username, created_at FROM users WHERE id = ?",
            [req.userId],
            (err, updatedUser) => {
              if (err) {
                console.error("Error fetching updated user:", err);
                return res
                  .status(500)
                  .json({ error: "Server error fetching updated user" });
              }
              res.json(updatedUser);
            }
          );
        }
      );
    }
  );
});

module.exports = router;
