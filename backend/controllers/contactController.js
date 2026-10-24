import Contact from '../models/Contact.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields.',
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject: subject || 'General Rental Inquiry',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our concierge team will reach out shortly.',
      contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
