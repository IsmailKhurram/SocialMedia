const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwtHelper');
const { 
  createSkillBadge, 
  listSkillBadges, 
  getSkillBadgeById, 
  updateSkillBadge, 
  deleteSkillBadge 
} = require('../controllers/skillbadgeController');

// Routes for skill badges
router.post('/create', verifyToken, createSkillBadge);
router.get('/list', verifyToken, listSkillBadges);
router.get('/:id', verifyToken, getSkillBadgeById);
router.put('/update/:id', verifyToken, updateSkillBadge);
router.delete('/delete/:id', verifyToken, deleteSkillBadge);

module.exports = router;
