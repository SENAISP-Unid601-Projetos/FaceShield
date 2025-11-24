package com.example.FaceShield_Back.Service.Security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.FaceShield_Back.Entity.Usuarios;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    // @PostConstruct
    // public void testSecret() {
    // System.out.println(">>> SEGREDO CARREGADO = " + secret);
    // }

    public String generateToken(Usuarios user) {
        try {
            // Define o algoritmo HMAC256 com o segredo
            Algorithm algorithm = Algorithm.HMAC256(secret);

            String token = JWT.create()
                    .withIssuer("login-auth-api") // Emissor do token
                    .withSubject(user.getUsername()) // Armazena o username no token
                    .withExpiresAt(generateExpirationDate()) // Define o tempo de expiração
                    .sign(algorithm); // Assina o token
            return token;
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error while authenticating", exception);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.require(algorithm)
                    .withIssuer("login-auth-api")
                    .build()
                    .verify(token) // Verifica a assinatura e a expiração
                    .getSubject(); // Retorna o username (o "subject")
        } catch (JWTVerificationException exception) {
            return ""; // Retorna vazio se o token for inválido
        }
    }

    // Gera um Instant de expiração (ex: 2 horas a partir de agora)
    private Instant generateExpirationDate() {
        // Fuso de -3 (Brasília)
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}