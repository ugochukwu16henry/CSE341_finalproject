// scripts/seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Import models
const User = require('../src/models/User');
const Therapist = require('../src/models/Therapist');
const Appointment = require('../src/models/Appointment');
const WellnessEntry = require('../src/models/WellnessEntry');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected ✅');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Therapist.deleteMany({});
    await Appointment.deleteMany({});
    await WellnessEntry.deleteMany({});
    console.log('Cleared existing data...\n');

    // Seed Users
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        googleId: 'google123456',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        googleId: 'google789012',
        role: 'user'
      }
    ]);
    console.log('✅ Added 2 users');
    console.log('   -', users[0].name, '(', users[0].email, ')');
    console.log('   -', users[1].name, '(', users[1].email, ')');
    console.log('');

    // Seed Therapists
    const therapists = await Therapist.insertMany([
      {
        name: 'Dr. Sarah Johnson',
        specialization: 'Anxiety and Stress Management',
        country: 'USA',
        rating: 4.8,
        bio: 'Experienced therapist specializing in anxiety disorders and stress management. Over 10 years of practice.',
        availability: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 1:00 PM'
        }
      },
      {
        name: 'Dr. Michael Chen',
        specialization: 'Family Counseling',
        country: 'Canada',
        rating: 4.9,
        bio: 'Family therapist with expertise in relationship counseling and family dynamics. Licensed in multiple states.',
        availability: {
          monday: '10:00 AM - 6:00 PM',
          tuesday: '10:00 AM - 6:00 PM',
          wednesday: '10:00 AM - 6:00 PM',
          thursday: '10:00 AM - 6:00 PM',
          friday: 'Closed'
        }
      }
    ]);
    console.log('✅ Added 2 therapists');
    console.log('   -', therapists[0].name, '(' + therapists[0].specialization + ')');
    console.log('   -', therapists[1].name, '(' + therapists[1].specialization + ')');
    console.log('');

    // Seed Appointments
    const appointments = await Appointment.insertMany([
      {
        userId: users[0]._id,
        therapistId: therapists[0]._id,
        date: new Date('2025-01-15T10:00:00Z'),
        status: 'scheduled',
        notes: 'Initial consultation for anxiety management'
      },
      {
        userId: users[1]._id,
        therapistId: therapists[1]._id,
        date: new Date('2025-01-20T14:00:00Z'),
        status: 'scheduled',
        notes: 'Family counseling session'
      }
    ]);
    console.log('✅ Added 2 appointments');
    console.log('   - Appointment for', users[0].name, 'with', therapists[0].name);
    console.log('   - Appointment for', users[1].name, 'with', therapists[1].name);
    console.log('');

    // Seed Wellness Entries
    const wellnessEntries = await WellnessEntry.insertMany([
      {
        userId: users[0]._id,
        mood: 'calm',
        stressLevel: 3,
        note: 'Feeling more relaxed after morning meditation. Overall good day.'
      },
      {
        userId: users[1]._id,
        mood: 'hopeful',
        stressLevel: 2,
        note: 'Looking forward to the counseling session next week. Feeling optimistic about progress.'
      }
    ]);
    console.log('✅ Added 2 wellness entries');
    console.log('   - Entry for', users[0].name, '(mood: calm, stress: 3)');
    console.log('   - Entry for', users[1].name, '(mood: hopeful, stress: 2)');
    console.log('');

    console.log('🎉 Seed data inserted successfully!');
    console.log('\nSummary:');
    console.log('  - Users: 2');
    console.log('  - Therapists: 2');
    console.log('  - Appointments: 2');
    console.log('  - Wellness Entries: 2');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  }
};

// Run seed
const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();

