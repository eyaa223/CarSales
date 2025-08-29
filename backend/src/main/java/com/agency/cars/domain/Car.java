// src/main/java/com/agency/cars/domain/Car.java
package com.agency.cars.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La marque est obligatoire")
    @Column(name = "brand", nullable = false)
    private String brand;

    @NotBlank(message = "Le modèle est obligatoire")
    @Column(name = "model", nullable = false)
    private String model;

    @NotNull(message = "L'année est obligatoire")
    @Column(name = "year")
    private Integer year;

    @Column(name = "color")
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type")
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    @Column(name = "transmission")
    private Transmission transmission;

    @Column(name = "mileage")
    private Integer mileage;

    @NotNull(message = "Le prix est obligatoire")
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status")
    private String status = "AVAILABLE";

    @Column(name = "sold_count")
    private Integer soldCount = 0;

    // ====== Constructeurs ======
    public Car() {
        this.status = "AVAILABLE";
    }

    public Car(String brand, String model, Integer year, String color,
               FuelType fuelType, Transmission transmission, Integer mileage,
               BigDecimal price, String imageUrl, String description, String status) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.color = color;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.mileage = mileage;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.status = (status != null) ? status : "AVAILABLE";
    }

    // ====== Getters et Setters ======
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public FuelType getFuelType() { return fuelType; }
    public void setFuelType(FuelType fuelType) { this.fuelType = fuelType; }

    public Transmission getTransmission() { return transmission; }
    public void setTransmission(Transmission transmission) { this.transmission = transmission; }

    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getSoldCount() { return soldCount; }
    public void setSoldCount(Integer soldCount) { this.soldCount = soldCount; }

    @Override
    public String toString() {
        return "Car{" +
                "id=" + id +
                ", brand='" + brand + '\'' +
                ", model='" + model + '\'' +
                ", year=" + year +
                ", price=" + price +
                ", status='" + status + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}