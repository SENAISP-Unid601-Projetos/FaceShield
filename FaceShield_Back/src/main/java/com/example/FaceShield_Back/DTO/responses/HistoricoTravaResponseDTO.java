package com.example.FaceShield_Back.DTO.responses;

import com.example.FaceShield_Back.Entity.HistoricoTrava;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HistoricoTravaResponseDTO {
    private Long id;
    private LocalDateTime dataHoraAbertura;
    private String username; // Username do usuário

    // Metodo estático para converter Entity para DTO
    public static HistoricoTravaResponseDTO toDTO(HistoricoTrava historicoTrava) {
        if (historicoTrava == null) {
            return null;
        }

        HistoricoTravaResponseDTO dto = new HistoricoTravaResponseDTO();
        dto.setId(historicoTrava.getId());
        dto.setDataHoraAbertura(historicoTrava.getDataHora_abertura());

        // Adiciona o username do usuário
        if (historicoTrava.getUsuario() != null) {
            dto.setUsername(historicoTrava.getUsuario().getUsername());
        }

        return dto;
    }

    // Construtor sem o username (para compatibilidade)
    public HistoricoTravaResponseDTO(Long id, LocalDateTime dataHoraAbertura) {
        this.id = id;
        this.dataHoraAbertura = dataHoraAbertura;
    }
}
