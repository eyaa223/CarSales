package com.agency.cars.Service;

import com.agency.cars.domain.AppUser;
import com.agency.cars.Repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + username));
        return User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .roles(user.getRole()) 
            .build();
    }
    public AppUser registerUser(String username, String email, String password, String role) {
        // 🔹 Validation du username
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom d'utilisateur est obligatoire");
        }
        username = username.trim();
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email invalide");
        }
        email = email.trim();
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Le mot de passe doit faire au moins 6 caractères");
        }
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Utilisateur déjà existant");
        }
        String encodedPassword = passwordEncoder.encode(password);
        AppUser user = new AppUser();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encodedPassword);
        user.setRole(role != null ? role : "USER"); 
        return userRepository.save(user);
    }
    public Optional<AppUser> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}