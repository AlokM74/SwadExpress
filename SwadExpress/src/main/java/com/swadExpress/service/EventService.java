package com.swadExpress.service;

import com.swadExpress.entity.Event;
import com.swadExpress.request.EventRequest;

import java.util.List;

public interface EventService {

    Event createEvent(EventRequest request, String jwt) throws Exception;

    Event getEventById(Long eventId)  throws Exception;

    List<Event> getAllEvents() throws Exception;

    List<Event> getEventsByRestaurant(String jwt) throws Exception;

    Event updateEvent(Long eventId, EventRequest request, String jwt) throws Exception;

    void deleteEvent(Long eventId, String jwt) throws Exception;
}