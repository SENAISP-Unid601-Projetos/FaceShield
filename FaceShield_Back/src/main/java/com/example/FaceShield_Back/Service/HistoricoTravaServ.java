package com.example.FaceShield_Back.Service;

import com.example.FaceShield_Back.DTO.HistoricoTravaDTO;
import com.example.FaceShield_Back.DTO.responses.HistoricoTravaResponseDTO;
import com.example.FaceShield_Back.Entity.HistoricoTrava;
import com.example.FaceShield_Back.Entity.Usuarios;
import com.example.FaceShield_Back.Repository.HistoricoTravaRepo;
import com.example.FaceShield_Back.Repository.UsuariosRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoricoTravaServ {

    @Autowired
    private HistoricoTravaRepo repository;

    @Autowired
    private UsuariosRepo usuariosRepository;

    // GET - Buscar todos os históricos de trava
    public List<HistoricoTravaResponseDTO> findAll() {
        List<HistoricoTrava> historicos = repository.findAll();
        return historicos.stream()
                .map(HistoricoTravaResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // GET - Buscar histórico de trava por ID
    public HistoricoTravaResponseDTO findById(Long id) {
        HistoricoTrava historicoTrava = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Histórico de trava não encontrado com ID: " + id));
        return HistoricoTravaResponseDTO.toDTO(historicoTrava);
    }

    // POST - Criar novo histórico de trava
    public HistoricoTravaResponseDTO create(HistoricoTravaDTO historicoTravaDTO) {
        // Buscar o usuário pelo ID
        Usuarios usuario = usuariosRepository.findById(historicoTravaDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + historicoTravaDTO.getUsuarioId()));

        // Criar nova entidade HistoricoTrava
        HistoricoTrava historicoTrava = new HistoricoTrava();
        historicoTrava.setDataHora_abertura(historicoTravaDTO.getDataHoraAbertura());
        historicoTrava.setUsuario(usuario);

        // Salvar no banco
        HistoricoTrava savedHistoricoTrava = repository.save(historicoTrava);

        // Retornar como DTO
        return HistoricoTravaResponseDTO.toDTO(savedHistoricoTrava);
    }

    // DELETE - Deletar histórico de trava por ID
    public void deleteById(Long id) {
        // Verificar se existe antes de deletar
        if (!repository.existsById(id)) {
            throw new RuntimeException("Histórico de trava não encontrado com ID: " + id);
        }
        repository.deleteById(id);
    }

    // GET - Buscar históricos de trava por usuário
    public List<HistoricoTravaResponseDTO> findByUsuarioId(Long usuarioId) {
        // Verificar se o usuário existe
        if (!usuariosRepository.existsById(usuarioId)) {
            throw new RuntimeException("Usuário não encontrado com ID: " + usuarioId);
        }

        List<HistoricoTrava> historicos = repository.findByUsuarioId(usuarioId);
        return historicos.stream()
                .map(HistoricoTravaResponseDTO::toDTO)
                .collect(Collectors.toList());
    }
}