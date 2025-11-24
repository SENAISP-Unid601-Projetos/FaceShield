package com.example.FaceShield_Back.DTO.Security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GenerateTokenRequestDTO {
    private String username;

    // Validação básica
    public boolean isValid() {
        return username != null && !username.trim().isEmpty();
    }

    public String getCleanUsername() {
        return username != null ? username.trim() : "";
    }
}
