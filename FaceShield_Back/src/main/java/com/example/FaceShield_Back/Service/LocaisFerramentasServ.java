package com.example.FaceShield_Back.Service;

import com.example.FaceShield_Back.DTO.LocaisFerramentasDTO;
import com.example.FaceShield_Back.Entity.LocaisFerramentas;
import com.example.FaceShield_Back.Repository.LocaisFerramentasRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocaisFerramentasServ {

    @Autowired
    private LocaisFerramentasRepo repository;

    // Buscar todos
    public List<LocaisFerramentas> getAllLocais() {
        return repository.findAll();
    }

    // Buscar por ID
    public Optional<LocaisFerramentasDTO> getByID(Long id) {
        Optional<LocaisFerramentas> optional = repository.findById(id);

        if (optional.isPresent()) {
            LocaisFerramentasDTO dto = new LocaisFerramentasDTO();
            return Optional.of(dto.fromLocaisFerramentasDTO(optional.get()));
        } else {
            return Optional.empty();
        }
    }

    // Buscar pelo NOME do Local
    public List<LocaisFerramentas> getAllByNomeLocal(String nomeEspaco) {
        return repository.findAllByNomeEspaco(nomeEspaco); // Corrigido para usar o campo correto
    }

    // Criando novo Local
    public LocaisFerramentasDTO createLocal(LocaisFerramentasDTO localDTO) {
        LocaisFerramentas locaisFerramentas = localDTO.toLocaisFerramentas();
        locaisFerramentas = repository.save(locaisFerramentas);

        return localDTO.fromLocaisFerramentasDTO(locaisFerramentas);
    }

    // Atualizando Local
    public Optional<LocaisFerramentasDTO> updateLocal(Long idLocal, LocaisFerramentasDTO localDTO) {
        Optional<LocaisFerramentas> optional = repository.findById(idLocal);

        if (optional.isPresent()) {
            LocaisFerramentas local = optional.get();

            local.setNomeEspaco(localDTO.getNomeEspaco());
            local.setArmario(localDTO.getArmario());
            local.setPrateleira(localDTO.getPrateleira());
            local.setEstojo(localDTO.getEstojo());

            local = repository.save(local);

            return Optional.of(localDTO.fromLocaisFerramentasDTO(local));
        } else {
            return Optional.empty();
        }
    }

    // Remover local
    public boolean deleteLocal(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);

            return true;
        } else {
            return false;
        }
    }
}
