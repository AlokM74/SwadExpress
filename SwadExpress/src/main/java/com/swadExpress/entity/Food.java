package com.swadExpress.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String description;

    private Double price;

    @ManyToOne
    private Category foodCategory;

    @Column(length = 1000)
    @ElementCollection
    private List<String> images;

    private boolean isAvailable;

    @JsonIgnore
    @ManyToOne
    private Restaurant restaurant;

    private boolean isVegetarian;

    private boolean isSessional;

    @ManyToMany
    private List<IngredientsItem> ingredients= new ArrayList<>();

    private Date creationDate;


 }
