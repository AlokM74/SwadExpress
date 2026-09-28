package com.swadExpress.controller;

import com.swadExpress.entity.Event;
import com.swadExpress.request.EventRequest;
import com.swadExpress.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
public class AdminEventController {

    @Autowired
    private EventService eventService;


    // =========================
    // CREATE EVENT
    // =========================

    @PostMapping("/restaurants/{restaurantId}/status")
    public ResponseEntity<Event> createEvent(
            @RequestBody EventRequest request,
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long restaurantId
    ) throws Exception {

        Event event = eventService.createEvent(
                request,
                jwt
        );

        return new ResponseEntity<>(
                event,
                HttpStatus.CREATED
        );
    }


    // =========================
    // GET RESTAURANT EVENTS
    // =========================

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Event>> getRestaurantEvents(
            @PathVariable Long restaurantId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        List<Event> events =
                eventService.getEventsByRestaurant(jwt);

        return new ResponseEntity<>(
                events,
                HttpStatus.OK
        );
    }


    // =========================
    // DELETE EVENT
    // =========================

    @DeleteMapping("/{eventId}")
    public ResponseEntity<String> deleteEvent(
            @PathVariable Long eventId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        eventService.deleteEvent(
                eventId,
                jwt
        );

        return new ResponseEntity<>(
                "Event deleted successfully",
                HttpStatus.OK
        );
    }


    // =========================
    // UPDATE EVENT
    // =========================

    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long eventId,
            @RequestBody EventRequest request,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        Event event = eventService.updateEvent(
                eventId,
                request,
                jwt
        );

        return new ResponseEntity<>(
                event,
                HttpStatus.OK
        );
    }
}