package com.dzuma.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dzuma.demo.models.Book;
import com.dzuma.demo.models.Client;
import com.dzuma.demo.services.BooksService;
import com.dzuma.demo.services.ClientsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Clients", description = "Operations related to clients and their interactions with books")
@RestController
@RequestMapping("/clients")
public class ClientsController {

    @Autowired
    private ClientsService clientsService;

    @Autowired
    private BooksService booksService;

    @Operation(summary = "Get all clients")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of clients")
    @GetMapping
    public List<Client> getAllClients() {
        return clientsService.getAllClients();
    }

    @Operation(summary = "Get a client by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Client found"),
        @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable int id) {
        Client client = clientsService.getClientById(id);
        if (client != null) {
            return ResponseEntity.ok(client);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Add a new client")
    @ApiResponse(responseCode = "201", description = "Client added successfully")
    @PostMapping
    public Client addClient(@RequestBody Client client) {
        return clientsService.addClient(client);
    }

    @Operation(summary = "Update an existing client")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Client updated successfully"),
        @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable int id, @RequestBody Client updatedClient) {
        Client client = clientsService.updateClient(id, updatedClient);
        if (client != null) {
            return ResponseEntity.ok(client);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete a client")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Client deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable int id) {
        if (clientsService.deleteClient(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Borrow a book for a client")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Book borrowed successfully"),
        @ApiResponse(responseCode = "400", description = "Client or book not found, or book already borrowed")
    })
    @PostMapping("/{clientId}/borrow/{bookId}")
    public ResponseEntity<String> borrowBook(@PathVariable int clientId, @PathVariable int bookId) {
        Client client = clientsService.getClientById(clientId);
        if (client == null) {
            return new ResponseEntity<>("Client not found", HttpStatus.BAD_REQUEST);
        }

        Book book = booksService.getBook(bookId);
        if (book == null) {
            return new ResponseEntity<>("Book not found", HttpStatus.BAD_REQUEST);
        }

        if (book.getBorrowedBy() != null) {
            return new ResponseEntity<>("Book is already borrowed", HttpStatus.BAD_REQUEST);
        }

        book.setBorrowedBy(clientId);
        booksService.updateBook(bookId, book);
        return new ResponseEntity<>("Book borrowed successfully", HttpStatus.OK);
    }
}
