const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');

const loginSuperAdmin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (
    email !== process.env.SUPER_ADMIN_EMAIL ||
    password !== process.env.SUPER_ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ role: 'superadmin' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({
    token,
    role: 'superadmin',
    email: process.env.SUPER_ADMIN_EMAIL,
  });
};

const getOrganizations = async (req, res) => {
  const organizations = await Organization.find().sort({ createdAt: -1 });
  res.json(organizations);
};

const createOrganization = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Organization name is required' });
  }

  const organization = await Organization.create({
    name,
    description: description || '',
  });

  res.status(201).json(organization);
};

const getPublicOrganizations = async (req, res) => {
  const organizations = await Organization.find()
    .select('_id name')
    .sort({ name: 1 });
  res.json(organizations);
};

module.exports = {
  loginSuperAdmin,
  getOrganizations,
  createOrganization,
  getPublicOrganizations,
};
