package com.swadExpress.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String orderId;

    @ManyToOne
    private Food food;

    private Integer quantity;

    private Double totalPrice;

    private List<String> ingredients;

}
