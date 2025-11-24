package com.example.FaceShield_Back.DTO;

import com.example.FaceShield_Back.Entity.Usuarios;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuariosDTO {

    private Long id;
    private String nome;
    private String sobrenome;
    private String turma;
    private String username;
    private String senha;
    private String tipoUsuario;

    // Conversão de Entidade para DTO
    public static UsuariosDTO toDTO(Usuarios entidade) {
        return new UsuariosDTO(
                entidade.getId(),
                entidade.getNome(),
                entidade.getSobrenome(),
                entidade.getTurma(),
                entidade.getUsername(),
                entidade.getSenha(),
                entidade.getTipoUsuario()
        );
    }

    // Conversão de DTO para Entidade
    public static Usuarios toEntity(UsuariosDTO dto) {
        Usuarios entidade = new Usuarios();

        entidade.setId(dto.getId());
        entidade.setNome(dto.getNome());
        entidade.setSobrenome(dto.getSobrenome());
        entidade.setTurma(dto.getTurma());
        entidade.setUsername(dto.getUsername());
        entidade.setSenha(dto.getSenha());
        entidade.setTipoUsuario(dto.getTipoUsuario());

        return entidade;
    }
}
