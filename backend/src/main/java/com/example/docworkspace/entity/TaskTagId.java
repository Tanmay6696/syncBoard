package com.example.docworkspace.entity;

import lombok.Data;
import java.io.Serializable;

@Data
public class TaskTagId implements Serializable {
    private Long task;
    private Long tag;
}