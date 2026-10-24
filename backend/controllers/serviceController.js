import Service from '../models/Service.js';

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'active' }).sort({ displayOrder: 1 });
    res.json({ success: true, count: services.length, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
