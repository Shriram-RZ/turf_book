package com.turfbook.backend.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        @ExceptionHandler(Exception.class)
        public ResponseEntity<Object> handleGlobalException(Exception ex, WebRequest request) {
                logger.error("Unhandled exception occurred", ex);

                Map<String, Object> body = new HashMap<>();
                body.put("timestamp", LocalDateTime.now());
                body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
                body.put("error", "Internal Server Error");
                body.put("message", ex.getMessage());
                body.put("path", request.getDescription(false));

                return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        @ExceptionHandler(NullPointerException.class)
        public ResponseEntity<Object> handleNullPointerException(NullPointerException ex, WebRequest request) {
                logger.error("NullPointerException occurred", ex);

                Map<String, Object> body = new HashMap<>();
                body.put("timestamp", LocalDateTime.now());
                body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
                body.put("error", "Internal Server Error");
                body.put("message", "A data processing error occurred. Please contact support.");
                body.put("path", request.getDescription(false));

                return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
                logger.error("IllegalArgumentException occurred", ex);

                Map<String, Object> body = new HashMap<>();
                body.put("timestamp", LocalDateTime.now());
                body.put("status", HttpStatus.BAD_REQUEST.value());
                body.put("error", "Bad Request");
                body.put("message", ex.getMessage());
                body.put("path", request.getDescription(false));

                return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(IllegalStateException.class)
        public ResponseEntity<Object> handleIllegalStateException(IllegalStateException ex, WebRequest request) {
                logger.error("IllegalStateException occurred: {}", ex.getMessage());

                Map<String, Object> body = new HashMap<>();
                body.put("timestamp", LocalDateTime.now());
                body.put("status", HttpStatus.UNAUTHORIZED.value()); // Often auth related in our context
                body.put("error", "Unauthorized");
                body.put("message", ex.getMessage());
                body.put("path", request.getDescription(false));

                return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<Object> handleRuntimeException(RuntimeException ex, WebRequest request) {
                logger.error("RuntimeException occurred", ex);

                Map<String, Object> body = new HashMap<>();
                body.put("timestamp", LocalDateTime.now());
                body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
                body.put("error", "Internal Server Error");
                body.put("message", "An unexpected error occurred");
                body.put("path", request.getDescription(false));

                return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
        }
}
