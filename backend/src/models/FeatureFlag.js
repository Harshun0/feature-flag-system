const mongoose = require('mongoose');

const featureFlagSchema = new mongoose.Schema(
  {
    feature_key: {
      type: String,
      required: [true, 'Feature key is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    is_enabled: {
      type: Boolean,
      default: false,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
    },
  },
  {
    timestamps: true,
  }
);

featureFlagSchema.index({ organization: 1, feature_key: 1 }, { unique: true });

module.exports = mongoose.model('FeatureFlag', featureFlagSchema);
