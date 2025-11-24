package com.example.FaceShield_Back.Repository;

import com.example.FaceShield_Back.Entity.Ferramentas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FerramentasRepo extends JpaRepository<Ferramentas, Long> {
    // Metodo para buscar pelo nome
    List<Ferramentas> findAllByNome(String nome);

    // Buscar ferramentas disponíveis
    List<Ferramentas> findByDisponibilidadeTrue();

    // Buscar ferramentas por local
    List<Ferramentas> findByLocalId(Long idLocal);

    // Buscar ferramenta por QR code
    Optional<Ferramentas> findByQrcode(String qrcode);
}
