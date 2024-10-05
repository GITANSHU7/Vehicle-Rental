const { sequelize, VehicleType, Vehicle } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });

  const carType = await VehicleType.create({ name: 'Car', wheels: 4 });
  const bikeType = await VehicleType.create({ name: 'Bike', wheels: 2 });

  await Vehicle.bulkCreate([
    { model: 'Hatchback', VehicleTypeId: carType.id },
    { model: 'SUV', VehicleTypeId: carType.id },
    { model: 'Sedan', VehicleTypeId: carType.id },
    { model: 'Cruiser', VehicleTypeId: bikeType.id },
  ]);

  console.log('Seed data inserted successfully');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});

