const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./database/User');
const Tree = require('./database/Tree');

async function seedDatabase() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear old data
  await User.deleteMany();
  await Tree.deleteMany();

  // Insert trees using your mock data
  const trees = await Tree.insertMany([
    {
      name: 'Misty Bonsai',
      stages: {
        seed: '/images/tree1/seed.png',
        sprout: '/images/tree1/sprout.png',
        seedling: '/images/tree1/seedling.png',
        sapling: '/images/tree1/sapling.png',
        adultTree: '/images/tree1/adult_tree.png'
      }
    },
    {
      name: 'Sunflower',
      stages: {
        seed: '/images/tree2/seed.png',
        sprout: '/images/tree2/sprout.png',
        seedling: '/images/tree2/seedling.png',
        sapling: '/images/tree2/sapling.png',
        adultTree: '/images/tree2/adult_tree.png'
      }
    },
    {
      name: 'Golden Sun',
      stages: {
        seed: '/images/tree3/seed.png',
        sprout: '/images/tree3/sprout.png',
        seedling: '/images/tree3/seedling.png',
        sapling: '/images/tree3/sapling.png',
        adultTree: '/images/tree3/adult_tree.png'
      }
    },
    {
      name: 'Blooming Berry',
      stages: {
        seed: '/images/tree4/seed.png',
        sprout: '/images/tree4/sprout.png',
        seedling: '/images/tree4/seedling.png',
        sapling: '/images/tree4/sapling.png',
        adultTree: '/images/plants1.png'
      }
    },
    {
      name: 'Sunleaf',
      stages: {
        seed: '/images/tree5/seed.png',
        sprout: '/images/tree5/sprout.png',
        seedling: '/images/tree5/seedling.png',
        sapling: '/images/tree5/sapling.png',
        adultTree: '/images/plants2.png'
      }
    },
    {
      name: 'Aqua Fern',
      stages: {
        seed: '/images/tree6/seed.png',
        sprout: '/images/tree6/sprout.png',
        seedling: '/images/tree6/seedling.png',
        sapling: '/images/tree6/sapling.png',
        adultTree: '/images/plants3.png'
      }
    },
    {
      name: 'Hydro Cactus',
      stages: {
        seed: '/images/tree7/seed.png',
        sprout: '/images/tree7/sprout.png',
        seedling: '/images/tree7/seedling.png',
        sapling: '/images/tree7/sapling.png',
        adultTree: '/images/plants4.png'
      }
    }
  ]);
  console.log('🌱 Trees seeded');

  // Insert test users
  await User.insertMany([
    {
      username: 'alice',
      password: 'test123',
      email: 'alice@example.com',
      hydrationData: [],
      hasUnlockedTree: true,
      unlockableTrees: ['Misty Bonsai', 'Golden Sun'],
      plantLevel: 3,
      longestStreak: 7,
      currentStreak: 2,
      totalWaterLogged: 3500,
      notificationsEnabled: true,
      friends: []
    },
    {
      username: 'bob',
      password: 'test123',
      email: 'bob@example.com',
      hydrationData: [
        { date: new Date(), amount: 500, unlockedPlant: 'Sunflower' }
      ],
      hasUnlockedTree: false,
      unlockableTrees: ['Sunflower'],
      plantLevel: 2,
      longestStreak: 5,
      currentStreak: 5,
      totalWaterLogged: 3000,
      notificationsEnabled: false,
      friends: []
    },
    {
      username: 'charlie',
      password: 'test123',
      email: 'charlie@example.com',
      hydrationData: [],
      hasUnlockedTree: false,
      unlockableTrees: [],
      plantLevel: 1,
      longestStreak: 2,
      currentStreak: 1,
      totalWaterLogged: 1200,
      notificationsEnabled: true,
      friends: []
    },
    {
        username: 'mark',
        password: 'test153',
        email: 'mark@example.com',
        hydrationData: [],
        hasUnlockedTree: false,
        unlockableTrees: [],
        plantLevel: 1,
        longestStreak: 3,
        currentStreak: 1,
        totalWaterLogged: 1400,
        notificationsEnabled: true,
        friends: []
      }
  ]);
  console.log('👤 Users seeded');

  mongoose.connection.close();
  console.log('✅ Database seed complete!');
}

seedDatabase();
