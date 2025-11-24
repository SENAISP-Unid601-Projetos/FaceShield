package com.example.FaceShield_Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoTravaDTO {
    private LocalDateTime dataHoraAbertura;
    private Long usuarioId; // Apenas o ID do usuário
}
