package com.example.FaceShield_Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FinalizarEmprestimoRequestDTO {
    private Long usuarioId;
    private String qrcodeFerramenta;
    private LocalDateTime data_devolucao;
}
