import { Request, Response, NextFunction } from "express";

// släpper bara igenom den som är admin
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Bara admin får göra det här" });
  }

  next();
}