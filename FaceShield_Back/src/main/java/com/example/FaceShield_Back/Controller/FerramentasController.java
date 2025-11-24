package com.example.FaceShield_Back.Controller;

import com.example.FaceShield_Back.DTO.FerramentasDTO;
import com.example.FaceShield_Back.DTO.responses.FerramentasResponseDTO;
import com.example.FaceShield_Back.Service.FerramentasServ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ferramentas")
public class FerramentasController {

    private final FerramentasServ ferramentasServ;

    @Autowired
    public FerramentasController(FerramentasServ ferramentasServ) {
        this.ferramentasServ = ferramentasServ;
    }

    // Buscar todas as ferramentas com filtros opcionais
    @GetMapping("/buscar")
    public ResponseEntity<List<FerramentasResponseDTO>> getAllFerramentas(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Boolean disponivel,
            @RequestParam(required = false) Long idLocal) {

        // Filtro por nome
        if (nome != null && !nome.isEmpty()) {
            return ResponseEntity.ok(ferramentasServ.getAllByNome(nome));
        }

        // Filtro por disponibilidade
        if (disponivel != null && disponivel) {
            return ResponseEntity.ok(ferramentasServ.getFerramentasDisponiveis());
        }

        // Filtro por local
        if (idLocal != null) {
            return ResponseEntity.ok(ferramentasServ.getFerramentasByLocal(idLocal));
        }

        // Caso nenhum filtro seja especificado, retorna todas
        return ResponseEntity.ok(ferramentasServ.getAllFerramentas());
    }

    // Buscar ferramenta por ID
    @GetMapping("/buscar/{id}")
    public ResponseEntity<FerramentasResponseDTO> getFerramentaById(@PathVariable Long id) {
        return ferramentasServ.getByID(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Criar nova ferramenta
    @PostMapping("/novaFerramenta")
    public ResponseEntity<FerramentasResponseDTO> createFerramenta(@RequestBody FerramentasDTO ferramentasDTO) {
        FerramentasResponseDTO novaFerramenta = ferramentasServ.createFerramenta(ferramentasDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaFerramenta);
    }

    // Atualizar ferramenta existente
    @PutMapping("/editar/{idFerramenta}")
    public ResponseEntity<FerramentasResponseDTO> updateFerramenta(
            @PathVariable Long idFerramenta,
            @RequestBody FerramentasDTO ferramentasDTO) {

        return ferramentasServ.updateFerramenta(idFerramenta, ferramentasDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Deletar ferramenta com mensagem de retorno
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<String> deleteFerramenta(@PathVariable Long id) {
        boolean deletado = ferramentasServ.deleteFerramenta(id);
        if (deletado) {
            return ResponseEntity.ok("Ferramenta removida com sucesso.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Erro ao remover ferramenta. Ferramenta não encontrada ou já removida.");
    }
}