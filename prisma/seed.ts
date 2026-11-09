import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.availabilityRule.deleteMany();
  // شنبه(6) تا چهارشنبه(3): 09:00 تا 17:00
  for (const weekday of [6, 0, 1, 2, 3]) {
    await prisma.availabilityRule.create({ data: { weekday, startTime: "09:00", endTime: "17:00" } });
  }
  console.log("Seeded availability rules");
}
main().finally(() => prisma.$disconnect());
