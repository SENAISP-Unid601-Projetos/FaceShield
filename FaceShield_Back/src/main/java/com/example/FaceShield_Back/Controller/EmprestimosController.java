package com.example.FaceShield_Back.Controller;

import com.example.FaceShield_Back.DTO.EmprestimosDTO;
import com.example.FaceShield_Back.DTO.EmprestimosRequestDTO;
import com.example.FaceShield_Back.DTO.FinalizarEmprestimoRequestDTO;
import com.example.FaceShield_Back.DTO.responses.EmprestimosResponseDTO;
import com.example.FaceShield_Back.Service.EmprestimosServ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimosController {

    private final EmprestimosServ emprestimosServ;

    @Autowired
    public EmprestimosController(EmprestimosServ emprestimosServ) {
        this.emprestimosServ = emprestimosServ;
    }

    // Buscar empréstimos com filtros opcionais
    @GetMapping("/buscar")
    public ResponseEntity<List<EmprestimosResponseDTO>> getAllEmprestimos(
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) Long ferramentaId) {

        if (usuarioId != null) {
            return ResponseEntity.ok(emprestimosServ.getByUsuarioId(usuarioId));
        }

        if (ferramentaId != null) {
            return ResponseEntity.ok(emprestimosServ.getByFerramentaId(ferramentaId));
        }

        return ResponseEntity.ok(emprestimosServ.getAllEmprestimos());
    }

    // Buscar empréstimo por ID
    @GetMapping("/buscar/{id}")
    public ResponseEntity<EmprestimosResponseDTO> getEmprestimoById(@PathVariable Long id) {
        return emprestimosServ.getByID(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Criar novo empréstimo
    @PostMapping("/novoEmprestimo")
    public ResponseEntity<EmprestimosResponseDTO> createEmprestimo(@RequestBody EmprestimosDTO emprestimosDTO) {
        EmprestimosResponseDTO novoEmprestimo = emprestimosServ.createEmprestimo(emprestimosDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoEmprestimo);
    }

    // Criar empréstimo por QRCode
    @PostMapping("/novoEmprestimoQrcode")
    public ResponseEntity<?> createEmprestimoPorQRCode(@RequestBody EmprestimosRequestDTO requestDTO) {
        try {
            EmprestimosResponseDTO novoEmprestimo = emprestimosServ.createEmprestimoPorQRCode(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoEmprestimo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao criar empréstimo: " + e.getMessage());
        }
    }

    // Finalizar empréstimo por QRCode
    @PutMapping("/finalizarEmprestimoQrcode")
    public ResponseEntity<?> finalizarEmprestimoPorQRCode(@RequestBody FinalizarEmprestimoRequestDTO requestDTO) {
        try {
            EmprestimosResponseDTO emprestimoFinalizado = emprestimosServ.finalizarEmprestimoPorQRCode(requestDTO);
            return ResponseEntity.ok(emprestimoFinalizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao finalizar empréstimo: " + e.getMessage());
        }
    }

    // Atualizar empréstimo existente
    @PutMapping("/editar/{id}")
    public ResponseEntity<EmprestimosResponseDTO> updateEmprestimo(
            @PathVariable Long id,
            @RequestBody EmprestimosDTO emprestimosDTO) {

        return emprestimosServ.updateEmprestimo(id, emprestimosDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Finalizar empréstimo (marcar como devolvido)
    @PutMapping("/finalizar/{id}")
    public ResponseEntity<EmprestimosResponseDTO> finalizarEmprestimo(
            @PathVariable Long id,
            @RequestParam LocalDateTime dataDevolucao,
            @RequestParam(required = false) String observacoes) {

        return emprestimosServ.finalizarEmprestimo(id, dataDevolucao, observacoes)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Deletar empréstimo
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<String> deleteEmprestimo(@PathVariable Long id) {
        boolean deletado = emprestimosServ.deleteEmprestimo(id);
        if (deletado) {
            return ResponseEntity.ok("Empréstimo removido com sucesso.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Erro ao remover empréstimo. Empréstimo não encontrado ou já removido.");
    }
}