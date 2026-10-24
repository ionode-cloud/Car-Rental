import Package from '../models/Package.js';

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({ status: 'active' }).sort({ price: 1 });
    res.json({ success: true, count: packages.length, packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, package: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
