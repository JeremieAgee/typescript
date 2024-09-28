
import { Request, Response, NextFunction } from "express";
// Generic Error Handling Middleware
export default function genericError(error: Error, request: Request, response: Response, next: NextFunction) {
  console.error(error.stack); // Log the error stack trace for debugging purposes
  response.status(500).json({
    error: "An error occurred. Please try again later.", 
    errorStack: error.stack, // Include the stack trace in the response (optional for production)
    errorMessage: error.message, // Include the error message
  });
}