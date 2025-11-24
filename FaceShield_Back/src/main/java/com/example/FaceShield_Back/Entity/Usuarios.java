package com.example.FaceShield_Back.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Usuarios {
    // Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150) // Definindo como NOT NULL
    private String nome;

    @Column(nullable = false, length = 150) // Definindo como NOT NULL
    private String sobrenome;

    @Column(nullable = true, length = 50) // Definido como CAN NULL
    private String turma;

    @Column(unique = true, nullable = true, length = 100) // Definindo como CAN NULL e Único
    private String username;

    @Column(nullable = true, length = 100) // Definindo como CAN NULL
    private String senha;

    @Column(name = "tipo_usuario", nullable = false) // Definindo como NOT NULL
    private String tipoUsuario;

    // Emprestimos
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Emprestimos> emprestimos; // Mapeado pelo atributo 'usuario' na classe Emprestimos

    // HistoricoTrava
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<HistoricoTrava> historicoTravas;
}
