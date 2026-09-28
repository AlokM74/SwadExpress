package com.swadExpress.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String eventName;

    private String eventDescription;

    private LocalDateTime eventStart;

    private LocalDateTime eventEnd;

    @Column(length = 1000)
    @ElementCollection
    private List<String> images;

    @ManyToOne
    @JsonIgnore
    private Restaurant restaurant;

    @JsonProperty("restaurantName")
    public String getRestaurantName() {
        return restaurant == null ? null : restaurant.getName();
    }

}
