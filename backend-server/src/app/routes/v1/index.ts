import Express from 'express';
import { TenantController } from '../../controllers/tenant.controller';
import { RentController } from '../../controllers/rent.controller';
import { AuthController } from '../../controllers/auth.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { DescoController } from '../../controllers/desco.controller';

const router = Express.Router();

// auth
router.post('/auth/request-otp', AuthController.requestCode);
router.post('/auth/verify-otp', AuthController.verifyCode);
router.post('/auth/new-token', AuthController.getAccessToken);

// auth checker
router.use(requireAuth);

// profile
router.get('/auth/profile', AuthController.getProfile);
router.put('/auth/profile', AuthController.updateProfile);

// tenant
router.post('/tenant', TenantController.createTenant);
router.get('/tenant', TenantController.getAllTenants);
router.get('/tenant/:id', TenantController.getTenantById);
router.put('/tenant/:id', TenantController.updateTenant);
router.delete('/tenant/:id', TenantController.deleteTenant);

// rent
router.post('/rent', RentController.createRent);
router.get('/rent/:tenantId', RentController.getRentsByTenantId);
router.get('/rent/:id', RentController.getRentById);
router.put('/rent/:id', RentController.updateRent);
router.delete('/rent/:id', RentController.deleteRent);
router.patch('/rent/:id/payment-status', RentController.updatePaymentStatus);

// desco electric
router.get('/desco/:tenantId', DescoController.latestReading);

export default router;
