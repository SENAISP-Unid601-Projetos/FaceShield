package com.example.FaceShield_Back.Service;

import com.example.FaceShield_Back.DTO.FerramentasDTO;
import com.example.FaceShield_Back.DTO.responses.FerramentasResponseDTO;
import com.example.FaceShield_Back.Entity.Ferramentas;
import com.example.FaceShield_Back.Repository.FerramentasRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FerramentasServ {

    @Autowired
    private FerramentasRepo repository;

    // Buscar todos - agora retorna List<FerramentasResponseDTO>
    public List<FerramentasResponseDTO> getAllFerramentas() {
        return repository.findAll().stream()
                .map(FerramentasResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar por ID - agora retorna Optional<FerramentasResponseDTO>
    public Optional<FerramentasResponseDTO> getByID(Long id) {
        return repository.findById(id)
                .map(FerramentasResponseDTO::toDTO);
    }

    // Buscar pelo NOME da ferramenta - agora retorna List<FerramentasResponseDTO>
    public List<FerramentasResponseDTO> getAllByNome(String nome) {
        return repository.findAllByNome(nome).stream()
                .map(FerramentasResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // Criando nova Ferramenta (mantém FerramentasDTO para input)
    public FerramentasResponseDTO createFerramenta(FerramentasDTO ferramentasDTO) {
        Ferramentas ferramentas = ferramentasDTO.toFerramentas();
        ferramentas = repository.save(ferramentas);
        return FerramentasResponseDTO.toDTO(ferramentas);
    }

    // Buscar ferramentas disponíveis - agora retorna List<FerramentasResponseDTO>
    public List<FerramentasResponseDTO> getFerramentasDisponiveis() {
        return repository.findByDisponibilidadeTrue().stream()
                .map(FerramentasResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // Buscar ferramentas por local - agora retorna List<FerramentasResponseDTO>
    public List<FerramentasResponseDTO> getFerramentasByLocal(Long idLocal) {
        return repository.findByLocalId(idLocal).stream()
                .map(FerramentasResponseDTO::toDTO)
                .collect(Collectors.toList());
    }

    // Atualizando Ferramenta (mantém FerramentasDTO para input)
    public Optional<FerramentasResponseDTO> updateFerramenta(Long idFerramenta, FerramentasDTO dto) {
        return repository.findById(idFerramenta)
                .map(ferramenta -> {
                    ferramenta.setNome(dto.getNome());
                    ferramenta.setMarca(dto.getMarca());
                    ferramenta.setModelo(dto.getModelo());
                    ferramenta.setEstado(dto.getEstado());
                    ferramenta.setDisponibilidade(dto.isDisponibilidade());
                    ferramenta.setDescricao(dto.getDescricao());
                    ferramenta.setLocal(dto.toFerramentas().getLocal());

                    ferramenta = repository.save(ferramenta);
                    return FerramentasResponseDTO.toDTO(ferramenta);
                });
    }

    // Remover ferramenta (mantém a mesma implementação)
    public boolean deleteFerramenta(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}