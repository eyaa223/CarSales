package com.agency.cars.Service;

import com.agency.cars.domain.Car;
import com.agency.cars.Repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Optional<Car> getCarById(Long id) {
        return carRepository.findById(id);
    }

    public Car createCar(Car car) {
        if (car.getStatus() == null || car.getStatus().trim().isEmpty()) {
            car.setStatus("AVAILABLE");
        }
        if (car.getBrand() == null || car.getBrand().trim().isEmpty()) {
            car.setBrand("Unknown");
        }
        return carRepository.save(car);
    }

    // ✅ update avec id et détails
    public Car updateCar(Long id, Car carDetails) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voiture non trouvée avec l'ID : " + id));

        car.setBrand(carDetails.getBrand());
        car.setModel(carDetails.getModel());
        car.setYear(carDetails.getYear());
        car.setColor(carDetails.getColor());
        car.setFuelType(carDetails.getFuelType());
        car.setTransmission(carDetails.getTransmission());
        car.setMileage(carDetails.getMileage());
        car.setPrice(carDetails.getPrice());
        car.setImageUrl(carDetails.getImageUrl());
        car.setDescription(carDetails.getDescription());

        if (carDetails.getStatus() != null && !carDetails.getStatus().trim().isEmpty()) {
            car.setStatus(carDetails.getStatus());
        } else if (car.getStatus() == null || car.getStatus().trim().isEmpty()) {
            car.setStatus("AVAILABLE");
        }

        return carRepository.save(car);
    }

    // ✅ update direct avec Car (utile pour sellCar et uploadImage)
    public Car updateCar(Car car) {
        if (car.getId() == null) {
            throw new RuntimeException("Impossible de mettre à jour : ID manquant");
        }
        return updateCar(car.getId(), car);
    }

    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new RuntimeException("Voiture non trouvée avec l'ID : " + id);
        }
        carRepository.deleteById(id);
    }
}
