package com.example.FaceShield_Back.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"ferramentas"}) // Ignora a lista de ferramentas ao serializar
public class LocaisFerramentas {
    // Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100) // Definindo como NOT NULL
    private String nomeEspaco;

    @Column(nullable = false, length = 50) // Definindo como NOT NULL
    private String armario;

    @Column(nullable = false, length = 50) // Definindo como NOT NULL
    private String prateleira;

    @Column(length = 50)
    private String estojo;

    // Relacionamento
    @OneToMany(mappedBy = "local")
    private List<Ferramentas> ferramentas;

    // Construtor personalizado
    public LocaisFerramentas(Long id, String nomeEspaco, String armario, String prateleira, String estojo) {
        this.id = id;
        this.nomeEspaco = nomeEspaco;
        this.armario = armario;
        this.prateleira = prateleira;
        this.estojo = estojo;
    }
}
