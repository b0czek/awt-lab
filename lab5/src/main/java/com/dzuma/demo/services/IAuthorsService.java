package com.dzuma.demo.services;

import java.util.List;

import com.dzuma.demo.models.Author;

public interface IAuthorsService {

    List<Author> getAllAuthors();

    Author getAuthorById(int id);

    Author addAuthor(Author author);

    Author updateAuthor(int id, Author updatedAuthor);

    boolean deleteAuthor(int id);
}
