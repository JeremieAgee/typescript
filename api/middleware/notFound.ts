// Imports
import { Request, Response, NextFunction } from "express";

// Nor Found Error Handling Middleware
export default function notFound(error: Error, request: Request, response: Response, next: NextFunction) {
  console.error(error.stack); // Log the error stack trace for debugging purposes
  response.status(404).json({
    error:
        "Resource not found. Try again or try different spot",
});
}