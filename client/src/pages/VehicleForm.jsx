import {
    Button,
    Label,
    Radio,
    TextInput
} from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { createBooking, getVehicleTypes, getVehicles } from '../components/apis';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

const VehicleForm = () => {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [wheels, setWheels] = useState('');
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getVehicleTypes().then((response) => setVehicleTypes(response.data));
  }, []);

  useEffect(() => {
    if (selectedType) {
      getVehicles(selectedType).then((response) => setVehicles(response.data));
    }
  }, [selectedType]);

  const handleNext = () => {
    setError('');
    if (validateStep()) {
      if (step === 4) {
        handleSubmit();
      } else {
        setStep(step + 1);
      }
    }
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        if (!firstName || !lastName) {
          setError('Please enter both first and last name');
          return false;
        }
        break;
      case 1:
        if (!wheels) {
          setError('Please select the number of wheels');
          return false;
        }
        break;
      case 2:
        if (!selectedType) {
          setError('Please select a vehicle type');
          return false;
        }
        break;
      case 3:
        if (!selectedVehicle) {
          setError('Please select a vehicle');
          return false;
        }
        break;
      case 4:
        if (!startDate || !endDate) {
          setError('Please select both start and end dates');
          return false;
        }
        if (startDate >= endDate) {
          setError('End date must be after start date');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

const handleSubmit = async () => {
    try {
      await createBooking({
        firstName,
        lastName,
        vehicleId: selectedVehicle,
        startDate,
        endDate,
      });
      toast.success('Booking successful!'); 
      window.location.reload();
} catch (error) {
   
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error);  
    } else {
      setError('Booking failed. Please try again.');
    }
  }
};
  

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
                     <h1 className="text-3xl font-semibold mb-4 ">First, what's your name?</h1>
            <Label htmlFor="firstName" className='flex mb-2'>First Name</Label>
            <TextInput
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
            <Label htmlFor="lastName" className='flex mb-2 mt-2'>Last Name</Label>
            <TextInput
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </>
        );
      case 1:
        return (
          <>
          <Label className='text-3xl font-semibold mb-4'>Number of Wheels</Label>
            <div className='mt-2'>
              <Radio
                id="2-wheels"
                name="wheels"
                value="2"
                className='mr-2'
                checked={wheels === '2'}
                onChange={(e) => setWheels(e.target.value)}
              />
              <Label htmlFor="2-wheels"  className='mr-2'>2 wheels</Label>

              <Radio
                id="4-wheels"
                name="wheels"
                value="4"
                  className='mr-2'
                checked={wheels === '4'}
                onChange={(e) => setWheels(e.target.value)}
              />
              <Label htmlFor="4-wheels"  className='mr-2'>4 wheels</Label>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <Label className='text-3xl font-semibold mb-4'>Vehicle Type</Label>
            <div>
              {vehicleTypes
                .filter((type) => type.wheels.toString() === wheels)
                .map((type) => (
                  <div key={type.VehicleTypeId}>
                    <Radio
                      id={`type-${type.VehicleTypeId}`}
                      name="vehicleType"
                        className='mr-2'
                      value={type.VehicleTypeId.toString()}
                      checked={selectedType === type.VehicleTypeId.toString()}
                      onChange={(e) => setSelectedType(e.target.value)}
                    />
                    <Label htmlFor={`type-${type.VehicleTypeId}` }   className='mr-2'>{type.name}</Label>
                  </div>
                ))}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <Label className='text-3xl font-semibold mb-4'>Choose a Vehicle</Label>
            <div className='flex mt-2'>
              {vehicles.map((vehicle) => (
                <div key={vehicle.id}>
                  <Radio
                    id={`vehicle-${vehicle.id}`}
                    name="vehicle"
                    className='mr-2'
                    value={vehicle.id.toString()}
                    checked={selectedVehicle === vehicle.id.toString()}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                  />
                  <Label htmlFor={`vehicle-${vehicle.id}`} className='mr-2'>{vehicle.model}</Label>
                </div>
              ))}
            </div>
          </>
        );
      case 4:
        return (
          <>
            
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText='Select Start Date'
            />
            
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText='Select End Date'
            />
          </>
        );
      default:
        return null;
    }
  };


  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Vehicle Rental Booking</h2>
      {renderStep()}
      {error && (
        <p className="text-red-500">{error}</p>
      )}
      <Button onClick={handleNext} className="mt-4" fullSized>
        {step === 4 ? 'Submit' : 'Next'}
      </Button>
    </div>
  );
};

export default VehicleForm;