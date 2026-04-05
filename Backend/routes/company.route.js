import express from 'express';
import { registerCompany,getCompanyById,getCompanyByUserId,updateCompany } from '../controllers/company.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.route('/company-register').post(isAuthenticated,registerCompany);
router.route('/company/:id').get(isAuthenticated,getCompanyById);
router.route('/company-user').get(isAuthenticated,getCompanyByUserId);
router.route('/company-update/:id').put(isAuthenticated,upload.single('file'),updateCompany);

export default router;