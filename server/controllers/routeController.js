import Route from '../models/Route.js';

// @desc    Get all routes (with optional from/to filter)
// @route   GET /api/v1/routes
// @access  Public
export const getRoutes = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { status: 'active' };
    if (from) filter.from = from;
    if (to) filter.to = to;

    const routes = await Route.find(filter).sort({ dep: 1 });
    res.status(200).json({ success: true, count: routes.length, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single route
// @route   GET /api/v1/routes/:id
// @access  Public
export const getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create route
// @route   POST /api/v1/routes
// @access  Admin
export const createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update route
// @route   PUT /api/v1/routes/:id
// @access  Admin
export const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete route
// @route   DELETE /api/v1/routes/:id
// @access  Admin
export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    res.status(200).json({ success: true, message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all unique cities
// @route   GET /api/v1/routes/cities
// @access  Public
export const getCities = async (req, res) => {
  try {
    const fromCities = await Route.distinct('from', { status: 'active' });
    const toCities = await Route.distinct('to', { status: 'active' });
    const cities = [...new Set([...fromCities, ...toCities])].sort();
    res.status(200).json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
