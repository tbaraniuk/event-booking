import { EventType, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const fakerEvent = () => {
  const max_capacity = faker.number.int({ min: 10, max: 40 });
  return {
    name: faker.lorem.words({ min: 1, max: 5 }),
    description: faker.lorem.sentences({ min: 1, max: 8 }),
    location: faker.location.city(),
    date: faker.date.future({}),
    max_capacity: max_capacity,
    capacity: max_capacity,
    type: EventType.OFFLINE,
    price: faker.number.int({ min: 0, max: 1000 }),
  };
};

async function main() {
  const events = await prisma.event.count();

  if (events > 0) {
    console.log('Data is already seeded!');
    return;
  }

  const fakerEventRound = 40;
  console.log('Seeding...');

  for (let i = 0; i < fakerEventRound; i++) {
    await prisma.event.create({ data: fakerEvent() });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
