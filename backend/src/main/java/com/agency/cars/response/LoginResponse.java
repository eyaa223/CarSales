package com.agency.cars.response;

public class LoginResponse {
    private String token;
    private String role;

    public LoginResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    // Getters
    public String getToken() { return token; }
    public String getRole() { return role; }

    // Setters (optionnels)
    public void setToken(String token) { this.token = token; }
    public void setRole(String role) { this.role = role; }
}