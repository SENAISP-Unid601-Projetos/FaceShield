package com.example.FaceShield_Back.DTO.responses;

import com.example.FaceShield_Back.Entity.Usuarios;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuariosResponseDTO {
    private Long id;
    private String nome;
    private String sobrenome;
    private String username;
    private String turma;
    private String tipoUsuario;

    // Método de conversão
    public static UsuariosResponseDTO toDTO(Usuarios usuario) {
        if (usuario == null) {
            return null;
        }

        return new UsuariosResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getSobrenome(),
                usuario.getUsername(),
                usuario.getTurma(),
                usuario.getTipoUsuario()
        );
    }
}
