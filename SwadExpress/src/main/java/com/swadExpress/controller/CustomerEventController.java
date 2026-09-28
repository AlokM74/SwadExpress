package com.swadExpress.controller;

import com.swadExpress.entity.Event;
import com.swadExpress.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class CustomerEventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents()
            throws Exception {

        List<Event> events =
                eventService.getAllEvents();

        return new ResponseEntity<>(
                events,
                HttpStatus.OK
        );
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<Event> getEventById(
            @PathVariable Long eventId
    ) throws Exception {

        Event event =
                eventService.getEventById(eventId);

        return new ResponseEntity<>(
                event,
                HttpStatus.OK
        );
    }
}