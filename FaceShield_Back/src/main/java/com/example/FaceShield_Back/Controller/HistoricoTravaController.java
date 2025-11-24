package com.example.FaceShield_Back.Controller;

import com.example.FaceShield_Back.DTO.HistoricoTravaDTO;
import com.example.FaceShield_Back.DTO.responses.HistoricoTravaResponseDTO;
import com.example.FaceShield_Back.Service.HistoricoTravaServ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/historico-trava")
public class HistoricoTravaController {

    @Autowired
    private HistoricoTravaServ historicoTravaService;

    @GetMapping("/buscar")
    public ResponseEntity<List<HistoricoTravaResponseDTO>> getAll() {
        List<HistoricoTravaResponseDTO> historicos = historicoTravaService.findAll();
        return ResponseEntity.ok(historicos);
    }

    @GetMapping("/buscar/{id}")
    public ResponseEntity<HistoricoTravaResponseDTO> getById(@PathVariable Long id) {
        HistoricoTravaResponseDTO historico = historicoTravaService.findById(id);
        return ResponseEntity.ok(historico);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<HistoricoTravaResponseDTO>> getByUsuario(@PathVariable Long usuarioId) {
        List<HistoricoTravaResponseDTO> historicos = historicoTravaService.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(historicos);
    }

    @PostMapping("/novoLog")
    public ResponseEntity<HistoricoTravaResponseDTO> create(@RequestBody HistoricoTravaDTO historicoTravaDTO) {
        HistoricoTravaResponseDTO createdHistorico = historicoTravaService.create(historicoTravaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdHistorico);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        historicoTravaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
