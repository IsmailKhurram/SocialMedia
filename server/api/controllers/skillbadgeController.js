const SkillBadge = require('../models/skillbadge.model'); 

// Create a new Skill Badge
exports.createSkillBadge = async (req, res) => {
  try {
    const skillBadge = new SkillBadge(req.body);
    await skillBadge.save();
    res.status(201).json({ message: "Skill Badge created", skillBadge });
  } catch (error) {
    res.status(400).json({ message: "Error creating skill badge", error });
  }
};

// List all Skill Badges
exports.listSkillBadges = async (req, res) => {
  try {
    const skillBadges = await SkillBadge.find({});
    res.status(200).json({ skillBadges });
  } catch (error) {
    res.status(400).json({ message: "Error fetching skill badges", error });
  }
};

// Get Skill Badge by ID
exports.getSkillBadgeById = async (req, res) => {
  try {
    const skillBadge = await SkillBadge.findById(req.params.id);
    res.status(200).json({ skillBadge });
  } catch (error) {
    res.status(400).json({ message: "Skill Badge not found", error });
  }
};

// Update Skill Badge by ID
exports.updateSkillBadge = async (req, res) => {
  try {
    const skillBadge = await SkillBadge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Skill Badge updated", skillBadge });
  } catch (error) {
    res.status(400).json({ message: "Error updating skill badge", error });
  }
};

// Delete Skill Badge by ID
exports.deleteSkillBadge = async (req, res) => {
  try {
    await SkillBadge.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Skill Badge deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting skill badge", error });
  }
};
