package com.example.FaceShield_Back.DTO.responses;

import com.example.FaceShield_Back.Entity.Ferramentas;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FerramentasResponseDTO {
    private Long id;
    private String nome;
    private String marca;
    private String modelo;
    private String qrcode;
    private String estado;
    private boolean disponibilidade;
    private String descricao;
    private String nomeLocal;

    // Método de conversão com tratamento de null safety
    public static FerramentasResponseDTO toDTO(Ferramentas ferramenta) {
        if (ferramenta == null) {
            return null;
        }

        return new FerramentasResponseDTO(
                ferramenta.getId(),
                ferramenta.getNome(),
                ferramenta.getMarca(),
                ferramenta.getModelo(),
                ferramenta.getQrcode(),
                ferramenta.getEstado(),
                ferramenta.isDisponibilidade(),
                ferramenta.getDescricao(),
                // Obtém o nome do local com verificação de nulo
                ferramenta.getLocal() != null ? ferramenta.getLocal().getNomeEspaco() : null
        );
    }
}