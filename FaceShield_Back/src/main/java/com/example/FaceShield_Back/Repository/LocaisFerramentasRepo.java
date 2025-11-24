package com.example.FaceShield_Back.Repository;

import com.example.FaceShield_Back.Entity.LocaisFerramentas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocaisFerramentasRepo extends JpaRepository<LocaisFerramentas, Long> {
    List<LocaisFerramentas> findAllByNomeEspaco(String nomeEspaco); // Metodo para buscar pelo nome
}
