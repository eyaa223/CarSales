// src/main/java/com/agency/cars/api/AuthController.java
package com.agency.cars.api;

import com.agency.cars.domain.AppUser;
import com.agency.cars.Service.UserService;
import com.agency.cars.util.JwtUtil;
import com.agency.cars.request.LoginRequest;
import com.agency.cars.request.RegisterRequest;
import com.agency.cars.response.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur d'authentification : login et register
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Autorise Angular
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Connexion : génère un JWT si les identifiants sont valides
     */
    @PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
    try {
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );

        //  Génération du token JWT
        String token = jwtUtil.generateToken(loginRequest.getUsername());

        //  Récupération du rôle
        AppUser user = userService.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        //  Réponse structurée
        LoginResponse response = new LoginResponse(token, user.getRole());
        return ResponseEntity.ok(response);

    } catch (BadCredentialsException e) {
        return ResponseEntity.status(401).body("Identifiants invalides");
    } catch (Exception e) {
        e.printStackTrace(); // 🔥 Très important pour débugger
        return ResponseEntity.status(401).body("Erreur d'authentification : " + e.getMessage());
    }
}
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            userService.registerUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                "USER" 
            );
            return ResponseEntity.ok("Inscription réussie");
        } catch (Exception e) {
            return ResponseEntity.status(400)
                .body("Erreur : " + e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register-admin")
public ResponseEntity<?> registerAdmin(@Valid @RequestBody RegisterRequest request) {
    try {
        userService.registerUser(
            request.getUsername(),
            request.getEmail(),
            request.getPassword(),
            "ADMIN"  // 👈 Rôle forcé
        );
        return ResponseEntity.ok("Admin créé avec succès");
    } catch (Exception e) {
        return ResponseEntity.status(400).body("Erreur : " + e.getMessage());
    }
}
}