package com.swadExpress.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalException {

    private static final Logger logger =
            LoggerFactory.getLogger(GlobalException.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(
            ApiException exception,
            HttpServletRequest request) {
        return error(exception.getStatus(), exception.getMessage(), request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidRequestBody(
            HttpMessageNotReadableException exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.BAD_REQUEST,
                "Some submitted information is missing or invalid. Please review the form and try again.",
                request
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationFailure(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getDefaultMessage())
                .filter(value -> value != null && !value.isBlank())
                .findFirst()
                .orElse("Please check the required information and try again.");
        return error(HttpStatus.BAD_REQUEST, message, request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidArgument(
            IllegalArgumentException exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.BAD_REQUEST,
                "Please check the information you entered and try again.",
                request
        );
    }

    @ExceptionHandler({
            MissingServletRequestParameterException.class,
            MethodArgumentTypeMismatchException.class
    })
    public ResponseEntity<ApiErrorResponse> handleInvalidParameter(
            Exception exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.BAD_REQUEST,
                "A required value is missing or invalid. Please review your request and try again.",
                request
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(
            AccessDeniedException exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.FORBIDDEN,
                "You don't have permission to perform this action.",
                request
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthenticationFailure(
            AuthenticationException exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.UNAUTHORIZED,
                "Please sign in to continue.",
                request
        );
    }

    @ExceptionHandler({
            BadCredentialsException.class,
            UsernameNotFoundException.class
    })
    public ResponseEntity<ApiErrorResponse> handleInvalidCredentials(
            AuthenticationException exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.UNAUTHORIZED,
                "The email or password is incorrect.",
                request
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataConflict(
            DataIntegrityViolationException exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.CONFLICT,
                "This change conflicts with existing information. Please review it and try again.",
                request
        );
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodNotAllowed(
            HttpRequestMethodNotSupportedException exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.METHOD_NOT_ALLOWED,
                "This action is not available. Please refresh the page and try again.",
                request
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleMissingResource(
            NoResourceFoundException exception,
            HttpServletRequest request) {
        return error(
                HttpStatus.NOT_FOUND,
                "The requested information could not be found.",
                request
        );
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleResponseStatus(
            ResponseStatusException exception,
            HttpServletRequest request) {
        HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());
        return error(status, messageFor(status), request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpectedException(
            Exception exception,
            HttpServletRequest request) {
        logger.error(
                "Unhandled API error at {} {}",
                request.getMethod(),
                request.getRequestURI(),
                exception
        );
        return error(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "We couldn't complete your request right now. Please try again.",
                request
        );
    }

    private ResponseEntity<ApiErrorResponse> error(
            HttpStatus status,
            String message,
            HttpServletRequest request) {
        return ResponseEntity.status(status)
                .body(ApiErrorResponse.of(
                        status.value(),
                        request.getRequestURI(),
                        message
                ));
    }

    private String messageFor(HttpStatus status) {
        return switch (status) {
            case BAD_REQUEST -> "Please check the information you entered and try again.";
            case UNAUTHORIZED -> "Please sign in to continue.";
            case FORBIDDEN -> "You don't have permission to perform this action.";
            case NOT_FOUND -> "The requested information could not be found.";
            case CONFLICT -> "This change conflicts with existing information.";
            default -> status.is5xxServerError()
                    ? "We couldn't complete your request right now. Please try again."
                    : "We couldn't complete this action. Please try again.";
        };
    }
}
