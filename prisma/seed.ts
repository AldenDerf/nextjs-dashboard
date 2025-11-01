import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clean old data first
    await prisma.user.deleteMany()

    // Create sample users
    await prisma.user.createMany({
      data: [
        { name: "Alden", email: "alden@example.com" },
        { name: "Derf", email: "derf@example.com" },
        { name: "Fabro", email: "fabro@example.com" },
      ],
    });

    console.log('Database seeded successfully');

}

main()
.then(() => prisma.$disconnect())
.catch((err) => {
    console.error(err)
    prisma.$disconnect()
    process.exit(1)
})