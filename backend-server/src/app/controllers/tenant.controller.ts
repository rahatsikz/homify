import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { TenantService } from "../services/tenant.service";

const createTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenant = await TenantService.createTenant(req.body);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Tenant created successfully",
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tenants
const getAllTenants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as "asc" | "desc";
    const tenants = await TenantService.getAllTenants(
      search,
      sortBy,
      sortOrder
    );
    res.status(HttpStatus.OK).json({
      success: true,
      data: tenants,
      message: "Tenants fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get tenant by ID
const getTenantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenant = await TenantService.getTenantById(req.params.id);
    if (!tenant) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Tenant not found",
      });
    } else {
      res.status(HttpStatus.OK).json({
        success: true,
        data: tenant,
        message: "Tenant fetched successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Update tenant by ID
const updateTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenant = await TenantService.updateTenant(req.params.id, req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Tenant updated successfully",
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
};

// Delete tenant by ID
const deleteTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await TenantService.deleteTenant(req.params.id);
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Tenant deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const TenantController = {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
};
