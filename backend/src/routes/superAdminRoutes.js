const express = require('express');
const {
  loginSuperAdmin,
  getOrganizations,
  createOrganization,
  getPublicOrganizations,
} = require('../controllers/superAdminController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginSuperAdmin);
router.get('/organizations/public', getPublicOrganizations);
router.get('/organizations', protect, superAdminOnly, getOrganizations);
router.post('/organizations', protect, superAdminOnly, createOrganization);

module.exports = router;
