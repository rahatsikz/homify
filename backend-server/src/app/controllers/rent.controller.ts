import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status";
import { RentService } from "../services/rent.service";

// Create rent
const createRent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rent = await RentService.createRent(req.body);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Rent created successfully",
      data: rent,
    });
  } catch (error) {
    next(error);
  }
};

// Get all rents by tenant ID
const getRentsByTenantId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sortBy, sortOrder, month } = req.query;
    const rents = await RentService.getRentsByTenantId(
      req.params.tenantId,
      month as string | undefined,
      (sortBy as string) || "createdAt",
      (sortOrder as "asc" | "desc") || "desc"
    );
    res.status(HttpStatus.OK).json({
      success: true,
      data: rents,
      message: "Rents for specific tenant fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get rent by ID
const getRentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rent = await RentService.getRentById(req.params.id);
    if (!rent) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Rent not found",
      });
    } else {
      res.status(HttpStatus.OK).json({
        success: true,
        data: rent,
        message: "Rent fetched successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Update rent by ID
const updateRent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rent = await RentService.updateRent(req.params.id, req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Rent updated successfully",
      data: rent,
    });
  } catch (error) {
    next(error);
  }
};

// Delete rent by ID
const deleteRent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await RentService.deleteRent(req.params.id);
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Rent deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update payment status
const updatePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentStatus, paidAmount } = req.body;
    const rent = await RentService.updatePaymentStatus(
      req.params.id,
      paymentStatus,
      paidAmount
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Payment status updated successfully",
      data: rent,
    });
  } catch (error) {
    next(error);
  }
};

export const RentController = {
  createRent,
  getRentsByTenantId,
  getRentById,
  updateRent,
  deleteRent,
  updatePaymentStatus,
};
