package com.example.FaceShield_Back.Service;

import com.example.FaceShield_Back.DTO.EmprestimosDTO;
import com.example.FaceShield_Back.DTO.EmprestimosRequestDTO;
import com.example.FaceShield_Back.DTO.FinalizarEmprestimoRequestDTO;
import com.example.FaceShield_Back.DTO.responses.EmprestimosResponseDTO;
import com.example.FaceShield_Back.Entity.Emprestimos;
import com.example.FaceShield_Back.Entity.Ferramentas;
import com.example.FaceShield_Back.Entity.Usuarios;
import com.example.FaceShield_Back.Repository.EmprestimosRepo;
import com.example.FaceShield_Back.Repository.FerramentasRepo;
import com.example.FaceShield_Back.Repository.UsuariosRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmprestimosServ {

    @Autowired
    private EmprestimosRepo repository;

    @Autowired
    private FerramentasRepo ferramentasRepo;

    @Autowired
    private UsuariosRepo usuariosRepo;

    // Buscar todos empréstimos (agora retorna List<EmprestimosResponseDTO>)
    public List<EmprestimosResponseDTO> getAllEmprestimos() {
        return repository.findAll().stream()
                .map(EmprestimosResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar por ID (agora retorna Optional<EmprestimosResponseDTO>)
    public Optional<EmprestimosResponseDTO> getByID(Long id) {
        return repository.findById(id)
                .map(EmprestimosResponseDTO::toDTO);
    }

    // Buscar empréstimos por ID de usuário (agora retorna List<EmprestimosResponseDTO>)
    public List<EmprestimosResponseDTO> getByUsuarioId(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId).stream()
                .map(EmprestimosResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar empréstimos por ID de ferramenta (agora retorna List<EmprestimosResponseDTO>)
    public List<EmprestimosResponseDTO> getByFerramentaId(Long ferramentaId) {
        return repository.findByFerramentaId(ferramentaId).stream()
                .map(EmprestimosResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // Criar novo empréstimo (mantém EmprestimosDTO para input)
    @Transactional
    public EmprestimosResponseDTO createEmprestimo(EmprestimosDTO emprestimoDTO) {
        // Verificar se a ferramenta já está em um empréstimo ativo
        Long ferramentaId = emprestimoDTO.getFerramenta().getId();
        boolean ferramentaEmUso = isFerramentaEmprestada(ferramentaId);

        if (ferramentaEmUso) {
            throw new IllegalArgumentException("A ferramenta com ID " + ferramentaId + " já está em um empréstimo ativo.");
        }

        // Verificar disponibilidade da ferramenta
        Ferramentas ferramenta = ferramentasRepo.findById(ferramentaId)
                .orElseThrow(() -> new IllegalArgumentException("Ferramenta com ID " + ferramentaId + " não encontrada."));

        if (!ferramenta.isDisponibilidade()) {
            throw new IllegalArgumentException("A ferramenta com ID " + ferramentaId + " não está disponível para empréstimo.");
        }

        Emprestimos emprestimo = EmprestimosDTO.toEntity(emprestimoDTO);
        emprestimo = repository.save(emprestimo);

        // ATUALIZAR DISPONIBILIDADE DA FERRAMENTA PARA FALSE
        atualizarDisponibilidadeFerramenta(ferramentaId, false);

        return EmprestimosResponseDTO.toDTO(emprestimo);
    }

    // Metodo para verificar se uma ferramenta está emprestada
    private boolean isFerramentaEmprestada(Long ferramentaId) {
        List<Emprestimos> emprestimosAtivos = repository.findEmprestimosAtivosByFerramentaId(ferramentaId);
        return !emprestimosAtivos.isEmpty();
    }

    // Criar empréstimo por QRCode
    @Transactional
    public EmprestimosResponseDTO createEmprestimoPorQRCode(EmprestimosRequestDTO requestDTO) {
        // Buscar ferramenta pelo QRCode
        Ferramentas ferramenta = ferramentasRepo.findByQrcode(requestDTO.getQrcodeFerramenta())
                .orElseThrow(() -> new IllegalArgumentException("Ferramenta com QRCode " + requestDTO.getQrcodeFerramenta() + " não encontrada."));

        // Verificar disponibilidade da ferramenta
        if (!ferramenta.isDisponibilidade()) {
            throw new IllegalArgumentException("A ferramenta com QRCode " + requestDTO.getQrcodeFerramenta() + " não está disponível para empréstimo.");
        }

        // Buscar usuário pelo ID
        Usuarios usuario = usuariosRepo.findById(requestDTO.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário com ID " + requestDTO.getUsuarioId() + " não encontrado."));

        // Verificar se a ferramenta já está emprestada (dupla verificação)
        boolean ferramentaEmUso = isFerramentaEmprestada(ferramenta.getId());
        if (ferramentaEmUso) {
            throw new IllegalArgumentException("A ferramenta com QRCode " + requestDTO.getQrcodeFerramenta() + " já está em um empréstimo ativo.");
        }

        // Criar o empréstimo
        Emprestimos emprestimo = new Emprestimos();
        emprestimo.setUsuario(usuario);
        emprestimo.setFerramenta(ferramenta);
        emprestimo.setData_retirada(requestDTO.getData_retirada());

        emprestimo = repository.save(emprestimo);

        // ATUALIZAR DISPONIBILIDADE DA FERRAMENTA PARA FALSE
        atualizarDisponibilidadeFerramenta(ferramenta.getId(), false);

        return EmprestimosResponseDTO.toDTO(emprestimo);
    }

    // Finalizar empréstimo por QRCode
    @Transactional
    public EmprestimosResponseDTO finalizarEmprestimoPorQRCode(FinalizarEmprestimoRequestDTO requestDTO) {
        // Buscar ferramenta pelo QRCode
        Ferramentas ferramenta = ferramentasRepo.findByQrcode(requestDTO.getQrcodeFerramenta())
                .orElseThrow(() -> new IllegalArgumentException("Ferramenta com QRCode " + requestDTO.getQrcodeFerramenta() + " não encontrada."));

        // Buscar usuário pelo ID
        Usuarios usuario = usuariosRepo.findById(requestDTO.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário com ID " + requestDTO.getUsuarioId() + " não encontrado."));

        // Buscar empréstimo ativo por ferramenta e usuário
        Emprestimos emprestimo = repository.findEmprestimoAtivoByFerramentaAndUsuario(ferramenta.getId(), usuario.getId())
                .orElseThrow(() -> new IllegalArgumentException("Não foi encontrado empréstimo ativo para esta ferramenta e usuário."));

        // Finalizar o empréstimo
        emprestimo.setData_devolucao(requestDTO.getData_devolucao());

        Emprestimos finalizado = repository.save(emprestimo);

        // ATUALIZAR DISPONIBILIDADE DA FERRAMENTA PARA TRUE (devolvida)
        atualizarDisponibilidadeFerramenta(ferramenta.getId(), true);

        return EmprestimosResponseDTO.toDTO(finalizado);
    }

    // Atualizar empréstimo existente (mantém EmprestimosDTO para input)
    public Optional<EmprestimosResponseDTO> updateEmprestimo(Long id, EmprestimosDTO dto) {
        return repository.findById(id)
                .map(emprestimo -> {
                    emprestimo.setData_retirada(dto.getData_retirada());
                    emprestimo.setData_devolucao(dto.getData_devolucao());
                    emprestimo.setObservacoes(dto.getObservacoes());
                    // Não atualizamos usuário e ferramenta pois são relações fixas
                    Emprestimos updated = repository.save(emprestimo);
                    return EmprestimosResponseDTO.toDTO(updated);
                });
    }

    // Finalizar empréstimo (marcar como devolvido)
    @Transactional
    public Optional<EmprestimosResponseDTO> finalizarEmprestimo(Long id, LocalDateTime dataDevolucao, String observacoes) {
        return repository.findById(id)
                .map(emprestimo -> {
                    emprestimo.setData_devolucao(dataDevolucao);
                    if (observacoes != null) {
                        emprestimo.setObservacoes(observacoes);
                    }
                    Emprestimos finalizado = repository.save(emprestimo);

                    // ATUALIZAR DISPONIBILIDADE DA FERRAMENTA PARA TRUE (devolvida)
                    atualizarDisponibilidadeFerramenta(emprestimo.getFerramenta().getId(), true);

                    return EmprestimosResponseDTO.toDTO(finalizado);
                });
    }

    // Remover empréstimo (retorna booleano indicando sucesso)
    @Transactional
    public boolean deleteEmprestimo(Long id) {
        return repository.findById(id)
                .map(emprestimo -> {
                    // ATUALIZAR DISPONIBILIDADE DA FERRAMENTA PARA TRUE ao deletar empréstimo
                    atualizarDisponibilidadeFerramenta(emprestimo.getFerramenta().getId(), true);

                    repository.deleteById(id);
                    return true;
                })
                .orElse(false);
    }

    // Metodo para atualizar disponibilidade da ferramenta
    private void atualizarDisponibilidadeFerramenta(Long ferramentaId, boolean disponivel) {
        Ferramentas ferramenta = ferramentasRepo.findById(ferramentaId)
                .orElseThrow(() -> new IllegalArgumentException("Ferramenta não encontrada com ID: " + ferramentaId));

        ferramenta.setDisponibilidade(disponivel);
        ferramentasRepo.save(ferramenta);
    }
}