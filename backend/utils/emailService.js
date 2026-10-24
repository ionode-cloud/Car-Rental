import nodemailer from 'nodemailer';

let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send an email with graceful development fallback
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.EMAIL_FROM || '"RideVista Rentals" <no-reply@ridevista.com>';

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error(`⚠️ Email sending failed to ${to}:`, err.message);
    }
  } else {
    console.log(`📧 [DEV EMAIL SIMULATOR]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message Snippet: ${text || subject}`);
    console.log(`-----------------------------------------`);
    return { mock: true };
  }
};

/**
 * Send Booking Confirmation Email
 */
export const sendBookingConfirmationEmail = async (booking, user, vehicle) => {
  const subject = `Booking Confirmed: ${booking.bookingReference} — RideVista Rentals`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #111; color: #fff; padding: 25px; border-radius: 8px;">
      <h2 style="color: #FF6B00; margin-top: 0;">RideVista Rental Confirmation</h2>
      <p>Hello <strong>${booking.customerDetails.name}</strong>,</p>
      <p>Your booking for <strong>${vehicle.name}</strong> has been successfully placed!</p>
      
      <div style="background-color: #222; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Booking Reference:</strong> <span style="color: #FF6B00;">${booking.bookingReference}</span></p>
        <p style="margin: 5px 0;"><strong>Vehicle:</strong> ${vehicle.brand} ${vehicle.model} (${booking.vehicleType.toUpperCase()})</p>
        <p style="margin: 5px 0;"><strong>Pickup:</strong> ${new Date(booking.pickupDate).toLocaleDateString()} at ${booking.pickupTime} (${booking.pickupLocation})</p>
        <p style="margin: 5px 0;"><strong>Return:</strong> ${new Date(booking.returnDate).toLocaleDateString()} at ${booking.returnTime} (${booking.returnLocation})</p>
        <p style="margin: 5px 0;"><strong>Total Paid/Payable:</strong> ₹${booking.totalAmount.toLocaleString('en-IN')}</p>
        <p style="margin: 5px 0;"><strong>Booking Status:</strong> ${booking.bookingStatus}</p>
        <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
      </div>

      <p>Please present a valid Driver's License and Government ID at the time of vehicle pickup.</p>
      <p>For assistance, reach our 24/7 hotline at <strong>+91 98765 43210</strong> or email <strong>support@ridevista.com</strong>.</p>
      <hr style="border-color: #333;" />
      <p style="font-size: 12px; color: #888;">RideVista Luxury Mobility Services Pvt Ltd.</p>
    </div>
  `;

  return sendEmail({
    to: booking.customerDetails.email,
    subject,
    html,
    text: `Your RideVista booking ${booking.bookingReference} for ${vehicle.name} has been confirmed. Total: ₹${booking.totalAmount}.`,
  });
};
