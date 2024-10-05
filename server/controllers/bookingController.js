const { Vehicle, Booking, VehicleType } = require('../models');
const { Op } = require('sequelize');

exports.getVehicleTypes = async (req, res) => {
  try {
    const types = await Vehicle.findAll({
      attributes: ['VehicleTypeId', 'VehicleType.name', 'VehicleType.wheels'],
      include: [{ model: VehicleType, attributes: [] }],
      group: ['VehicleTypeId', 'VehicleType.name', 'VehicleType.wheels'],
      raw: true,
    });
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const { typeId } = req.params;
    const vehicles = await Vehicle.findAll({ where: { VehicleTypeId: typeId } });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { firstName, lastName, vehicleId, startDate, endDate } = req.body;

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      where: {
        VehicleId: vehicleId,
        [Op.or]: [
          {
            startDate: { [Op.between]: [startDate, endDate] },
          },
          {
            endDate: { [Op.between]: [startDate, endDate] },
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: 'Vehicle is not available for the selected dates' });
    }

    const booking = await Booking.create({
      firstName,
      lastName,
      VehicleId: vehicleId,
      startDate,
      endDate,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


