const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function clearDatabase() {
  await prisma.user.deleteMany()
}

clearDatabase()
  .then(() => {
    console.log('Database cleared');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error clearing database:', err);
    process.exit(1);
  });
