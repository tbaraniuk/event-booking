import { EventType, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const fakerEvent = () => ({
  name: faker.lorem.words({ min: 1, max: 5 }),
  description: faker.lorem.sentences({ min: 1, max: 8 }),
  location: faker.location.city(),
  date: faker.date.future({}),
  max_capacity: faker.number.int({ min: 0, max: 30 }),
  type: EventType.OFFLINE,
  price: faker.number.int({ min: 0, max: 1000 }),
});

const fakerUser = () => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

const fakerClient = () => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  phone: faker.string.numeric(9),
  password: faker.internet.password(),
});

async function main() {
  const fakerRound = 10;
  const fakerEventRound = 30;
  console.log('Seeding...');

  for (let i = 0; i < fakerRound; i++) {
    await prisma.user.create({ data: fakerUser() });
    await prisma.client.create({ data: fakerClient() });
  }

  for (let i = 0; i < fakerEventRound; i++) {
    await prisma.event.create({ data: fakerEvent() });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
