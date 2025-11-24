package com.example.FaceShield_Back.Service;

import com.example.FaceShield_Back.DTO.UsuariosDTO;
import com.example.FaceShield_Back.DTO.responses.UsuariosResponseDTO;
import com.example.FaceShield_Back.Entity.Usuarios;
import com.example.FaceShield_Back.Repository.UsuariosRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuariosServ {

    @Autowired
    private UsuariosRepo repository;

    // Buscar todos os usuários (agora retorna List<UsuariosResponseDTO>)
    public List<UsuariosResponseDTO> getAllUsuarios() {
        return repository.findAll().stream()
                .map(UsuariosResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar por ID (agora retorna Optional<UsuariosResponseDTO>)
    public Optional<UsuariosResponseDTO> getByID(Long id) {
        return repository.findById(id)
                .map(UsuariosResponseDTO::toDTO);
    }

    // Buscar pelo NOME do usuário (agora retorna List<UsuariosResponseDTO>)
    public List<UsuariosResponseDTO> getAllByNome(String nome) {
        return repository.findAllByNome(nome).stream()
                .map(UsuariosResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar por TURMA (agora retorna List<UsuariosResponseDTO>)
    public List<UsuariosResponseDTO> getAllByTurma(String turma) {
        return repository.findAllByTurma(turma).stream()
                .map(UsuariosResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar por TIPO DE USUARIO (agora retorna List<UsuariosResponseDTO>)
    public List<UsuariosResponseDTO> getAllByTiposUsuarios(String tipo_usuario) {
        return repository.findAllByTipoUsuario(tipo_usuario).stream()
                .map(UsuariosResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // Criar novo usuário (mantém UsuariosDTO para input)
    public UsuariosResponseDTO createUsuario(UsuariosDTO usuariosDTO) {
        Usuarios usuario = UsuariosDTO.toEntity(usuariosDTO);
        usuario = repository.save(usuario);
        return UsuariosResponseDTO.toDTO(usuario);
    }

    // Atualizar usuário existente (mantém UsuariosDTO para input)
    public Optional<UsuariosResponseDTO> updateUsuario(Long idUsuario, UsuariosDTO dto) {
        return repository.findById(idUsuario)
                .map(usuario -> {
                    usuario.setNome(dto.getNome());
                    usuario.setSobrenome(dto.getSobrenome());
                    usuario.setTurma(dto.getTurma());
                    usuario.setUsername(dto.getUsername());
                    usuario.setSenha(dto.getSenha());
                    usuario.setTipoUsuario(dto.getTipoUsuario());

                    Usuarios updated = repository.save(usuario);
                    return UsuariosResponseDTO.toDTO(updated);
                });
    }

    // Remover usuário (retorna booleano indicando sucesso)
    public boolean deleteUsuario(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}