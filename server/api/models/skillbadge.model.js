const mongoose = require('mongoose');

const SkillBadgeSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    level: { type: String, enum: ['Bronze', 'Silver', 'Gold'], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
  },
  { collection: 'skillBadge-data', timestamps: true }
);

const SkillBadgeModel = mongoose.model('SkillBadgeData', SkillBadgeSchema);

module.exports = SkillBadgeModel;
