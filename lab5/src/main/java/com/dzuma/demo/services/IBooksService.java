package com.dzuma.demo.services;

import java.util.Collection;

import com.dzuma.demo.models.Book;

public interface IBooksService {

    public abstract Collection<Book> getBooks();

    public abstract Book getBook(int id);

    public abstract Book addBook(Book book);

    public abstract Book updateBook(int id, Book updatedBook);

    public abstract boolean deleteBook(int id);
}
