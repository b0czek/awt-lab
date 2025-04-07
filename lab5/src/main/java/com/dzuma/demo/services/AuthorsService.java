package com.dzuma.demo.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dzuma.demo.models.Author;

@Service
public class AuthorsService implements IAuthorsService {

    private final List<Author> authorsRepo = new ArrayList<>();

    public AuthorsService() {
        authorsRepo.add(new Author(1, "Henryk Sienkiewicz"));
        authorsRepo.add(new Author(2, "Władysław Reymont"));
        authorsRepo.add(new Author(3, "Adam Mickiewicz"));
    }

    @Override
    public List<Author> getAllAuthors() {
        return new ArrayList<>(authorsRepo);
    }

    @Override
    public Author getAuthorById(int id) {
        return authorsRepo.stream().filter(author -> author.getId() == id).findFirst().orElse(null);
    }

    @Override
    public Author addAuthor(Author author) {
        authorsRepo.add(author);
        return author;
    }

    @Override
    public Author updateAuthor(int id, Author updatedAuthor) {
        for (int i = 0; i < authorsRepo.size(); i++) {
            if (authorsRepo.get(i).getId() == id) {
                updatedAuthor.setId(id);
                authorsRepo.set(i, updatedAuthor);
                return updatedAuthor;
            }
        }
        return null;
    }

    @Override
    public boolean deleteAuthor(int id) {
        return authorsRepo.removeIf(author -> author.getId() == id);
    }
}
