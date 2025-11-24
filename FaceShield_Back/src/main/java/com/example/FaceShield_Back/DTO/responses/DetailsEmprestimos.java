package com.example.FaceShield_Back.DTO.responses;

import com.example.FaceShield_Back.Entity.Emprestimos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailsEmprestimos {
    // Atributos
    private Long id;
    private LocalDateTime data_retirada;
    private LocalDateTime data_devolucao;
    private String observacoes;
    private String nomeUsuario;
    private Long idFerramenta;
    private String nomeFerramenta;

    // Atributos de localização
    private String nomeLocal;
    private String armario;
    private String prateleira;
    private String estojo;

    // Metodo de conversão
    public static DetailsEmprestimos toDTO(Emprestimos emprestimos) {
        String nomeCompleto = emprestimos.getUsuario().getNome() + " " +
                emprestimos.getUsuario().getSobrenome();

        if (emprestimos == null) {
            return null;
        }

        return new DetailsEmprestimos(
                emprestimos.getId(),
                emprestimos.getData_retirada(),
                emprestimos.getData_devolucao(),
                emprestimos.getObservacoes(),
                nomeCompleto, // Nome completo do usuário

                // Obtém o nome de ferramenta e ID
                emprestimos.getFerramenta().getId(),
                emprestimos.getFerramenta().getNome(),

                // Obtém as informações de local da ferramenta do emprestimo
                emprestimos.getFerramenta().getLocal() != null ?
                        emprestimos.getFerramenta().getLocal().getNomeEspaco() : null,
                emprestimos.getFerramenta().getLocal() != null ?
                        emprestimos.getFerramenta().getLocal().getArmario() : null,
                emprestimos.getFerramenta().getLocal() != null ?
                        emprestimos.getFerramenta().getLocal().getPrateleira() : null,
                emprestimos.getFerramenta().getLocal() != null ?
                        emprestimos.getFerramenta().getLocal().getEstojo() : null
        );
    }
}
