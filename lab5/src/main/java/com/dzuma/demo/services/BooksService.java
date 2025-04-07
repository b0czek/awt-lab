package com.dzuma.demo.services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dzuma.demo.models.Book;

@Service
public class BooksService implements IBooksService {

    private static List<Book> booksRepo = new ArrayList<>();

    static {
        booksRepo.add(new Book(1, "Potop", 1, 936));
        booksRepo.add(new Book(2, "Wesele", 2, 150));
        booksRepo.add(new Book(3, "Dziady", 3, 292));
    }

    @Override
    public Collection<Book> getBooks() {
        return booksRepo;
    }

    @Override
    public Book getBook(int id) {
        for (Book book : booksRepo) {
            if (book.getId() == id) {
                return book;
            }
        }
        return null;
    }

    @Override
    public Book addBook(Book book) {
        booksRepo.add(book);
        return book;
    }

    @Override
    public Book updateBook(int id, Book updatedBook) {
        for (int i = 0; i < booksRepo.size(); i++) {
            if (booksRepo.get(i).getId() == id) {
                booksRepo.set(i, updatedBook);
                return updatedBook;
            }
        }
        return null;
    }

    @Override
    public boolean deleteBook(int id) {
        return booksRepo.removeIf(book -> book.getId() == id);
    }

}
