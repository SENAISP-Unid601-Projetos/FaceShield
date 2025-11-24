package com.example.FaceShield_Back.Controller;

import com.example.FaceShield_Back.DTO.LocaisFerramentasDTO;
import com.example.FaceShield_Back.Entity.LocaisFerramentas;
import com.example.FaceShield_Back.Service.LocaisFerramentasServ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/locais")
public class LocaisController {

    private final LocaisFerramentasServ locaisFerramentasServ;

    @Autowired
    public LocaisController(LocaisFerramentasServ locaisFerramentasServ) {
        this.locaisFerramentasServ = locaisFerramentasServ;
    }

    // Buscar todos os locais ou filtrar por nome (parâmetro opcional)
    @GetMapping("/buscar")
    public ResponseEntity<List<LocaisFerramentas>> getAllLocais(
            @RequestParam(required = false) String nomeEspaco) {

        if (nomeEspaco != null && !nomeEspaco.isEmpty()) {
            List<LocaisFerramentas> locaisFiltrados = locaisFerramentasServ.getAllByNomeLocal(nomeEspaco);
            return ResponseEntity.ok(locaisFiltrados);
        }
        List<LocaisFerramentas> todosLocais = locaisFerramentasServ.getAllLocais();
        return ResponseEntity.ok(todosLocais);
    }

    // Buscar local por ID
    @GetMapping("/buscar/{id}")
    public ResponseEntity<LocaisFerramentasDTO> getLocalById(@PathVariable Long id) {
        Optional<LocaisFerramentasDTO> local = locaisFerramentasServ.getByID(id);

        return local.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Criar novo local
    @PostMapping("/novoLocal")
    public ResponseEntity<LocaisFerramentasDTO> createLocal(@RequestBody LocaisFerramentasDTO localDTO) {
        LocaisFerramentasDTO novoLocal = locaisFerramentasServ.createLocal(localDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoLocal);
    }

    // Atualizar local existente
    @PutMapping("/editar/{idLocal}")
    public ResponseEntity<LocaisFerramentasDTO> updateLocal(
            @PathVariable Long idLocal,
            @RequestBody LocaisFerramentasDTO localDTO) {

        Optional<LocaisFerramentasDTO> localAtualizado = locaisFerramentasServ.updateLocal(idLocal, localDTO);

        return localAtualizado.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Deletar local com mensagem de retorno
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<String> deleteLocal(@PathVariable Long id) {
        boolean deletado = locaisFerramentasServ.deleteLocal(id);

        if (deletado) {
            return ResponseEntity.ok("Local removido com sucesso.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Erro ao remover local. Local não encontrado ou já removido.");
        }
    }
}