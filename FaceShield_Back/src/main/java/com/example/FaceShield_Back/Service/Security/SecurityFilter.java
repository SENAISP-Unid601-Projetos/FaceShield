package com.example.FaceShield_Back.Service.Security;

import com.example.FaceShield_Back.Entity.Usuarios;
import com.example.FaceShield_Back.Repository.UsuariosRepo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuariosRepo usuariosRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var token = this.recoverToken(request);

        if (token != null) {
            // Valida o token e pega o username (subject)
            var username = tokenService.validateToken(token);

            if (username != null && !username.isEmpty()) {
                // Busca o usuário no banco
                Usuarios user = usuariosRepo.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User Not Found"));

                // Cria um token de autenticação do Spring
                var authentication = new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());

                // Define o usuário como autenticado no contexto de segurança
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        // Continua a cadeia de filtros
        filterChain.doFilter(request, response);
    }

    // Método auxiliar para extrair o token do cabeçalho "Authorization"
    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;

        // Remove o prefixo "Bearer "
        return authHeader.replace("Bearer ", "");
    }
}