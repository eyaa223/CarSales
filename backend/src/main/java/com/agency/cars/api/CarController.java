// src/main/java/com/agency/cars/api/CarController.java
package com.agency.cars.api;

import com.agency.cars.domain.Car;
import com.agency.cars.util.QRCodeGenerator;
import com.agency.cars.Service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:4200")
public class CarController {

    @Autowired
    private CarService carService;

    private final String uploadDir = "src/main/resources/static/images/";

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        return carService.getCarById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Car> createCar(
            @RequestParam String brand,
            @RequestParam String model,
            @RequestParam Integer year,
            @RequestParam String color,
            @RequestParam String fuelType,
            @RequestParam String transmission,
            @RequestParam Integer mileage,
            @RequestParam BigDecimal price,
            @RequestParam String description,
            @RequestParam(required = false) String status,
            @RequestParam("image") MultipartFile image) {

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = System.currentTimeMillis() + "_" +
                    Objects.requireNonNull(image.getOriginalFilename()).replaceAll("\\s+", "_");
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, image.getBytes());

            Car car = new Car();
            car.setBrand(brand);
            car.setModel(model);
            car.setYear(year);
            car.setColor(color);
            car.setFuelType(com.agency.cars.domain.FuelType.valueOf(fuelType.toUpperCase()));
            car.setTransmission(com.agency.cars.domain.Transmission.valueOf(transmission.toUpperCase()));
            car.setMileage(mileage);
            car.setPrice(price);
            car.setDescription(description);
            car.setStatus(status != null ? status : "AVAILABLE");
            car.setImageUrl("/images/" + fileName);

            Car savedCar = carService.createCar(car);
            return ResponseEntity.ok(savedCar);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car carDetails) {
        try {
            Car updatedCar = carService.updateCar(id, carDetails);
            return ResponseEntity.ok(updatedCar);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<Map<String, String>> generateQrCode(@PathVariable Long id) {
        return carService.getCarById(id)
                .map(car -> {
                    String text = String.format(
                            "Voiture: %s %s - Année: %d - Prix: %.2f $",
                            car.getBrand(), car.getModel(), car.getYear(), car.getPrice()
                    );
                    try {
                        String base64Image = QRCodeGenerator.getQRCodeImage(text, 200, 200);
                        return ResponseEntity.ok(Map.of("qrcode", base64Image));
                    } catch (Exception e) {
                        return ResponseEntity
                                .status(500)
                                .body(Collections.singletonMap("error", "Erreur lors de la génération du QR Code"));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) {

        return carService.getCarById(id)
                .map(car -> {
                    try {
                        String fileName = System.currentTimeMillis() + "_" +
                                Objects.requireNonNull(image.getOriginalFilename()).replaceAll("\\s+", "_");
                        Path path = Paths.get("src/main/resources/static/images/" + fileName);
                        Files.write(path, image.getBytes());

                        String imageUrl = "/images/" + fileName;
                        car.setImageUrl(imageUrl);
                        carService.updateCar(car);

                        Map<String, String> response = new HashMap<>();
                        response.put("imageUrl", imageUrl);
                        return ResponseEntity.ok(response);

                    } catch (IOException e) {
                        return ResponseEntity.status(500).body(null);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/sell")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Car> sellCar(@PathVariable Long id) {
        return carService.getCarById(id)
                .map(car -> {
                    car.setStatus("SOLD");
                    car.setSoldCount(car.getSoldCount() == null ? 1 : car.getSoldCount() + 1);
                    Car updatedCar = carService.updateCar(car);
                    return ResponseEntity.ok(updatedCar);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}