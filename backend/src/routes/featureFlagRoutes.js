const express = require('express');
const {
  getFlags,
  createFlag,
  updateFlag,
  deleteFlag,
  checkFeature,
} = require('../controllers/featureFlagController');
const { protect, orgAdminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/check', checkFeature);

router.get('/', protect, orgAdminOnly, getFlags);
router.post('/', protect, orgAdminOnly, createFlag);
router.put('/:id', protect, orgAdminOnly, updateFlag);
router.delete('/:id', protect, orgAdminOnly, deleteFlag);

module.exports = router;
