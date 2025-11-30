import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { DescoService } from "../services/desco.service";

const latestReading = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const balance = await DescoService.getLatestReading(req.params.tenantId);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Latest reading fetched successfully",
      data: balance,
    });
  } catch (error) {
    next(error);
  }
};

export const DescoController = { latestReading };