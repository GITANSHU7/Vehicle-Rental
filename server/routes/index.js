const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/vehicle-types', bookingController.getVehicleTypes);
router.get('/vehicles/:typeId', bookingController.getVehicles);
router.post('/bookings', bookingController.createBooking);

module.exports = router;