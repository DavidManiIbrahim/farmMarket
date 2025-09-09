import { seedDatabase } from '@/data/seedDatabase';

// Command to seed the database with mock data
async function seed() {
  console.log('Starting database seeding...');
  const result = await seedDatabase();
  
  if (result.success) {
    console.log('Database seeding completed successfully!');
  } else {
    console.error('Database seeding failed:', result.error);
  }
}

// Run the seeding
seed();
