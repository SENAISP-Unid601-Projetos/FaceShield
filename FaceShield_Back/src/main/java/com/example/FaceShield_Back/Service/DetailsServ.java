package com.example.FaceShield_Back.Service;

import com.example.FaceShield_Back.DTO.responses.DetailsEmprestimos;
import com.example.FaceShield_Back.DTO.responses.DetailsFerramentas;
import com.example.FaceShield_Back.Entity.Emprestimos;
import com.example.FaceShield_Back.Entity.Ferramentas;
import com.example.FaceShield_Back.Repository.EmprestimosRepo;
import com.example.FaceShield_Back.Repository.FerramentasRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DetailsServ {

    private final EmprestimosRepo emprestimosRepository;
    private final FerramentasRepo ferramentasRepository;

    // ========== MÉTODOS PARA DETAILS EMPRÉSTIMOS ==========

    /**
     * Busca todos os empréstimos com detalhes
     */
    public List<DetailsEmprestimos> getAllEmprestimosDetails() {
        List<Emprestimos> emprestimos = emprestimosRepository.findAll();
        return emprestimos.stream()
                .map(DetailsEmprestimos::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca um empréstimo específico por ID com detalhes
     */
    public DetailsEmprestimos getEmprestimoDetailsById(Long id) {
        Optional<Emprestimos> emprestimo = emprestimosRepository.findById(id);
        return emprestimo.map(DetailsEmprestimos::toDTO).orElse(null);
    }

    /**
     * Busca empréstimos por ID do usuário
     */
    public List<DetailsEmprestimos> getEmprestimosDetailsByUsuarioId(Long usuarioId) {
        List<Emprestimos> emprestimos = emprestimosRepository.findByUsuarioId(usuarioId);
        return emprestimos.stream()
                .map(DetailsEmprestimos::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca empréstimos por ID da ferramenta
     */
    public List<DetailsEmprestimos> getEmprestimosDetailsByFerramentaId(Long ferramentaId) {
        List<Emprestimos> emprestimos = emprestimosRepository.findByFerramentaId(ferramentaId);
        return emprestimos.stream()
                .map(DetailsEmprestimos::toDTO)
                .collect(Collectors.toList());
    }

    // ========== MÉTODOS PARA DETAILS FERRAMENTAS ==========

    /**
     * Busca todas as ferramentas com detalhes
     */
    public List<DetailsFerramentas> getAllFerramentasDetails() {
        List<Ferramentas> ferramentas = ferramentasRepository.findAll();
        return ferramentas.stream()
                .map(DetailsFerramentas::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca uma ferramenta específica por ID com detalhes
     */
    public DetailsFerramentas getFerramentaDetailsById(Long id) {
        Optional<Ferramentas> ferramenta = ferramentasRepository.findById(id);
        return ferramenta.map(DetailsFerramentas::toDTO).orElse(null);
    }

    /**
     * Busca ferramentas por localização
     */
    public List<DetailsFerramentas> getFerramentasDetailsByLocalId(Long localId) {
        List<Ferramentas> ferramentas = ferramentasRepository.findByLocalId(localId);
        return ferramentas.stream()
                .map(DetailsFerramentas::toDTO)
                .collect(Collectors.toList());
    }
}