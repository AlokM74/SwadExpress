package com.swadExpress.exception;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.time.Instant;

public final class ApiErrorWriter {

    private ApiErrorWriter() {
    }

    public static void write(
            HttpServletRequest request,
            HttpServletResponse response,
            int status,
            String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String body = """
                {"message":"%s","status":%d,"path":"%s","timestamp":"%s"}
                """.formatted(
                escape(message),
                status,
                escape(request.getRequestURI()),
                Instant.now()
        );
        response.getWriter().write(body);
    }

    private static String escape(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
