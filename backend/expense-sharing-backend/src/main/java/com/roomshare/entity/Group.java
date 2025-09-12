package com.roomshare.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp; // <<< --- IMPORTANT IMPORT

import java.sql.Timestamp;

@Data
@Entity
@Table(name = "`groups`")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    // ** THE FIX IS HERE: Add the @CreationTimestamp annotation **
    @CreationTimestamp // This annotation from Hibernate ensures the field is populated on creation.
    @Column(name = "created_at", updatable = false) // We can simplify this annotation now.
    private Timestamp createdAt;
}