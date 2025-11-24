package com.example.FaceShield_Back.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Emprestimos {
    // Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) // Definindo como NOT NULL
    private LocalDateTime data_retirada;

    private LocalDateTime data_devolucao;

    @Column(length = 150)
    private String observacoes;

    // Relacionamento Many-to-One com Usuario
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false) // 'id_usuario' é o nome da coluna FK na tabela Emprestimos
    private Usuarios usuario; // Representa a entidade Usuario relacionada

    // Relacionamento Many-to-One com Ferramenta
    @ManyToOne
    @JoinColumn(name = "id_ferramenta", nullable = false) // 'id_ferramenta' é o nome da coluna FK na tabela Emprestimos
    private Ferramentas ferramenta; // Representa a entidade Ferramenta relacionada
}
