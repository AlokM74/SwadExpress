package com.swadExpress.service.impl;

import com.swadExpress.entity.Event;
import com.swadExpress.entity.Restaurant;
import com.swadExpress.entity.User;
import com.swadExpress.exception.ApiException;
import com.swadExpress.repository.EventRepository;
import com.swadExpress.repository.RestaurantRepository;
import com.swadExpress.request.EventRequest;
import com.swadExpress.service.EventService;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantRepository restaurantRepository;


    // CREATE EVENT
    @Override
    public Event createEvent(EventRequest request, String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant =
                restaurantRepository.findByOwnerId(user.getId());

        if (restaurant == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Your restaurant could not be found.");
        }

        Event event = new Event();

        event.setEventName(request.getEventName());
        event.setEventDescription(request.getEventDescription());
        event.setRestaurant(restaurant);
        event.setEventStart(request.getEventStart());
        event.setEventEnd(request.getEventEnd());
        event.setImages(request.getImages());

        return eventRepository.save(event);
    }


    // GET EVENT BY ID
    @Override
    public Event getEventById(Long eventId) throws Exception {

        return eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new ApiException(HttpStatus.NOT_FOUND, "The event could not be found.")
                );
    }


    // GET ALL EVENTS
    @Override
    public List<Event> getAllEvents() throws Exception {

        return eventRepository.findAll();
    }


    // GET EVENTS BY RESTAURANT
    @Override
    public List<Event> getEventsByRestaurant(String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant =
                restaurantRepository.findByOwnerId(user.getId());

        if (restaurant == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Your restaurant could not be found.");
        }

        return eventRepository.findByRestaurantId(restaurant.getId());
    }


    // UPDATE EVENT
    @Override
    public Event updateEvent(
            Long eventId,
            EventRequest request,
            String jwt
    ) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant =
                restaurantRepository.findByOwnerId(user.getId());

        if (restaurant == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Your restaurant could not be found.");
        }

        // Find existing event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new ApiException(HttpStatus.NOT_FOUND, "The event could not be found.")
                );

        // Security check
        if (!event.getRestaurant().getId()
                .equals(restaurant.getId())) {

            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "You don't have permission to update this event."
            );
        }

        // Update existing event
        event.setEventName(request.getEventName());
        event.setEventDescription(request.getEventDescription());
        event.setEventStart(request.getEventStart());
        event.setEventEnd(request.getEventEnd());
        event.setImages(request.getImages());

        return eventRepository.save(event);
    }


    // DELETE EVENT
    @Override
    public void deleteEvent(Long eventId, String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Restaurant restaurant =
                restaurantRepository.findByOwnerId(user.getId());

        if (restaurant == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Your restaurant could not be found.");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new ApiException(HttpStatus.NOT_FOUND, "The event could not be found.")
                );

        // Security check
        if (!event.getRestaurant().getId()
                .equals(restaurant.getId())) {

            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "You don't have permission to delete this event."
            );
        }

        eventRepository.delete(event);
    }
}