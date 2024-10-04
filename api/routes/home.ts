// Imports
import { Request, Response, NextFunction } from "express";

export default function home(
	request: Request,
	response: Response,
	next: NextFunction
) {
	response.json({ message: "welcome to our server" });
}
