import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Route from './models/Route.js';
import Booking from './models/Booking.js';
import Passenger from './models/Passenger.js';
import Complaint from './models/Complaint.js';
import Refund from './models/Refund.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pakride';

// ── Route seed data (from original routes.js) ──
const routesData = [
  { from: 'Lahore', to: 'Karachi', fromCode: 'LHR', toCode: 'KHI', dep: '08:00', arr: '22:00', dur: '14h', dist: '1240km', fareAC: 3500, fareNAC: 2200, type: 'AC', busType: 'Volvo AC', available: 28 },
  { from: 'Lahore', to: 'Karachi', fromCode: 'LHR', toCode: 'KHI', dep: '20:00', arr: '10:00', dur: '14h', dist: '1240km', fareAC: 3200, fareNAC: 2000, type: 'AC', busType: 'Daewoo AC', available: 12 },
  { from: 'Islamabad', to: 'Lahore', fromCode: 'ISB', toCode: 'LHR', dep: '06:00', arr: '10:30', dur: '4.5h', dist: '380km', fareAC: 1100, fareNAC: 750, type: 'AC', busType: 'Faisal Movers AC', available: 20 },
  { from: 'Karachi', to: 'Hyderabad', fromCode: 'KHI', toCode: 'HYD', dep: '09:00', arr: '12:30', dur: '3.5h', dist: '165km', fareAC: 650, fareNAC: 400, type: 'Non-AC', busType: 'Standard Bus', available: 35 },
  { from: 'Peshawar', to: 'Islamabad', fromCode: 'PEW', toCode: 'ISB', dep: '07:00', arr: '10:30', dur: '3.5h', dist: '185km', fareAC: 900, fareNAC: 600, type: 'AC', busType: 'Skyways AC', available: 18 },
  { from: 'Multan', to: 'Lahore', fromCode: 'MUL', toCode: 'LHR', dep: '14:00', arr: '18:00', dur: '4h', dist: '330km', fareAC: 1050, fareNAC: 700, type: 'AC', busType: 'Bilal Travels AC', available: 22 },
  { from: 'Quetta', to: 'Karachi', fromCode: 'QTA', toCode: 'KHI', dep: '18:00', arr: '08:00', dur: '14h', dist: '710km', fareAC: 2800, fareNAC: 1900, type: 'AC', busType: 'Faisal Movers', available: 15 },
  { from: 'Lahore', to: 'Islamabad', fromCode: 'LHR', toCode: 'ISB', dep: '12:00', arr: '16:30', dur: '4.5h', dist: '380km', fareAC: 1100, fareNAC: 750, type: 'AC', busType: 'Daewoo Premium', available: 8 },
  { from: 'Lahore', to: 'Faisalabad', fromCode: 'LHR', toCode: 'FSL', dep: '12:00', arr: '14:30', dur: '2.5h', dist: '200km', fareAC: 1100, fareNAC: 750, type: 'AC', busType: 'Daewoo Premium', available: 8 },
];

// ── Demo data ──
const names = ['Muhammad Ali', 'Fatima Khan', 'Ahmed Hassan', 'Ayesha Siddiqui', 'Usman Tariq', 'Zainab Malik', 'Bilal Akhtar', 'Sara Nazir', 'Hamza Raza', 'Hina Baig', 'Kamran Javed', 'Sana Irfan'];
const cnics = ['35201-1234567-1', '42301-9876543-2', '37405-1122334-3', '38101-5566778-4', '31202-4455667-5', '34501-7788990-6', '61101-2233445-7', '33100-6677889-8', '45102-3344556-9', '21301-8899001-0', '36601-5544332-1', '13101-6677543-2'];
const phones = ['0300-1234567', '0321-9876543', '0333-4455667', '0311-7788990', '0345-1122334', '0302-5566778', '0322-4433221', '0312-8877665', '0341-3322110', '0301-6655443', '0315-4433220', '0331-2211009'];
const methods = ['Easypaisa', 'JazzCash', 'Debit Card', 'Pay at Counter'];
const statuses = ['Confirmed', 'Confirmed', 'Confirmed', 'Confirmed', 'Pending', 'Cancelled'];
const cats = ['Bus Late / Delayed', 'Rude Staff Behavior', 'Seat Issue / Dirty Bus', 'AC Not Working', 'Overcharging'];
const compStatuses = ['Open', 'In Review', 'Resolved'];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Route.deleteMany({});
    await Booking.deleteMany({});
    await Passenger.deleteMany({});
    await Complaint.deleteMany({});
    await Refund.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ── 1. Create Users ──
    const admin = await User.create({
      name: 'Admin PakRide',
      email: 'admin@pakride.pk',
      password: 'admin123',
      phone: '0300-0000000',
      role: 'admin',
    });

    const user1 = await User.create({
      name: 'Muhammad Ali',
      email: 'ali@test.com',
      password: 'password123',
      phone: '0300-1234567',
      cnic: '35201-1234567-1',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Fatima Khan',
      email: 'fatima@test.com',
      password: 'password123',
      phone: '0321-9876543',
      cnic: '42301-9876543-2',
      role: 'user',
    });

    console.log('👤 Created 3 users (1 admin, 2 regular)');

    // ── 2. Create Routes ──
    const routes = await Route.insertMany(routesData);
    console.log(`🗺️  Created ${routes.length} bus routes`);

    // ── 3. Create Bookings ──
    const users = [user1, user2];
    const today = new Date();
    const bookings = [];

    for (let i = 0; i < 48; i++) {
      const pIdx = i % names.length;
      const rIdx = i % routes.length;
      const uIdx = i % users.length;
      const daysAgo = Math.floor(Math.random() * 60);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      const seatCount = Math.ceil(Math.random() * 2);
      const seats = [];
      while (seats.length < seatCount) {
        const s = String(Math.floor(Math.random() * 40) + 1);
        if (!seats.includes(s)) {
          seats.push(s);
        }
      }

      const y = String(date.getFullYear()).slice(2);
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const ticketId = `PRE-${y}${m}${d}-${String(i + 1).padStart(4, '0')}`;

      const route = routes[rIdx];
      const passengers = seats.map((seat, j) => ({
        name: names[(pIdx + j) % names.length],
        cnic: cnics[(pIdx + j) % cnics.length],
        phone: phones[(pIdx + j) % phones.length],
        age: String(20 + Math.floor(Math.random() * 40)),
        gender: j % 2 === 0 ? 'Male' : 'Female',
        city: route.from,
        seat,
      }));

      bookings.push({
        ticketId,
        user: users[uIdx]._id,
        route: route._id,
        passengerName: names[pIdx],
        cnic: cnics[pIdx],
        phone: phones[pIdx],
        from: route.from,
        to: route.to,
        date: date.toISOString().slice(0, 10),
        dep: route.dep,
        arr: route.arr,
        busType: route.busType,
        seats,
        passengers,
        farePerSeat: route.fareAC,
        total: route.fareAC * seatCount,
        status: statuses[i % statuses.length],
        payment: methods[i % methods.length],
        createdAt: date,
      });
    }

    const createdBookings = await Booking.insertMany(bookings);
    console.log(`🎫 Created ${createdBookings.length} bookings`);

    // ── 4. Create Passenger records ──
    const paxMap = {};
    createdBookings.forEach((b) => {
      if (!paxMap[b.cnic]) {
        paxMap[b.cnic] = {
          name: b.passengerName,
          cnic: b.cnic,
          phone: b.phone,
          city: b.from,
          trips: 0,
          totalSpent: 0,
          lastTrip: '',
        };
      }
      paxMap[b.cnic].trips++;
      paxMap[b.cnic].totalSpent += b.total;
      if (b.date > paxMap[b.cnic].lastTrip) paxMap[b.cnic].lastTrip = b.date;
    });

    await Passenger.insertMany(Object.values(paxMap));
    console.log(`👥 Created ${Object.keys(paxMap).length} passenger records`);

    // ── 5. Create Complaints ──
    const complaints = createdBookings.slice(0, 8).map((b, i) => ({
      complaintId: `CMP-${String(i + 1).padStart(4, '0')}`,
      ticketId: b.ticketId,
      user: b.user,
      name: b.passengerName,
      phone: b.phone,
      category: cats[i % cats.length],
      desc: 'Complaint filed by passenger regarding service quality.',
      status: compStatuses[i % compStatuses.length],
      createdAt: b.createdAt,
    }));

    await Complaint.insertMany(complaints);
    console.log(`🚨 Created ${complaints.length} complaints`);

    // ── 6. Create Refunds ──
    const cancelledBookings = createdBookings.filter((b) => b.status === 'Cancelled').slice(0, 4);
    const refunds = cancelledBookings.map((b, i) => ({
      refundId: `REF-${String(i + 1).padStart(4, '0')}`,
      ticketId: b.ticketId,
      booking: b._id,
      user: b.user,
      name: b.passengerName,
      cnic: b.cnic,
      amount: b.total,
      method: 'Easypaisa',
      reason: 'Travel plans changed.',
      status: i === 0 ? 'Pending' : 'Processed',
      createdAt: b.createdAt,
    }));

    await Refund.insertMany(refunds);
    console.log(`💸 Created ${refunds.length} refund requests`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log('Admin Login:  admin@pakride.pk / admin123');
    console.log('User Login:   ali@test.com / password123');
    console.log('User Login:   fatima@test.com / password123');
    console.log('─────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
}

seed();
