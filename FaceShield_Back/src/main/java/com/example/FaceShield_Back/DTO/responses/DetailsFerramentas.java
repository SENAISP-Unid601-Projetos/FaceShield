package com.example.FaceShield_Back.DTO.responses;

import com.example.FaceShield_Back.Entity.Ferramentas;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailsFerramentas {
    private Long id;
    private String nome;
    private String marca;
    private String modelo;
    private String qrcode;
    private String estado;
    private boolean disponibilidade;
    private String descricao;

    // Atributos de localização
    private String nomeLocal;
    private String armario;
    private String prateleira;
    private String estojo;

    // Metodo de conversão com tratamento de null safety
    public static DetailsFerramentas toDTO(Ferramentas ferramenta) {
        if (ferramenta == null) {
            return null;
        }

        return new DetailsFerramentas(
                ferramenta.getId(),
                ferramenta.getNome(),
                ferramenta.getMarca(),
                ferramenta.getModelo(),
                ferramenta.getQrcode(),
                ferramenta.getEstado(),
                ferramenta.isDisponibilidade(),
                ferramenta.getDescricao(),

                // Obtém as informacoes do local com verificação de nulo
                ferramenta.getLocal() != null ? ferramenta.getLocal().getNomeEspaco() : null,
                ferramenta.getLocal() != null ? ferramenta.getLocal().getArmario() : null,
                ferramenta.getLocal() != null ? ferramenta.getLocal().getPrateleira() : null,
                ferramenta.getLocal() != null ? ferramenta.getLocal().getEstojo() : null
        );
    }
}
