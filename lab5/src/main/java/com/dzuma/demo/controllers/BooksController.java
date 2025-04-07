package com.dzuma.demo.controllers;

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
import com.dzuma.demo.services.IAuthorsService;
import com.dzuma.demo.services.IBooksService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/books")
@Tag(name = "Books", description = "Endpoints for managing books")
public class BooksController {

    @Autowired
    private IBooksService booksService;

    @Autowired
    private IAuthorsService authorsService;

    @Operation(summary = "Get all books", description = "Retrieve a list of all books")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved list of books")
    })
    @GetMapping
    public ResponseEntity<Object> getBooks() {
        return new ResponseEntity<>(booksService.getBooks(), HttpStatus.OK);
    }

    @Operation(summary = "Get a book by ID", description = "Retrieve details of a specific book by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the book"),
        @ApiResponse(responseCode = "404", description = "Book not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<Object> getBook(@PathVariable("id") int id) {
        return new ResponseEntity<>(booksService.getBook(id), HttpStatus.OK);
    }

    @Operation(summary = "Add a new book", description = "Create a new book")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Book created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or author not found", content = @Content)
    })
    @PostMapping
    public ResponseEntity<Object> addBook(@RequestBody Book book) {
        if (authorsService.getAuthorById(book.getAuthorId()) == null) {
            return new ResponseEntity<>("Author not found", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(booksService.addBook(book), HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing book", description = "Update the details of an existing book by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Book updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or author not found", content = @Content),
        @ApiResponse(responseCode = "404", description = "Book not found", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateBook(@PathVariable("id") int id, @RequestBody Book updatedBook) {
        if (updatedBook.getId() != id) {
            return new ResponseEntity<>("Book ID cannot be modified", HttpStatus.BAD_REQUEST);
        }
        if (authorsService.getAuthorById(updatedBook.getAuthorId()) == null) {
            return new ResponseEntity<>("Author not found", HttpStatus.BAD_REQUEST);
        }
        Book book = booksService.updateBook(id, updatedBook);
        if (book != null) {
            return new ResponseEntity<>(book, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Book not found", HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Delete a book", description = "Delete a book by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Book deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Book not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteBook(@PathVariable("id") int id) {
        boolean isDeleted = booksService.deleteBook(id);
        if (isDeleted) {
            return new ResponseEntity<>("Book deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Book not found", HttpStatus.NOT_FOUND);
        }
    }
}
