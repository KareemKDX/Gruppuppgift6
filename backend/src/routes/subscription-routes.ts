import { Router } from "express";
import { pool } from "../db";
import { authenticateToken } from "../middleware/auth";

const router = Router();

//FETCH ALL SUBSCRIPTIONS
router.get("/subscriptions", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, price, playlist_limit, early_access
       FROM subscriptions
       ORDER BY price ASC`,
    );

    res.json({ subscriptions: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching subscriptions" });
  }
});

//CHANGE SUBSCRIPTION CURRENT USER
router.put("/profile/subscription", authenticateToken, async (req, res) => {
  const { subscription_id } = req.body;

  if (!subscription_id) {
    return res.status(400).json({ message: "subscription_id is required" });
  }

  try {
    const subCheck = await pool.query(
      `SELECT id FROM subscriptions WHERE id = $1`,
      [subscription_id],
    );

    if (subCheck.rows.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await pool.query(`UPDATE users SET subscription_id = $1 WHERE id = $2`, [
      subscription_id,
      req.user!.id,
    ]);

    res.json({ message: "Subscription updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating subscription" });
  }
});

export default router;
