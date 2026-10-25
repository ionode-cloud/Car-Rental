const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Vehicle = require('./backend/models/Vehicle');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const targets = ['Toyota', 'Ford', 'Mercedes-Benz', 'Jeep', 'BMW', 'Audi'];
  for (const b of targets) {
    const v = await Vehicle.find({ brand: b }).select('name brand category images pricePerDay');
    console.log(`Brand ${b}:`, v.length ? v.map(x => x.name) : 'NONE');
  }

  process.exit(0);
}

run().catch(console.error);
