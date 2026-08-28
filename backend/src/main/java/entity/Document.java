package com.example.docworkspace.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer documentId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Integer xPosition;

    private Integer yPosition;

    private String filesize;

    private Boolean close;

    private Boolean tagOpen;

    private String tagTitle;

    private String tagColor;

    // USER WHO OWNS THIS DOCUMENT
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    public Integer getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Integer documentId) {
        this.documentId = documentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getXPosition() {
        return xPosition;
    }

    public void setXPosition(Integer xPosition) {
        this.xPosition = xPosition;
    }

    public Integer getYPosition() {
        return yPosition;
    }

    public void setYPosition(Integer yPosition) {
        this.yPosition = yPosition;
    }

    public String getFilesize() {
        return filesize;
    }

    public void setFilesize(String filesize) {
        this.filesize = filesize;
    }

    public Boolean getClose() {
        return close;
    }

    public void setClose(Boolean close) {
        this.close = close;
    }

    public Boolean getTagOpen() {
        return tagOpen;
    }

    public void setTagOpen(Boolean tagOpen) {
        this.tagOpen = tagOpen;
    }

    public String getTagTitle() {
        return tagTitle;
    }

    public void setTagTitle(String tagTitle) {
        this.tagTitle = tagTitle;
    }

    public String getTagColor() {
        return tagColor;
    }

    public void setTagColor(String tagColor) {
        this.tagColor = tagColor;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}