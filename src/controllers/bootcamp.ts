import { Request, Response, NextFunction } from "express";

export const getBootcamp = (req: Request, res: Response, next: NextFunction) => {
  res.send('heelo bootcmp');
};