import Review from '../models/Review.js';

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .populate('vehicle', 'name brand images')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { vehicleId, bookingId, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const review = await Review.create({
      customer: req.user._id,
      customerName: req.user.name,
      vehicle: vehicleId || null,
      booking: bookingId || null,
      rating: Number(rating),
      comment,
      status: 'approved', // Auto-approved or pending based on policy
    });

    res.status(201).json({ success: true, message: 'Thank you for your review!', review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
