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

import com.dzuma.demo.models.Author;
import com.dzuma.demo.services.AuthorsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/authors")
@Tag(name = "Authors", description = "Endpoints for managing authors")
public class AuthorsController {

    @Autowired
    private AuthorsService authorsService;

    @GetMapping
    @Operation(summary = "Get all authors", description = "Retrieve a list of all authors")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved list of authors")
    })
    public List<Author> getAllAuthors() {
        return authorsService.getAllAuthors();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get author by ID", description = "Retrieve a specific author by their ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the author"),
        @ApiResponse(responseCode = "404", description = "Author not found")
    })
    public ResponseEntity<Author> getAuthorById(@PathVariable int id) {
        Author author = authorsService.getAuthorById(id);
        if (author != null) {
            return ResponseEntity.ok(author);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @Operation(summary = "Add a new author", description = "Create a new author")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Author successfully created")
    })
    public Author addAuthor(@RequestBody Author author) {
        return authorsService.addAuthor(author);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an author", description = "Update an existing author's details")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully updated the author"),
        @ApiResponse(responseCode = "400", description = "Invalid request, author ID cannot be modified"),
        @ApiResponse(responseCode = "404", description = "Author not found")
    })
    public ResponseEntity<Object> updateAuthor(@PathVariable int id, @RequestBody Author updatedAuthor) {
        if (updatedAuthor.getId() != id) {
            return new ResponseEntity<>("Author ID cannot be modified", HttpStatus.BAD_REQUEST);
        }
        Author author = authorsService.updateAuthor(id, updatedAuthor);
        if (author != null) {
            return ResponseEntity.ok(author);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an author", description = "Delete an author by their ID")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Successfully deleted the author"),
        @ApiResponse(responseCode = "404", description = "Author not found")
    })
    public ResponseEntity<Void> deleteAuthor(@PathVariable int id) {
        if (authorsService.deleteAuthor(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
