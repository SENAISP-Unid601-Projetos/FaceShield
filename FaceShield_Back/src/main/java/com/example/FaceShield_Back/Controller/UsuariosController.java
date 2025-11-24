package com.example.FaceShield_Back.Controller;

import com.example.FaceShield_Back.DTO.UsuariosDTO;
import com.example.FaceShield_Back.DTO.responses.UsuariosResponseDTO;
import com.example.FaceShield_Back.Service.UsuariosServ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuariosController {

    private final UsuariosServ usuariosServ;

    @Autowired
    public UsuariosController(UsuariosServ usuariosServ) {
        this.usuariosServ = usuariosServ;
    }

    // Buscar usuários com filtros opcionais
    @GetMapping("/buscar")
    public ResponseEntity<List<UsuariosResponseDTO>> getAllUsuarios(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String turma,
            @RequestParam(required = false) String tipo_usuario) {

        if (nome != null && !nome.isEmpty()) {
            return ResponseEntity.ok(usuariosServ.getAllByNome(nome));
        }

        if (turma != null && !turma.isEmpty()) {
            return ResponseEntity.ok(usuariosServ.getAllByTurma(turma));
        }

        if (tipo_usuario != null && !tipo_usuario.isEmpty()) {
            return ResponseEntity.ok(usuariosServ.getAllByTiposUsuarios(tipo_usuario));
        }

        return ResponseEntity.ok(usuariosServ.getAllUsuarios());
    }

    // Buscar usuário por ID
    @GetMapping("/buscar/{id}")
    public ResponseEntity<UsuariosResponseDTO> getUsuarioById(@PathVariable Long id) {
        return usuariosServ.getByID(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Criar novo usuário
    @PostMapping("/novoUsuario")
    public ResponseEntity<UsuariosResponseDTO> createUsuario(@RequestBody UsuariosDTO usuariosDTO) {
        UsuariosResponseDTO novoUsuario = usuariosServ.createUsuario(usuariosDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }

    // Atualizar usuário existente
    @PutMapping("/editar/{idUsuario}")
    public ResponseEntity<UsuariosResponseDTO> updateUsuario(
            @PathVariable Long idUsuario,
            @RequestBody UsuariosDTO usuariosDTO) {

        return usuariosServ.updateUsuario(idUsuario, usuariosDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Deletar usuário
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<String> deleteUsuario(@PathVariable Long id) {
        boolean deletado = usuariosServ.deleteUsuario(id);
        if (deletado) {
            return ResponseEntity.ok("Usuário removido com sucesso.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Erro ao remover usuário. Usuário não encontrado ou já removido.");
    }
}