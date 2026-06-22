const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');

const generateToken = (userId, orgId, role) => {
  return jwt.sign({ userId, orgId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const register = async (req, res) => {
  const { name, email, password, organizationId } = req.body;

  if (!name || !email || !password || !organizationId) {
    return res.status(400).json({
      message: 'Name, email, password, and organizationId are required',
    });
  }

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    return res.status(404).json({ message: 'Organization not found' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  const user = await User.create({
    name,
    email,
    password,
    organization: organizationId,
    role: 'org_admin',
  });

  const token = generateToken(user._id, user.organization, user.role);

  res.status(201).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).populate(
    'organization',
    'name'
  );

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id, user.organization._id || user.organization, user.role);

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
    },
  });
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user.userId)
    .select('-password')
    .populate('organization', 'name description');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};

module.exports = { register, login, getMe };
