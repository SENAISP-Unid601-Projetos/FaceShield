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
public class EmprestimosRequestDTO {
    private Long usuarioId;
    private String qrcodeFerramenta;
    private LocalDateTime data_retirada;
    // data_devolucao e observacoes podem ser omitidos ou serão null por padrão
}
