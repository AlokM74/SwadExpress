package com.swadExpress.exception;

import java.time.Instant;

public record ApiErrorResponse(String message, int status, String path, Instant timestamp) {

    public static ApiErrorResponse of(int status, String path, String message) {
        return new ApiErrorResponse(message, status, path, Instant.now());
    }
}
