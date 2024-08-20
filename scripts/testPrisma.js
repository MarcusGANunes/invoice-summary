// Substitua a linha de importação por esta:
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany()
  console.log("Users:", users)
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
