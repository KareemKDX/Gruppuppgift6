import { Request, Response } from "express";
import { z } from "zod";
import { pool } from "../db";

// kollar att paketet som skickas in är ett heltal
const CheckoutSchema = z.object({
  subscription_id: z.number().int().positive(),
});

// skapar kvitto och sätter användarens nya nivå
export async function createCheckout(req: Request, res: Response) {
  const result = CheckoutSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: "Fel format på paketet" });
  }

  const userId = req.user?.id;
  const { subscription_id } = result.data;

  try {
    // hämtar priset från databasen så ingen kan skicka med ett eget belopp
    const subscription = await pool.query(
      "SELECT id, price FROM subscriptions WHERE id = $1",
      [subscription_id]
    );

    if (subscription.rows.length === 0) {
      return res.status(404).json({ error: "Paketet finns inte" });
    }

    const price = subscription.rows[0].price;

    // sparar kvittot
    const receipt = await pool.query(
      "INSERT INTO receipts (user_id, subscription_id, amount) VALUES ($1, $2, $3) RETURNING *",
      [userId, subscription_id, price]
    );

    // uppdaterar användarens nivå
    await pool.query("UPDATE users SET subscription_id = $1 WHERE id = $2", [
      subscription_id,
      userId,
    ]);

    res.status(201).json({ receipt: receipt.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte slutföra köpet" });
  }
}