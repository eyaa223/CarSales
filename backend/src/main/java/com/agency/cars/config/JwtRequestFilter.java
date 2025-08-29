// src/main/java/com/agency/cars/config/JwtRequestFilter.java
package com.agency.cars.config;

import com.agency.cars.Service.UserService;
import com.agency.cars.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String requestURI = request.getRequestURI();
        final String method = request.getMethod();
        logger.debug("🔍 Requête entrante: {} {}", method, requestURI);

        // ✅ 1. Ignore les ressources statiques
        if (requestURI.startsWith("/images/") ||
            requestURI.startsWith("/css/") ||
            requestURI.startsWith("/js/") ||
            requestURI.startsWith("/assets/")) {
            logger.debug("✅ Ignoré (ressource statique)");
            chain.doFilter(request, response);
            return;
        }

        // ✅ 2. Récupère le token
        final String header = request.getHeader("Authorization");
        String jwtToken = null;
        String username = null;

        if (header != null && header.startsWith("Bearer ")) {
            jwtToken = header.substring(7);
            try {
                username = jwtUtil.extractUsername(jwtToken);
                logger.debug("✅ Token extrait pour l'utilisateur: {}", username);
            } catch (IllegalArgumentException e) {
                logger.warn("❌ Impossible d'extraire le token JWT");
            } catch (ExpiredJwtException e) {
                logger.warn("⏰ Token expiré");
            }
        }

        // ✅ 3. Authentifie l'utilisateur
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userService.loadUserByUsername(username);
            if (jwtUtil.validateToken(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.debug("✅ Authentification réussie pour: {}", username);
            } else {
                logger.warn("❌ Échec de validation du token");
            }
        }

        // ✅ 4. Continue la chaîne
        chain.doFilter(request, response);
    }
}