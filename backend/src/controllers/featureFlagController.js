const FeatureFlag = require('../models/FeatureFlag');
const Organization = require('../models/Organization');

const getFlags = async (req, res) => {
  const flags = await FeatureFlag.find({ organization: req.user.orgId }).sort({
    createdAt: -1,
  });
  res.json(flags);
};

const createFlag = async (req, res) => {
  const { feature_key, description, is_enabled } = req.body;

  if (!feature_key) {
    return res.status(400).json({ message: 'Feature key is required' });
  }

  const existing = await FeatureFlag.findOne({
    organization: req.user.orgId,
    feature_key: feature_key.trim(),
  });

  if (existing) {
    return res.status(400).json({
      message: 'Feature flag with this key already exists for your organization',
    });
  }

  const flag = await FeatureFlag.create({
    feature_key: feature_key.trim(),
    description: description || '',
    is_enabled: is_enabled ?? false,
    organization: req.user.orgId,
  });

  res.status(201).json(flag);
};

const updateFlag = async (req, res) => {
  const flag = await FeatureFlag.findById(req.params.id);

  if (!flag) {
    return res.status(404).json({ message: 'Feature flag not found' });
  }

  if (flag.organization.toString() !== req.user.orgId.toString()) {
    return res.status(403).json({ message: 'Access denied. Flag belongs to another organization.' });
  }

  const { feature_key, description, is_enabled } = req.body;

  if (feature_key !== undefined) {
    const trimmedKey = feature_key.trim();
    if (!trimmedKey) {
      return res.status(400).json({ message: 'Feature key cannot be empty' });
    }

    const duplicate = await FeatureFlag.findOne({
      organization: req.user.orgId,
      feature_key: trimmedKey,
      _id: { $ne: flag._id },
    });

    if (duplicate) {
      return res.status(400).json({
        message: 'Feature flag with this key already exists for your organization',
      });
    }

    flag.feature_key = trimmedKey;
  }

  if (description !== undefined) flag.description = description;
  if (is_enabled !== undefined) flag.is_enabled = is_enabled;

  const updated = await flag.save();
  res.json(updated);
};

const deleteFlag = async (req, res) => {
  const flag = await FeatureFlag.findById(req.params.id);

  if (!flag) {
    return res.status(404).json({ message: 'Feature flag not found' });
  }

  if (flag.organization.toString() !== req.user.orgId.toString()) {
    return res.status(403).json({ message: 'Access denied. Flag belongs to another organization.' });
  }

  await flag.deleteOne();
  res.json({ message: 'Feature flag deleted' });
};

const checkFeature = async (req, res) => {
  const { orgId, feature } = req.query;

  if (!orgId || !feature) {
    return res.status(400).json({ message: 'orgId and feature query parameters are required' });
  }

  const organization = await Organization.findById(orgId).select('_id name');
  if (!organization) {
    return res.status(404).json({ message: 'Organization not found' });
  }

  const flag = await FeatureFlag.findOne({
    organization: orgId,
    feature_key: feature.trim(),
  });

  if (!flag) {
    return res.status(404).json({ message: 'Feature flag not found' });
  }

  res.json({
    feature_key: flag.feature_key,
    is_enabled: flag.is_enabled,
    organization: {
      _id: organization._id,
      name: organization.name,
    },
  });
};

module.exports = {
  getFlags,
  createFlag,
  updateFlag,
  deleteFlag,
  checkFeature,
};
