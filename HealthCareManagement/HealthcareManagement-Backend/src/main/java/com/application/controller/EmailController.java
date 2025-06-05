package com.application.controller;

import com.application.dto.AppointmentEmailRequest;
import com.application.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "http://localhost:4200")
public class EmailController {
    private static final Logger logger = LoggerFactory.getLogger(EmailController.class);

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-appointment-status")
    public ResponseEntity<?> sendAppointmentStatusEmail(@RequestBody AppointmentEmailRequest request) {
        try {
            // Validate request
            if (request == null) {
                return ResponseEntity.badRequest().body("Request body cannot be null");
            }
            
            logger.info("Received email request for patient: {}", request.getPatientName());
            
            emailService.sendAppointmentStatusEmail(
                request.getTo(),
                request.getPatientName(),
                request.getAppointmentDate(),
                request.getAppointmentSlot(),
                request.getStatus()
            );
            
            return ResponseEntity.ok().body("Email sent successfully");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid request parameters: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        } catch (IOException e) {
            logger.error("Failed to send email: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to send email: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error while sending email: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred: " + e.getMessage());
        }
    }
} 