import PDFDocument from 'pdfkit';

/**
 * Generate a PDF invoice and pipe it directly to a writable stream (e.g., Express res)
 * @param {Object} booking - Fully populated booking document
 * @param {Object} res - Express Response stream
 */
export const generateInvoicePDF = (booking, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Set HTTP headers for file download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename=Invoice-${booking.bookingReference}.pdf`
  );

  doc.pipe(res);

  // Brand Header
  doc
    .fillColor('#FF6B00')
    .fontSize(24)
    .text('RIDEVISTA', { continued: true })
    .fillColor('#111111')
    .fontSize(10)
    .text('  |  Premium Car & Scooty Rentals', { align: 'right' });

  doc
    .fontSize(9)
    .fillColor('#555555')
    .text('RideVista Mobility Pvt Ltd, Aerocity Business Park, New Delhi, India')
    .text('GSTIN: 07AAAAA0000A1Z5 | Support: +91 98765 43210 | support@ridevista.com')
    .moveDown(1);

  doc.strokeColor('#EEEEEE').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1);

  // Invoice Title & Meta
  doc
    .fillColor('#111111')
    .fontSize(16)
    .text('TAX INVOICE / BOOKING RECEIPT', { align: 'center' })
    .moveDown(0.5);

  const startY = doc.y;

  // Invoice Details (Left column)
  doc
    .fontSize(10)
    .fillColor('#111111')
    .text(`Invoice / Booking Ref: ${booking.bookingReference}`, 50, startY)
    .text(`Booking Date: ${new Date(booking.createdAt).toLocaleDateString('en-IN')}`)
    .text(`Payment Status: ${booking.paymentStatus}`)
    .text(`Payment Method: ${booking.paymentMethod}`);

  // Customer Details (Right column)
  doc
    .text(`Billed To: ${booking.customerDetails?.name || 'Customer'}`, 320, startY)
    .text(`Email: ${booking.customerDetails?.email || ''}`)
    .text(`Phone: ${booking.customerDetails?.phone || ''}`)
    .text(`License No: ${booking.customerDetails?.drivingLicenseNumber || 'Verified on Pickup'}`);

  doc.moveDown(2);

  // Vehicle & Trip Details Table
  const tripY = doc.y + 10;
  doc
    .rect(50, tripY, 500, 24)
    .fill('#F5F5F5')
    .stroke('#E0E0E0');

  doc
    .fillColor('#111111')
    .fontSize(10)
    .text('TRIP & VEHICLE SPECIFICATIONS', 60, tripY + 7);

  doc.moveDown(1.5);

  const vehicleName = booking.vehicle?.name || `${booking.vehicleType.toUpperCase()} Rental`;
  const vehicleBrand = booking.vehicle?.brand || '';

  doc
    .fontSize(9)
    .fillColor('#333333')
    .text(`Vehicle: ${vehicleBrand} ${vehicleName}`, 60)
    .text(`Vehicle Type: ${booking.vehicleType.toUpperCase()}`)
    .text(`Pickup: ${new Date(booking.pickupDate).toLocaleDateString('en-IN')} ${booking.pickupTime || ''} (${booking.pickupLocation})`)
    .text(`Return: ${new Date(booking.returnDate).toLocaleDateString('en-IN')} ${booking.returnTime || ''} (${booking.returnLocation})`)
    .text(`Total Duration: ${booking.rentalDuration?.days || 1} Days`);

  doc.moveDown(2);

  // Price Breakdown Table Header
  const tableTop = doc.y;
  doc
    .rect(50, tableTop, 500, 22)
    .fill('#111111');

  doc
    .fillColor('#FFFFFF')
    .fontSize(9)
    .text('DESCRIPTION', 60, tableTop + 6)
    .text('RATE (INR)', 280, tableTop + 6)
    .text('QTY / DAYS', 370, tableTop + 6)
    .text('AMOUNT (INR)', 460, tableTop + 6);

  let curY = tableTop + 26;

  const pb = booking.priceBreakdown || {};
  const items = [
    {
      desc: `Vehicle Rental Fare (${vehicleName})`,
      rate: `₹${(pb.dailyRate || 0).toLocaleString('en-IN')}`,
      qty: `${pb.rentalDays || 1} Days`,
      amt: `₹${(pb.baseRental || 0).toLocaleString('en-IN')}`,
    },
    {
      desc: 'Goods & Services Tax (GST 18%)',
      rate: '18%',
      qty: '1',
      amt: `₹${(pb.taxAmount || 0).toLocaleString('en-IN')}`,
    },
    {
      desc: 'Refundable Security Deposit',
      rate: `₹${(pb.securityDeposit || 0).toLocaleString('en-IN')}`,
      qty: '1',
      amt: `₹${(pb.securityDeposit || 0).toLocaleString('en-IN')}`,
    },
  ];

  if (pb.deliveryFee > 0) {
    items.push({
      desc: 'Location Delivery & Logistics Fee',
      rate: `₹${pb.deliveryFee.toLocaleString('en-IN')}`,
      qty: '1',
      amt: `₹${pb.deliveryFee.toLocaleString('en-IN')}`,
    });
  }

  if (pb.discountAmount > 0) {
    items.push({
      desc: `Promotional Coupon Discount (${pb.couponCode || 'APPLIED'})`,
      rate: `-`,
      qty: '1',
      amt: `-₹${pb.discountAmount.toLocaleString('en-IN')}`,
    });
  }

  items.forEach((item) => {
    doc
      .fillColor('#333333')
      .fontSize(9)
      .text(item.desc, 60, curY)
      .text(item.rate, 280, curY)
      .text(item.qty, 370, curY)
      .text(item.amt, 460, curY);

    curY += 20;
  });

  doc.strokeColor('#DDDDDD').lineWidth(0.5).moveTo(50, curY).lineTo(550, curY).stroke();
  curY += 10;

  // Grand Total Highlight Box
  doc
    .rect(300, curY, 250, 30)
    .fill('#FFF0E6')
    .stroke('#FF6B00');

  doc
    .fillColor('#FF6B00')
    .fontSize(12)
    .text(`TOTAL AMOUNT: ₹${booking.totalAmount.toLocaleString('en-IN')}`, 320, curY + 8);

  curY += 50;

  // Terms & Footer
  doc
    .fontSize(8)
    .fillColor('#777777')
    .text('Terms & Conditions:', 50, curY)
    .text('1. Security deposit is refundable upon safe inspection of the vehicle within 24 hours of return.')
    .text('2. Customers must adhere to statutory speed limits and traffic laws.')
    .text('3. This is a computer-generated tax invoice and requires no physical signature.')
    .moveDown(1)
    .text('Thank you for choosing RideVista. Drive Safe and Enjoy the Freedom of the Road!', {
      align: 'center',
    });

  doc.end();
};

export default generateInvoicePDF;
