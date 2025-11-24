package com.example.FaceShield_Back.DTO;

import com.example.FaceShield_Back.Entity.LocaisFerramentas;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocaisFerramentasDTO {
    // Atributos
    private Long id;
    private String nomeEspaco;
    private String armario;
    private String prateleira;
    private String estojo;

    // Tranformação de Objetos
    public LocaisFerramentas toLocaisFerramentas() {
        return new LocaisFerramentas(
                this.id,
                this.nomeEspaco,
                this.armario,
                this.prateleira,
                this.estojo
        );
    }

    public LocaisFerramentasDTO fromLocaisFerramentasDTO(LocaisFerramentas locaisFerramentas) {
        return new LocaisFerramentasDTO(
                locaisFerramentas.getId(),
                locaisFerramentas.getNomeEspaco(),
                locaisFerramentas.getArmario(),
                locaisFerramentas.getPrateleira(),
                locaisFerramentas.getEstojo()
        );
    }
}
