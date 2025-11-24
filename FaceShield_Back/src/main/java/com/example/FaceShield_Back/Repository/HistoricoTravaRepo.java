package com.example.FaceShield_Back.Repository;

import com.example.FaceShield_Back.Entity.HistoricoTrava;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoricoTravaRepo extends JpaRepository<HistoricoTrava, Long> {
    // Buscar por ID do usuário (através da relação)
    List<HistoricoTrava> findByUsuarioId(Long usuarioId);
}
