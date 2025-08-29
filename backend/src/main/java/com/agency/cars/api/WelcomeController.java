package com.agency.cars.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public String home() {
        return """
             Bienvenue sur Car Sales API!
            Accédez aux voitures : <a href="/api/cars">/api/cars</a>
            """;
    }
}