package com.zp1ke.flo.api.controller;

import jakarta.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(errorMap(ex.getMessage()));
    }

    @ExceptionHandler({IllegalArgumentException.class, BadCredentialsException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleBadRequestsException(Exception ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(errorMap(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        var fields = new HashMap<String, String>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            var fieldName = ((FieldError) error).getField();
            var errorMessage = error.getDefaultMessage();
            fields.put(fieldName, errorMessage);
        });
        var errorMap = new HashMap<>(errorMap(ex.getMessage()));
        errorMap.put("fields", fields);

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(errorMap);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleConstraintViolationException(ConstraintViolationException ex) {
        var fields = new HashMap<String, String>();
        ex.getConstraintViolations().forEach((error) -> {
            var fieldName = error.getPropertyPath().toString();
            var errorMessage = error.getMessage();
            fields.put(fieldName, errorMessage);
        });
        var errorMap = new HashMap<>(errorMap(ex.getMessage()));
        errorMap.put("fields", fields);

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(errorMap);
    }

    private Map<String, Object> errorMap(String message) {
        return Map.of(
            "message", message
        );
    }
}
