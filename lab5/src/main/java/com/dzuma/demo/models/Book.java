package com.dzuma.demo.models;

public class Book {

    private int id;
    private String title;
    private int authorId;
    private int pages;
    private Integer borrowedBy; // ID of the client who borrowed the book

    public Book() {
    }

    public Book(int id, String title, int authorId, int pages) {
        this.id = id;
        this.title = title;
        this.authorId = authorId;
        this.pages = pages;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getAuthorId() {
        return authorId;
    }

    public void setAuthorId(int authorId) {
        this.authorId = authorId;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }

    public Integer getBorrowedBy() {
        return borrowedBy;
    }

    public void setBorrowedBy(Integer borrowedBy) {
        this.borrowedBy = borrowedBy;
    }

    @Override
    public String toString() {
        return "Book{"
                + "id=" + id
                + ", title='" + title + '\''
                + ", authorId=" + authorId
                + ", pages=" + pages
                + ", borrowedBy=" + borrowedBy
                + '}';
    }
}
