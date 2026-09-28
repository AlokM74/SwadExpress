package com.swadExpress.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventRequest {

    private String eventName;

    private String eventDescription;

    private LocalDateTime eventStart;

    private LocalDateTime eventEnd;

    private List<String> images;
}