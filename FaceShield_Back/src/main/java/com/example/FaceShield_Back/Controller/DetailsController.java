package com.example.FaceShield_Back.Controller;

import com.example.FaceShield_Back.DTO.responses.DetailsEmprestimos;
import com.example.FaceShield_Back.DTO.responses.DetailsFerramentas;
import com.example.FaceShield_Back.Service.DetailsServ;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/detalhes")
@RequiredArgsConstructor
public class DetailsController {

    private final DetailsServ detailsServ;

    // ========== ENDPOINTS PARA EMPRÉSTIMOS ==========

    /**
     * GET - Busca todos os empréstimos com detalhes
     */
    @GetMapping("/emprestimos")
    public ResponseEntity<List<DetailsEmprestimos>> getAllEmprestimosDetails() {
        List<DetailsEmprestimos> emprestimos = detailsServ.getAllEmprestimosDetails();
        return ResponseEntity.ok(emprestimos);
    }

    /**
     * GET - Busca um empréstimo específico por ID
     */
    @GetMapping("/emprestimos/{id}")
    public ResponseEntity<DetailsEmprestimos> getEmprestimoDetailsById(@PathVariable Long id) {
        DetailsEmprestimos emprestimo = detailsServ.getEmprestimoDetailsById(id);
        if (emprestimo != null) {
            return ResponseEntity.ok(emprestimo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET - Busca empréstimos por ID do usuário
     */
    @GetMapping("/emprestimos/usuario/{usuarioId}")
    public ResponseEntity<List<DetailsEmprestimos>> getEmprestimosByUsuarioId(@PathVariable Long usuarioId) {
        List<DetailsEmprestimos> emprestimos = detailsServ.getEmprestimosDetailsByUsuarioId(usuarioId);
        return ResponseEntity.ok(emprestimos);
    }

    /**
     * GET - Busca empréstimos por ID da ferramenta
     */
    @GetMapping("/emprestimos/ferramenta/{ferramentaId}")
    public ResponseEntity<List<DetailsEmprestimos>> getEmprestimosByFerramentaId(@PathVariable Long ferramentaId) {
        List<DetailsEmprestimos> emprestimos = detailsServ.getEmprestimosDetailsByFerramentaId(ferramentaId);
        return ResponseEntity.ok(emprestimos);
    }

    // ========== ENDPOINTS PARA FERRAMENTAS ==========

    /**
     * GET - Busca todas as ferramentas com detalhes
     */
    @GetMapping("/ferramentas")
    public ResponseEntity<List<DetailsFerramentas>> getAllFerramentasDetails() {
        List<DetailsFerramentas> ferramentas = detailsServ.getAllFerramentasDetails();
        return ResponseEntity.ok(ferramentas);
    }

    /**
     * GET - Busca uma ferramenta específica por ID
     */
    @GetMapping("/ferramentas/{id}")
    public ResponseEntity<DetailsFerramentas> getFerramentaDetailsById(@PathVariable Long id) {
        DetailsFerramentas ferramenta = detailsServ.getFerramentaDetailsById(id);
        if (ferramenta != null) {
            return ResponseEntity.ok(ferramenta);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET - Busca ferramentas por ID do local
     */
    @GetMapping("/ferramentas/local/{localId}")
    public ResponseEntity<List<DetailsFerramentas>> getFerramentasByLocalId(@PathVariable Long localId) {
        List<DetailsFerramentas> ferramentas = detailsServ.getFerramentasDetailsByLocalId(localId);
        return ResponseEntity.ok(ferramentas);
    }
}