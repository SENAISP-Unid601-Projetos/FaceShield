
package com.example.FaceShield_Back.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Ferramentas {
    // Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100) // Definindo como NOT NULL
    private String nome;

    @Column(nullable = false, length = 100) // Definindo como NOT NULL
    private String marca;

    @Column(nullable = false, length = 100) // Definindo como NOT NULL
    private String modelo;

    @Column(nullable = true, length = 200) // Definindo como NOT NULL (Por enquanto para teste está Can Null)
    private String qrcode;

    @Column(nullable = false, length = 200) // Definindo como NOT NULL
    private String estado;

    @Column(nullable = false) // Definindo como NOT NULL
    private boolean disponibilidade; // Disponivel (1), Indisponivel (0)

    @Column(length = 200)
    private String descricao;

    // Relacionamentos Local de Ferramentas
    @ManyToOne
    @JoinColumn(name = "id_local", nullable = false)
    private LocaisFerramentas local;

    // Emprestimos
    @OneToMany(mappedBy = "ferramenta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Emprestimos> emprestimos;

    // Construtor pro DTO de Ferramentas
//    public Ferramentas(Long id, String nome, String marca, String modelo, String qrcode, String estado, boolean disponibilidade, String descricao, LocaisFerramentas local) {
//    }
}
