require('dotenv').config(); 

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('rental', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const VehicleType = sequelize.define('VehicleType', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  wheels: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const Vehicle = sequelize.define('Vehicle', {
  model: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Booking = sequelize.define('Booking', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  endDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});


VehicleType.hasMany(Vehicle);
Vehicle.belongsTo(VehicleType);
Vehicle.hasMany(Booking);
Booking.belongsTo(Vehicle);

module.exports = {
  sequelize,
  VehicleType,
  Vehicle,
  Booking,
};
