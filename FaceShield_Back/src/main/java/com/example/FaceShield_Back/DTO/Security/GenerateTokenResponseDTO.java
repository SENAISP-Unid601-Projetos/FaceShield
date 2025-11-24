package com.example.FaceShield_Back.DTO.Security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GenerateTokenResponseDTO {
    private Long id;
    private String username;
    private String token;

    // Construtor para sucesso
    public static GenerateTokenResponseDTO success(Long id, String username, String token) {
        return new GenerateTokenResponseDTO(id, username, token);
    }

    // Construtor para erro (sem token)
    public static GenerateTokenResponseDTO error(Long id, String username) {
        return new GenerateTokenResponseDTO(id, username, null);
    }

    // Metodo auxiliar para verificar se foi bem sucedido
    public boolean isSuccess() {
        return token != null && !token.isEmpty();
    }
}
